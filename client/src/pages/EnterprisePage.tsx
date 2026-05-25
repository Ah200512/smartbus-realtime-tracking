import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Shield, Users, Zap, Check, HeadphonesIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const enterpriseFeatures = [
  { icon: Building2, title: 'White-Label Solution', description: 'Fully branded platform with your organization\'s identity. Custom domain, logo, and color scheme.' },
  { icon: Shield, title: 'Advanced Security', description: 'Enterprise-grade security with SSO, RBAC, data encryption, and compliance with Indian data protection laws.' },
  { icon: Users, title: 'Unlimited Scale', description: 'No limits on buses, routes, or users. Built to handle fleets of 10,000+ vehicles across India.' },
  { icon: HeadphonesIcon, title: 'Dedicated Support', description: '24/7 dedicated account manager and phone support. On-site training available in all major Indian cities.' },
];

const clients = [
  'Delhi Public School Network', 'IIT Madras', 'Bengaluru Metropolitan Transport',
  'Tata Group Corporate Fleet', 'Jaipur Smart City Initiative', 'Kerala State Transport',
];

export function EnterprisePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          <Button onClick={() => navigate('/contact')}>Contact Sales</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />Enterprise Solution
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for India's <span className="gradient-text">Largest Organizations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Custom fleet management solutions for schools, corporations, and government bodies across India.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {enterpriseFeatures.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full p-6 hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
            <Card className="p-8">
              <CardHeader className="p-0 mb-6"><CardTitle>Enterprise Plan Includes</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    'Unlimited buses & drivers', 'White-label mobile apps', 'Custom API integrations',
                    'SSO / LDAP authentication', '24/7 phone support', 'On-site training',
                    'SLA guarantees (99.99%)', 'Indian compliance (DPDP Act)', 'Priority feature requests',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Trusted by Leading Indian Organizations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clients.map(client => (
                <Card key={client} className="p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground">{client}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-8 lg:p-12 text-center bg-gradient-to-br from-primary/10 via-card to-orange-500/5 border-primary/20">
              <h2 className="text-2xl font-bold mb-4">Let's Discuss Your Requirements</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get a custom quote for your organization. Starting at ₹1,999/month.
              </p>
              <Button size="lg" onClick={() => navigate('/contact')}>Contact Sales Team</Button>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
