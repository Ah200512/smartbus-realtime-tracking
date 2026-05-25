// Mock SOS Alert Service - Ready for real backend integration

export interface SOSAlertData {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  time: Date;
  status: 'triggered' | 'acknowledged' | 'resolved' | 'cancelled';
  busId?: string;
  message?: string;
}

// In-memory store (replace with API calls for production)
const sosStore: SOSAlertData[] = [];

function generateId(): string {
  return `sos-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null), // Fallback to null on error
      { timeout: 5000, enableHighAccuracy: false }
    );
  });
}

export const sosService = {
  /**
   * Trigger an SOS alert
   */
  async triggerAlert(
    userId: string,
    busId?: string,
    message?: string
  ): Promise<{ success: boolean; alert?: SOSAlertData; error?: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const location = await getCurrentLocation();

      const alert: SOSAlertData = {
        id: generateId(),
        userId,
        location: location || { latitude: 13.0418, longitude: 80.2341 }, // Default to Chennai
        time: new Date(),
        status: 'triggered',
        busId,
        message: message || 'Emergency alert triggered',
      };

      sosStore.push(alert);

      // In production:
      // const res = await fetch('/api/sos', { method: 'POST', body: JSON.stringify(alert) });
      // return await res.json();

      return { success: true, alert };
    } catch (error) {
      return { success: false, error: 'Failed to send SOS alert. Please try again.' };
    }
  },

  /**
   * Cancel an SOS alert
   */
  async cancelAlert(alertId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const alert = sosStore.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'cancelled';
    }
    return { success: true };
  },

  /**
   * Get SOS history for a user
   */
  async getHistory(userId: string): Promise<SOSAlertData[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return sosStore.filter((a) => a.userId === userId);
  },

  /**
   * Get active SOSes
   */
  getActiveAlerts(): SOSAlertData[] {
    return sosStore.filter((a) => a.status === 'triggered');
  },
};
