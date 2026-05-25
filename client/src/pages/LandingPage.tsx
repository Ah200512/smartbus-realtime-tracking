import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, MapPin, Shield, Clock, Users, Zap, ShoppingCart, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { useAppStore } from '../stores/appStore';
import { useStartTrial } from '../lib/startTrial';

export function LandingPage() {
    const { user } = useAuth();
    const isSignedIn = !!user;
    const navigate = useNavigate();
    const userRole = useAppStore((state) => state.userRole);
    const onboardingDone = useAppStore((state) => state.onboardingDone);
    const cart = useAppStore((state) => state.cart);
    const { handleStartTrial } = useStartTrial();

    // Redirect logic removed to allow signed-in users to view the landing page (Home)
    // as requested by the user.

    const features = [
        {
            icon: MapPin,
            title: 'Real-Time Tracking',
            description: 'Track your bus location in real-time with smooth animations',
        },
        {
            icon: Shield,
            title: 'SOS Emergency',
            description: 'One-tap emergency alerts to ensure passenger safety',
        },
        {
            icon: Clock,
            title: 'Smart ETA',
            description: 'Accurate arrival predictions based on live traffic data',
        },
        {
            icon: Users,
            title: 'QR Attendance',
            description: 'Seamless check-in with QR code scanning',
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
                        <span className="font-bold text-xl">
                            smart<span className="text-primary">bus</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <button onClick={() => navigate('/pricing')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</button>
                        <button onClick={() => navigate('/about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
                        <button onClick={() => navigate('/our-journey')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Journey</button>
                        <button onClick={() => navigate('/contact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</button>
                    </nav>
                    <div className="flex items-center gap-3">
                        {cart.length > 0 && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="relative text-primary hover:bg-primary/10"
                                onClick={() => navigate('/cart')}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            </Button>
                        )}
                        {isSignedIn ? (
                            <Button onClick={() => navigate(userRole ? `/dashboard/${userRole.toLowerCase()}` : '/select-role')}>
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => navigate('/sign-in')}>
                                    Sign In
                                </Button>
                                <Button onClick={() => navigate('/sign-up')}>Get Started</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-16 flex-1">
                <section className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                    <Zap className="h-4 w-4" />
                                    Enterprise Transportation Platform
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                                    Smart Fleet Management for{' '}
                                    <span className="gradient-text">Modern Transit</span>
                                </h1>
                                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                                    Real-time GPS tracking, automated attendance, emergency
                                    alerts, and comprehensive analytics—all in one powerful
                                    platform.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" onClick={() => handleStartTrial('pro')}>
                                        Start Free Trial
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => navigate('/watch-demo')}
                                    >
                                        Watch Demo
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Animated Bus Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative aspect-square max-w-lg mx-auto">
                                    {/* Glowing background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-orange-500/10 rounded-3xl blur-3xl" />

                                    {/* Map preview card */}
                                    <div className="relative bg-card border border-border rounded-2xl p-4 shadow-2xl">
                                        <div className="aspect-video bg-surface rounded-xl overflow-hidden relative">
                                            {/* Grid */}
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                          `,
                                                    backgroundSize: '30px 30px',
                                                }}
                                            />

                                            {/* Animated bus marker */}
                                            <motion.div
                                                className="absolute"
                                                animate={{
                                                    x: [100, 250, 200, 300],
                                                    y: [150, 100, 200, 120],
                                                }}
                                                transition={{
                                                    duration: 8,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                }}
                                            >
                                                <div className="relative">
                                                    <div className="w-4 h-4 rounded-full bg-primary/30 animate-ping absolute" />
                                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow">
                                                        <Bus className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                            </motion.div>

                                            {/* Route line */}
                                            <svg
                                                className="absolute inset-0 w-full h-full"
                                                style={{ opacity: 0.3 }}
                                            >
                                                <path
                                                    d="M 100 150 Q 200 50 250 100 T 350 120"
                                                    stroke="hsl(25, 95%, 53%)"
                                                    strokeWidth="2"
                                                    strokeDasharray="8 4"
                                                    fill="none"
                                                />
                                            </svg>
                                        </div>

                                        {/* Stats bar */}
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            {[
                                                { label: 'Active', value: '12' },
                                                { label: 'On Route', value: '847' },
                                                { label: 'Alerts', value: '0' },
                                            ].map((stat) => (
                                                <div key={stat.label} className="text-center">
                                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-surface/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-4">
                                Everything You Need to Manage Your Fleet
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Comprehensive tools designed for modern transportation systems
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card p-6 hover:border-primary/30 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border border-primary/20 rounded-2xl p-12"
                        >
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Transform Your Fleet?
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join thousands of organizations using SmartBus to streamline
                                their transportation operations.
                            </p>
                            <Button size="xl" onClick={() => handleStartTrial('pro')}>
                                Get Started Free
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Floating Cart Button for Mobile/Scroll */}
            {cart.length > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/cart')}
                    className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary-hover transition-colors"
                >
                    <ShoppingCart className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-primary text-xs flex items-center justify-center font-bold border-2 border-primary">
                        {cart.length}
                    </span>
                </motion.button>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
