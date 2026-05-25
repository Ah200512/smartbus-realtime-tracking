import * as React from 'react';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:opacity-90',
                destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
                outline: 'border border-border bg-transparent hover:bg-surface hover:text-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-surface-hover',
                ghost: 'hover:bg-surface hover:text-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                success: 'bg-success text-success-foreground hover:opacity-90',
                glow: 'relative overflow-hidden bg-primary text-primary-foreground',
                magnetic: 'bg-primary text-primary-foreground',
                neumorphic: 'bg-surface text-foreground shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.05)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-12 rounded-lg px-8 text-base',
                xl: 'h-14 rounded-xl px-10 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface AnimatedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    magnetic?: boolean;
    glowEffect?: boolean;
    slideIcon?: React.ReactNode;
}

// Magnetic Button Hook
function useMagneticButton(ref: React.RefObject<HTMLButtonElement | null>, enabled: boolean) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!enabled || !ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        // Only apply magnetic effect within a certain radius
        const maxDistance = 100;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        
        if (distance < maxDistance) {
            const strength = 0.3;
            x.set(distanceX * strength);
            y.set(distanceY * strength);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { springX, springY, handleMouseMove, handleMouseLeave };
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ 
        className, 
        variant, 
        size, 
        asChild = false, 
        loading, 
        magnetic = false,
        glowEffect = false,
        slideIcon,
        children, 
        disabled, 
        ...props 
    }, _ref) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [isHovered, setIsHovered] = useState(false);
        
        const { springX, springY, handleMouseMove, handleMouseLeave } = useMagneticButton(
            buttonRef, 
            magnetic && !disabled
        );
        
        // Glow effect animation
        const renderGlowEffect = glowEffect && (
            <>
                {/* Moving gradient background */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    }}
                    animate={{
                        x: isHovered ? ['0%', '200%'] : '0%',
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                    }}
                />
                {/* Glow blur */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl bg-primary/50 -z-10" />
            </>
        );

        // Slide icon animation
        const renderContent = slideIcon ? (
            <span className="flex items-center gap-2 overflow-hidden">
                <motion.span
                    animate={{ x: isHovered ? 0 : -24, opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    {slideIcon}
                </motion.span>
                <motion.span
                    animate={{ x: isHovered ? 0 : -24 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.span>
            </span>
        ) : children;

        if (magnetic) {
            return (
                <motion.button
                    ref={buttonRef as React.RefObject<HTMLButtonElement>}
                    className={cn(buttonVariants({ variant, size, className }), 'group relative')}
                    style={{ x: springX, y: springY }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    disabled={disabled || loading}
                    whileTap={{ scale: 0.98 }}
                    {...(props as any)}
                >
                    {loading && (
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    )}
                    {renderGlowEffect}
                    {renderContent}
                </motion.button>
            );
        }

        return (
            <motion.button
                ref={buttonRef as React.RefObject<HTMLButtonElement>}
                className={cn(buttonVariants({ variant, size, className }), 'group relative')}
                disabled={disabled || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                {...(props as any)}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {renderGlowEffect}
                {renderContent}
            </motion.button>
        );
    }
);
AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton, buttonVariants };
