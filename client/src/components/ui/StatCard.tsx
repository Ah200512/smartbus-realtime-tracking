import { cn } from '../../lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    iconColor?: string;
    description?: string;
    trend?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    iconColor = 'text-primary',
    description,
    trend,
    className,
}: StatCardProps) {
    return (
        <div className={cn('stat-card', className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {icon && (
                    <div className={cn('p-2 rounded-lg bg-surface', iconColor)}>
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{value}</p>
                {(change || trend) && (
                    <span
                        className={cn('text-sm font-medium', {
                            'text-success': changeType === 'positive' || trend,
                            'text-destructive': changeType === 'negative',
                            'text-muted-foreground': changeType === 'neutral' && !trend,
                        })}
                    >
                        {change || trend}
                    </span>
                )}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
