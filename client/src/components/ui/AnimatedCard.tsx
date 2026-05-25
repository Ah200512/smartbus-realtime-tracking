import * as React from 'react';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
    tilt?: boolean;
    glowOnHover?: boolean;
    liftOnHover?: boolean;
    interactive?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
    ({ className, tilt = false, glowOnHover = false, liftOnHover = true, interactive = true, children, ...props }, _ref) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const [isHovered, setIsHovered] = useState(false);
        
        // Motion values for 3D tilt
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        
        // Spring physics for smooth animation
        const springConfig = { damping: 20, stiffness: 300 };
        const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
        const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
        
        // Glow position
        const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
        const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!tilt || !cardRef.current) return;
            
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);
            
            x.set(normalizedX);
            y.set(normalizedY);
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
            setIsHovered(false);
        };

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        return (
            <motion.div
                ref={cardRef}
                className={cn(
                    'relative rounded-xl border border-border bg-card text-card-foreground shadow-card overflow-hidden',
                    interactive && 'cursor-pointer',
                    className
                )}
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: 1000,
                    rotateX: tilt ? rotateX : 0,
                    rotateY: tilt ? rotateY : 0,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                whileHover={liftOnHover ? { 
                    y: -4, 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    borderColor: 'hsl(var(--primary) / 0.3)',
                } : undefined}
                transition={{ duration: 0.2 }}
                {...(props as any)}
            >
                {/* Gradient glow effect */}
                {glowOnHover && (
                    <motion.div
                        className="absolute inset-0 opacity-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at ${glowX}% ${glowY}%, hsl(var(--primary) / 0.15), transparent 50%)`,
                        }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
                
                {/* Glass sweep effect */}
                {isHovered && glowOnHover && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.03) 55%, transparent 60%)',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                    />
                )}
                
                {/* Content with 3D depth */}
                <div style={{ transform: tilt ? 'translateZ(20px)' : undefined }}>
                    {children}
                </div>
            </motion.div>
        );
    }
);
AnimatedCard.displayName = 'AnimatedCard';

// Infinite scrolling card row
interface InfiniteCardRowProps {
    children: React.ReactNode[];
    speed?: number;
    pauseOnHover?: boolean;
    direction?: 'left' | 'right';
}

export function InfiniteCardRow({ 
    children, 
    speed = 30, 
    pauseOnHover = true,
    direction = 'left' 
}: InfiniteCardRowProps) {
    const [isPaused, setIsPaused] = useState(false);
    
    // Duplicate children for seamless loop
    const duplicatedChildren = [...children, ...children];
    
    return (
        <div 
            className="relative overflow-hidden"
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            
            <motion.div
                className="flex gap-6"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: speed,
                        ease: 'linear',
                    },
                }}
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                {duplicatedChildren.map((child, index) => (
                    <div key={index} className="flex-shrink-0">
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// Card with image zoom effect
interface ZoomCardProps extends AnimatedCardProps {
    imageUrl?: string;
    title?: string;
    description?: string;
}

export function ZoomCard({ imageUrl, title, description, className, children, ...props }: ZoomCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <AnimatedCard
            className={cn('overflow-hidden', className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {imageUrl && (
                <div className="relative aspect-video overflow-hidden">
                    <motion.img
                        src={imageUrl}
                        alt={title || ''}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
                        animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                    />
                </div>
            )}
            {(title || description) && (
                <motion.div 
                    className="p-5"
                    animate={{ y: isHovered ? -4 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {title && <h3 className="font-semibold mb-1">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </motion.div>
            )}
            {children}
        </AnimatedCard>
    );
}

export { AnimatedCard };
