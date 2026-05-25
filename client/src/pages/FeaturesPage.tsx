import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Clock, Users, Zap, BarChart3, QrCode, Bell, Route } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const features = [
  {
    icon: MapPin, title: 'Real-Time GPS Tracking',
    description: 'Track every bus in your fleet with live GPS positioning. View speed, direction, and estimated arrival times on an interactive map.',
  },
  {
    icon: Shield, title: 'SOS Emergency Alerts',
    description: 'One-tap emergency alerts notify administrators and parents instantly. Integrated with local emergency services across India.',
  },
  {
    icon: QrCode, title: 'QR Code Attendance',
    description: 'Automated attendance tracking using QR codes. Students scan on boarding, and parents get instant notifications.',
  },
  {
    icon: BarChart3, title: 'Advanced Analytics',
    description: 'Comprehensive dashboards showing ridership trends, route efficiency, fuel consumption, and attendance reports.',
  },
  {
    icon: Route, title: 'Smart Route Optimization',
    description: 'AI-powered route planning that considers traffic patterns, school timings, and student locations across Indian cities.',
  },
  {
    icon: Bell, title: 'Push Notifications',
    description: 'Real-time notifications for parents, drivers, and administrators. Know when the bus is arriving, delayed, or has reached school.',
  },
  {
    icon: Clock, title: 'ETA Predictions',
    description: 'Accurate arrival predictions based on live traffic data from Indian roads. Updated every 30 seconds.',
  },
  {
    icon: Users, title: 'Multi-Role Dashboard',
    description: 'Separate dashboards for students, drivers, and administrators with role-specific features and views.',
  },
];

export function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          <Button onClick={() => navigate('/pricing')}>View Pricing</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />Platform Features
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need for <span className="gradient-text">Smart Fleet Management</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for Indian schools, colleges, and organizations. Designed to handle the complexity of Indian roads and transit systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <Card className="h-full p-6 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/start-trial')}>Start Free Trial</Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/watch-demo')}>Watch Demo</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
