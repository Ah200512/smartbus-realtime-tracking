import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Zap, Key, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';

const endpoints = [
  { method: 'POST', path: '/api/register', description: 'Register a new user with name, email, and password' },
  { method: 'POST', path: '/api/login', description: 'Authenticate user and receive JWT token' },
  { method: 'GET', path: '/api/profile', description: 'Get authenticated user profile (requires Bearer token)' },
  { method: 'PUT', path: '/api/profile', description: 'Update user profile fields' },
  { method: 'POST', path: '/api/cart', description: 'Create a new order with selected plan' },
  { method: 'POST', path: '/api/checkout/:orderId', description: 'Complete checkout and generate QR code' },
  { method: 'POST', path: '/api/generate-qr', description: 'Generate standalone QR code for bus pass' },
  { method: 'GET', path: '/api/orders', description: 'Get all orders for authenticated user' },
  { method: 'GET', path: '/api/health', description: 'Health check endpoint (no auth required)' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/10 text-green-500',
  POST: 'bg-blue-500/10 text-blue-500',
  PUT: 'bg-yellow-500/10 text-yellow-500',
  DELETE: 'bg-red-500/10 text-red-500',
};

export function ApiDocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
          <Button variant="outline" onClick={() => navigate('/contact')}>Get API Key</Button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Code className="h-4 w-4" />Developer API
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">API <span className="gradient-text">Documentation</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrate SmartBus into your applications with our RESTful API.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Key, title: 'Authentication', desc: 'JWT Bearer token auth on all protected endpoints' },
              { icon: Zap, title: 'Rate Limits', desc: '1000 requests/minute for standard plans' },
              { icon: BookOpen, title: 'Base URL', desc: 'https://api.smartbus.in/v1' },
            ].map(item => (
              <Card key={item.title} className="p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 mb-12">
            <CardHeader className="p-0 mb-6"><CardTitle>API Endpoints</CardTitle></CardHeader>
            <CardContent className="p-0 space-y-3">
              {endpoints.map(ep => (
                <div key={ep.path} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${methodColors[ep.method]}`}>{ep.method}</span>
                  <code className="text-sm font-mono text-primary flex-shrink-0">{ep.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">{ep.description}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="p-6 mb-12">
            <CardHeader className="p-0 mb-4"><CardTitle>Quick Start Example</CardTitle></CardHeader>
            <CardContent className="p-0">
              <pre className="bg-surface rounded-lg p-4 overflow-x-auto text-sm text-muted-foreground">
{`// Register a new user
const response = await fetch('https://api.smartbus.in/v1/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Pranav M',
    email: 'pranav@example.com',
    password: 'securePassword123',
    phone: '9876543210',
    countryCode: '+91'
  })
});

const { token, user } = await response.json();
console.log('Logged in as:', user.name);

// Use token for subsequent requests
const profile = await fetch('https://api.smartbus.in/v1/profile', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
