// Mock Attendance Service - Ready for real backend integration

export interface AttendanceRecord {
  id: string;
  userId: string;
  busId: string;
  timestamp: Date;
  status: 'checked-in' | 'checked-out' | 'duplicate' | 'expired';
  sessionId: string;
}

interface QRPayload {
  busId: string;
  timestamp: number;
  expiresAt: number;
}

// In-memory store for mock data (replace with API calls for production)
const attendanceStore: AttendanceRecord[] = [];

function generateId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

function getSessionId(): string {
  // Session = one per day per user
  const today = new Date().toISOString().split('T')[0];
  return `session-${today}`;
}

export const attendanceService = {
  /**
   * Parse QR code data
   */
  parseQRData(raw: string): QRPayload | null {
    try {
      const data = JSON.parse(raw);
      if (data.busId && data.timestamp && data.expiresAt) {
        return data as QRPayload;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Check if QR code is expired
   */
  isExpired(payload: QRPayload): boolean {
    return Date.now() > payload.expiresAt;
  },

  /**
   * Check for duplicate attendance in same session
   */
  isDuplicate(userId: string, busId: string): boolean {
    const sessionId = getSessionId();
    return attendanceStore.some(
      (r) => r.userId === userId && r.busId === busId && r.sessionId === sessionId && r.status === 'checked-in'
    );
  },

  /**
   * Mark attendance after QR scan
   * Returns the attendance record or an error status
   */
  async markAttendance(
    userId: string,
    qrData: string
  ): Promise<{ success: boolean; record?: AttendanceRecord; error?: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const payload = this.parseQRData(qrData);
    if (!payload) {
      return { success: false, error: 'Invalid QR code' };
    }

    if (this.isExpired(payload)) {
      return { success: false, error: 'QR code has expired. Please request a fresh code.' };
    }

    if (this.isDuplicate(userId, payload.busId)) {
      return { success: false, error: 'Attendance already marked for this session.' };
    }

    const record: AttendanceRecord = {
      id: generateId(),
      userId,
      busId: payload.busId,
      timestamp: new Date(),
      status: 'checked-in',
      sessionId: getSessionId(),
    };

    attendanceStore.push(record);

    // In production, this would be:
    // const res = await fetch('/api/attendance', { method: 'POST', body: JSON.stringify(record) });
    // return await res.json();

    return { success: true, record };
  },

  /**
   * Get attendance records for a user
   */
  async getRecords(userId: string): Promise<AttendanceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return attendanceStore.filter((r) => r.userId === userId);
  },

  /**
   * Get today's attendance count
   */
  getTodayCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return attendanceStore.filter(
      (r) => r.timestamp.toISOString().split('T')[0] === today && r.status === 'checked-in'
    ).length;
  },

  /**
   * Generate mock QR data (for testing)
   */
  generateMockQRData(busId: string): string {
    return JSON.stringify({
      busId,
      timestamp: Date.now(),
      expiresAt: Date.now() + 300000, // 5 min
    });
  },
};
