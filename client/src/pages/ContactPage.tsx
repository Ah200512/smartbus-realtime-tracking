import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const contactMethods = [
    {
        icon: Mail,
        title: 'Email Us',
        description: 'Our team typically responds within 24 hours',
        value: 'support@smartbus.in',
        action: 'mailto:support@smartbus.in',
    },
    {
        icon: Phone,
        title: 'Call Us',
        description: 'Mon-Sat from 9am to 7pm IST',
        value: '+91 98765 43210',
        action: 'tel:+919876543210',
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        description: 'Come visit our Head Office in Chennai',
        value: 'No. 42, Mount Road, T. Nagar, Chennai 600017',
        action: 'https://maps.google.com/?q=13.0418,80.2341',
    },
];

const offices = [
    { city: 'Chennai', region: 'South India (Tamil Nadu)', timezone: 'IST', type: 'Head Office', address: 'No. 42, Mount Road, T. Nagar', icon: '🏛️' },
    { city: 'New Delhi', region: 'North India', timezone: 'IST', type: 'Regional Office', address: 'A-12, Connaught Place', icon: '🏢' },
    { city: 'Mumbai', region: 'West India (Maharashtra)', timezone: 'IST', type: 'Business Office', address: 'BKC, Bandra East', icon: '🏢' },
    { city: 'Kolkata', region: 'East India (West Bengal)', timezone: 'IST', type: 'Operations Center', address: 'Salt Lake, Sector V', icon: '⚙️' },
];

export function ContactPage() {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <Button onClick={() => navigate('/help-center')}>Help Center</Button>
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
                            <MessageSquare className="h-4 w-4" />
                            Get in Touch
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            We'd Love to <span className="gradient-text">Hear From You</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question, need a demo, or want to discuss how SmartBus can help your organization?
                            Our team is here to help.
                        </p>
                    </motion.div>

                    {/* Contact Methods */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid md:grid-cols-3 gap-6 mb-16"
                    >
                        {contactMethods.map((method) => (
                            <a
                                key={method.title}
                                href={method.action}
                                target={method.action.startsWith('http') ? '_blank' : undefined}
                                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="block"
                            >
                                <Card className="h-full p-6 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <method.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{method.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                                    <p className="text-sm font-medium text-primary">{method.value}</p>
                                </Card>
                            </a>
                        ))}
                    </motion.div>

                    {/* Contact Form + Info */}
                    <div className="grid lg:grid-cols-5 gap-8 mb-16">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="lg:col-span-3"
                        >
                            <Card className="p-8">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle>Send us a Message</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {isSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="h-8 w-8 text-success" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                            <p className="text-muted-foreground mb-6">
                                                We'll get back to you within 24 hours.
                                            </p>
                                            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                                                Send Another Message
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formState.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="input"
                                                        placeholder="John Smith"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formState.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="input"
                                                        placeholder="john@company.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Company</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formState.company}
                                                        onChange={handleInputChange}
                                                        className="input"
                                                        placeholder="Your Company"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                                    <select
                                                        name="subject"
                                                        value={formState.subject}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="input"
                                                    >
                                                        <option value="">Select a topic</option>
                                                        <option value="sales">Sales Inquiry</option>
                                                        <option value="support">Technical Support</option>
                                                        <option value="partnership">Partnership</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={formState.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={5}
                                                    className="input resize-none"
                                                    placeholder="Tell us how we can help..."
                                                />
                                            </div>
                                            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                                                <Send className="h-4 w-4 mr-2" />
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Response Time */}
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Quick Response</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Our average response time is under 4 hours during business hours.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Global Offices */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Global Offices</h3>
                                <div className="space-y-4">
                                    {offices.map((office) => (
                                        <div key={office.city} className="flex justify-between items-center py-3 px-3 border border-border rounded-lg hover:border-primary/30 hover:shadow-[0_0_12px_rgba(249,115,22,0.1)] transition-all">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{office.icon}</span>
                                                <div>
                                                    <p className="font-medium text-sm">{office.city}</p>
                                                    <p className="text-xs text-muted-foreground">{office.region}</p>
                                                    <p className="text-xs text-muted-foreground">{office.address}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-primary font-medium">{office.timezone}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* FAQ Link */}
                            <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                                <h3 className="font-semibold mb-2">Looking for quick answers?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Check our Help Center for FAQs and guides.
                                </p>
                                <Button variant="outline" size="sm" onClick={() => navigate('/help-center')}>
                                    Visit Help Center
                                </Button>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Map Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Card className="overflow-hidden">
                            <div className="aspect-[3/1] bg-surface relative">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                                        `,
                                        backgroundSize: '40px 40px',
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
                                        <p className="font-semibold">SmartBus Head Office — Chennai 🇮🇳</p>
                                        <p className="text-sm text-muted-foreground">No. 42, Mount Road, T. Nagar, Chennai, Tamil Nadu 600017</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
