import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, TrendingUp, Zap, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';

const featuredPost = {
    title: 'Introducing AI-Powered Route Optimization',
    excerpt: 'Our new machine learning algorithms can reduce fuel costs by up to 25% while improving on-time performance. Learn how SmartBus AI analyzes thousands of data points to suggest optimal routes.',
    author: 'Sarah Chen',
    role: 'CEO',
    date: 'February 5, 2026',
    readTime: '8 min read',
    category: 'Product Update',
    image: 'gradient',
};

const posts = [
    {
        title: 'How We Achieved 99.99% Uptime in 2025',
        excerpt: 'A deep dive into our infrastructure improvements and the engineering decisions that made our platform more reliable than ever.',
        author: 'Marcus Johnson',
        date: 'January 28, 2026',
        readTime: '6 min read',
        category: 'Engineering',
    },
    {
        title: 'Case Study: City of Austin Fleet Transformation',
        excerpt: 'How Austin\'s public transit system reduced delays by 40% using SmartBus real-time tracking and analytics.',
        author: 'Emily Rodriguez',
        date: 'January 20, 2026',
        readTime: '10 min read',
        category: 'Case Study',
    },
    {
        title: 'New: QR Code Check-in for Events',
        excerpt: 'Announcing support for event-based attendance tracking. Perfect for field trips, corporate shuttles, and special events.',
        author: 'David Park',
        date: 'January 15, 2026',
        readTime: '4 min read',
        category: 'Product Update',
    },
    {
        title: 'The Future of School Bus Safety',
        excerpt: 'Industry trends and how technology is making student transportation safer than ever before.',
        author: 'Sarah Chen',
        date: 'January 8, 2026',
        readTime: '7 min read',
        category: 'Industry',
    },
    {
        title: 'Building a Culture of Remote Engineering Excellence',
        excerpt: 'How our distributed team collaborates across 12 time zones to ship world-class software.',
        author: 'Marcus Johnson',
        date: 'December 28, 2025',
        readTime: '5 min read',
        category: 'Company',
    },
    {
        title: 'Year in Review: 2025 Highlights',
        excerpt: 'A look back at our biggest milestones, new features, and the amazing customers we\'ve had the privilege to work with.',
        author: 'Sarah Chen',
        date: 'December 20, 2025',
        readTime: '12 min read',
        category: 'Company',
    },
];

const categories = ['All', 'Product Update', 'Engineering', 'Case Study', 'Industry', 'Company'];

export function BlogPage() {
    const navigate = useNavigate();
    const [communityReviews, setCommunityReviews] = useState<any[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const reviews = await api.getReviews();
                setCommunityReviews(reviews || []);
            } catch (error) {
                console.error('Failed to load community reviews:', error);
            }
        };

        loadReviews();
    }, []);

    const getReviewForPost = (index: number) => {
        if (communityReviews.length === 0) return null;
        return communityReviews[index % communityReviews.length];
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
                    <Button onClick={() => navigate('/start-trial')}>Start Free Trial</Button>
                </div>
            </header>

            <main className="pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <BookOpen className="h-4 w-4" />
                            Blog & Updates
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Insights from the <span className="gradient-text">SmartBus Team</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Product updates, engineering deep-dives, customer stories, and industry trends
                        </p>
                        <div className="mt-4">
                            <Button variant="outline" onClick={() => window.location.href = '/reviews'}>
                                Community Reviews
                            </Button>
                        </div>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap gap-2 justify-center mb-12"
                    >
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={cat === 'All' ? 'default' : 'outline'}
                                size="sm"
                            >
                                {cat}
                            </Button>
                        ))}
                    </motion.div>

                    {/* Featured Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-12"
                    >
                        <Card className="overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="grid lg:grid-cols-2">
                                <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/20 via-surface to-orange-500/10 flex items-center justify-center p-12">
                                    <div className="text-center">
                                        <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                                        <Badge variant="default">Featured</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-8 flex flex-col justify-center">
                                    <Badge variant="outline" className="w-fit mb-4">{featuredPost.category}</Badge>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <span className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            {featuredPost.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {featuredPost.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <Button className="w-fit group-hover:gap-3 transition-all">
                                        Read Article
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <div className="mt-6 rounded-xl border border-border bg-surface/70 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Community Review</p>
                                        {communityReviews.length > 0 ? (
                                            <>
                                                <p className="text-sm font-medium mb-1">{communityReviews[0].title}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{communityReviews[0].comment}</p>
                                                <p className="text-xs text-muted-foreground mt-2">by {communityReviews[0].userName}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share feedback.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                            >
                                <Card className="h-full flex flex-col hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group">
                                    <div className="aspect-video bg-surface relative overflow-hidden">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundImage: `
                                                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                                                `,
                                                backgroundSize: '20px 20px',
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                                                {post.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="mb-4 rounded-lg border border-border bg-background/60 p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[11px] uppercase tracking-[0.18em] text-primary">What users say</span>
                                                <span className="text-[11px] text-muted-foreground">Live feedback</span>
                                            </div>
                                            {getReviewForPost(index) ? (
                                                <>
                                                    <p className="text-sm font-medium line-clamp-1">{getReviewForPost(index)?.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{getReviewForPost(index)?.comment}</p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">Reviews will appear here after users submit them.</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{post.author}</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mb-16">
                        <Button variant="outline" size="lg">
                            Load More Articles
                        </Button>
                    </div>

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <div className="max-w-2xl mx-auto text-center">
                                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                                <p className="text-muted-foreground mb-8">
                                    Get the latest product updates, engineering insights, and industry news delivered to your inbox.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="input flex-1"
                                    />
                                    <Button>Subscribe</Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    No spam, ever. Unsubscribe anytime.
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
