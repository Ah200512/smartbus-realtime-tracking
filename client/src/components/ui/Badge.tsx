import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                {
                    'bg-primary/15 text-primary': variant === 'default',
                    'bg-success/15 text-success': variant === 'success',
                    'bg-warning/15 text-warning': variant === 'warning',
                    'bg-destructive/15 text-destructive': variant === 'destructive',
                    'border border-border text-muted-foreground': variant === 'outline',
                },
                className
            )}
            {...props}
        />
    );
}
