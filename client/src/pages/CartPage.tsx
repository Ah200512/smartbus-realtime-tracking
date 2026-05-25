import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, CreditCard, FileText, Minus, Plus, Trash2, Lock, Zap, Smartphone, Building2, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';

const planDetails: Record<string, { name: string; price: number; monthlyPrice: number; features: string[], isFreeTrial?: boolean }> = {
  basic: {
    name: 'Basic Plan', price: 0, monthlyPrice: 499,
    features: ['Up to 10 buses', 'Real-time GPS tracking', 'Basic attendance via QR', 'Email support', 'Basic analytics dashboard'],
    isFreeTrial: true
  },
  pro: {
    name: 'Pro Plan', price: 999, monthlyPrice: 999,
    features: ['Up to 50 buses', 'Advanced GPS with live ETA', 'QR + biometric attendance', 'SOS emergency alerts', 'Priority support', 'Advanced analytics', 'Custom branding', 'API access'],
  },
  enterprise: {
    name: 'Enterprise Plan', price: 1999, monthlyPrice: 1999,
    features: ['Unlimited buses', 'White-label solution', 'Dedicated account manager', '24/7 phone support', 'Custom integrations', 'SLA guarantees', 'Advanced security', 'Training & onboarding'],
  },
};

type PaymentMethod = 'card' | 'upi' | 'bank';

export function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isSignedIn, isLoaded } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  
  // Card payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI payment
  const [upiId, setUpiId] = useState('');
  
  // Bank transfer
  const [selectedBank, setSelectedBank] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Get plan from URL or localStorage
  const planParam = searchParams.get('plan') || 'basic';
  const [selectedPlan, setSelectedPlan] = useState(planParam);

  useEffect(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem('smartbus_cart');
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        if (cart.plan) setSelectedPlan(cart.plan);
        if (cart.quantity) setQuantity(cart.quantity);
      } catch { /* ignore parse errors */ }
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-up?redirect_url=/cart?plan=' + selectedPlan);
    }
  }, [isLoaded, isSignedIn, navigate, selectedPlan]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartbus_cart', JSON.stringify({ plan: selectedPlan, quantity }));
  }, [selectedPlan, quantity]);

  const plan = planDetails[selectedPlan] || planDetails.basic;
  const isFreeTrial = selectedPlan === 'basic';
  const subtotal = plan.price * quantity;
  const gst = Math.round(subtotal * 0.18);
  const totalBeforeDiscount = subtotal + gst;
  const total = Math.max(0, totalBeforeDiscount - discountAmount);

  // Coupon validation and application
  const coupons: Record<string, { discount: number; type: 'percentage' | 'fixed'; description: string }> = {
    'SAVE10': { discount: 10, type: 'percentage', description: '10% off all plans' },
    'SAVE20': { discount: 20, type: 'percentage', description: '20% off Pro & Enterprise' },
    'STUDENT': { discount: 15, type: 'percentage', description: '15% student discount' },
    'WELCOME': { discount: 5, type: 'percentage', description: '5% welcome bonus' },
    'FLAT500': { discount: 500, type: 'fixed', description: '₹500 off orders' },
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    
    if (!code) {
      setCouponError('Enter a coupon code');
      return;
    }

    const coupon = coupons[code];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      setDiscountAmount(0);
      setAppliedCoupon('');
      return;
    }

    if (isFreeTrial) {
      setCouponError('Cannot apply coupon to free trial');
      return;
    }

    const discount = coupon.type === 'percentage' 
      ? Math.round(totalBeforeDiscount * (coupon.discount / 100))
      : coupon.discount;

    setDiscountAmount(discount);
    setAppliedCoupon(code);
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    setCouponCode('');
    setCouponError('');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const handleCheckout = () => {
    if (isFreeTrial) {
      // Direct checkout for free trial
      handlePayment();
    } else {
      setShowPaymentModal(true);
    }
  };

  const triggerSuperbCelebration = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handlePayment = async () => {
    if (!isFreeTrial && selectedPaymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) return;
    if (!isFreeTrial && selectedPaymentMethod === 'upi' && !upiId) return;
    if (!isFreeTrial && selectedPaymentMethod === 'bank' && !selectedBank) return;
    
    setIsProcessing(true);
    
    try {
      // Create order via API
      const orderPayload = {
        plan: selectedPlan,
        price: total,
        paymentMethod: selectedPaymentMethod,
      };
      
      const response = await api.post('/payment/cart', orderPayload);
      const orderId = response._id;
      
      // Complete checkout
      await api.post(`/payment/checkout/${orderId}`, {
        paymentMethod: selectedPaymentMethod,
        lastFour: selectedPaymentMethod === 'card' ? cardNumber.slice(-4) : '',
      });
      
      // Save order to localStorage for confirmation
      const order = {
        userId: user?.id || 'guest',
        email: user?.email || '',
        plan: selectedPlan,
        planName: plan.name,
        quantity,
        subtotal,
        gst,
        total,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date().toISOString(),
        invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
      };
      localStorage.setItem('smartbus_last_order', JSON.stringify(order));
      localStorage.removeItem('smartbus_cart');
      
      setIsProcessing(false);
      setShowPaymentModal(false);
      setShowCelebration(true);
      
      // Trigger superb animation
      triggerSuperbCelebration();
      
      // Notification
      toast.success(isFreeTrial ? '🎉 Trial started successfully!' : '🎉 Payment successful! Subscription active.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#1a1b2e',
          color: '#fff',
          border: '1px solid #f97316',
          padding: '16px',
        },
      });

      // Auto-redirect to select role after celebration
      setTimeout(() => {
        navigate('/select-role');
      }, 5000);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const qrData = JSON.stringify({
    userId: user?.id || 'guest',
    email: user?.email || '',
    plan: selectedPlan,
    quantity,
    total,
    timestamp: new Date().toISOString(),
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
  });

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `smartbus-pass-${selectedPlan}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrData);
    toast.success('QR data copied to clipboard');
  };

  // Celebration animation
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center relative z-10 max-w-lg px-6"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-orange-400 to-primary flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 relative z-20"
            >
              <Check className="h-16 w-16 text-white" strokeWidth={3} />
            </motion.div>
            
            {/* Pulsing rings around the checkmark */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-3xl border-2 border-primary/30"
                animate={{
                  scale: [1, 1.8],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.6,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
              WELCOME <span className="gradient-text">ABOARD!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your <span className="text-primary font-bold">{plan.name}</span> is now active. 
              Get ready for a smarter commuting experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-sm text-muted-foreground">
                Redirecting to role selection in a few seconds...
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-primary shadow-[0_0_10px_#f97316]"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-primary/20 hover:bg-primary/10 transition-all"
                onClick={() => navigate('/select-role')}
              >
                Go Now
              </Button>
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                onClick={() => {
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f97316', '#ffffff', '#000000']
                  });
                  toast.success('More magic coming your way!');
                }}
              >
                More Magic! ✨
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Order complete view
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </header>
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-10 w-10 text-green-500" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
              <p className="text-muted-foreground mb-8">Your SmartBus subscription is now active.</p>

              {/* QR Code */}
              <Card className="p-8 mb-8">
                <h2 className="font-semibold text-lg mb-4">Your SmartBus Pass QR Code</h2>
                <div id="qr-code" className="flex justify-center mb-4">
                  <QRCodeCanvas
                    value={qrData}
                    size={250}
                    bgColor="#1a1b2e"
                    fgColor="#f97316"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleDownloadQR}>
                    Download QR PNG
                  </Button>
                  <Button variant="outline" onClick={handleCopyData}>
                    Copy QR Data
                  </Button>
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="p-6 text-left">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{plan.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{quantity}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Pricing
          </Button>
          <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
          <div />
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => (isSignedIn ? navigate('/dashboard') : navigate('/'))} className="hover:text-foreground transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/pricing')} className="hover:text-foreground transition-colors">Pricing</button>
          <span>/</span>
          <span className="text-foreground">Cart</span>
        </nav>
      </div>

      <main className="pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />Checkout
            </div>
            <h1 className="text-3xl font-bold mb-2">Complete Your <span className="gradient-text">Order</span></h1>
            {isFreeTrial && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-green-400 font-medium">
                ✨ 14-day free trial - No payment required!
              </motion.p>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Selection */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4"><CardTitle>Select Plan</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="grid gap-3">
                    {Object.entries(planDetails).map(([key, p]) => (
                      <button key={key} onClick={() => setSelectedPlan(key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPlan === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{p.name}</h3>
                            <p className="text-sm text-muted-foreground">{p.features.length} features included</p>
                          </div>
                          <span className={`text-xl font-bold ${key === 'basic' ? 'text-green-400' : 'text-primary'}`}>
                            {key === 'basic' ? 'FREE' : `₹${p.price.toLocaleString('en-IN')}`}
                            <span className="text-sm text-muted-foreground font-normal">{key !== 'basic' ? '/mo' : ''}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quantity */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4"><CardTitle>Quantity (Bus Licenses)</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Invoice Preview</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowInvoice(!showInvoice)}>
                    {showInvoice ? 'Hide' : 'Show'} Details
                  </Button>
                </div>
                <AnimatePresence>
                  {showInvoice && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="border border-border rounded-lg p-4 text-sm">
                        <div className="flex justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">INVOICE</p>
                            <p className="text-muted-foreground">SmartBus Technologies Pvt. Ltd.</p>
                            <p className="text-muted-foreground">GSTIN: 33AABCS1234X1ZA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">Date: {new Date().toLocaleDateString('en-IN')}</p>
                            <p className="text-muted-foreground">Invoice #: INV-PREVIEW</p>
                          </div>
                        </div>
                        <div className="border-t border-border pt-3 space-y-2">
                          <div className="flex justify-between">
                          <span>Bill To:</span>
                          <span>{user?.username || 'User'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span>{user?.email || ''}</span>
                        </div>
                        </div>
                        <div className="border-t border-border mt-3 pt-3 space-y-2">
                          <div className="flex justify-between"><span>{plan.name} × {quantity}</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>CGST (9%)</span><span>₹{Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between text-muted-foreground"><span>SGST (9%)</span><span>₹{Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">{plan.name} × {quantity}</span><span className={selectedPlan === 'basic' ? 'text-green-400 font-semibold' : ''}>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  {subtotal > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between font-bold border-t border-border pt-3">
                    <span>Total</span>
                    <span className={`text-lg ${isFreeTrial ? 'text-green-400' : 'text-primary'}`}>{isFreeTrial ? 'FREE' : `₹${total.toLocaleString('en-IN')}`}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium">Features included:</h4>
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                {!isFreeTrial && (
                  <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Have a coupon code?</span>
                    </div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-400">{appliedCoupon} applied!</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs text-green-300 hover:text-green-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError('');
                            }}
                            placeholder="e.g., SAVE10"
                            className="input flex-1 py-2"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyCoupon}
                            className="px-4"
                          >
                            Apply
                          </Button>
                        </div>
                        {couponError && (
                          <div className="flex items-center gap-2 text-xs text-red-400">
                            <AlertCircle className="h-3 w-3" />{couponError}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Try: SAVE10, SAVE20, STUDENT, WELCOME, FLAT500
                        </div>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="mt-3 p-2 bg-green-500/10 rounded text-sm">
                        <p className="text-green-400">✓ Discount: -₹{discountAmount.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Updated total with discount */}
                {discountAmount > 0 && (
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm text-red-400 font-medium">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-border pt-3 mt-2">
                      <span>Final Total</span>
                      <span className="text-lg text-green-400">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isFreeTrial ? 'Start Free Trial' : `Pay ₹${total.toLocaleString('en-IN')}`}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {isFreeTrial ? '✨ 14-day free trial. No card required. Cancel anytime.' : '🔒 Secure payment. Cancel anytime.'}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !isProcessing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Secure Payment</h2>
                    <p className="text-sm text-muted-foreground">Choose payment method</p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Smartphone },
                    { id: 'bank', label: 'Bank', icon: Building2 },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${selectedPaymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                      <method.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card Payment */}
                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Card Holder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="•••"
                          maxLength={3}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment */}
                {selectedPaymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="input"
                      />
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                      <p className="text-blue-300">💡 You'll receive a UPI payment request on your registered mobile</p>
                    </div>
                  </div>
                )}

                {/* Bank Transfer */}
                {selectedPaymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Select Bank</label>
                      <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="input">
                        <option value="">Choose a bank...</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm">
                      <p className="text-amber-300">🏦 Bank transfer details will be provided after order confirmation</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4 mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm mb-2 text-red-400 font-medium">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handlePayment}
                  loading={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}
