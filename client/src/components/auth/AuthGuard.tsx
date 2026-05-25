import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../stores/appStore';
import type { UserRole } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
}

export function AuthGuard({ children, allowedRoles, requireOnboarding = true }: AuthGuardProps) {
  const { isSignedIn, isLoaded, user } = useAuth();
  const location = useLocation();
  const userRole = useAppStore((state) => state.userRole);
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  // Wait for auth context to fully load
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in → send to sign-in
  if (!isSignedIn || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;
  // Fallback to user.role if store isn't synced
  const effectiveRole = userRole || (user.role as UserRole);

  // Signed in but no role → send to role selection
  if (!effectiveRole && currentPath !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // Has role but onboarding not done → send to onboarding
  if (effectiveRole && requireOnboarding && !onboardingDone && currentPath !== '/onboarding' && currentPath !== '/select-role') {
    return <Navigate to="/onboarding" replace />;
  }

  // Role-based access control
  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to={`/dashboard/${effectiveRole.toLowerCase()}`} replace />;
  }

  return <>{children}</>;
}
