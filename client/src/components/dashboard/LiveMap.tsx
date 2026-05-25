import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { BusWithLocation } from '../../types';

interface LiveMapProps {
    buses: BusWithLocation[];
    selectedBusId?: string;
    onBusSelect?: (busId: string) => void;
    className?: string;
}

export function LiveMap({ buses, selectedBusId, onBusSelect, className }: LiveMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Convert lat/lng to pixel position (simplified for demo)
    const latLngToPixel = (lat: number, lng: number) => {
        const centerLat = 40.7128;
        const centerLng = -74.006;
        const scale = 50000;

        const x = (lng - centerLng) * scale + dimensions.width / 2;
        const y = (centerLat - lat) * scale + dimensions.height / 2;

        return { x: Math.max(40, Math.min(dimensions.width - 40, x)), y: Math.max(40, Math.min(dimensions.height - 40, y)) };
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative rounded-xl overflow-hidden bg-surface border border-border',
                className
            )}
        >
            {/* Map Grid Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border z-10">
                <p className="text-xs font-medium text-muted-foreground mb-2">Live Tracking</p>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                    <span className="text-foreground">{buses.length} buses active</span>
                </div>
            </div>

            {/* Center Marker (User Location) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary/30 animate-ping absolute inset-0" />
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-white relative z-10" />
                </div>
            </div>

            {/* Bus Markers */}
            {buses.map((bus) => {
                if (!bus.location) return null;
                const pos = latLngToPixel(bus.location.latitude, bus.location.longitude);

                return (
                    <motion.div
                        key={bus.id}
                        className="absolute z-20"
                        initial={false}
                        animate={{
                            x: pos.x - 20,
                            y: pos.y - 20,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            damping: 20,
                        }}
                    >
                        <button
                            onClick={() => onBusSelect?.(bus.id)}
                            className={cn(
                                'group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                                selectedBusId === bus.id
                                    ? 'bg-primary text-primary-foreground scale-125 shadow-glow'
                                    : 'bg-card text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:scale-110'
                            )}
                        >
                            <Navigation
                                className="w-5 h-5 transition-transform"
                                style={{
                                    transform: `rotate(${bus.location.speed > 0 ? 45 : 0}deg)`,
                                }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                                    <p className="text-xs font-medium">{bus.number}</p>
                                    <p className="text-xs text-muted-foreground">{bus.routeName}</p>
                                    <p className="text-xs text-muted-foreground">{bus.location.speed} km/h</p>
                                </div>
                            </div>
                        </button>
                    </motion.div>
                );
            })}

            {/* Placeholder for Mapbox */}
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
                Map Preview • Mapbox Ready
            </div>
        </div>
    );
}
