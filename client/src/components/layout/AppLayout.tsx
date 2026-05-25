import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppStore } from '../../stores/appStore';

export function AppLayout() {
    const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
    
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div 
                className="transition-all duration-200"
                style={{ paddingLeft: sidebarCollapsed ? 80 : 260 }}
            >
                <Navbar />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
