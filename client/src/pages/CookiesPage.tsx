import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

export function CookiesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Cookie className="h-4 w-4" />Cookie Policy
            </div>
            <h1 className="text-4xl font-bold mb-4">Cookie <span className="gradient-text">Policy</span></h1>
            <p className="text-muted-foreground">Last updated: February 1, 2026</p>
          </motion.div>

          <Card className="p-8">
            <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience, remember your preferences, and understand how you use SmartBus.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Cookies We Use</h2>
                <div className="space-y-4 mt-4">
                  {[
                    { name: 'Essential Cookies', desc: 'Required for the platform to function. Includes authentication tokens (JWT), session management, and CSRF protection.', required: true },
                    { name: 'Preference Cookies', desc: 'Remember your settings like dark/light mode, language preferences, and dashboard layout.', required: false },
                    { name: 'Analytics Cookies', desc: 'Help us understand how users interact with SmartBus. We use anonymized analytics to improve our services.', required: false },
                    { name: 'Performance Cookies', desc: 'Monitor page load times and application performance to ensure a smooth experience.', required: false },
                  ].map(cookie => (
                    <div key={cookie.name} className="p-4 rounded-lg bg-surface border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{cookie.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${cookie.required ? 'bg-primary/10 text-primary' : 'bg-surface-hover text-muted-foreground'}`}>
                          {cookie.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-sm">{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Managing Cookies</h2>
                <p>You can control and manage cookies through your browser settings. Note that disabling essential cookies may affect the functionality of SmartBus. Most browsers allow you to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>View what cookies are stored</li>
                  <li>Delete individual or all cookies</li>
                  <li>Block cookies from specific or all websites</li>
                  <li>Set preferences for first-party vs third-party cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
                <p>For questions about our cookie practices, email us at privacy@smartbus.in</p>
              </section>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
