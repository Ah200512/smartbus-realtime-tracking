import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const services = [
  { name: 'API Gateway', status: 'operational', uptime: '99.99%' },
  { name: 'Real-Time GPS Tracking', status: 'operational', uptime: '99.98%' },
  { name: 'WebSocket Connections', status: 'operational', uptime: '99.97%' },
  { name: 'QR Code Service', status: 'operational', uptime: '99.99%' },
  { name: 'Push Notifications', status: 'operational', uptime: '99.95%' },
  { name: 'Analytics Dashboard', status: 'operational', uptime: '99.99%' },
  { name: 'Authentication Service', status: 'operational', uptime: '100%' },
  { name: 'Database Cluster', status: 'operational', uptime: '99.99%' },
];

const incidents = [
  { date: 'Feb 15, 2026', title: 'Scheduled Maintenance', status: 'resolved', description: 'Database maintenance window completed successfully. No data loss.' },
  { date: 'Jan 28, 2026', title: 'Minor GPS Delay', status: 'resolved', description: 'GPS updates experienced 2-second delays in Mumbai region. Resolved within 30 minutes.' },
  { date: 'Jan 10, 2026', title: 'CDN Upgrade', status: 'resolved', description: 'CDN infrastructure upgraded for better performance across Indian cities.' },
];

const statusIcon = (status: string) => {
  if (status === 'operational') return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (status === 'degraded') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  return <AlertTriangle className="h-5 w-5 text-red-500" />;
};

export function StatusPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          <Button variant="outline" onClick={() => navigate('/contact')}>Report Issue</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-6">
              <Activity className="h-4 w-4" />All Systems Operational
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">System <span className="gradient-text">Status</span></h1>
            <p className="text-muted-foreground">Real-time status of SmartBus services across India.</p>
          </motion.div>

          <Card className="p-6 mb-12">
            <h2 className="font-semibold text-lg mb-4">Services</h2>
            <div className="space-y-3">
              {services.map(service => (
                <div key={service.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    {statusIcon(service.status)}
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{service.uptime} uptime</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <h2 className="font-semibold text-lg mb-4">Recent Incidents</h2>
          <div className="space-y-4 mb-12">
            {incidents.map(incident => (
              <Card key={incident.date} className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{incident.title}</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{incident.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 capitalize">{incident.status}</span>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
