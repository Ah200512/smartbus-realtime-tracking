import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Newspaper, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const pressReleases = [
  { date: 'Jan 2026', title: 'SmartBus Expands to 200+ Indian Cities', source: 'The Economic Times', excerpt: 'SmartBus, the leading fleet management platform, announced its expansion to over 200 cities across India, serving schools, colleges, and corporate fleets.' },
  { date: 'Nov 2025', title: 'SmartBus Raises ₹100 Crore in Series B', source: 'YourStory', excerpt: 'Indian transportation technology startup SmartBus has raised ₹100 crore in Series B funding led by Sequoia Capital India.' },
  { date: 'Aug 2025', title: 'SmartBus Partners with CBSE Schools', source: 'Hindustan Times', excerpt: 'SmartBus announced a partnership with CBSE-affiliated schools across Tamil Nadu and Karnataka for student safety tracking.' },
  { date: 'May 2025', title: 'SmartBus Wins Best EdTech Safety Platform', source: 'Inc42', excerpt: 'SmartBus was recognized as the Best EdTech Safety Platform at the India EdTech Awards 2025 in Bengaluru.' },
  { date: 'Feb 2025', title: 'SmartBus Launches AI-Powered Route Optimization', source: 'TechCrunch India', excerpt: 'SmartBus launched its AI-powered route optimization feature, reducing average commute times by 23% in pilot programs across Chennai.' },
  { date: 'Dec 2024', title: 'SmartBus Featured in India\'s Top 50 Startups', source: 'Forbes India', excerpt: 'SmartBus was featured in Forbes India\'s annual list of Top 50 Startups to Watch, recognizing its impact on transportation safety.' },
];

export function PressPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          <Button onClick={() => navigate('/contact')}>Media Inquiries</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Newspaper className="h-4 w-4" />Press & Media
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">SmartBus in the <span className="gradient-text">News</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Latest press releases, media coverage, and company announcements.
            </p>
          </motion.div>

          <div className="space-y-6 mb-16">
            {pressReleases.map((pr, i) => (
              <motion.div key={pr.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="p-6 hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-primary font-medium">{pr.date}</span>
                        <span className="text-xs text-muted-foreground">• {pr.source}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{pr.title}</h3>
                      <p className="text-sm text-muted-foreground">{pr.excerpt}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-8 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
            <h2 className="text-xl font-bold mb-2">Media Kit</h2>
            <p className="text-muted-foreground mb-6">Download logos, brand assets, and press materials.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/contact')}>Request Media Kit</Button>
              <Button onClick={() => navigate('/contact')}>Contact PR Team</Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
