import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Book, MessageCircle, FileText, Video, ChevronRight, HelpCircle, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const categories = [
    {
        icon: Zap,
        title: 'Getting Started',
        description: 'Quick guides to set up your account',
        articles: 12,
        color: 'text-blue-500',
    },
    {
        icon: Book,
        title: 'User Guides',
        description: 'Detailed feature documentation',
        articles: 28,
        color: 'text-green-500',
    },
    {
        icon: Shield,
        title: 'Security & Privacy',
        description: 'Account security and data protection',
        articles: 8,
        color: 'text-purple-500',
    },
    {
        icon: MessageCircle,
        title: 'Troubleshooting',
        description: 'Common issues and solutions',
        articles: 15,
        color: 'text-orange-500',
    },
    {
        icon: FileText,
        title: 'Billing & Plans',
        description: 'Subscriptions, invoices, and payments',
        articles: 10,
        color: 'text-pink-500',
    },
    {
        icon: Video,
        title: 'Video Tutorials',
        description: 'Step-by-step video guides',
        articles: 6,
        color: 'text-cyan-500',
    },
];

const popularArticles = [
    { title: 'How to set up real-time GPS tracking', category: 'Getting Started', views: '2.4k' },
    { title: 'Understanding the QR code attendance system', category: 'User Guides', views: '1.8k' },
    { title: 'Configuring SOS emergency alerts', category: 'User Guides', views: '1.5k' },
    { title: 'Inviting team members to your organization', category: 'Getting Started', views: '1.2k' },
    { title: 'Exporting attendance reports', category: 'User Guides', views: '950' },
    { title: 'Two-factor authentication setup', category: 'Security & Privacy', views: '890' },
];

const faqs = [
    {
        question: 'How accurate is the GPS tracking?',
        answer: 'Our GPS tracking updates every 3 seconds with accuracy within 5 meters, using a combination of GPS, cellular, and WiFi positioning.',
    },
    {
        question: 'Can I use SmartBus offline?',
        answer: 'Yes! The mobile app supports offline mode. Data will sync automatically when you regain internet connectivity.',
    },
    {
        question: 'How do I add drivers to my organization?',
        answer: 'Go to Settings → Team Management → Invite Member. Enter their email and assign the Driver role.',
    },
    {
        question: 'What happens when an SOS alert is triggered?',
        answer: 'All organization admins receive instant push notifications, emails, and the alert appears on the dashboard with the exact location.',
    },
    {
        question: 'Can I customize the attendance reports?',
        answer: 'Yes, you can filter by date range, route, bus, and export in CSV, PDF, or Excel formats.',
    },
];

export function HelpCenterPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                    <Button onClick={() => navigate('/contact')}>Contact Support</Button>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero + Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <HelpCircle className="h-4 w-4" />
                            Help Center
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            How Can We <span className="gradient-text">Help You?</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Search our knowledge base or browse categories below
                        </p>
                        
                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for articles, guides, and more..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-12 pr-4 py-4 text-lg"
                            />
                        </div>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-16"
                    >
                        <h2 className="text-xl font-bold mb-6">Browse by Category</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + index * 0.05 }}
                                >
                                    <Card className="h-full p-5 hover:border-primary/30 transition-all hover:-translate-y-0.5 cursor-pointer group">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center ${category.color}`}>
                                                <category.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                                    {category.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {category.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{category.articles} articles</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Popular Articles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-16"
                    >
                        <h2 className="text-xl font-bold mb-6">Popular Articles</h2>
                        <Card>
                            <CardContent className="p-0">
                                {popularArticles.map((article, index) => (
                                    <div
                                        key={article.title}
                                        className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-surface/50 cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium group-hover:text-primary transition-colors">{article.title}</p>
                                                <p className="text-sm text-muted-foreground">{article.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">{article.views} views</span>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* FAQs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mb-16"
                    >
                        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <button
                                        className="w-full p-5 text-left flex items-center justify-between hover:bg-surface/50 transition-colors"
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    >
                                        <span className="font-medium pr-4">{faq.question}</span>
                                        <ChevronRight
                                            className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                                                expandedFaq === index ? 'rotate-90' : ''
                                            }`}
                                        />
                                    </button>
                                    {expandedFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="px-5 pb-5"
                                        >
                                            <p className="text-muted-foreground">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Still Need Help */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Our support team is available 24/7 to assist you with any questions or issues.
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Average response time: 4 hours</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                    <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Contact Support
                                    </Button>
                                    <Button size="lg">
                                        <Video className="h-4 w-4 mr-2" />
                                        Schedule a Call
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
