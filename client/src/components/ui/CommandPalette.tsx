import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Home, CreditCard, Settings, HelpCircle, FileText, MapPin, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const commands = [
    { icon: Home, label: 'Home', href: '/', section: 'Navigation' },
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard', section: 'Navigation' },
    { icon: CreditCard, label: 'Pricing', href: '/pricing', section: 'Navigation' },
    { icon: CreditCard, label: 'Billing', href: '/billing', section: 'Navigation' },
    { icon: Settings, label: 'Settings', href: '/settings', section: 'Navigation' },
    { icon: MapPin, label: 'Contact', href: '/contact', section: 'Pages' },
    { icon: FileText, label: 'About', href: '/about', section: 'Pages' },
    { icon: FileText, label: 'Blog', href: '/blog', section: 'Pages' },
    { icon: FileText, label: 'Careers', href: '/careers', section: 'Pages' },
    { icon: HelpCircle, label: 'Help Center', href: '/help-center', section: 'Support' },
    { icon: Shield, label: 'Security', href: '/security', section: 'Support' },
    { icon: FileText, label: 'API Docs', href: '/api-docs', section: 'Support' },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const filteredCommands = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const grouped = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.section]) acc[cmd.section] = [];
        acc[cmd.section].push(cmd);
        return acc;
    }, {} as Record<string, typeof commands>);

    const handleOpen = useCallback(() => {
        setOpen(true);
        setQuery('');
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                handleOpen();
            }
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleOpen]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const handleSelect = (href: string) => {
        setOpen(false);
        navigate(href);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                            />
                            <kbd className="text-xs text-muted-foreground bg-surface px-2 py-1 rounded">ESC</kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto py-2">
                            {Object.keys(grouped).length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-8">No results found.</p>
                            )}
                            {Object.entries(grouped).map(([section, items]) => (
                                <div key={section}>
                                    <p className="text-xs font-medium text-muted-foreground px-4 py-2">{section}</p>
                                    {items.map((cmd) => (
                                        <button
                                            key={cmd.href}
                                            onClick={() => handleSelect(cmd.href)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
                                        >
                                            <cmd.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="flex-1 text-left">{cmd.label}</span>
                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>ESC Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
