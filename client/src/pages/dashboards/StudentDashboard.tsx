import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Bus,
  MapPin,
  Navigation,
  Wifi,
  Home,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSocket } from '../../hooks/useSocket';
import { StudentDashboardMap } from '../../components/dashboard';
import { ReviewsSection } from '../../components/dashboard/ReviewsSection';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { formatETA, formatDistance } from '../../lib/utils';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const buses = useAppStore((state) => state.buses);
  const isConnected = useAppStore((state) => state.isConnected);
  const { joinRole, subscribeBus } = useSocket();

  useEffect(() => {
    joinRole('STUDENT');
    // Subscribe to first bus for demo
    if (buses.length > 0) {
      subscribeBus(buses[0].id);
    }
  }, [joinRole, subscribeBus, buses.length]);

  const nearestBus = useMemo(() => buses[0], [buses]);

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
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your bus and stay connected</p>
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface">
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
            <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-muted-foreground'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Bus"
          value={nearestBus?.number || 'N/A'}
          icon={<Bus className="h-5 w-5" />}
          description={nearestBus?.routeName}
        />
        <StatCard
          title="ETA"
          value={nearestBus?.eta ? formatETA(nearestBus.eta) : '--'}
          icon={<Clock className="h-5 w-5" />}
          description="Estimated arrival"
          trend={nearestBus?.eta && nearestBus.eta < 5 ? 'Arriving soon!' : undefined}
        />
        <StatCard
          title="Distance"
          value={nearestBus?.distance ? formatDistance(nearestBus.distance) : '--'}
          icon={<Navigation className="h-5 w-5" />}
          description="From your location"
        />
        <StatCard
          title="Speed"
          value={`${nearestBus?.location?.speed || 0} km/h`}
          icon={<MapPin className="h-5 w-5" />}
          description="Current speed"
        />
      </motion.div>

      <motion.div variants={item}>
        <StudentDashboardMap userId="current-user" />
      </motion.div>

      {/* Active Buses */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bus.number}</p>
                      <p className="text-sm text-muted-foreground">{bus.routeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{bus.eta ? formatETA(bus.eta) : '--'}</p>
                      <p className="text-xs text-muted-foreground">ETA</p>
                    </div>
                    <Badge variant={bus.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {bus.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews Section */}
      <motion.div variants={item}>
        <ReviewsSection role="STUDENT" />
      </motion.div>
    </motion.div>
  );
}
