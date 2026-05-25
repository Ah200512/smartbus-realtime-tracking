import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Check, Zap, Star, Shield, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Footer } from '../components/layout/Footer';
import { useStartTrial } from '../lib/startTrial';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 499,
    yearlyPrice: 4790,
    description: 'Perfect for small school fleets across India',
    icon: Zap,
    features: [
      'Up to 10 buses',
      'Real-time GPS tracking',
      'Basic attendance via QR',
      'Email support',
      'Basic analytics dashboard',
      'IST timezone default',
    ],
    cta: 'Start Free Trial',
    badge: '14-day free trial • No card required',
    trialOnly: true,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 999,
    yearlyPrice: 9590,
    description: 'For growing institutions & municipal fleets',
    icon: Star,
    features: [
      'Up to 50 buses',
      'Advanced GPS with live ETA',
      'QR + biometric attendance',
      'SOS emergency alerts',
      'Priority support (Hindi & English)',
      'Advanced analytics & reports',
      'Custom branding',
      'API access',
      'Route optimization',
    ],
    cta: 'Get Started',
    badge: 'Upgrade from Basic anytime',
    trialOnly: false,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 1999,
    yearlyPrice: 19190,
    description: 'For state transport & large-scale operations',
    icon: Shield,
    features: [
      'Unlimited buses',
      'White-label solution',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantees (99.9% uptime)',
      'Advanced security & compliance',
      'On-site training & onboarding',
      'Multi-city support',
      'GSTIN billing support',
    ],
    cta: 'Contact Sales',
    badge: 'Custom pricing available',
    trialOnly: false,
    popular: false,
  },
];

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [isYearly, setIsYearly] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const { handleStartTrial } = useStartTrial();

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const yearlySavings = (plan.monthlyPrice * 12) - plan.yearlyPrice;
    return yearlySavings;
  };

  const handlePlanAction = (plan: typeof plans[0]) => {
    if (plan.trialOnly) {
      // Free trial flow for Basic plan
      handleStartTrial(plan.id);
    } else if (plan.id === 'enterprise') {
      // Contact sales
      navigate('/contact');
    } else {
      // For Pro plan or other paid plans
      // Save to localStorage for cart persistence
      localStorage.setItem('smartbus_cart', JSON.stringify({ plan: plan.id, quantity: 1 }));
      
      if (!isSignedIn) {
        navigate(`/sign-up?redirect_url=/cart?plan=${plan.id}`);
      } else {
        navigate(`/cart?plan=${plan.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => isSignedIn ? navigate('/dashboard') : navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </div>
          <Button onClick={() => isSignedIn ? navigate('/dashboard') : navigate('/sign-up')}>
            {isSignedIn ? 'Dashboard' : 'Get Started'}
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => isSignedIn ? navigate('/dashboard') : navigate('/')} className="hover:text-foreground transition-colors">Home</button>
          <span>/</span>
          <span className="text-foreground">Pricing</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Choose the Perfect <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Built for Indian transit. Start with a 14-day free trial. No credit card required. All prices in INR.
            </p>

            {/* Monthly/Yearly Toggle */}
            <div className="inline-flex items-center gap-3 bg-surface border border-border rounded-full p-1.5">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isYearly ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isYearly ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Yearly
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full card-lift-glow transition-all ${plan.popular ? 'border-primary/50 shadow-glow scale-[1.02]' : ''}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <plan.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">₹{getPrice(plan).toLocaleString('en-IN')}</span>
                        <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                      </div>
                      {isYearly && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-green-400 mt-1 flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Save ₹{getSavings(plan).toLocaleString('en-IN')}/year
                        </motion.p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handlePlanAction(plan)}
                    >
                      {plan.cta}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground px-2">{plan.badge}</p>

                    {/* Expandable Pricing Details */}
                    <div className="border-t border-border pt-4">
                      <button
                        onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                        className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View Pricing Details
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedPlan === plan.id ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedPlan === plan.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly price</span>
                                <span>₹{plan.monthlyPrice.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Yearly price</span>
                                <span>₹{plan.yearlyPrice.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹{Math.round(plan.monthlyPrice * 0.18).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t border-border pt-2">
                                <span>Total (monthly + GST)</span>
                                <span className="text-primary">₹{Math.round(plan.monthlyPrice * 1.18).toLocaleString('en-IN')}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                * 14-day free trial. Cancel anytime. Billed in INR. GST as applicable.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Enterprise-Grade Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Security & Compliance',
                      items: ['SSO integration', 'GDPR & IT Act compliant', 'End-to-end encryption', 'SOC 2 certified'],
                    },
                    {
                      title: 'Customization',
                      items: ['White-label mobile app', 'Custom branding', 'RESTful API access', 'Webhook integrations'],
                    },
                    {
                      title: 'Indian Market',
                      items: ['GSTIN billing', 'UPI payment support', 'Regional language support', 'RTO compliance tools'],
                    },
                  ].map((category) => (
                    <div key={category.title}>
                      <h3 className="font-semibold mb-3">{category.title}</h3>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Check className="h-4 w-4 text-success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ-like CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border border-primary/20 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Plan?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                We work with state transport corporations, municipal bodies, and large educational institutions across India.
              </p>
              <Button size="lg" onClick={() => navigate('/contact')}>
                Contact Our Sales Team
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
