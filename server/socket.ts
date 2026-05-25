import { Server, Socket } from 'socket.io';
import { chennaiBusSeeds } from './chennaiRoutes.js';
import express from 'express';

// ---------- Interfaces ----------
interface BusLocationPayload {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

interface SOSPayload {
  userId: string;
  busId: string;
  message: string;
  latitude?: number;
  longitude?: number;
  location?: { lat?: number; lng?: number };
}

interface TripPayload {
  busId: string;
  driverId: string;
  action: 'start' | 'stop';
}

interface BusSimState {
  id: string;
  number: string;
  name: string;
  routeName: string;
  capacity: number;
  route: [number, number][];
  currentIndex: number;
  currentLat: number;
  currentLng: number;
  speed: number;
  active: boolean;
}

interface SOSAlertState {
  id: string;
  userId: string;
  busId: string;
  message: string;
  latitude?: number;
  longitude?: number;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// ---------- Shared In-Memory State ----------
export const buses: BusSimState[] = chennaiBusSeeds.map((bus) => ({
  id: bus.id,
  number: bus.number,
  name: bus.name,
  routeName: bus.routeName,
  capacity: bus.capacity,
  speed: bus.speed,
  route: bus.route,
  currentIndex: 0,
  currentLat: bus.route[0][0],
  currentLng: bus.route[0][1],
  active: true, // Default to active for simulation
}));

export const activeBusIds = new Set<string>();
export const alerts: SOSAlertState[] = [];

// Populate active buses list
buses.forEach((bus) => {
  if (bus.active) activeBusIds.add(bus.id);
});

// ---------- Helper Functions ----------
function getBusPayload(bus: BusSimState) {
  return {
    id: bus.id,
    busId: bus.id,
    number: bus.number,
    name: bus.name,
    routeName: bus.routeName,
    currentLat: bus.currentLat,
    currentLng: bus.currentLng,
    latitude: bus.currentLat,
    longitude: bus.currentLng,
    speed: bus.speed,
    heading: 0,
    route: bus.route,
    routePoints: bus.route,
    active: bus.active,
    timestamp: new Date().toISOString(),
  };
}

let ioInstance: Server | null = null;

function emitBusUpdate(bus: BusSimState) {
  if (!ioInstance) return;
  const payload = getBusPayload(bus);
  ioInstance.emit('busLocationUpdate', payload);
  ioInstance.emit('location:updated', payload);
}

function tickBus(bus: BusSimState) {
  if (bus.route.length < 2) return;
  bus.currentIndex = (bus.currentIndex + 1) % bus.route.length;
  bus.currentLat = bus.route[bus.currentIndex][0];
  bus.currentLng = bus.route[bus.currentIndex][1];
  emitBusUpdate(bus);
}

export function startBusSimulation(busId: string) {
  const bus = buses.find((item) => item.id === busId);
  if (!bus) return;
  bus.active = true;
  activeBusIds.add(busId);
  if (ioInstance) {
    ioInstance.emit('trip:updated', { busId, driverId: 'system', action: 'start' });
  }
  emitBusUpdate(bus);
}

export function stopBusSimulation(busId: string) {
  const bus = buses.find((item) => item.id === busId);
  if (bus) {
    bus.active = false;
  }
  activeBusIds.delete(busId);
  if (ioInstance) {
    ioInstance.emit('trip:updated', { busId, driverId: 'system', action: 'stop' });
  }
}

// Start in-memory ticker interval
setInterval(() => {
  const activeCount = buses.filter((bus) => bus.active).length;
  console.log(`🤖 [Runtime Bot] Server is active. Ticking ${activeCount} active buses...`);
  buses.forEach((bus) => {
    if (activeBusIds.has(bus.id) || bus.active) {
      tickBus(bus);
    }
  });
}, 5000);

// ---------- Socket Setup ----------
export function setupSocket(httpServer: any, allowedOrigins: string[]) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  ioInstance = io;

  const connectedDrivers = new Map<string, string>(); // socketId -> busId
  const connectedStudents = new Set<string>();
  const connectedAdmins = new Set<string>();

  io.on('connection', (socket: Socket) => {
    console.log(`📡 WebSocket client connected: ${socket.id}`);

    // Seed initial state
    socket.emit('buses:seed', buses.map((bus) => getBusPayload(bus)));
    socket.emit('alerts:seed', alerts.filter((alert) => !alert.resolved));

    // Join role-based rooms
    socket.on('join:role', (role: string) => {
      socket.join(`role:${role}`);
      if (role === 'ADMIN') connectedAdmins.add(socket.id);
      if (role === 'STUDENT') connectedStudents.add(socket.id);
    });

    // Driver joins their bus room
    socket.on('join:bus', (busId: string) => {
      socket.join(`bus:${busId}`);
      connectedDrivers.set(socket.id, busId);
    });

    // Student subscribes to a bus
    socket.on('subscribe:bus', (busId: string) => {
      socket.join(`bus:${busId}`);
    });

    // GPS location update from driver
    socket.on('location:update', (data: BusLocationPayload) => {
      const bus = buses.find((item) => item.id === data.busId);
      if (bus) {
        bus.currentLat = data.latitude;
        bus.currentLng = data.longitude;
        bus.speed = data.speed;
      }
      
      // Broadcast updates
      socket.to(`bus:${data.busId}`).emit('location:updated', data);
      io.to('role:ADMIN').emit('location:updated', data);
      io.emit('busLocationUpdate', {
        id: data.busId,
        busId: data.busId,
        currentLat: data.latitude,
        currentLng: data.longitude,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: data.timestamp,
        route: bus?.route || [],
      });
    });

    // SOS alert trigger
    socket.on('sos:trigger', (data: SOSPayload) => {
      const lat = data.latitude ?? data.location?.lat;
      const lng = data.longitude ?? data.location?.lng;
      const alert: SOSAlertState = {
        id: `sos-${Date.now()}`,
        userId: data.userId,
        busId: data.busId,
        message: data.message,
        latitude: lat,
        longitude: lng,
        resolved: false,
        createdAt: new Date().toISOString(),
      };
      alerts.unshift(alert);

      io.to('role:ADMIN').emit('sos:alert', { ...alert, timestamp: alert.createdAt });
      io.to(`bus:${data.busId}`).emit('sos:alert', { ...alert, timestamp: alert.createdAt });
      io.emit('newAlert', alert);
    });

    // Trip management trigger
    socket.on('trip:update', (data: TripPayload) => {
      if (data.action === 'start') {
        startBusSimulation(data.busId);
      } else {
        stopBusSimulation(data.busId);
      }
      io.to('role:ADMIN').emit('trip:updated', data);
      io.to(`bus:${data.busId}`).emit('trip:updated', data);
    });

    // Attendance mark trigger
    socket.on('attendance:scan', (data: { userId: string; busId: string }) => {
      const bus = buses.find((item) => item.id === data.busId);
      io.to('role:ADMIN').emit('attendance:recorded', {
        ...data,
        busName: bus?.name,
        scannedAt: new Date().toISOString(),
      });
      io.to(`bus:${data.busId}`).emit('attendanceNotification', {
        message: `Student marked attendance on ${bus?.name || data.busId}`,
        busName: bus?.name,
        time: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      connectedDrivers.delete(socket.id);
      connectedStudents.delete(socket.id);
      connectedAdmins.delete(socket.id);
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// ---------- Simulation REST Routes ----------
export function registerSimulationRoutes(app: express.Express) {
  // Get active buses in simulation state
  app.get('/api/buses', (_req, res) => {
    res.json(buses.map((bus) => getBusPayload(bus)));
  });

  // Start trip simulation
  app.post('/api/trips/start', (req, res) => {
    const { busId } = req.body as { busId?: string };
    if (!busId) {
      return res.status(400).json({ error: 'busId is required' });
    }
    const bus = buses.find((item) => item.id === busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    startBusSimulation(busId);
    return res.json({ success: true, bus: getBusPayload(bus) });
  });

  // End trip simulation
  app.post('/api/trips/end', (req, res) => {
    const { busId } = req.body as { busId?: string };
    if (!busId) {
      return res.status(400).json({ error: 'busId is required' });
    }
    const bus = buses.find((item) => item.id === busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    stopBusSimulation(busId);
    return res.json({ success: true, bus: getBusPayload(bus) });
  });

  // Log attendance scan via REST
  app.post('/api/attendance', (req, res) => {
    const { busId, userId } = req.body as { busId?: string; userId?: string };
    if (!busId || !userId) {
      return res.status(400).json({ error: 'busId and userId are required' });
    }

    const bus = buses.find((item) => item.id === busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const payload = {
      busId,
      userId,
      busName: bus.name,
      message: `Student marked attendance on ${bus.name}`,
      time: new Date().toISOString(),
    };

    if (ioInstance) {
      ioInstance.to(`bus:${busId}`).emit('attendanceNotification', payload);
      ioInstance.to('role:ADMIN').emit('attendance:recorded', payload);
    }

    return res.status(201).json({ success: true, attendance: payload });
  });

  // Add new bus in-memory simulation
  app.post('/api/admin/buses', (req, res) => {
    const { name, routePoints } = req.body as {
      name?: string;
      routePoints?: [number, number][];
    };

    if (!name || !routePoints || routePoints.length < 2) {
      return res.status(400).json({ error: 'name and at least two route points are required' });
    }

    const nextNumber = `BUS-${String(buses.length + 1).padStart(3, '0')}`;
    const newBus: BusSimState = {
      id: String(Date.now()),
      number: nextNumber,
      name,
      routeName: name,
      capacity: 40,
      route: routePoints,
      currentIndex: 0,
      currentLat: routePoints[0][0],
      currentLng: routePoints[0][1],
      speed: 28,
      active: false,
    };

    buses.push(newBus);
    const payload = getBusPayload(newBus);
    if (ioInstance) {
      ioInstance.emit('newBusAdded', payload);
    }
    return res.status(201).json(payload);
  });

  // Create SOS alert via REST
  app.post('/api/alerts/sos', (req, res) => {
    const { userId, busId, message, location } = req.body as {
      userId?: string;
      busId?: string;
      message?: string;
      location?: { lat?: number; lng?: number };
    };

    if (!userId || !busId) {
      return res.status(400).json({ error: 'userId and busId are required' });
    }

    const alert: SOSAlertState = {
      id: `sos-${Date.now()}`,
      userId,
      busId,
      message: message || 'SOS alert from student dashboard',
      latitude: location?.lat,
      longitude: location?.lng,
      resolved: false,
      createdAt: new Date().toISOString(),
    };
    alerts.unshift(alert);

    if (ioInstance) {
      ioInstance.to('role:ADMIN').emit('sos:alert', { ...alert, timestamp: alert.createdAt });
      ioInstance.to(`bus:${busId}`).emit('sos:alert', { ...alert, timestamp: alert.createdAt });
      ioInstance.emit('newAlert', alert);
    }
    return res.status(201).json({ success: true, alert });
  });

  // Get SOS alerts
  app.get('/api/sos', (_req, res) => {
    res.json(alerts);
  });

  // Resolve SOS alert
  app.patch('/api/sos/:id/resolve', (req, res) => {
    const target = alerts.find((item) => item.id === req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    target.resolved = true;
    target.resolvedAt = new Date().toISOString();
    target.resolvedBy = (req.body as { resolvedBy?: string })?.resolvedBy || 'admin';
    
    if (ioInstance) {
      ioInstance.emit('sos:resolved', { id: target.id });
    }
    return res.json({ success: true, alert: target });
  });

  // Get analytics dashboard stats
  app.get('/api/analytics/dashboard', (_req, res) => {
    const activeBusesCount = buses.filter((bus) => bus.active).length;
    const activeAlerts = alerts.filter((alert) => !alert.resolved).length;
    res.json({
      activeBuses: activeBusesCount,
      driversOnline: Math.max(activeBusesCount, 2),
      todayRidership: 847,
      attendanceRate: 94.2,
      activeAlerts,
    });
  });

  // Health check for WebSocket service
  app.get('/api/ws-health', (_req, res) => {
    res.json({
      status: 'ok',
      connections: ioInstance ? ioInstance.engine.clientsCount : 0,
      activeSimulations: activeBusIds.size,
    });
  });
}
