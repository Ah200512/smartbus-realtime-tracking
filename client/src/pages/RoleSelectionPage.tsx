import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Truck, Shield, ArrowRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const roles = [
  {
    id: 'STUDENT' as UserRole,
    title: 'Student / Passenger',
    description: 'Track your bus in real-time, scan QR for attendance, and send SOS alerts.',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    glow: 'hover:shadow-blue-500/20',
    features: ['Live bus tracking', 'QR attendance', 'SOS alerts', 'ETA notifications'],
  },
  {
    id: 'DRIVER' as UserRole,
    title: 'Driver',
    description: 'Manage trips, broadcast GPS location, and handle student safety.',
    icon: Truck,
    color: 'from-emerald-500 to-green-500',
    glow: 'hover:shadow-emerald-500/20',
    features: ['Trip management', 'GPS broadcasting', 'Student counter', 'Emergency alerts'],
  },
  {
    id: 'ADMIN' as UserRole,
    title: 'Administrator',
    description: 'Monitor all buses, assign drivers, manage routes, and view analytics.',
    icon: Shield,
    color: 'from-primary to-amber-500',
    glow: 'hover:shadow-primary/20',
    features: ['Fleet monitoring', 'Driver management', 'Route planning', 'Analytics dashboard'],
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const setUserRole = useAppStore((state) => state.setUserRole);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectUrl = searchParams.get('redirect_url');

  const handleSubmit = useCallback(async () => {
    if (!selectedRole || !user) return;
    setIsSubmitting(true);
    try {
      await api.updateRole(selectedRole);
      updateUser({ role: selectedRole });
      setUserRole(selectedRole);
      // If redirect_url exists, use it; otherwise go to onboarding
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/onboarding');
      }
    } catch {
      setUserRole(selectedRole);
      updateUser({ role: selectedRole });
      // If redirect_url exists, use it; otherwise go to onboarding
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/onboarding');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRole, user, setUserRole, updateUser, navigate, redirectUrl]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 w-full"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Select Your Role</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose how you'll use SmartBus. This determines your dashboard experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8 w-full items-stretch">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 h-full flex flex-col ${
                selectedRole === role.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {selectedRole === role.id && (
                <motion.div
                  layoutId="roleIndicator"
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-lg flex-shrink-0`}
              >
                <role.icon className="h-7 w-7 text-white" />
              </div>

              <h3 className="text-lg font-bold mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

              <ul className="space-y-2 mt-auto">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center w-full"
        >
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            className="btn-glow text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
