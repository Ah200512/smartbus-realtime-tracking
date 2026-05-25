import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, CheckCircle, ChevronDown, Camera, MapPin, Calendar, Building, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Footer } from '../components/layout/Footer';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('1');
  const [address, setAddress] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // We should load full profile details from the backend since user object in AuthContext may just have core fields.
    const loadProfile = async () => {
      try {
        const profile = await api.getProfile();
        setFullName(profile.fullName || user?.name || '');
        setRegisterNumber(profile.registerNumber || '');
        setPhone(profile.phone || '');
        setDepartment(profile.department || '');
        setYear(profile.year ? String(profile.year) : '1');
        setAddress(profile.address || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    if (user) loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await api.updateProfile({
        fullName,
        registerNumber,
        phone,
        department,
        year: parseInt(year, 10),
        address
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refreshProfile(); // sync updated state
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (n?: string) => n ? n.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
          <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
          <div />
        </div>
      </header>

      <div className="pt-20 max-w-3xl mx-auto px-6">
        <Breadcrumb items={[{ label: 'Profile' }]} />
      </div>

      <main className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">{getInitials(fullName || user?.name || user?.email)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{fullName || user?.name || 'User'}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />{user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Building className="h-3.5 w-3.5" />{registerNumber || 'No Register Number'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Profile Form */}
            <form onSubmit={handleSave}>
              <Card className="p-6 mb-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {/* Register Number */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Register Number</label>
                      <input
                        type="text"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        className="input"
                        placeholder="e.g. RA2311003020XXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email (read-only) */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <div className="input bg-surface/50 flex items-center gap-2 cursor-not-allowed opacity-70">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Phone className="h-4 w-4" />Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input w-full"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Department */}
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="input w-full"
                        placeholder="e.g. CSE"
                      />
                    </div>
                    {/* Year */}
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Calendar className="h-4 w-4" />Year
                      </label>
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
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4" />Address
                    </label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="input" 
                      placeholder="e.g. Chennai, Tamil Nadu" 
                    />
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              {saved && (
                <div className="text-green-500 text-sm mb-4">Profile updated successfully.</div>
              )}

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
