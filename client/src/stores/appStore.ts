import { create } from 'zustand';
import type { UserRole, BusWithLocation, SOSAlert, Attendance, DashboardStats, AnalyticsData } from '../types';
import { chennaiBusSeeds } from '../lib/chennaiRoutes';

// ── Cart Types & Helpers ──────────────────────────────────────────
export interface CartItem {
    planId: string;
    planName: string;
    price: number;
    quantity: number;
}

const PLAN_PRICES: Record<string, { name: string; price: number }> = {
    basic: { name: 'Basic Plan', price: 499 },
    pro: { name: 'Pro Plan', price: 999 },
    enterprise: { name: 'Enterprise Plan', price: 1999 },
};

function hydrateCart(): CartItem[] {
    try {
        const saved = localStorage.getItem('smartbus_cart');
        if (saved) {
            const data = JSON.parse(saved);
            // Support legacy { plan, quantity } format
            if (data.plan && PLAN_PRICES[data.plan]) {
                return [{
                    planId: data.plan,
                    planName: PLAN_PRICES[data.plan].name,
                    price: PLAN_PRICES[data.plan].price,
                    quantity: Math.max(1, data.quantity || 1),
                }];
            }
            // Support array format
            if (Array.isArray(data)) return data;
        }
    } catch { /* safe JSON fallback */ }
    return [];
}

function persistCart(cart: CartItem[]): void {
    if (cart.length === 0) {
        localStorage.removeItem('smartbus_cart');
    } else if (cart.length === 1) {
        // Keep legacy format for backward compat with CartPage
        localStorage.setItem('smartbus_cart', JSON.stringify({
            plan: cart[0].planId,
            quantity: cart[0].quantity,
        }));
    } else {
        localStorage.setItem('smartbus_cart', JSON.stringify(cart));
    }
}

function hydrateTheme(): 'light' | 'dark' {
    try {
        const saved = localStorage.getItem('smartbus_theme');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

function hydrateUserRole(): UserRole | null {
    try {
        const saved = localStorage.getItem('smartbus_user_role');
        if (saved) return saved as UserRole;
    } catch { /* ignore */ }
    return null;
}

function hydrateOnboardingDone(): boolean {
    try {
        const saved = localStorage.getItem('smartbus_onboarding_done');
        return saved === 'true';
    } catch { /* ignore */ }
    return false;
}

// Mock data for demonstration
const mockBuses: BusWithLocation[] = chennaiBusSeeds.map((bus, index) => ({
    id: bus.id,
    number: bus.number,
    routeName: bus.routeName,
    capacity: bus.capacity,
    status: index < 3 ? 'ACTIVE' : 'INACTIVE',
    currentOccupancy: 12 + index * 6,
    location: {
        id: `loc-${bus.id}`,
        busId: bus.id,
        latitude: bus.route[0][0],
        longitude: bus.route[0][1],
        speed: bus.speed,
        timestamp: new Date(),
    },
    eta: 6 + index * 3,
    distance: 1800 + index * 700,
    routePoints: bus.route,
}));

const mockAlerts: SOSAlert[] = [
    {
        id: 'sos-1',
        userId: 'user-1',
        busId: '1',
        message: 'Medical emergency on bus',
        resolved: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        bus: mockBuses[0],
    },
];

const mockStats: DashboardStats = {
    activeBuses: 12,
    driversOnline: 10,
    todayRidership: 847,
    attendanceRate: 94.2,
    activeAlerts: 1,
};

const mockAnalytics: AnalyticsData[] = [
    { date: 'Mon', ridership: 720, attendance: 680 },
    { date: 'Tue', ridership: 850, attendance: 810 },
    { date: 'Wed', ridership: 790, attendance: 750 },
    { date: 'Thu', ridership: 920, attendance: 870 },
    { date: 'Fri', ridership: 880, attendance: 840 },
    { date: 'Sat', ridership: 450, attendance: 420 },
    { date: 'Sun', ridership: 380, attendance: 350 },
];

interface AppState {
    // Theme
    theme: 'light' | 'dark';
    toggleTheme: () => void;

    // Sidebar
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;

    // User
    userRole: UserRole | null;
    setUserRole: (role: UserRole) => void;
    onboardingDone: boolean;
    setOnboardingDone: (done: boolean) => void;

    // Buses
    buses: BusWithLocation[];
    updateBusLocation: (busId: string, lat: number, lng: number, speed: number) => void;
    upsertBus: (bus: Partial<BusWithLocation> & { id: string }) => void;
    addBus: (bus: BusWithLocation) => void;

    // Alerts
    alerts: SOSAlert[];
    addAlert: (alert: SOSAlert) => void;
    resolveAlert: (alertId: string) => void;

    // Attendance
    attendanceRecords: Attendance[];
    addAttendance: (record: Attendance) => void;

    // Stats
    stats: DashboardStats;
    analytics: AnalyticsData[];

    // Trip State (Driver)
    isOnTrip: boolean;
    startTrip: () => void;
    endTrip: () => void;

    // Socket connection status
    isConnected: boolean;
    setConnected: (connected: boolean) => void;

    // Cart
    cart: CartItem[];
    addToCart: (planId: string) => void;
    removeFromCart: (planId: string) => void;
    updateCartQuantity: (planId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => { subtotal: number; gst: number; total: number };
}

export const useAppStore = create<AppState>((set, get) => ({
    // Theme - persisted to localStorage
    theme: hydrateTheme(),
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('smartbus_theme', newTheme);
        return { theme: newTheme };
    }),

    // Sidebar
    sidebarCollapsed: false,
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    // User
    userRole: hydrateUserRole(),
    setUserRole: (role) => set(() => {
        localStorage.setItem('smartbus_user_role', role);
        return { userRole: role };
    }),
    onboardingDone: hydrateOnboardingDone(),
    setOnboardingDone: (done) => set(() => {
        localStorage.setItem('smartbus_onboarding_done', String(done));
        return { onboardingDone: done };
    }),

    // Buses
    buses: mockBuses,
    updateBusLocation: (busId, lat, lng, speed) => set((state) => ({
        buses: state.buses.map((bus) =>
            bus.id === busId
                ? {
                    ...bus,
                    location: {
                        id: `loc-${busId}`,
                        busId,
                        latitude: lat,
                        longitude: lng,
                        speed,
                        timestamp: new Date(),
                    },
                }
                : bus
        ),
    })),
    upsertBus: (incomingBus) => set((state) => {
        const existingIndex = state.buses.findIndex((bus) => bus.id === incomingBus.id);
        if (existingIndex === -1) {
            const newBus: BusWithLocation = {
                id: incomingBus.id,
                number: incomingBus.number || `BUS-${incomingBus.id}`,
                routeName: incomingBus.routeName || 'New Route',
                capacity: incomingBus.capacity || 40,
                status: incomingBus.status || 'INACTIVE',
                currentOccupancy: incomingBus.currentOccupancy || 0,
                location: incomingBus.location,
                eta: incomingBus.eta,
                distance: incomingBus.distance,
                routePoints: incomingBus.routePoints,
            };
            return { buses: [...state.buses, newBus] };
        }

        const buses = [...state.buses];
        buses[existingIndex] = {
            ...buses[existingIndex],
            ...incomingBus,
            location: incomingBus.location || buses[existingIndex].location,
            routePoints: incomingBus.routePoints || buses[existingIndex].routePoints,
        };
        return { buses };
    }),
    addBus: (bus) => set((state) => {
        if (state.buses.some((existing) => existing.id === bus.id)) {
            return state;
        }
        return { buses: [...state.buses, bus] };
    }),

    // Alerts
    alerts: mockAlerts,
    addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts],
        stats: { ...state.stats, activeAlerts: state.stats.activeAlerts + 1 },
    })),
    resolveAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)),
        stats: { ...state.stats, activeAlerts: Math.max(0, state.stats.activeAlerts - 1) },
    })),

    // Attendance
    attendanceRecords: [],
    addAttendance: (record) => set((state) => ({
        attendanceRecords: [record, ...state.attendanceRecords],
    })),

    // Stats
    stats: mockStats,
    analytics: mockAnalytics,

    // Trip State
    isOnTrip: false,
    startTrip: () => set({ isOnTrip: true }),
    endTrip: () => set({ isOnTrip: false }),

    // Socket
    isConnected: false,
    setConnected: (connected) => set({ isConnected: connected }),

    // Cart — hydrated from localStorage
    cart: hydrateCart(),
    addToCart: (planId) => set((state) => {
        const existing = state.cart.find(item => item.planId === planId);
        if (existing) return state; // prevent duplicates
        const planInfo = PLAN_PRICES[planId];
        if (!planInfo) return state;
        const newCart = [...state.cart, {
            planId,
            planName: planInfo.name,
            price: planInfo.price,
            quantity: 1,
        }];
        persistCart(newCart);
        return { cart: newCart };
    }),
    removeFromCart: (planId) => set((state) => {
        const newCart = state.cart.filter(item => item.planId !== planId);
        persistCart(newCart);
        return { cart: newCart };
    }),
    updateCartQuantity: (planId, quantity) => set((state) => {
        const newCart = state.cart.map(item =>
            item.planId === planId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        persistCart(newCart);
        return { cart: newCart };
    }),
    clearCart: () => {
        localStorage.removeItem('smartbus_cart');
        set({ cart: [] });
    },
    getCartTotal: () => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const gst = Math.round(subtotal * 0.18);
        return { subtotal, gst, total: subtotal + gst };
    },
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
    const initialTheme = hydrateTheme();
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}
