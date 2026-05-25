import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import {
  Rocket,
  Users,
  TrendingUp,
  Brain,
  Globe,
} from 'lucide-react';

const milestones = [
  {
    year: '2021',
    title: 'Founded',
    description:
      'SmartBus was born from a vision to revolutionize school and fleet transportation with real-time tracking and intelligent routing.',
    icon: Rocket,
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/30',
  },
  {
    year: '2022',
    title: '100+ Clients',
    description:
      'Rapidly scaled to serve over 100 educational institutions and fleet operators with our enterprise-grade platform.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/30',
  },
  {
    year: '2023',
    title: 'Series A Funding',
    description:
      'Secured $12M in Series A funding to accelerate product development, expand our engineering team, and enter new markets.',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-500',
    glow: 'shadow-emerald-500/30',
  },
  {
    year: '2024',
    title: 'AI Integration',
    description:
      'Launched AI-powered route optimization, predictive maintenance alerts, and smart scheduling that reduced fuel costs by 23%.',
    icon: Brain,
    color: 'from-purple-500 to-violet-500',
    glow: 'shadow-purple-500/30',
  },
  {
    year: '2025',
    title: 'Nationwide Expansion',
    description:
      'Expanded operations to cover 50 states with partnerships across 500+ districts, serving over 2 million daily riders.',
    icon: Globe,
    color: 'from-primary to-amber-500',
    glow: 'shadow-primary/30',
  },
];

function MilestoneCard({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex items-center gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:gap-16`}
    >
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-md"
      >
        <div className="card p-8 card-glass-sweep card-lift-glow">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg ${milestone.glow}`}
            >
              <milestone.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">{milestone.year}</span>
              <h3 className="text-xl font-bold">{milestone.title}</h3>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
        </div>
      </motion.div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
        className="relative z-10 hidden md:flex"
      >
        <div
          className={`w-6 h-6 rounded-full bg-gradient-to-br ${milestone.color} ring-4 ring-background shadow-lg ${milestone.glow}`}
        />
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${milestone.color} animate-ping opacity-20`}
        />
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 max-w-md hidden md:block" />
    </div>
  );
}

export default function OurJourneyPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/about')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate('/our-journey')}
              className="text-sm text-primary font-medium"
            >
              Our Journey
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/sign-in')}
              className="btn-primary rounded-lg px-5 py-2 text-sm"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Story
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            The Journey of{' '}
            <span className="gradient-text">SmartBus</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From a small idea to a nationwide platform — follow the milestones that shaped the
            future of intelligent fleet management.
          </motion.p>
        </div>
      </motion.section>

      {/* Timeline */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={milestone.year} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of Our Next Chapter
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of organizations already using SmartBus to transform their
              transportation operations.
            </p>
            <button
              onClick={() => navigate('/sign-up')}
              className="btn-glow text-white font-semibold px-8 py-3 rounded-xl"
            >
              Start Your Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
