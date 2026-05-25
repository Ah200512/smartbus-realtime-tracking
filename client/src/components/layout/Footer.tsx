import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Youtube } from 'lucide-react';

const footerLinks = {
    product: {
        title: 'Product',
        links: [
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Demo', href: '/demo' },
            { label: 'Enterprise', href: '/enterprise' },
        ],
    },
    company: {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Reviews', href: '/reviews' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
        ],
    },
    support: {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/help-center' },
            { label: 'Contact', href: '/contact' },
            { label: 'Status', href: '/status' },
            { label: 'API Docs', href: '/api-docs' },
        ],
    },
    legal: {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Security', href: '/security' },
            { label: 'Cookies', href: '/cookies' },
        ],
    },
};

const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
    const navigate = useNavigate();

    const handleLinkClick = (href: string) => {
        if (href.startsWith('http')) {
            window.open(href, '_blank');
        } else {
            navigate(href);
        }
    };

    return (
        <footer className="bg-surface/50 border-t border-border">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/smartbus-icon.svg" alt="SmartBus" className="w-10 h-10" />
                            <span className="font-bold text-xl">
                                smart<span className="text-primary">bus</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            India's leading smart fleet management platform for schools, businesses, and municipalities.
                        </p>
                        <p className="text-xs text-muted-foreground mb-6 max-w-xs">
                            📍 No. 42, Mount Road, T. Nagar, Chennai, Tamil Nadu 600017
                            <br />📞 +91 98765 43210 &nbsp;|&nbsp; ✉️ support@smartbus.in
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <motion.button
                                    key={social.label}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLinkClick(social.href)}
                                    className="w-9 h-9 rounded-lg bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => handleLinkClick(link.href)}
                                            className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all inline-block"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} SmartBus Technologies Pvt. Ltd. All rights reserved. 🇮🇳
                        </p>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleLinkClick('/privacy')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => handleLinkClick('/terms')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </button>
                            <button
                                onClick={() => handleLinkClick('/cookies')}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cookies
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
