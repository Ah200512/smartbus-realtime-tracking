import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, Globe, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const securityFeatures = [
    {
        icon: Lock,
        title: 'End-to-End Encryption',
        description: 'All data transmitted between your devices and our servers is encrypted using TLS 1.3 and AES-256.',
    },
    {
        icon: Server,
        title: 'SOC 2 Type II Certified',
        description: 'We maintain SOC 2 Type II compliance, verified annually by independent auditors.',
    },
    {
        icon: Eye,
        title: 'Role-Based Access Control',
        description: 'Granular permissions ensure users only access the data they need for their role.',
    },
    {
        icon: Shield,
        title: 'DDoS Protection',
        description: 'Enterprise-grade protection against distributed denial-of-service attacks.',
    },
    {
        icon: FileCheck,
        title: 'GDPR Compliant',
        description: 'Full compliance with European data protection regulations including data portability.',
    },
    {
        icon: Globe,
        title: 'Data Residency Options',
        description: 'Choose where your data is stored: US, EU, or Asia-Pacific regions.',
    },
];

const certifications = [
    { name: 'SOC 2 Type II', status: 'Certified', year: '2025' },
    { name: 'ISO 27001', status: 'Certified', year: '2024' },
    { name: 'GDPR', status: 'Compliant', year: '2024' },
    { name: 'CCPA', status: 'Compliant', year: '2024' },
    { name: 'HIPAA', status: 'Available', year: '2025' },
    { name: 'FedRAMP', status: 'In Progress', year: '2026' },
];

const privacyPrinciples = [
    {
        title: 'Minimal Data Collection',
        description: 'We only collect data that is essential for providing our services. No unnecessary tracking or profiling.',
    },
    {
        title: 'Transparent Processing',
        description: 'We clearly explain how your data is used and never sell it to third parties.',
    },
    {
        title: 'User Control',
        description: 'You can access, export, or delete your data at any time through your account settings.',
    },
    {
        title: 'Data Retention Limits',
        description: 'We automatically delete data according to configurable retention policies.',
    },
];

export function SecurityPage() {
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
                    <Button onClick={() => navigate('/contact')}>Security Questions?</Button>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Shield className="h-4 w-4" />
                            Security & Privacy
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Your Data Security is Our{' '}
                            <span className="gradient-text">Top Priority</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            We've built SmartBus with enterprise-grade security from the ground up.
                            Your fleet data is protected by industry-leading practices and certifications.
                        </p>
                    </motion.div>

                    {/* Trust Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-16"
                    >
                        <Card className="p-6 bg-gradient-to-r from-success/10 via-card to-success/5 border-success/20">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Zero Security Incidents</p>
                                        <p className="text-sm text-muted-foreground">
                                            We've maintained a perfect security record since launch in 2021
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="success">99.99% Uptime</Badge>
                                    <Badge variant="success">SOC 2 Certified</Badge>
                                    <Badge variant="success">ISO 27001</Badge>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Security Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Security Features</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            Enterprise-grade protection for your fleet data
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {securityFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                    <Card className="h-full p-6 hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Certifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Compliance & Certifications</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            Independently verified security and privacy standards
                        </p>
                        <Card>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                                    {certifications.map((cert) => (
                                        <div
                                            key={cert.name}
                                            className="p-6 border-b border-r border-border last:border-b-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold">{cert.name}</h3>
                                                <Badge
                                                    variant={cert.status === 'Certified' || cert.status === 'Compliant' ? 'success' : 'warning'}
                                                >
                                                    {cert.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {cert.status === 'In Progress' ? `Expected ${cert.year}` : `Since ${cert.year}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Privacy Principles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Privacy Principles</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            How we respect and protect your privacy
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            {privacyPrinciples.map((principle, index) => (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + index * 0.1 }}
                                >
                                    <Card className="h-full p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">{principle.title}</h3>
                                                <p className="text-sm text-muted-foreground">{principle.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Report Vulnerability */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-16"
                    >
                        <Card className="p-8 border-warning/30 bg-warning/5">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="h-8 w-8 text-warning" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">Security Bug Bounty</h3>
                                    <p className="text-muted-foreground">
                                        Found a security vulnerability? We reward responsible disclosure.
                                        Report security issues to security@smartbus.io for rewards up to $10,000.
                                    </p>
                                </div>
                                <Button variant="outline">
                                    Learn More
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-4">Need More Details?</h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Request our complete security documentation, SOC 2 report, or schedule a call with our security team.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button size="lg">
                                    Request Security Docs
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                                    Contact Security Team
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
