import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { chennaiBusSeeds } from './chennaiRoutes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

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

const buses: BusSimState[] = chennaiBusSeeds.map((bus) => ({
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
  active: true,
}));

const activeBusIds = new Set<string>();
const alerts: SOSAlertState[] = [];

buses.forEach((bus) => activeBusIds.add(bus.id));

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

function emitBusUpdate(bus: BusSimState) {
  const payload = getBusPayload(bus);
  io.emit('busLocationUpdate', payload);
  io.emit('location:updated', payload);
}

function tickBus(bus: BusSimState) {
  if (bus.route.length < 2) {
    return;
  }
  bus.currentIndex = (bus.currentIndex + 1) % bus.route.length;
  bus.currentLat = bus.route[bus.currentIndex][0];
  bus.currentLng = bus.route[bus.currentIndex][1];
  emitBusUpdate(bus);
}

function startBusSimulation(busId: string) {
  const bus = buses.find((item) => item.id === busId);
  if (!bus) {
    return;
  }
  bus.active = true;
  activeBusIds.add(busId);
  io.emit('trip:updated', { busId, driverId: 'system', action: 'start' });
  emitBusUpdate(bus);
}

function stopBusSimulation(busId: string) {
  const bus = buses.find((item) => item.id === busId);
  if (bus) {
    bus.active = false;
  }
  activeBusIds.delete(busId);
  io.emit('trip:updated', { busId, driverId: 'system', action: 'stop' });
}

setInterval(() => {
  buses.forEach((bus) => {
    if (activeBusIds.has(bus.id) || bus.active) {
      tickBus(bus);
    }
  });
}, 5000);

// Track connected clients
const connectedDrivers = new Map<string, string>(); // socketId -> busId
const connectedStudents = new Set<string>();
const connectedAdmins = new Set<string>();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

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
    // Broadcast to all subscribers of this bus
    socket.to(`bus:${data.busId}`).emit('location:updated', data);
    // Also broadcast to all admins
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

  // SOS alert
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

    // Broadcast to admins and bus subscribers
    io.to('role:ADMIN').emit('sos:alert', { ...alert, timestamp: alert.createdAt });
    io.to(`bus:${data.busId}`).emit('sos:alert', { ...alert, timestamp: alert.createdAt });
    io.emit('newAlert', alert);
  });

  // Trip management
  socket.on('trip:update', (data: TripPayload) => {
    if (data.action === 'start') {
      startBusSimulation(data.busId);
    } else {
      stopBusSimulation(data.busId);
    }
    io.to('role:ADMIN').emit('trip:updated', data);
    io.to(`bus:${data.busId}`).emit('trip:updated', data);
  });

  // Attendance scan
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
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get('/api/buses', (_req, res) => {
  res.json(buses.map((bus) => getBusPayload(bus)));
});

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

  io.to(`bus:${busId}`).emit('attendanceNotification', payload);
  io.to('role:ADMIN').emit('attendance:recorded', payload);

  return res.status(201).json({ success: true, attendance: payload });
});

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
  io.emit('newBusAdded', payload);
  return res.status(201).json(payload);
});

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

  io.to('role:ADMIN').emit('sos:alert', { ...alert, timestamp: alert.createdAt });
  io.to(`bus:${busId}`).emit('sos:alert', { ...alert, timestamp: alert.createdAt });
  io.emit('newAlert', alert);
  return res.status(201).json({ success: true, alert });
});

app.get('/api/sos', (_req, res) => {
  res.json(alerts);
});

app.patch('/api/sos/:id/resolve', (req, res) => {
  const target = alerts.find((item) => item.id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  target.resolved = true;
  target.resolvedAt = new Date().toISOString();
  target.resolvedBy = (req.body as { resolvedBy?: string })?.resolvedBy || 'admin';
  io.emit('sos:resolved', { id: target.id });
  return res.json({ success: true, alert: target });
});

app.get('/api/analytics/dashboard', (_req, res) => {
  const activeBuses = buses.filter((bus) => bus.active).length;
  const activeAlerts = alerts.filter((alert) => !alert.resolved).length;
  res.json({
    activeBuses,
    driversOnline: Math.max(activeBuses, 2),
    todayRidership: 847,
    attendanceRate: 94.2,
    activeAlerts,
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    connections: io.engine.clientsCount,
    drivers: connectedDrivers.size,
    students: connectedStudents.size,
    admins: connectedAdmins.size,
    activeSimulations: activeBusIds.size,
  });
});

// Browser-friendly root response so localhost:3001 does not show a 404 page
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'websocket-server',
    message: 'Socket.IO server is running',
    frontend: 'http://localhost:5173',
    health: '/health',
  });
});

const PORT = process.env.WS_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

export { io, httpServer };
