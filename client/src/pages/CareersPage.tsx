import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Briefcase, Heart, Zap, Users, Coffee, Laptop, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const perks = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health, dental, and vision coverage' },
    { icon: Laptop, title: 'Remote-First', description: 'Work from anywhere with flexible hours' },
    { icon: Coffee, title: 'Learning Budget', description: '$2,000/year for courses and conferences' },
    { icon: Globe, title: 'Travel', description: 'Annual team retreats in amazing locations' },
    { icon: Users, title: 'Equity', description: 'Competitive stock options for all employees' },
    { icon: Zap, title: 'Latest Tech', description: 'Top-of-the-line equipment and tools' },
];

const jobs = [
    {
        id: 1,
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'Remote (US)',
        type: 'Full-time',
        level: 'Senior',
        description: 'Build beautiful, performant interfaces with React and TypeScript',
    },
    {
        id: 2,
        title: 'Backend Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        level: 'Mid-Senior',
        description: 'Design and scale our real-time infrastructure',
    },
    {
        id: 3,
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote (Global)',
        type: 'Full-time',
        level: 'Senior',
        description: 'Shape the future of fleet management UX',
    },
    {
        id: 4,
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Remote (US)',
        type: 'Full-time',
        level: 'Senior',
        description: 'Manage our cloud infrastructure on AWS and GCP',
    },
    {
        id: 5,
        title: 'Customer Success Manager',
        department: 'Customer Success',
        location: 'London, UK',
        type: 'Full-time',
        level: 'Mid',
        description: 'Help enterprise clients succeed with SmartBus',
    },
    {
        id: 6,
        title: 'Data Scientist',
        department: 'Data',
        location: 'Remote (US)',
        type: 'Full-time',
        level: 'Senior',
        description: 'Build ML models for route optimization and predictions',
    },
];

const departments = ['All', 'Engineering', 'Design', 'Data', 'Customer Success'];

export function CareersPage() {
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
                    <Button onClick={() => navigate('/about')}>About Us</Button>
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
                            <Briefcase className="h-4 w-4" />
                            We're Hiring
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Build the Future of <span className="gradient-text">Transportation</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                            Join a passionate team solving real-world problems for millions of commuters.
                            We're growing fast and looking for talented people to help us scale.
                        </p>
                        <Button size="lg" onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Open Positions
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </motion.div>

                    {/* Culture Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-20"
                    >
                        <Card className="overflow-hidden">
                            <div className="grid lg:grid-cols-2">
                                <div className="p-8 lg:p-12">
                                    <h2 className="text-2xl font-bold mb-4">Life at SmartBus</h2>
                                    <p className="text-muted-foreground mb-6">
                                        We're a remote-first company with a focus on results, not hours.
                                        Our team spans 12 countries, united by a shared mission to revolutionize
                                        fleet management.
                                    </p>
                                    <p className="text-muted-foreground mb-6">
                                        We believe in transparency, continuous learning, and celebrating wins together.
                                        Whether you're debugging at midnight or brainstorming in our annual retreat,
                                        you'll always find a supportive team beside you.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">Remote-First</Badge>
                                        <Badge variant="outline">50+ Employees</Badge>
                                        <Badge variant="outline">12 Countries</Badge>
                                        <Badge variant="outline">4.8 Glassdoor</Badge>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-primary/20 via-surface to-orange-500/10 flex items-center justify-center p-12">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-24 h-24 rounded-xl bg-card/50 backdrop-blur-sm border border-border" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Perks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-20"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Perks & Benefits</h2>
                        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                            We take care of our team so they can focus on doing their best work
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {perks.map((perk, index) => (
                                <motion.div
                                    key={perk.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                    <Card className="h-full p-6 hover:border-primary/30 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <perk.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{perk.title}</h3>
                                        <p className="text-sm text-muted-foreground">{perk.description}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Open Positions */}
                    <motion.div
                        id="positions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">Open Positions</h2>
                        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                            Don't see a role that fits? Send us your resume at careers@smartbus.io
                        </p>

                        {/* Filter */}
                        <div className="flex flex-wrap gap-2 justify-center mb-8">
                            {departments.map((dept) => (
                                <Button
                                    key={dept}
                                    variant={dept === 'All' ? 'default' : 'outline'}
                                    size="sm"
                                >
                                    {dept}
                                </Button>
                            ))}
                        </div>

                        {/* Jobs List */}
                        <div className="space-y-4">
                            {jobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 + index * 0.05 }}
                                >
                                    <Card className="p-6 hover:border-primary/30 transition-all hover:-translate-y-0.5 cursor-pointer group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <Badge variant="outline">{job.level}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        {job.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {job.location}
                                                    </span>
                                                    <span>{job.type}</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                Apply Now
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
                            <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join our team and help shape the future of fleet management.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button size="lg">
                                    View All Positions
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                                    Learn About Us
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
