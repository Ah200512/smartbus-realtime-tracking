import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Shield,
    Eye,
    Phone,
    MapPin,
    X,
    Plus,
    Bell,
    CheckCircle,
    Clock,
    Filter,
    RefreshCw,
    Share2,
    ChevronDown,
    ChevronUp,
    Bus,
    User,
    Radio,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import type { SOSAlert } from '../types';

type FilterTab = 'all' | 'active' | 'resolved';

const MOCK_DETAILS: Record<string, { driver: string; phone: string; location: string; passengerCount: number }> = {
    'sos-1': { driver: 'Rajesh Kumar', phone: '+91 98765 43210', location: 'Anna Salai, Chennai', passengerCount: 34 },
};

function getDefaultDetail(busId: string) {
    return { driver: `Driver ${busId}`, phone: '+91 99999 00000', location: 'En Route, Chennai', passengerCount: 28 };
}

interface ExpandedAlertCardProps {
    alert: SOSAlert;
    onResolve: () => void;
    onDismiss: () => void;
}

function ExpandedAlertCard({ alert, onResolve, onDismiss }: ExpandedAlertCardProps) {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [shared, setShared] = useState(false);

    const details = MOCK_DETAILS[alert.id] || getDefaultDetail(alert.busId);

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    const handleResolve = async () => {
        setIsResolving(true);
        await new Promise((r) => setTimeout(r, 900));
        onResolve();
        setIsResolving(false);
    };

    const handleShare = () => {
        const msg = `🚨 SmartBus Alert: ${alert.message}\nBus: ${alert.bus?.number || alert.busId}\nLocation: ${details.location}\nTime: ${new Date(alert.createdAt).toLocaleTimeString()}`;
        if (navigator.clipboard) navigator.clipboard.writeText(msg);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    };

    const handleContactDriver = () => {
        window.open(`tel:${details.phone.replace(/\s/g, '')}`, '_self');
    };

    const handleViewOnMap = () => {
        const lat = alert.bus?.id ? '13.0827' : '13.0827';
        const lng = '80.2707';
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    const isActive = !alert.resolved;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
                isActive
                    ? 'bg-destructive/10 border-destructive/30 shadow-lg shadow-destructive/10'
                    : 'bg-card border-border opacity-75'
            }`}
            role="alert"
        >
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-destructive via-orange-400 to-destructive animate-pulse" />
            )}

            {isActive && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                    </span>
                </div>
            )}

            <div className="flex items-start gap-3 p-4 pb-3">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isActive ? 'bg-destructive/20' : 'bg-surface'}`}>
                    <AlertTriangle className={`h-5 w-5 ${isActive ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>

                <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-sm font-semibold ${isActive ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {isActive ? t('alerts.activeSOS') : t('alerts.resolved')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(new Date(alert.createdAt))}
                        </span>
                        {alert.bus && (
                            <Badge variant={isActive ? 'destructive' : 'outline'} className="text-xs py-0">
                                <Bus className="h-3 w-3 mr-1" />
                                {alert.bus.number}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    {alert.bus && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.bus.routeName} · {details.location}
                        </p>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {expanded ? 'Hide details' : 'Show details'}
                </button>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-surface/60 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Driver</span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{details.driver}</p>
                            </div>
                            <div className="bg-surface/60 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Phone</span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{details.phone}</p>
                            </div>
                            <div className="bg-surface/60 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Radio className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Passengers</span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{details.passengerCount} aboard</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-border/50 pt-3">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={handleViewOnMap}>
                    <Eye className="h-3.5 w-3.5" />
                    View on Map
                </Button>

                {isActive && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-8 text-primary border-primary/40 hover:bg-primary/10"
                        onClick={handleContactDriver}
                    >
                        <Phone className="h-3.5 w-3.5" />
                        Contact Driver
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className={`gap-1.5 text-xs h-8 transition-all ${shared ? 'text-success border-success/40 bg-success/10' : ''}`}
                    onClick={handleShare}
                >
                    <Share2 className="h-3.5 w-3.5" />
                    {shared ? 'Copied!' : 'Share Alert'}
                </Button>

                <div className="flex-1" />

                {isActive ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={handleResolve}
                        loading={isResolving}
                    >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {isResolving ? 'Resolving…' : t('alerts.markResolved')}
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-destructive"
                        onClick={onDismiss}
                    >
                        <X className="h-3.5 w-3.5" />
                        Dismiss
                    </Button>
                )}
            </div>
        </motion.div>
    );
}

export function AlertsPage() {
    const { t } = useLanguage();
    const alerts = useAppStore((state) => state.alerts);
    const resolveAlert = useAppStore((state) => state.resolveAlert);
    const userRole = useAppStore((state) => state.userRole);
    const addAlert = useAppStore((state) => state.addAlert);

    const [filter, setFilter] = useState<FilterTab>('all');
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const allAlerts = userRole === 'STUDENT' 
        ? alerts.filter(a => a.busId === '2' || a.busId === 'current-bus') 
        : alerts;

    const unresolvedAlerts = allAlerts.filter((a) => !a.resolved);
    const resolvedAlerts = allAlerts.filter((a) => a.resolved && !dismissed.has(a.id));

    const filteredAlerts =
        filter === 'active'
            ? unresolvedAlerts
            : filter === 'resolved'
            ? resolvedAlerts
            : [...unresolvedAlerts, ...resolvedAlerts];

    const handleDismiss = (id: string) => {
        setDismissed((prev) => new Set([...prev, id]));
    };

    const handleCreateTestAlert = () => {
        const testAlert: SOSAlert = {
            id: `sos-test-${Date.now()}`,
            userId: 'test-user',
            busId: '2',
            message: 'Breakdown reported on route',
            resolved: false,
            createdAt: new Date(),
            bus: {
                id: '2',
                number: 'BUS-002',
                routeName: 'Tambaram Express',
                capacity: 50,
                status: 'ACTIVE',
            },
        };
        addAlert(testAlert);
    };

    const totalAlerts = allAlerts.length;
    const resolvedCount = allAlerts.filter((a) => a.resolved).length;
    const responseRate = totalAlerts > 0 ? Math.round((resolvedCount / totalAlerts) * 100) : 100;

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: unresolvedAlerts.length + resolvedAlerts.length },
        { key: 'active', label: 'Active', count: unresolvedAlerts.length },
        { key: 'resolved', label: 'Resolved', count: resolvedAlerts.length },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-3 gap-4"
            >
                {[
                    { icon: Bell, label: 'Total Alerts', value: totalAlerts, color: 'text-primary' },
                    { icon: AlertTriangle, label: 'Active', value: unresolvedAlerts.length, color: 'text-destructive' },
                    { icon: Shield, label: 'Response Rate', value: `${responseRate}%`, color: 'text-success' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <Card key={label} className="py-3">
                        <CardContent className="flex items-center gap-3 p-0 px-4">
                            <div className="p-2 rounded-lg bg-surface">
                                <Icon className={`h-4 w-4 ${color}`} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className={`text-lg font-bold ${color}`}>{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                {t('alerts.activeAlerts')}
                                {unresolvedAlerts.length > 0 && (
                                    <Badge variant="destructive">{unresolvedAlerts.length}</Badge>
                                )}
                            </CardTitle>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
                                    <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setFilter(tab.key)}
                                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                                filter === tab.key
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {tab.label}
                                            {tab.count > 0 && (
                                                <span className="ml-1 text-xs opacity-60">({tab.count})</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={handleCreateTestAlert}>
                                    <Plus className="h-3.5 w-3.5" />
                                    New Alert
                                </Button>

                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.location.reload()}>
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert) => (
                                    <ExpandedAlertCard
                                        key={alert.id}
                                        alert={alert}
                                        onResolve={() => resolveAlert(alert.id)}
                                        onDismiss={() => handleDismiss(alert.id)}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-14"
                                >
                                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                        <Shield className="h-10 w-10 text-success/60" />
                                    </div>
                                    <p className="text-lg font-semibold text-success">{t('alerts.allClear')}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{t('alerts.noActiveAlerts')}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                {
                                    icon: Bell,
                                    label: 'Alert All Drivers',
                                    desc: 'Broadcast to fleet',
                                    color: 'text-primary',
                                    bg: 'bg-primary/10',
                                    onClick: () => alert('Broadcast sent to all drivers!'),
                                },
                                {
                                    icon: MapPin,
                                    label: 'View Fleet Map',
                                    desc: 'Track all buses',
                                    color: 'text-orange-500',
                                    bg: 'bg-orange-500/10',
                                    onClick: () => (window.location.href = '/map'),
                                },
                                {
                                    icon: Phone,
                                    label: 'Emergency Line',
                                    desc: 'Call dispatch',
                                    color: 'text-destructive',
                                    bg: 'bg-destructive/10',
                                    onClick: () => window.open('tel:+911800123456', '_self'),
                                },
                                {
                                    icon: CheckCircle,
                                    label: 'Resolve All',
                                    desc: 'Clear active alerts',
                                    color: 'text-success',
                                    bg: 'bg-success/10',
                                    onClick: () => unresolvedAlerts.forEach((a) => resolveAlert(a.id)),
                                },
                            ].map(({ icon: Icon, label, desc, color, bg, onClick }) => (
                                <button
                                    key={label}
                                    onClick={onClick}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface/60 transition-all duration-200 group text-center"
                                >
                                    <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-5 w-5 ${color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{label}</p>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
