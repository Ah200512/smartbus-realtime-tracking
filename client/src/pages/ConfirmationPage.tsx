import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Download, Copy, Home, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

interface OrderData {
  clerkUserId: string;
  email: string;
  plan: string;
  planName: string;
  quantity: number;
  subtotal: number;
  gst: number;
  total: number;
  timestamp: string;
  invoiceNumber: string;
}

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartbus_last_order');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const qrData = JSON.stringify({
    clerkUserId: order.clerkUserId,
    email: order.email,
    plan: order.plan,
    timestamp: order.timestamp,
  });

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#confirmation-qr canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `smartbus-pass-${order.plan}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <span className="font-bold text-xl">
            smart<span className="text-primary">bus</span>
          </span>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
              >
                <Check className="h-12 w-12 text-green-500" />
              </motion.div>
            </motion.div>

            {/* Confetti-like sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-2 mb-4"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [-10, 0], opacity: [0, 1] }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
              <p className="text-muted-foreground mb-8">
                Your SmartBus subscription is now active. Welcome aboard!
              </p>
            </motion.div>

            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 mb-8">
                <h2 className="font-semibold text-lg mb-6">Your SmartBus Pass QR Code</h2>
                <div id="confirmation-qr" className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <QRCodeCanvas
                      value={qrData}
                      size={250}
                      bgColor="#ffffff"
                      fgColor="#1a1b2e"
                      level="H"
                      includeMargin
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan this QR code for quick access to your SmartBus pass.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={handleDownloadQR}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy QR Data'}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 text-left">
                <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice</span>
                    <span className="font-mono text-xs">{order.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{order.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{order.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{order.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-3 mt-3">
                    <span>Total Paid</span>
                    <span className="text-primary text-lg">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex gap-4 justify-center flex-wrap"
            >
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
                View Plans
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
