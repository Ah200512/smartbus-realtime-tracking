import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Settings, Palette, Bell, Shield, Globe, Moon, Sun, Monitor, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useAppStore } from '../stores/appStore';
import { Footer } from '../components/layout/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, type ThemeMode } from '../context/ThemeContext';

const timezones = ['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)', 'Asia/Singapore (SGT)'];

export function SettingsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language, setLanguage, t, languageNames, availableLanguages } = useLanguage();
    const { themeMode, setThemeMode } = useTheme();

    const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: t('settings.account'), icon: Settings },
        { id: 'preferences', label: t('settings.preferences'), icon: Palette },
        { id: 'notifications', label: t('settings.notifications'), icon: Bell },
        { id: 'security', label: t('settings.security'), icon: Shield },
    ];

    const themeOptions: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
        { mode: 'light', icon: Sun, label: t('settings.light') },
        { mode: 'dark', icon: Moon, label: t('settings.dark') },
        { mode: 'system', icon: Monitor, label: t('settings.system') },
    ];

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />{t('common.back')}
                    </Button>
                    <span className="font-bold text-xl">smart<span className="text-primary">bus</span></span>
                    <div />
                </div>
            </header>

            <div className="pt-20 max-w-5xl mx-auto px-6">
                <Breadcrumb items={[{ label: t('settings.title') }]} />
            </div>

            <main className="pt-8 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Settings className="h-7 w-7 text-primary" /> {t('settings.title')}
                        </h1>
                        <p className="text-muted-foreground mb-8">{t('settings.subtitle')}</p>

                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Sidebar Tabs */}
                            <div className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-surface'}`}
                                    >
                                        <tab.icon className="h-4 w-4" />{tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Account */}
                                {activeTab === 'account' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle>{t('settings.accountInfo')}</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">{t('settings.fullName')}</label>
                                                        <p className="mt-1 font-medium">{user?.username || 'Not set'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">{t('settings.email')}</label>
                                                        <p className="mt-1 font-medium">{user?.email || 'Not set'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">{t('settings.userId')}</label>
                                                        <p className="mt-1 font-mono text-sm text-muted-foreground">{user?.id}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">{t('settings.created')}</label>
                                                        <p className="mt-1 text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" onClick={() => navigate('/profile')}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />{t('settings.manageProfile')}
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {/* Danger Zone */}
                                        <Card className="p-6 border-destructive/30">
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle className="text-destructive flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5" />{t('settings.dangerZone')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {t('settings.dangerWarning')}
                                                </p>
                                                <Button variant="destructive" size="sm">{t('settings.deleteAccount')}</Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Preferences */}
                                {activeTab === 'preferences' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />{t('settings.appearance')}</CardTitle></CardHeader>
                                            <CardContent className="p-0">
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="font-medium">{t('settings.theme')}</p>
                                                        <p className="text-sm text-muted-foreground mb-3">{t('settings.themeDescription')}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {themeOptions.map((opt) => (
                                                            <button
                                                                key={opt.mode}
                                                                onClick={() => setThemeMode(opt.mode)}
                                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                                                    themeMode === opt.mode
                                                                        ? 'bg-primary/10 border-primary/40 text-primary ring-1 ring-primary/20'
                                                                        : 'bg-surface border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                                                                }`}
                                                            >
                                                                <opt.icon className="h-4 w-4" />
                                                                <span className="text-sm font-medium">{opt.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />{t('settings.regional')}</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">{t('settings.language')}</label>
                                                    <select
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value as typeof language)}
                                                        className="input max-w-xs"
                                                    >
                                                        {availableLanguages.map((l) => (
                                                            <option key={l} value={l}>{languageNames[l]}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">{t('settings.timezone')}</label>
                                                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input max-w-xs">
                                                        {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                                                    </select>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Notifications */}
                                {activeTab === 'notifications' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-6"><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />{t('settings.notificationPrefs')}</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-6">
                                                {[
                                                    { label: t('settings.emailNotif'), description: t('settings.emailNotifDesc'), value: emailNotif, setter: setEmailNotif },
                                                    { label: t('settings.smsNotif'), description: t('settings.smsNotifDesc'), value: smsNotif, setter: setSmsNotif },
                                                    { label: t('settings.pushNotif'), description: t('settings.pushNotifDesc'), value: pushNotif, setter: setPushNotif },
                                                ].map((item) => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{item.label}</p>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => item.setter(!item.value)}
                                                            className={`relative w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-primary' : 'bg-muted'}`}
                                                            role="switch"
                                                            aria-checked={item.value}
                                                        >
                                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.value ? 'translate-x-6' : ''}`} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Security */}
                                {activeTab === 'security' && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />{t('settings.sessionInfo')}</CardTitle></CardHeader>
                                            <CardContent className="p-0 space-y-3">
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-muted-foreground">{t('settings.currentSession')}</span>
                                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">{t('common.active')}</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-sm text-muted-foreground">{t('settings.lastSignIn')}</span>
                                                    <span className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}</span>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />{t('settings.manageSessions')}
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card className="p-6">
                                            <CardHeader className="p-0 mb-4"><CardTitle>{t('settings.twoFactor')}</CardTitle></CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {t('settings.twoFactorDesc')}
                                                </p>
                                                <Button variant="outline" onClick={() => navigate('/profile')}>
                                                    <Shield className="h-4 w-4 mr-2" />{t('settings.configure2FA')}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
