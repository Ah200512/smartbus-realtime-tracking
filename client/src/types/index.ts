export type UserRole = 'STUDENT' | 'DRIVER' | 'ADMIN';

export interface User {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface Bus {
    id: string;
    number: string;
    routeName: string;
    capacity: number;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    currentOccupancy?: number;
}

export interface Driver {
    id: string;
    userId: string;
    busId: string;
    user?: User;
    bus?: Bus;
}

export interface Location {
    id: string;
    busId: string;
    latitude: number;
    longitude: number;
    speed: number;
    timestamp: Date;
}

export interface BusWithLocation extends Bus {
    location?: Location;
    driver?: Driver;
    eta?: number;
    distance?: number;
    routePoints?: [number, number][];
}

export interface Attendance {
    id: string;
    userId: string;
    busId: string;
    scannedAt: Date;
    user?: User;
    bus?: Bus;
}

export interface SOSAlert {
    id: string;
    userId: string;
    busId: string;
    message: string;
    resolved: boolean;
    createdAt: Date;
    user?: User;
    bus?: Bus;
}

export interface RouteStop {
    id: string;
    name: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
}

export interface AnalyticsData {
    date: string;
    ridership: number;
    attendance: number;
}

export interface DashboardStats {
    activeBuses: number;
    driversOnline: number;
    todayRidership: number;
    attendanceRate: number;
    activeAlerts: number;
}
