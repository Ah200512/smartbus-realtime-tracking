import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

export function PrivacyPage() {
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
              <Shield className="h-4 w-4" />Privacy Policy
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy <span className="gradient-text">Policy</span></h1>
            <p className="text-muted-foreground">Last updated: February 1, 2026</p>
          </motion.div>

          <Card className="p-8 prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
                <p>SmartBus Technologies Pvt. Ltd. ("SmartBus", "we", "our") collects the following information from users in India and worldwide:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, organization details</li>
                  <li><strong className="text-foreground">Location Data:</strong> GPS coordinates of buses (only during active trips)</li>
                  <li><strong className="text-foreground">Usage Data:</strong> App interactions, feature usage patterns, login timestamps</li>
                  <li><strong className="text-foreground">Device Data:</strong> Device type, OS version, browser type</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide real-time bus tracking and fleet management services</li>
                  <li>Process QR code attendance and generate boarding passes</li>
                  <li>Send safety alerts and notifications to parents/guardians</li>
                  <li>Improve our services through analytics (anonymized)</li>
                  <li>Comply with applicable Indian laws including the DPDP Act 2023</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Protection (India)</h2>
                <p>We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India. Your data is stored on servers located in India (Mumbai and Chennai data centers). We implement industry-standard encryption and security measures.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Sharing</h2>
                <p>We do not sell your personal data. We may share data with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Your organization's administrators (for fleet management purposes)</li>
                  <li>Emergency services (when SOS alerts are triggered)</li>
                  <li>Service providers who help us operate our platform (under strict NDAs)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Your Rights</h2>
                <p>Under the DPDP Act, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and associated data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>File grievances with our Data Protection Officer</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Contact Us</h2>
                <p>Data Protection Officer: privacy@smartbus.in</p>
                <p>SmartBus Technologies Pvt. Ltd.</p>
                <p>123, Anna Salai, Guindy, Chennai, Tamil Nadu 600032, India</p>
              </section>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
