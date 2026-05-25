import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <button onClick={() => navigate(user ? '/dashboard' : '/')} className="hover:text-foreground transition-colors flex items-center gap-1" aria-label="Home">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
            </button>
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" />
                    {item.href ? (
                        <button onClick={() => navigate(item.href!)} className="hover:text-foreground transition-colors">
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
