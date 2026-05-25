import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Monitor, Smartphone, Globe, Zap, MapPin, Users, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Footer } from '../components/layout/Footer';

const demoFeatures = [
    {
        icon: MapPin,
        title: 'Live GPS Tracking',
        description: 'Real-time bus location tracking with sub-second updates across Indian cities',
        image: '🗺️',
    },
    {
        icon: Users,
        title: 'QR Attendance',
        description: 'Instant student check-in/check-out with QR code scanning',
        image: '📱',
    },
    {
        icon: Shield,
        title: 'SOS Emergency Alerts',
        description: 'One-tap emergency alerts with instant admin/parent notification',
        image: '🚨',
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Comprehensive fleet analytics, ridership trends, attendance reports',
        image: '📊',
    },
];

export function DemoPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isSignedIn = !!user;

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />Back
                    </Button>
                    <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
                    <Button onClick={() => isSignedIn ? navigate('/dashboard') : navigate('/sign-up')}>
                        {isSignedIn ? 'Dashboard' : 'Start Free Trial'}
                    </Button>
                </div>
            </header>

            <div className="pt-20 max-w-7xl mx-auto px-6">
                <Breadcrumb items={[{ label: 'Demo' }]} />
            </div>

            <main className="pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Play className="h-4 w-4" />
                            Interactive Demo
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            See SmartBus <span className="gradient-text">in Action</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Explore our platform's capabilities. Built for Indian transit systems — from school buses in Chennai to municipal fleets in Delhi.
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Button size="lg" onClick={() => isSignedIn ? navigate('/dashboard') : navigate('/sign-up')}>
                                <Play className="h-4 w-4 mr-2" />Start Free Trial
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                                Request Live Demo
                            </Button>
                        </div>
                    </motion.div>

                    {/* Demo Preview - Simulated window */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-20"
                    >
                        <Card className="overflow-hidden">
                            <div className="bg-surface border-b border-border px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-background/50 rounded-md px-4 py-1 text-xs text-muted-foreground flex items-center gap-2">
                                        <Globe className="h-3 w-3" />
                                        app.smartbus.in/dashboard
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-background via-surface to-background min-h-[400px] flex items-center justify-center">
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-5xl">
                                        🚌
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">SmartBus Dashboard</h3>
                                        <p className="text-muted-foreground">Real-time fleet monitoring for Indian transit</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                        <div className="bg-surface/80 rounded-lg p-3 border border-border">
                                            <p className="text-2xl font-bold text-primary">24</p>
                                            <p className="text-xs text-muted-foreground">Active Buses</p>
                                        </div>
                                        <div className="bg-surface/80 rounded-lg p-3 border border-border">
                                            <p className="text-2xl font-bold text-green-400">98%</p>
                                            <p className="text-xs text-muted-foreground">On Time</p>
                                        </div>
                                        <div className="bg-surface/80 rounded-lg p-3 border border-border">
                                            <p className="text-2xl font-bold text-blue-400">1.2K</p>
                                            <p className="text-xs text-muted-foreground">Students</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Platforms */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold mb-4">Available Across Platforms</h2>
                        <div className="flex items-center justify-center gap-8">
                            <div className="flex items-center gap-2 text-muted-foreground"><Monitor className="h-5 w-5" />Web App</div>
                            <div className="flex items-center gap-2 text-muted-foreground"><Smartphone className="h-5 w-5" />Mobile</div>
                            <div className="flex items-center gap-2 text-muted-foreground"><Zap className="h-5 w-5" />API</div>
                        </div>
                    </div>

                    {/* Feature Demos */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        {demoFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full card-lift-glow">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <feature.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <CardTitle>{feature.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                                        <div className="bg-surface/50 rounded-lg p-8 text-center text-4xl border border-border">
                                            {feature.image}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border border-primary/20 rounded-2xl p-12">
                            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join 500+ institutions across India using SmartBus. Start your 14-day free trial today.
                            </p>
                            <Button size="lg" onClick={() => isSignedIn ? navigate('/cart') : navigate('/sign-up')}>
                                Start Free Trial — No Credit Card Required
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
