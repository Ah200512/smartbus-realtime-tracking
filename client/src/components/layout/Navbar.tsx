import { Moon, Sun, Bell, Wifi, WifiOff, LogOut, User, ChevronDown, Settings, CreditCard, LayoutDashboard, HelpCircle, BellRing, ShoppingCart, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/Dialog';

interface NavbarProps {
    title?: string;
}

const menuItems = [
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CreditCard, label: 'Billing', href: '/billing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: BellRing, label: 'Notifications', href: '/notifications' },
    { icon: HelpCircle, label: 'Help', href: '/help-center' },
];

export function Navbar({ title = 'Dashboard' }: NavbarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const menuRef = useRef<HTMLDivElement>(null);

    // Separate selectors to avoid re-renders
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);
    const isConnected = useAppStore((state) => state.isConnected);
    const alerts = useAppStore((state) => state.alerts);
    const userRole = useAppStore((state) => state.userRole);

    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    // Keyboard accessibility
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowUserMenu(false);
                setFocusedIndex(-1);
            }
            if (!showUserMenu) return;

            // Total items = menuItems.length + 1 (sign out)
            const totalItems = menuItems.length + 1;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % totalItems);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                event.preventDefault();
                if (focusedIndex < menuItems.length) {
                    setShowUserMenu(false);
                    setFocusedIndex(-1);
                    navigate(menuItems[focusedIndex].href);
                } else {
                    // Sign Out
                    setShowUserMenu(false);
                    setFocusedIndex(-1);
                    setShowLogoutModal(true);
                }
            }
        };
        if (showUserMenu) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showUserMenu, focusedIndex, navigate]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center justify-between h-full px-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold">{title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface">
                            {isConnected ? (
                                <>
                                    <Wifi className="h-4 w-4 text-success" />
                                    <span className="text-xs font-medium text-success">Live</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Offline</span>
                                </>
                            )}
                        </div>

                        {/* Home Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.location.href = '/'} 
                            aria-label="Home"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Home className="h-5 w-5" />
                        </Button>

                        {/* Cart Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative text-muted-foreground hover:text-primary transition-colors" 
                            onClick={() => navigate('/cart')} 
                            aria-label="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>

                        {/* Notifications */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative text-muted-foreground hover:text-primary transition-colors" 
                            onClick={() => navigate('/notifications')} 
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {unresolvedAlerts > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium border-2 border-card">
                                    {unresolvedAlerts}
                                </span>
                            )}
                        </Button>

                        {/* Theme Toggle */}
                        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="text-muted-foreground hover:text-primary transition-colors">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                                aria-expanded={showUserMenu}
                                aria-haspopup="true"
                                aria-label="User menu"
                            >
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src={undefined} alt={user?.username || 'User'} />
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(user?.username)}</AvatarFallback>
                                </Avatar>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Enhanced Animated Dropdown */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
                                    >
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-border bg-surface/50">
                                            <p className="font-medium text-sm truncate">{user?.username || 'User'}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-4">
                                                    {userRole || 'Passenger'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            {menuItems.map((item, index) => (
                                                <motion.button
                                                    key={item.label}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    onClick={() => {
                                                        setShowUserMenu(false);
                                                        setFocusedIndex(-1);
                                                        navigate(item.href);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors min-h-[44px] ${focusedIndex === index ? 'bg-surface ring-1 ring-primary/30' : ''}`}
                                                    role="menuitem"
                                                >
                                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                                    {item.label}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {/* Sign Out */}
                                        <div className="border-t border-border py-1">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    setFocusedIndex(-1);
                                                    setShowLogoutModal(true);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors min-h-[44px] ${focusedIndex === menuItems.length ? 'bg-destructive/10 ring-1 ring-destructive/30' : ''}`}
                                                role="menuitem"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Sign Out</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowLogoutModal(false)} disabled={isLoggingOut}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
