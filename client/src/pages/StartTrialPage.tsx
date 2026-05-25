import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Shield, Clock, Star, Users, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const benefits = [
    { icon: Clock, text: '14-day free trial' },
    { icon: Shield, text: 'No credit card required' },
    { icon: Zap, text: 'Setup in under 5 minutes' },
    { icon: Star, text: 'Cancel anytime' },
];

const features = [
    'Real-time GPS tracking for all buses',
    'QR code attendance system',
    'SOS emergency alerts',
    'Comprehensive analytics dashboard',
    'Route optimization',
    'Parent/passenger notifications',
    'Mobile apps for iOS & Android',
    'Priority email support',
];

const testimonial = {
    quote: "SmartBus transformed how we manage our school district's fleet. The real-time tracking alone has saved us countless hours.",
    author: 'Jennifer Martinez',
    role: 'Transportation Director',
    company: 'Austin ISD',
};

export function StartTrialPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isSignedIn = !!user;

    if (isSignedIn) {
        return <Navigate to="/select-role" replace />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Already have an account?</span>
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column - Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:sticky lg:top-24"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <img src="/smartbus-icon.svg" alt="SmartBus" className="w-12 h-12" />
                                    <span className="font-bold text-2xl">
                                        smart<span className="text-primary">bus</span>
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                                    Start Your Free Trial <span className="gradient-text">Today</span>
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Join 500+ organizations using SmartBus to manage their fleets more efficiently.
                                </p>
                            </div>

                            {/* Quick Benefits */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                {benefits.map((benefit) => (
                                    <div key={benefit.text} className="flex items-center gap-2 text-sm">
                                        <benefit.icon className="h-4 w-4 text-primary" />
                                        <span>{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Features List */}
                            <Card className="p-6 mb-8">
                                <h3 className="font-semibold mb-4">Everything you get with the trial:</h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Testimonial */}
                            <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-orange-500/5 border-primary/10">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <blockquote className="text-sm italic mb-4">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{testimonial.author}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role}, {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {[
                                    { value: '500+', label: 'Customers' },
                                    { value: '10,000+', label: 'Buses' },
                                    { value: '99.9%', label: 'Uptime' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center p-4 rounded-lg bg-surface">
                                        <p className="text-xl font-bold text-primary">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Column - Sign Up Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-8">
                                <div className="text-center mb-6">
                                    <Badge variant="default" className="mb-4">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Professional Plan Trial
                                    </Badge>
                                    <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                                    <p className="text-muted-foreground text-sm">
                                        Get started with your 14-day free trial
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Button 
                                        size="xl" 
                                        className="w-full"
                                        onClick={() => navigate('/sign-up')}
                                    >
                                        Start Free Trial
                                    </Button>
                                    
                                    <p className="text-xs text-muted-foreground text-center pt-4">
                                        By signing up, you agree to our{' '}
                                        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="/security" className="text-primary hover:underline">Privacy Policy</a>
                                    </p>
                                </div>
                            </Card>

                            {/* Trust Badges */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4" />
                                    <span>SOC 2 Certified</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>99.99% Uptime</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>500+ Customers</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
