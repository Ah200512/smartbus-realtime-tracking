import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, Settings, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: CreditCard, label: 'Pricing', href: '/pricing' },
    { icon: Bell, label: 'Alerts', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/90 backdrop-blur-md border-t border-border" aria-label="Mobile navigation">
            <div className="flex items-center justify-around py-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <button
                            key={item.href}
                            onClick={() => navigate(item.href)}
                            className={`relative flex flex-col items-center gap-1 min-w-[48px] min-h-[44px] px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute -top-[1px] w-8 h-0.5 bg-primary rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
