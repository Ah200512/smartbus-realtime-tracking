import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Send, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  createdAt: string;
  userId: string;
}

interface ReviewsSectionProps {
  role: 'STUDENT' | 'DRIVER' | 'ADMIN';
}

export function ReviewsSection({ role }: ReviewsSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const [hoverRating, setHoverRating] = useState(0);

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [role]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getReviews(role);
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReviews = async () => {
    try {
      const data = await api.getUserReviews();
      setUserReviews(data || []);
    } catch (error) {
      console.error('Failed to load user reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.createReview({
        ...formData,
        role,
      });

      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      loadReviews();
      loadUserReviews();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      const msg = error?.message || 'Failed to submit review';
      if (msg.toLowerCase().includes('authentication') || msg.toLowerCase().includes('token') || msg.toLowerCase().includes('invalid')) {
        if (confirm(msg + '. You need to sign in to submit a review. Go to Sign In?')) {
          navigate('/sign-in?redirect_url=/dashboard');
        }
        return;
      }
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(reviewId);
      loadReviews();
      loadUserReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Submit Review */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="w-full">
              Write a Review
            </Button>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onMouseEnter={() => setHoverRating(num)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className="focus:outline-none transform transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                          num <= (hoverRating || formData.rating)
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'text-muted-foreground hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 5 && 'Excellent!'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Great service!"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="input w-full min-h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Your Reviews */}
      {userReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userReviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-surface border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Community Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-4">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-surface border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
