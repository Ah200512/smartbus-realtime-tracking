import { useAppStore } from '../stores/appStore';
import { StudentDashboard, DriverDashboard, AdminDashboard } from './dashboards';

export function DashboardPage() {
    const userRole = useAppStore((state) => state.userRole);

    switch (userRole) {
        case 'DRIVER':
            return <DriverDashboard />;
        case 'ADMIN':
            return <AdminDashboard />;
        case 'STUDENT':
        default:
            return <StudentDashboard />;
    }
}
