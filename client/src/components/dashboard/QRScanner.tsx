import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { attendanceService } from '../../services/attendanceService';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

interface QRScannerProps {
  userId: string;
  className?: string;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export function QRScanner({ userId, className }: QRScannerProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSimulatedScan = useCallback(async () => {
    setStatus('scanning');
    setErrorMessage('');

    // Generate mock QR data for BUS-001
    const mockQRData = attendanceService.generateMockQRData('BUS-001');

    const result = await attendanceService.markAttendance(userId, mockQRData);

    if (result.success) {
      setStatus('success');
      showToast(t('attendance.scanSuccess'), 'success');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Unknown error');
      showToast(result.error || 'Scan failed', 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [userId, showToast, t]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" aria-hidden="true" />
          {t('attendance.scanQR')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* Scanner Area */}
          <div className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-border bg-surface/50 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                  <p className="text-xs text-muted-foreground">{t('attendance.scanQR')}</p>
                </motion.div>
              )}

              {status === 'scanning' && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-2 animate-spin" aria-hidden="true" />
                  <p className="text-xs text-muted-foreground">{t('common.loading')}</p>
                  {/* Scan line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-primary/60"
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  />
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="h-14 w-14 text-success mx-auto mb-2" aria-hidden="true" />
                  </motion.div>
                  <p className="text-xs text-success font-medium">{t('attendance.verified')}</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center px-2"
                >
                  <XCircle className="h-14 w-14 text-destructive mx-auto mb-2" aria-hidden="true" />
                  <p className="text-xs text-destructive font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Simulated Scan Button */}
          <Button
            onClick={handleSimulatedScan}
            disabled={status === 'scanning'}
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label={t('attendance.simulateScan')}
          >
            <QrCode className="h-4 w-4" aria-hidden="true" />
            {status === 'scanning' ? t('common.loading') : t('attendance.simulateScan')}
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            Camera scan not available. Use the button above to test attendance marking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
