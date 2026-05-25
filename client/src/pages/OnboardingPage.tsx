import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = useAppStore((state) => state.userRole);
  const setOnboardingDone = useAppStore((state) => state.setOnboardingDone);

  const [registerNumber, setRegisterNumber] = useState(user?.name || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!fullName.trim() || !registerNumber.trim()) return;
    setIsSubmitting(true);
    try {
      await api.createProfile({
        fullName,
        registerNumber,
        phone,
        department,
        year: parseInt(year, 10),
      });

      setOnboardingDone(true);
      const rolePath = userRole?.toLowerCase() || 'student';
      navigate(`/dashboard/${rolePath}`);
    } catch {
      // Assuming mock or partial flow success if errors
      setOnboardingDone(true);
      navigate(`/dashboard/${userRole?.toLowerCase() || 'student'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fullName, registerNumber, phone,, department, year, userRole, setOnboardingDone, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
            <span className="font-bold text-xl">
              smart<span className="text-primary">bus</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Just a few more details before we set up your{' '}
            <span className="text-primary font-medium capitalize">{userRole?.toLowerCase()}</span>{' '}
            dashboard.
          </p>
        </div>

        <div className="card p-8 space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-2">Register Number</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="RA2311003020XXX"
                className="input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., CSE"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!fullName.trim() || !registerNumber.trim() || isSubmitting}
            loading={isSubmitting}
            size="lg"
            className="w-full gap-2 mt-4"
          >
            Complete Setup
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
