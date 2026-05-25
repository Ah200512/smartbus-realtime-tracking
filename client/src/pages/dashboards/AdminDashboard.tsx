import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Users,
  AlertTriangle,
  BarChart3,
  MapPin,
  UserCheck,
  Route,
  Shield,
  CheckCircle,
  Clock,
  Home,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import Bus3DMap from '../../components/Bus3DMap';
import { notify } from '../../components/NotificationProvider';
import { ReviewsSection } from '../../components/dashboard/ReviewsSection';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { formatTime } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { WS_API_BASE } from '../../config/ws';

const API_BASE = WS_API_BASE;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const buses = useAppStore((state) => state.buses);
  const alerts = useAppStore((state) => state.alerts);
  const stats = useAppStore((state) => state.stats);
  const analytics = useAppStore((state) => state.analytics);
  const resolveAlert = useAppStore((state) => state.resolveAlert);
  const isConnected = useAppStore((state) => state.isConnected);
  const { joinRole } = useSocket();
  const { showToast } = useToast();
  const [busName, setBusName] = useState('');
  const [routeInput, setRouteInput] = useState('13.0827,80.2707\n13.0789,80.2669\n13.0747,80.2612');

  useEffect(() => {
    joinRole('ADMIN');
  }, [joinRole]);

  const unresolvedAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  const handleAddBus = async () => {
    const routePoints = routeInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [latStr, lngStr] = line.split(',');
        return [Number(latStr), Number(lngStr)] as [number, number];
      })
      .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

    if (!busName || routePoints.length < 2) {
      showToast('Enter a bus name and at least two valid route points.', 'warning');
      return;
    }

    const response = await fetch(`${API_BASE}/api/admin/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: busName, routePoints }),
    });

    if (response.ok) {
      setBusName('');
      showToast('New bus added to fleet and broadcast in real time.', 'success');
      notify('New Bus Added Successfully', 'success');
      return;
    }

    showToast('Failed to add bus.', 'error');
  };

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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Fleet management & monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Badge variant={isConnected ? 'success' : 'outline'} className="text-sm px-4 py-1.5">
            {isConnected ? 'All Systems Online' : 'Connecting...'}
          </Badge>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Active Buses" value={stats.activeBuses.toString()} icon={<Bus className="h-5 w-5" />} description="Currently operating" />
        <StatCard title="Drivers Online" value={stats.driversOnline.toString()} icon={<UserCheck className="h-5 w-5" />} description="On active duty" />
        <StatCard title="Today's Ridership" value={stats.todayRidership.toLocaleString()} icon={<Users className="h-5 w-5" />} description="+12% from yesterday" trend="+12%" />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon={<BarChart3 className="h-5 w-5" />} description="Daily average" />
        <StatCard title="Active Alerts" value={stats.activeAlerts.toString()} icon={<AlertTriangle className="h-5 w-5" />} description={stats.activeAlerts > 0 ? 'Needs attention' : 'All clear'} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Fleet Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bus3DMap buses={buses} showUserMarker={false} heightClassName="h-72 mb-4" showLegend={false} />
              <div className="space-y-2">
                {buses.map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bus className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bus.number}</p>
                        <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{bus.currentOccupancy}/{bus.capacity}</span>
                      <Badge variant={bus.status === 'ACTIVE' ? 'success' : 'warning'}>{bus.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                SOS Alerts
                {unresolvedAlerts.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">{unresolvedAlerts.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unresolvedAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-success mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unresolvedAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{formatTime(alert.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Bus: {alert.bus?.number || alert.busId}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const response = await fetch(`${API_BASE}/api/sos/${alert.id}/resolve`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ resolvedBy: 'admin-dashboard' }),
                            });

                            if (!response.ok) {
                              let message = 'Resolve failed';
                              try {
                                const errorBody = await response.json();
                                message = errorBody?.message || errorBody?.error || message;
                              } catch {
                                // Keep default message if body is not JSON
                              }
                              showToast(message, 'error');
                              return;
                            }

                            showToast('SOS resolved', 'success');
                            resolveAlert(alert.id);
                          }}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4" />Manage Drivers</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Route className="h-4 w-4" />Route Management</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Bus className="h-4 w-4" />Assign Buses</Button>
              <Button variant="outline" className="w-full justify-start gap-2"><Clock className="h-4 w-4" />Attendance Logs</Button>

              <div className="mt-3 rounded-lg border border-border bg-surface p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add New Bus</p>
                <input
                  value={busName}
                  onChange={(event) => setBusName(event.target.value)}
                  placeholder="Bus name (e.g., Anna Salai Connector)"
                  className="mb-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                />
                <textarea
                  value={routeInput}
                  onChange={(event) => setRouteInput(event.target.value)}
                  rows={4}
                  placeholder="lat,lng per line"
                  className="mb-2 w-full rounded-md border border-border bg-card px-3 py-2 text-xs"
                />
                <Button className="w-full" onClick={handleAddBus}>Create Bus</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews Section */}
      <motion.div variants={item}>
        <ReviewsSection role="ADMIN" />
      </motion.div>
    </motion.div>
  );
}
