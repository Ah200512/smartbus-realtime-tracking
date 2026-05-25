import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { AppLayout, ErrorBoundary } from './components/layout';
import { AuthGuard } from './components/auth';
import ReviewsPage from './pages/ReviewsPage';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { BackToTop } from './components/ui/BackToTop';
import NotificationProvider from './components/NotificationProvider';
import { CommandPalette } from './components/ui/CommandPalette';
import { MobileBottomNav } from './components/ui/MobileBottomNav';
import {
  LandingPage,
  RoleSelectionPage,
  DashboardPage,
  MapPage,
  AlertsPage,
  AnalyticsPage,
  SettingsPage,
  RoutesPage,
  AttendancePage,
  WatchDemoPage,
  PricingPage,
  OrganizationPage,
  AboutPage,
  ContactPage,
  CareersPage,
  HelpCenterPage,
  BlogPage,
  SecurityPage,
  StartTrialPage,
  NotFoundPage,
  SignInPage,
  SignUpPage,
  OnboardingPage,
  OurJourneyPage,
  StudentDashboard,
  DriverDashboard,
  AdminDashboard,
} from './pages';
import { CartPage } from './pages/CartPage';
import { DemoPage } from './pages/DemoPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { BillingPage } from './pages/BillingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { EnterprisePage } from './pages/EnterprisePage';
import { PressPage } from './pages/PressPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPage } from './pages/CookiesPage';
import { StatusPage } from './pages/StatusPage';
import { ApiDocsPage } from './pages/ApiDocsPage';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ErrorBoundary>
      <NotificationProvider />
      <BrowserRouter>
        <CustomCursor />
        <ScrollProgress />
        <CommandPalette />
        <BackToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/our-journey" element={<OurJourneyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/watch-demo" element={<WatchDemoPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/start-trial" element={<StartTrialPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />

            {/* Auth Routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Role Selection - requires auth, no onboarding check */}
            <Route
              path="/select-role"
              element={
                <AuthGuard requireOnboarding={false}>
                  <RoleSelectionPage />
                </AuthGuard>
              }
            />

            {/* Onboarding - requires auth + role, no onboarding check */}
            <Route
              path="/onboarding"
              element={
                <AuthGuard requireOnboarding={false}>
                  <OnboardingPage />
                </AuthGuard>
              }
            />

            {/* Role Dashboards */}
            <Route
              path="/dashboard/student"
              element={
                <AuthGuard allowedRoles={['STUDENT']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<StudentDashboard />} />
            </Route>

            <Route
              path="/dashboard/driver"
              element={
                <AuthGuard allowedRoles={['DRIVER']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<DriverDashboard />} />
            </Route>

            <Route
              path="/dashboard/admin"
              element={
                <AuthGuard allowedRoles={['ADMIN']}>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* Protected App Routes */}
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>

            {/* Protected standalone pages (own layout, not AppLayout) */}
            <Route path="/cart" element={<AuthGuard requireOnboarding={false}><CartPage /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard requireOnboarding={false}><ProfilePage /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard requireOnboarding={false}><SettingsPage /></AuthGuard>} />
            <Route path="/billing" element={<AuthGuard requireOnboarding={false}><BillingPage /></AuthGuard>} />
            <Route path="/notifications" element={<AuthGuard requireOnboarding={false}><NotificationsPage /></AuthGuard>} />
            <Route path="/confirmation" element={<AuthGuard requireOnboarding={false}><ConfirmationPage /></AuthGuard>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <MobileBottomNav />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;