import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Square,
  MapPin,
  Users,
  AlertTriangle,
  Navigation,
  Gauge,
  Radio,
  Home,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useToast } from '../../context/ToastContext';
import Bus3DMap from '../../components/Bus3DMap';
import { notify } from '../../components/NotificationProvider';
import { ReviewsSection } from '../../components/dashboard/ReviewsSection';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const isOnTrip = useAppStore((state) => state.isOnTrip);
  const startTrip = useAppStore((state) => state.startTrip);
  const endTrip = useAppStore((state) => state.endTrip);
  const buses = useAppStore((state) => state.buses);
  const isConnected = useAppStore((state) => state.isConnected);

  const { joinRole, joinBus, socket, triggerSOS, updateTrip } = useSocket();
  const { showToast } = useToast();
  const geo = useGeolocation(isOnTrip);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedBusId, setSelectedBusId] = useState<string>('1');

  const assignedBus = buses.find((bus) => bus.id === selectedBusId) || buses[0];

  useEffect(() => {
    joinRole('DRIVER');
    if (assignedBus) {
      joinBus(assignedBus.id);
    }
  }, [joinRole, joinBus, assignedBus?.id]);

  useEffect(() => {
    const onAttendanceNotification = (payload: { message: string }) => {
      showToast(payload.message, 'info');
    };

    socket.on('attendanceNotification', onAttendanceNotification);
    return () => {
      socket.off('attendanceNotification', onAttendanceNotification);
    };
  }, [socket, showToast]);

  /* ── Listen for bus-added / driver-added notifications ── */
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

  const handleStartTrip = useCallback(() => {
    startTrip();
    if (assignedBus) {
      updateTrip({ busId: assignedBus.id, driverId: 'current-driver', action: 'start' });
      fetch(`${API_BASE}/api/trips/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId: assignedBus.id, driverId: 'current-driver' }),
      }).catch(() => undefined);
    }
  }, [startTrip, assignedBus, updateTrip]);

  const handleEndTrip = useCallback(() => {
    endTrip();
    if (assignedBus) {
      updateTrip({ busId: assignedBus.id, driverId: 'current-driver', action: 'stop' });
      fetch(`${API_BASE}/api/trips/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId: assignedBus.id, driverId: 'current-driver' }),
      }).catch(() => undefined);
    }
  }, [endTrip, assignedBus, updateTrip]);

  const handleSOS = useCallback(() => {
    if (!assignedBus) {
      showToast('No bus assigned to send emergency alert', 'error');
      return;
    }
    
    showToast('Sending emergency alert to administration...', 'warning');
    
    triggerSOS({
      userId: 'current-driver',
      busId: assignedBus.id,
      message: 'Driver emergency alert',
      latitude: geo.latitude || undefined,
      longitude: geo.longitude || undefined,
    });

    setTimeout(() => {
      showToast('Emergency alert broadcasted successfully!', 'success');
    }, 1000);
  }, [assignedBus, triggerSOS, geo.latitude, geo.longitude, showToast]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">
            {assignedBus ? `Assigned: ${assignedBus.number} — ${assignedBus.routeName}` : 'No bus assigned'}
          </p>
          {buses.length > 0 && (
            <div className="mt-3 max-w-sm">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Assigned Bus</label>
              <select
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                value={assignedBus?.id || ''}
                onChange={(event) => setSelectedBusId(event.target.value)}
              >
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.number} - {bus.routeName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Badge variant={isOnTrip ? 'success' : 'outline'} className="text-sm px-4 py-1.5">
            {isOnTrip ? 'On Trip' : 'Off Duty'}
          </Badge>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Trip Status"
          value={isOnTrip ? 'Active' : 'Idle'}
          icon={<Radio className="h-5 w-5" />}
          description={isOnTrip ? 'Broadcasting GPS' : 'Waiting to start'}
        />
        <StatCard
          title="Students"
          value={studentCount.toString()}
          icon={<Users className="h-5 w-5" />}
          description="Currently on bus"
        />
        <StatCard
          title="Speed"
          value={`${geo.speed ? Math.round(geo.speed * 3.6) : 0} km/h`}
          icon={<Gauge className="h-5 w-5" />}
          description="Current speed"
        />
        <StatCard
          title="Connection"
          value={isConnected ? 'Online' : 'Offline'}
          icon={<Navigation className="h-5 w-5" />}
          description={isConnected ? 'WebSocket active' : 'Disconnected'}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isOnTrip ? (
                  <Button size="lg" className="flex-1 gap-2" variant="success" onClick={handleStartTrip}>
                    <Play className="h-5 w-5" />
                    Start Trip
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1 gap-2" variant="destructive" onClick={handleEndTrip}>
                    <Square className="h-5 w-5" />
                    End Trip
                  </Button>
                )}
              </div>

              {isOnTrip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium text-success">GPS Broadcasting Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Location: {geo.latitude?.toFixed(6) || 'Acquiring...'},{' '}
                    {geo.longitude?.toFixed(6) || ''}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bus3DMap
                buses={assignedBus ? [assignedBus] : []}
                userLocation={geo.latitude && geo.longitude ? { lat: geo.latitude, lng: geo.longitude } : null}
                showUserMarker
                heightClassName="h-64"
                showLegend={false}
              />
              {geo.accuracy && (
                <p className="mt-2 text-xs text-muted-foreground">GPS accuracy: ±{Math.round(geo.accuracy)}m</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Student Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-primary mb-2">{studentCount}</p>
                <p className="text-sm text-muted-foreground mb-4">/ {assignedBus?.capacity || 45} capacity</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStudentCount((c) => Math.max(0, c - 1))}>
                    -
                  </Button>
                  <Button className="flex-1" onClick={() => setStudentCount((c) => c + 1)}>
                    +
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Alert admin immediately in case of an emergency.
              </p>
              <Button variant="destructive" className="w-full gap-2" onClick={handleSOS}>
                <AlertTriangle className="h-4 w-4" />
                Send Emergency Alert
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Section */}
        <motion.div variants={item}>
          <ReviewsSection role="DRIVER" />
        </motion.div>
      </div>
    </motion.div>
  );
}
