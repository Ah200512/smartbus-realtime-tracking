import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/Dialog';
import { useAppStore } from '../../stores/appStore';
import { sosService } from '../../services/sosService';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import type { SOSAlert } from '../../types';

interface SOSButtonProps {
    busId: string;
}

export function SOSButton({ busId }: SOSButtonProps) {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const addAlert = useAppStore((state) => state.addAlert);

    const handleSOS = async () => {
        setIsSending(true);
        setError('');

        const result = await sosService.triggerAlert('current-user', busId);

        if (result.success && result.alert) {
            const alert: SOSAlert = {
                id: result.alert.id,
                userId: 'current-user',
                busId,
                message: result.alert.message || t('sos.title'),
                resolved: false,
                createdAt: new Date(),
            };

            addAlert(alert);
            setIsSending(false);
            setSent(true);
            showToast(t('sos.alertSent'), 'success');

            // Reset after 3 seconds
            setTimeout(() => {
                setSent(false);
                setShowConfirm(false);
            }, 3000);
        } else {
            setIsSending(false);
            setError(result.error || 'Failed to send alert');
            showToast(result.error || 'Failed to send alert', 'error');
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                size="lg"
                className="gap-2"
                onClick={() => setShowConfirm(true)}
                aria-label={t('sos.button')}
            >
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                {t('sos.button')}
            </Button>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                            {t('sos.title')}
                        </DialogTitle>
                        <DialogDescription>
                            {sent
                                ? t('sos.sentMessage')
                                : t('sos.confirmMessage')}
                        </DialogDescription>
                    </DialogHeader>

                    {sent ? (
                        <div className="flex flex-col items-center py-6" role="status" aria-label={t('sos.alertSent')}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center"
                            >
                                <motion.svg
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    className="w-8 h-8 text-success"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <motion.path
                                        d="M20 6L9 17l-5-5"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    />
                                </motion.svg>
                            </motion.div>
                            <p className="mt-4 text-sm font-medium text-success">{t('sos.alertSent')}</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <p className="text-sm text-destructive text-center py-2">{error}</p>
                            )}
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                                    {t('common.cancel')}
                                </Button>
                                <Button variant="destructive" onClick={handleSOS} loading={isSending}>
                                    {isSending ? t('sos.sending') : t('sos.sendAlert')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

interface AlertCardProps {
    alert: SOSAlert;
    onResolve: () => void;
}

export function AlertCard({ alert, onResolve }: AlertCardProps) {
    const { t } = useLanguage();
    const [isResolving, setIsResolving] = useState(false);

    const handleResolve = async () => {
        setIsResolving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onResolve();
        setIsResolving(false);
    };

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`relative rounded-xl border p-4 ${alert.resolved
                ? 'bg-card border-border'
                : 'bg-destructive/10 border-destructive/30 animate-pulse-slow'
                }`}
            role="alert"
            aria-live="polite"
        >
            {!alert.resolved && (
                <div className="absolute top-4 right-4">
                    <span className="flex h-3 w-3" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                    </span>
                </div>
            )}

            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${alert.resolved ? 'bg-surface' : 'bg-destructive/20'}`}>
                    <AlertTriangle className={`h-5 w-5 ${alert.resolved ? 'text-muted-foreground' : 'text-destructive'}`} aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${alert.resolved ? 'text-muted-foreground' : 'text-destructive'}`}>
                            {alert.resolved ? t('alerts.resolved') : t('alerts.activeSOS')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {timeAgo(new Date(alert.createdAt))}
                        </span>
                    </div>

                    <p className="text-sm text-foreground mb-2">{alert.message}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {alert.bus && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" aria-hidden="true" />
                                {alert.bus.number} - {alert.bus.routeName}
                            </span>
                        )}
                    </div>
                </div>

                {!alert.resolved && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResolve}
                        loading={isResolving}
                        aria-label={t('alerts.markResolved')}
                    >
                        {t('alerts.markResolved')}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
