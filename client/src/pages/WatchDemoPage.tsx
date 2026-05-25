import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function WatchDemoPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <Button onClick={() => navigate('/select-role')}>Get Started</Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold mb-4">
                            See SmartBus in <span className="gradient-text">Action</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Watch how SmartBus transforms fleet management with real-time tracking,
                            automated attendance, and comprehensive analytics.
                        </p>
                    </motion.div>

                    {/* Video Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-surface flex items-center justify-center">
                                    {/* Video Placeholder */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10" />
                                    <div className="relative z-10">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-glow"
                                        >
                                            <Play className="h-8 w-8 text-white ml-1" />
                                        </motion.button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mt-16">
                        {[
                            {
                                title: 'Real-Time GPS Tracking',
                                features: [
                                    'Live bus location updates',
                                    'Smooth animated markers',
                                    'Route visualization',
                                    'ETA predictions',
                                ],
                            },
                            {
                                title: 'Smart Attendance System',
                                features: [
                                    'QR code generation & scanning',
                                    'Automated check-in/out',
                                    'Attendance reports',
                                    'Parent notifications',
                                ],
                            },
                            {
                                title: 'Emergency SOS Alerts',
                                features: [
                                    'One-tap emergency button',
                                    'Instant admin notifications',
                                    'Real-time alert resolution',
                                    'Safety dashboard',
                                ],
                            },
                            {
                                title: 'Comprehensive Analytics',
                                features: [
                                    'Ridership trends',
                                    'Route performance',
                                    'Attendance analytics',
                                    'Custom reports',
                                ],
                            },
                        ].map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {section.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-16"
                    >
                        <Card className="bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <CardContent className="py-12">
                                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    Start your free trial today and see how SmartBus can transform your
                                    transportation operations.
                                </p>
                                <Button size="lg" onClick={() => navigate('/select-role')}>
                                    Start Free Trial
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
