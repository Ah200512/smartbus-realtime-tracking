import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { RefreshCw } from 'lucide-react';

interface QRGeneratorProps {
    busId: string;
    className?: string;
}

export function QRGenerator({ busId, className }: QRGeneratorProps) {
    const [qrData, setQrData] = useState('');
    const [expiresIn, setExpiresIn] = useState(300); // 5 minutes

    const generateQR = () => {
        const timestamp = Date.now();
        const data = JSON.stringify({
            busId,
            timestamp,
            expiresAt: timestamp + 300000, // 5 minutes expiry
        });
        setQrData(data);
        setExpiresIn(300);
    };

    useEffect(() => {
        generateQR();
    }, [busId]);

    useEffect(() => {
        if (expiresIn <= 0) {
            generateQR();
            return;
        }

        const timer = setInterval(() => {
            setExpiresIn((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresIn]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Attendance QR</CardTitle>
                    <Button variant="ghost" size="sm" onClick={generateQR}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-xl">
                        <QRCodeSVG
                            value={qrData}
                            size={200}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Scan to mark attendance
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Expires in{' '}
                            <span className={expiresIn < 60 ? 'text-warning' : 'text-foreground'}>
                                {formatTime(expiresIn)}
                            </span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
