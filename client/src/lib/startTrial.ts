import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

const PLAN_NAMES: Record<string, string> = {
  basic: 'Basic Plan',
  pro: 'Pro Plan',
  enterprise: 'Enterprise Plan',
};

/**
 * Reusable hook for handling "Start Trial" actions across the app.
 *
 * Logic:
 * - If signed out → navigates to /sign-up
 * - If signed in → saves plan to localStorage cart, navigates to /cart
 * - Prevents duplicate cart entries
 * - Shows toast feedback
 */
export function useStartTrial() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleStartTrial = (planId: string) => {
    // Trigger celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Always persist selected plan to cart so cart page has context
    try {
      const saved = localStorage.getItem('smartbus_cart');
      if (saved) {
        const existing = JSON.parse(saved);
        if (existing.plan === planId) {
          if (!isSignedIn) {
            // include redirect so user returns to cart after signup
            navigate(`/sign-up?redirect_url=/cart?plan=${planId}`);
            return;
          }
          showToast('This plan is already in your cart', 'info');
          navigate(`/cart?plan=${planId}`);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    // If not signed in, ensure cart saved then send user to sign-up with redirect
    if (!isSignedIn) {
      localStorage.setItem('smartbus_cart', JSON.stringify({ plan: planId, quantity: 1 }));
      showToast(`Excellent choice! Sign up to start your ${PLAN_NAMES[planId]} trial.`, 'success');
      navigate(`/sign-up?redirect_url=/cart?plan=${planId}`);
      return;
    }

    // Prevent duplicates — if same plan already in cart, just navigate
    try {
      const saved = localStorage.getItem('smartbus_cart');
      if (saved) {
        const existing = JSON.parse(saved);
        if (existing.plan === planId) {
          showToast('This plan is already in your cart', 'info');
          navigate(`/cart?plan=${planId}`);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    // Add selected plan to localStorage cart for signed-in user
    localStorage.setItem('smartbus_cart', JSON.stringify({ plan: planId, quantity: 1 }));

    showToast(`🎉 Congratulations! ${PLAN_NAMES[planId]} trial activated in your cart!`, 'success');
    navigate(`/cart?plan=${planId}`);
  };

  return { handleStartTrial };
}
