import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../lib/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews page:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold">Community Reviews</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-3">Read honest feedback from SmartBus users and contributors.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Latest Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground">No reviews yet. Be the first!</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-surface border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <h3 className="font-semibold">{r.title}</h3>
                              <p className="text-xs text-muted-foreground">by {r.userName} • {new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>How it works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Users who have an account can submit reviews from their dashboard. Reviews are moderated and displayed publicly across the site including the blog and this page.</p>
                  <div className="flex gap-3">
                    <Button onClick={() => window.location.href = '/sign-in'}>Sign In</Button>
                    <Button variant="outline" onClick={() => window.location.href = '/sign-up'}>Create Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
