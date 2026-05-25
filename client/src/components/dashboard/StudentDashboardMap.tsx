import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bus,
  Gauge,
  MapPin,
  QrCode,
  Navigation,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { notify } from '../NotificationProvider';
import Bus3DMap from '../Bus3DMap';
import { WS_API_BASE } from '../../config/ws';

interface UserLocation {
  lat: number;
  lng: number;
}

interface StudentDashboardMapProps {
  sosEndpoint?: string;
  attendanceEndpoint?: string;
  userId?: string;
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function calculateEtaMinutes(distanceKm: number, speedKmh: number): number {
  if (speedKmh <= 0) {
    return 0;
  }
  return (distanceKm / speedKmh) * 60;
}

export function StudentDashboardMap({
  sosEndpoint = `${WS_API_BASE}/api/alerts/sos`,
  attendanceEndpoint = `${WS_API_BASE}/api/attendance`,
  userId = 'current-user',
}: StudentDashboardMapProps) {
  const buses = useAppStore((state) => state.buses);
  const bus = useMemo(() => buses[0] || null, [buses]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sosMessage, setSosMessage] = useState<string>('No active alerts. Stay safe!');
  const [sendingSos, setSendingSos] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUserLocation(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  /* ── Socket listeners for real-time notifications ── */
  useEffect(() => {
    const onBusAdded = (data: { name?: string; number?: string }) => {
      notify(`New Bus Added: ${data.name || data.number || 'Unknown'}`, 'success');
    };

    const onDriverAdded = (data: { name?: string }) => {
      notify(`Driver Assigned: ${data.name || 'Unknown'}`, 'info');
    };

    socket.on('bus-added', onBusAdded);
    socket.on('newBusAdded', onBusAdded);
    socket.on('driver-added', onDriverAdded);

    return () => {
      socket.off('bus-added', onBusAdded);
      socket.off('newBusAdded', onBusAdded);
      socket.off('driver-added', onDriverAdded);
    };
  }, [socket]);

  const speed = useMemo(() => {
    return bus?.location?.speed ?? null;
  }, [bus?.location?.speed]);

  const distance = useMemo(() => {
    if (!bus?.location || !userLocation) {
      return null;
    }
    return getDistanceKm(userLocation.lat, userLocation.lng, bus.location.latitude, bus.location.longitude);
  }, [bus?.location, userLocation]);

  const eta = useMemo(() => {
    if (distance === null) {
      return null;
    }
    if (bus?.eta !== undefined) {
      return bus.eta;
    }
    return calculateEtaMinutes(distance, bus?.location?.speed || 30);
  }, [bus?.eta, bus?.location?.speed, distance]);

  const sendSOS = async () => {
    if (!bus?.id) {
      setSosMessage('No active bus selected for SOS alert.');
      return;
    }

    setSendingSos(true);
    try {
      const response = await fetch(sosEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          busId: bus?.id,
          message: 'Emergency help needed from student dashboard',
          location: userLocation,
        }),
      });

      if (!response.ok) {
        let message = 'Unable to send SOS alert';
        try {
          const errorBody = await response.json();
          message = errorBody?.message || errorBody?.error || message;
        } catch {
          // Keep default message if body is not JSON
        }
        throw new Error(message);
      }

      setSosMessage('SOS alert sent successfully. Authorities have been notified.');
      notify('SOS alert sent! Help is on the way.', 'warning');
      window.setTimeout(() => {
        setSosMessage('No active alerts. Stay safe!');
      }, 3500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send SOS. Please try again.';
      setSosMessage(message);
      window.setTimeout(() => {
        setSosMessage('No active alerts. Stay safe!');
      }, 3500);
    } finally {
      setSendingSos(false);
    }
  };

  const markAttendance = async () => {
    if (!bus?.id) {
      setSosMessage('No active bus selected for attendance.');
      return;
    }

    setMarkingAttendance(true);
    try {
      const response = await fetch(attendanceEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: bus.id,
          userId,
        }),
      });

      if (!response.ok) {
        let message = 'Attendance failed';
        try {
          const errorBody = await response.json();
          message = errorBody?.message || errorBody?.error || message;
        } catch {
          // Keep default message if body is not JSON
        }
        throw new Error(message);
      }

      setSosMessage('Attendance marked successfully. Driver has been notified.');
      notify('Attendance marked successfully!', 'success');
      window.setTimeout(() => setSosMessage('No active alerts. Stay safe!'), 3500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark attendance. Please try again.';
      setSosMessage(message);
      window.setTimeout(() => setSosMessage('No active alerts. Stay safe!'), 3500);
    } finally {
      setMarkingAttendance(false);
    }
  };

  return (
    <div className="grid h-full w-full gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Bus3DMap buses={buses} userLocation={userLocation} showUserMarker heightClassName="h-[520px]" />

      <aside className="flex min-h-[520px] flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Bus className="h-5 w-5 text-primary" />
            {bus?.routeName || 'Waiting for live bus data...'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Live telematics from your route bus.</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Navigation className="h-4 w-4" /> ETA
            </p>
            <p className="text-base font-semibold text-foreground">
              {eta !== null ? `${Math.max(0, Math.round(eta))} min` : '--'}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <MapPin className="h-4 w-4" /> Distance
            </p>
            <p className="text-base font-semibold text-foreground">
              {distance !== null ? `${distance.toFixed(1)} km` : '--'}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Gauge className="h-4 w-4" /> Speed
            </p>
            <p className="text-base font-semibold text-foreground">
              {speed !== null ? `${Math.round(speed)} km/h` : '--'}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex items-center justify-between mb-1">
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" /> Alerts
            </p>
            <button 
              onClick={() => window.location.href = '/alerts'}
              className="text-[10px] uppercase font-bold hover:underline"
            >
              View History
            </button>
          </div>
          <p className="text-xs opacity-90">{sosMessage}</p>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface p-3">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <QrCode className="h-4 w-4" /> QR Attendance
          </p>
          <button
            type="button"
            onClick={markAttendance}
            disabled={markingAttendance}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {markingAttendance ? 'Marking...' : 'Open Scanner'}
          </button>
        </div>

        <motion.button
          type="button"
          onClick={sendSOS}
          disabled={sendingSos}
          whileTap={{ scale: 0.97 }}
          animate={{ boxShadow: ['0 0 0px rgba(239,68,68,0.0)', '0 0 18px rgba(239,68,68,0.35)', '0 0 0px rgba(239,68,68,0.0)'] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sendingSos ? 'Sending SOS...' : 'Send SOS Alert'}
        </motion.button>
      </aside>
    </div>
  );
}

export default StudentDashboardMap;