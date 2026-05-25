import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

export function TermsPage() {
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
              <FileText className="h-4 w-4" />Terms of Service
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of <span className="gradient-text">Service</span></h1>
            <p className="text-muted-foreground">Last updated: February 1, 2026</p>
          </motion.div>

          <Card className="p-8">
            <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using SmartBus ("Service"), operated by SmartBus Technologies Pvt. Ltd., registered in Chennai, Tamil Nadu, India, you agree to be bound by these Terms of Service. If you represent an organization, you confirm you have authority to bind that organization.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Service Description</h2>
                <p>SmartBus provides fleet management services including real-time GPS tracking, QR code attendance, SOS emergency alerts, analytics dashboards, and route management. Services are available as subscription plans priced in Indian Rupees (₹).</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Subscription Plans</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Basic Plan:</strong> ₹499/month — Up to 10 buses, basic tracking</li>
                  <li><strong className="text-foreground">Pro Plan:</strong> ₹999/month — Up to 50 buses, full features</li>
                  <li><strong className="text-foreground">Enterprise Plan:</strong> ₹1,999/month — Unlimited buses, custom integrations</li>
                </ul>
                <p className="mt-2">All prices are exclusive of GST (18%). Plans auto-renew unless cancelled.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Not misuse the SOS alert system</li>
                  <li>Comply with all applicable Indian laws</li>
                  <li>Report any unauthorized access immediately</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Cancellation & Refunds</h2>
                <p>You may cancel your subscription at any time. Refunds are processed as per our refund policy — pro-rated refunds are available within the first 14 days of subscription. After 14 days, cancellation takes effect at the end of the billing cycle.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
                <p>SmartBus shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim. GPS tracking accuracy depends on device hardware and network conditions.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Governing Law</h2>
                <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
                <p>For questions about these Terms, contact us at legal@smartbus.in</p>
                <p>SmartBus Technologies Pvt. Ltd., 123 Anna Salai, Guindy, Chennai, TN 600032</p>
              </section>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
