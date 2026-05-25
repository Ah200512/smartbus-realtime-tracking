import { motion } from 'framer-motion';
import { Bus, MapPin, Gauge, Users, Navigation, Clock } from 'lucide-react';

interface BusInfoPanelProps {
  bus: {
    number: string;
    routeName: string;
    status: string;
    speed?: number;
    occupancy?: number;
    capacity?: number;
    driverName?: string;
    eta?: number | null;
    distance?: number | null;
  };
}

export default function BusInfoPanel({ bus }: BusInfoPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
          <Bus className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground">{bus.number}</h3>
          <p className="text-xs text-muted-foreground">{bus.routeName}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            bus.status === 'ACTIVE'
              ? 'bg-success/15 text-success'
              : bus.status === 'MAINTENANCE'
                ? 'bg-warning/15 text-warning'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {bus.status}
        </span>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            <Gauge className="h-3 w-3" /> Speed
          </p>
          <p className="text-lg font-bold text-foreground">{Math.round(bus.speed ?? 0)} <span className="text-xs font-normal text-muted-foreground">km/h</span></p>
        </div>

        <div className="rounded-xl bg-surface p-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            <Users className="h-3 w-3" /> Capacity
          </p>
          <p className="text-lg font-bold text-foreground">
            {bus.occupancy ?? 0}/{bus.capacity ?? 45}
          </p>
        </div>

        {bus.eta != null && (
          <div className="rounded-xl bg-surface p-3">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              <Clock className="h-3 w-3" /> ETA
            </p>
            <p className="text-lg font-bold text-foreground">{Math.round(bus.eta)} <span className="text-xs font-normal text-muted-foreground">min</span></p>
          </div>
        )}

        {bus.distance != null && (
          <div className="rounded-xl bg-surface p-3">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              <Navigation className="h-3 w-3" /> Distance
            </p>
            <p className="text-lg font-bold text-foreground">{bus.distance.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">km</span></p>
          </div>
        )}
      </div>

      {/* Driver */}
      {bus.driverName && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Driver</p>
              <p className="text-sm font-semibold text-foreground">{bus.driverName}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
