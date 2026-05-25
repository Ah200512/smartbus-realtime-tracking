import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Download, FileText, Clock, CheckCircle, AlertCircle, Plus, Trash2, Check, Zap, Star, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export function BillingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(14);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    fetchOrders();

    // Calculate trial days remaining
    if (user?.subscriptionEnd) {
      const end = new Date(user.subscriptionEnd);
      const now = new Date();
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setTrialDaysRemaining(Math.max(0, daysLeft));
    }
  }, [user]);

  const planDetails: Record<string, { icon: any; color: string; description: string }> = {
    basic: { icon: Zap, color: 'text-orange-400', description: 'Perfect for small school fleets' },
    pro: { icon: Star, color: 'text-yellow-400', description: 'For growing institutions' },
    enterprise: { icon: Shield, color: 'text-blue-400', description: 'For large-scale operations' },
  };

  const currentPlan = planDetails[user?.plan as keyof typeof planDetails] || null;
  const isOnTrial = user?.plan === 'basic' && !user?.trialUsed;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <span className="font-bold">Billing Center</span>
          <div />
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Billing & <span className="gradient-text">Account</span></h1>
            <p className="text-muted-foreground mb-8">Manage your subscription, invoices, and payment methods</p>

            {/* Current Plan Card */}
            {currentPlan ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-6 mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <currentPlan.icon className={`h-6 w-6 ${currentPlan.color}`} />
                        </div>
                        <div>
                          <CardTitle className="capitalize">{user?.plan} Plan</CardTitle>
                          <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => navigate('/pricing')}>
                        Upgrade Plan
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Subscription Status */}
                    <div className="p-4 rounded-lg bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        {isOnTrial ? <Clock className="h-4 w-4 text-orange-400" /> : <CheckCircle className="h-4 w-4 text-green-400" />}
                        <span className="text-sm font-medium">{isOnTrial ? 'Trial Active' : 'Active Subscription'}</span>
                      </div>
                      <p className="text-2xl font-bold mb-1">
                        {isOnTrial ? trialDaysRemaining : user?.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString('en-IN') : 'No end date'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isOnTrial ? `${trialDaysRemaining} days remaining` : 'Renewal date'}
                      </p>
                    </div>

                    {/* Monthly Cost */}
                    <div className="p-4 rounded-lg bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Monthly Cost</span>
                      </div>
                      <p className="text-2xl font-bold mb-1">
                        {isOnTrial ? '₹0' : user?.plan === 'pro' ? '₹999' : user?.plan === 'enterprise' ? '₹1,999' : '₹499'}
                      </p>
                      <p className="text-xs text-muted-foreground">Billed monthly</p>
                    </div>

                    {/* Next Billing Date */}
                    <div className="p-4 rounded-lg bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-medium">Next Billing</span>
                      </div>
                      <p className="text-2xl font-bold mb-1">
                        {isOnTrial 
                          ? (new Date(Date.now() + trialDaysRemaining * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN')
                          : user?.subscriptionEnd 
                          ? new Date(user.subscriptionEnd).toLocaleDateString('en-IN')
                          : 'N/A'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isOnTrial ? 'Trial ends' : 'Subscription renews'}
                      </p>
                    </div>
                  </div>

                  {isOnTrial && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-300">Free Trial Ending Soon</p>
                        <p className="text-xs text-orange-200 mt-1">
                          Your free trial ends in {trialDaysRemaining} days. After that, your plan will require a payment method on file.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-8 text-center mb-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">No Active Subscription</h3>
                  <p className="text-muted-foreground mb-6">Start your free trial today and unlock all features</p>
                  <Button size="lg" onClick={() => navigate('/pricing')}>
                    View Plans
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Payment Methods */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 mb-8">
                <CardHeader className="p-0 mb-6 flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddPaymentMethod(!showAddPaymentMethod)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  {showAddPaymentMethod && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 p-4 rounded-lg bg-surface border border-border"
                    >
                      <div className="grid gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Payment Method Type</label>
                          <select className="input">
                            <option value="">Select...</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="upi">UPI</option>
                            <option value="bank">Bank Transfer</option>
                          </select>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Card Number</label>
                            <input type="text" placeholder="4242 4242 4242 4242" className="input" maxLength={19} />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="input" maxLength={5} />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1" size="sm">Save Method</Button>
                          <Button variant="outline" className="flex-1" size="sm" onClick={() => setShowAddPaymentMethod(false)}>Cancel</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {user?.paymentMethods && user.paymentMethods.length > 0 ? (
                    <div className="space-y-3">
                      {user.paymentMethods.map((method: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-lg bg-surface border border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{method.brand} •••• {method.last4}</p>
                              <p className="text-xs text-muted-foreground">Expires {method.expiryMonth}/{method.expiryYear}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && <Badge variant="default" className="text-xs">Default</Badge>}
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No payment methods on file</p>
                      <p className="text-xs text-muted-foreground mb-4">Add a payment method to upgrade or renew your subscription</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order History */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Invoice History
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No invoices yet</p>
                      <p className="text-xs text-muted-foreground">Your invoices will appear here after your first purchase</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {orders.map((order: any) => (
                        <motion.div 
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium capitalize">{order.plan} Plan</p>
                              <Badge 
                                variant={order.status === 'completed' ? 'default' : order.status === 'pending' ? 'outline' : 'destructive'}
                              >
                                {order.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{order.invoiceNumber} • {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-primary">₹{order.price.toLocaleString('en-IN')}</span>
                            <AnimatePresence>
                              {order.qrCode && (
                                <motion.a 
                                  href={order.qrCode} 
                                  download={`qr-${order.invoiceNumber}.png`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button variant="ghost" size="icon" title="Download QR Code">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </motion.a>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
