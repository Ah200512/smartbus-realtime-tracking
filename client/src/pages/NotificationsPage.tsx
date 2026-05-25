import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Bell, BellRing, Check, Clock, AlertTriangle, Info, Trash2, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Footer } from '../components/layout/Footer';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'alert';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const initialNotifications: Notification[] = [
    { id: '1', type: 'success', title: 'Subscription Activated', message: 'Your Pro plan subscription is now active. Enjoy all premium features!', time: '2 min ago', read: false },
    { id: '2', type: 'info', title: 'New Feature', message: 'Route optimization powered by AI is now available for Pro and Enterprise plans.', time: '1 hour ago', read: false },
    { id: '3', type: 'warning', title: 'Bus #KA-05-1234 Delayed', message: 'Route 7A delayed by 15 minutes due to traffic on MG Road, Bengaluru.', time: '3 hours ago', read: false },
    { id: '4', type: 'alert', title: 'SOS Alert Resolved', message: 'Emergency alert for Bus #TN-01-5678 on Route 12B has been resolved.', time: '5 hours ago', read: true },
    { id: '5', type: 'info', title: 'Maintenance Scheduled', message: 'System maintenance on 28th Feb, 2:00 AM - 4:00 AM IST. Minimal service disruption.', time: '1 day ago', read: true },
    { id: '6', type: 'success', title: 'Monthly Report Ready', message: 'Your January 2026 fleet analytics report is ready for download.', time: '2 days ago', read: true },
];

const typeConfig = {
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    success: { icon: Check, color: 'text-green-400', bg: 'bg-green-500/10' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    alert: { icon: BellRing, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export function NotificationsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
    const unreadCount = notifications.filter(n => !n.read).length;

    const markRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />Back
                    </Button>
                    <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
                    <div />
                </div>
            </header>

            <div className="pt-20 max-w-4xl mx-auto px-6">
                <Breadcrumb items={[{ label: 'Notifications' }]} />
            </div>

            <main className="pt-8 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3">
                                    <Bell className="h-7 w-7 text-primary" /> Notifications
                                </h1>
                                <p className="text-muted-foreground mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
                                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm ${filter === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
                                    <button onClick={() => setFilter('unread')} className={`px-4 py-2 text-sm ${filter === 'unread' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>Unread ({unreadCount})</button>
                                </div>
                                {unreadCount > 0 && (
                                    <Button variant="outline" size="sm" onClick={markAllRead}>
                                        <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredNotifications.length === 0 ? (
                                <Card className="p-12 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-1">No notifications</h3>
                                    <p className="text-muted-foreground">You're all caught up!</p>
                                </Card>
                            ) : (
                                filteredNotifications.map((notification, index) => {
                                    const config = typeConfig[notification.type];
                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className={`p-4 transition-all hover:border-primary/30 ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                                        <config.icon className={`h-5 w-5 ${config.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h3>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" /> {notification.time}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {!notification.read && (
                                                                <button onClick={() => markRead(notification.id)} className="text-xs text-primary hover:underline">Mark as read</button>
                                                            )}
                                                            <button onClick={() => deleteNotification(notification.id)} className="text-xs text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3 inline mr-1" />Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
