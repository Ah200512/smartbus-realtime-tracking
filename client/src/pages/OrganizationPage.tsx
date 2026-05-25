import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Shield, Zap, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function OrganizationPage() {
    const navigate = useNavigate();

    const benefits = [
        {
            icon: Building2,
            title: 'Centralized Management',
            description: 'Manage multiple departments and routes from a single dashboard',
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Invite admins, drivers, and staff with role-based permissions',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'SSO, 2FA, and advanced security features for large organizations',
        },
        {
            icon: Zap,
            title: 'Scalable Infrastructure',
            description: 'Handle unlimited buses, routes, and passengers effortlessly',
        },
    ];

    const features = [
        'Multi-location support',
        'Custom branding & white-label',
        'Advanced analytics & reporting',
        'Dedicated account manager',
        'Priority 24/7 support',
        'Custom integrations',
        'Training & onboarding',
        'SLA guarantees',
    ];

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
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Building2 className="h-4 w-4" />
                            Enterprise Solutions
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Fleet Management for{' '}
                            <span className="gradient-text">Organizations</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for schools, universities, corporations, and municipalities managing
                            complex transportation networks.
                        </p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardHeader className="pb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <benefit.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Enterprise Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Use Cases */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16"
                    >
                        <h2 className="text-2xl font-bold mb-8 text-center">
                            Trusted by Organizations Worldwide
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    type: 'Educational',
                                    title: 'Schools & Universities',
                                    count: '500+',
                                    description: 'Safe student transportation',
                                },
                                {
                                    type: 'Corporate',
                                    title: 'Businesses',
                                    count: '200+',
                                    description: 'Employee shuttle services',
                                },
                                {
                                    type: 'Government',
                                    title: 'Public Transit',
                                    count: '50+',
                                    description: 'Municipal bus systems',
                                },
                            ].map((useCase, index) => (
                                <motion.div
                                    key={useCase.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                >
                                    <Card className="text-center">
                                        <CardContent className="py-8">
                                            <p className="text-3xl font-bold text-primary mb-2">
                                                {useCase.count}
                                            </p>
                                            <h3 className="font-semibold mb-1">{useCase.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {useCase.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-16"
                    >
                        <Card className="bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <CardContent className="py-12 text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    Ready to Transform Your Organization?
                                </h2>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    Contact our sales team to learn how SmartBus can be customized for your
                                    organization's unique needs.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button size="lg" onClick={() => navigate('/select-role')}>
                                        Start Free Trial
                                    </Button>
                                    <Button size="lg" variant="outline">
                                        Contact Sales
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
