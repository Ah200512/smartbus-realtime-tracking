import { cn } from '../../lib/utils';
import type { RouteStop } from '../../types';

interface RouteTimelineProps {
    stops: RouteStop[];
    className?: string;
}

export function RouteTimeline({ stops, className }: RouteTimelineProps) {
    return (
        <div className={cn('space-y-0', className)}>
            {stops.map((stop, index) => (
                <div key={stop.id} className="flex gap-4">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'w-3 h-3 rounded-full border-2',
                                {
                                    'bg-success border-success': stop.status === 'completed',
                                    'bg-primary border-primary animate-pulse': stop.status === 'current',
                                    'bg-transparent border-border': stop.status === 'upcoming',
                                }
                            )}
                        />
                        {index < stops.length - 1 && (
                            <div
                                className={cn('w-0.5 h-12 -my-0', {
                                    'bg-success': stop.status === 'completed',
                                    'bg-gradient-to-b from-primary to-border': stop.status === 'current',
                                    'bg-border': stop.status === 'upcoming',
                                })}
                            />
                        )}
                    </div>

                    {/* Stop info */}
                    <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                            <p
                                className={cn('font-medium text-sm', {
                                    'text-muted-foreground': ['completed', 'upcoming'].includes(stop.status),
                                    'text-foreground': stop.status === 'current',
                                })}
                            >
                                {stop.name}
                            </p>
                            <span
  className={cn('text-xs', {
    'text-muted-foreground':
      stop.status === 'completed' || stop.status === 'upcoming',
    'text-primary font-medium': stop.status === 'current',
  })}
>
  {stop.time}
</span>

                        </div>
                        {stop.status === 'current' && (
                            <p className="text-xs text-primary mt-0.5">Current location</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
