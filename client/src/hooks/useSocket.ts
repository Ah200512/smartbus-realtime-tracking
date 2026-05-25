import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAppStore } from '../stores/appStore';
import { WS_SOCKET_URL } from '../config/ws';

const WS_URL = WS_SOCKET_URL;

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socketInstance;
}

export function useSocket() {
  const socketRef = useRef<Socket>(getSocket());
  const setConnected = useAppStore((state) => state.setConnected);
  const buses = useAppStore((state) => state.buses);
  const updateBusLocation = useAppStore((state) => state.updateBusLocation);
  const upsertBus = useAppStore((state) => state.upsertBus);
  const addBus = useAppStore((state) => state.addBus);
  const addAlert = useAppStore((state) => state.addAlert);
  const resolveAlert = useAppStore((state) => state.resolveAlert);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onLocationUpdated = (data: {
      busId: string;
      latitude: number;
      longitude: number;
      speed: number;
    }) => {
      updateBusLocation(data.busId, data.latitude, data.longitude, data.speed);
    };

    const onSOSAlert = (data: {
      id: string;
      userId: string;
      busId: string;
      message: string;
      timestamp: string;
    }) => {
      addAlert({
        id: data.id,
        userId: data.userId,
        busId: data.busId,
        message: data.message,
        resolved: false,
        createdAt: new Date(data.timestamp),
      });
    };

    const onBusesSeed = (data: Array<{
      id: string;
      busId: string;
      number: string;
      routeName: string;
      capacity: number;
      route: [number, number][];
      latitude: number;
      longitude: number;
      speed: number;
      active?: boolean;
    }>) => {
      data.forEach((bus) => {
        const busIdentifier = bus.busId || bus.id;
        upsertBus({
          id: busIdentifier,
          number: bus.number,
          routeName: bus.routeName,
          capacity: bus.capacity,
          status: bus.active ? 'ACTIVE' : 'INACTIVE',
          routePoints: bus.route,
        });
        updateBusLocation(busIdentifier, bus.latitude, bus.longitude, bus.speed);
      });
    };

    const onAlertsSeed = (data: Array<{ id: string; userId: string; busId: string; message: string; createdAt: string }>) => {
      data.forEach((alert) => {
        addAlert({
          id: alert.id,
          userId: alert.userId,
          busId: alert.busId,
          message: alert.message,
          resolved: false,
          createdAt: new Date(alert.createdAt),
          bus: buses.find((b) => b.id === alert.busId),
        });
      });
    };

    const onSOSResolved = (data: { id: string }) => {
      resolveAlert(data.id);
    };

    const onNewBusAdded = (bus: {
      id: string;
      busId: string;
      number: string;
      routeName: string;
      capacity: number;
      route: [number, number][];
      currentLat: number;
      currentLng: number;
      speed: number;
      active: boolean;
    }) => {
      addBus({
        id: bus.id || bus.busId,
        number: bus.number,
        routeName: bus.routeName,
        capacity: bus.capacity,
        status: bus.active ? 'ACTIVE' : 'INACTIVE',
        routePoints: bus.route,
        currentOccupancy: 0,
        location: {
          id: `loc-${bus.id || bus.busId}`,
          busId: bus.id || bus.busId,
          latitude: bus.currentLat,
          longitude: bus.currentLng,
          speed: bus.speed,
          timestamp: new Date(),
        },
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('location:updated', onLocationUpdated);
    socket.on('sos:alert', onSOSAlert);
    socket.on('buses:seed', onBusesSeed);
    socket.on('alerts:seed', onAlertsSeed);
    socket.on('sos:resolved', onSOSResolved);
    socket.on('newBusAdded', onNewBusAdded);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('location:updated', onLocationUpdated);
      socket.off('sos:alert', onSOSAlert);
      socket.off('buses:seed', onBusesSeed);
      socket.off('alerts:seed', onAlertsSeed);
      socket.off('sos:resolved', onSOSResolved);
      socket.off('newBusAdded', onNewBusAdded);
    };
  }, [setConnected, buses, updateBusLocation, upsertBus, addBus, addAlert, resolveAlert]);

  const joinRole = useCallback((role: string) => {
    socketRef.current.emit('join:role', role);
  }, []);

  const joinBus = useCallback((busId: string) => {
    socketRef.current.emit('join:bus', busId);
  }, []);

  const subscribeBus = useCallback((busId: string) => {
    socketRef.current.emit('subscribe:bus', busId);
  }, []);

  const sendLocation = useCallback(
    (data: { busId: string; latitude: number; longitude: number; speed: number; heading: number }) => {
      socketRef.current.emit('location:update', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  const triggerSOS = useCallback(
    (data: { userId: string; busId: string; message: string; latitude?: number; longitude?: number }) => {
      socketRef.current.emit('sos:trigger', data);
    },
    []
  );

  const updateTrip = useCallback(
    (data: { busId: string; driverId: string; action: 'start' | 'stop' }) => {
      socketRef.current.emit('trip:update', data);
    },
    []
  );

  const scanAttendance = useCallback((data: { userId: string; busId: string }) => {
    socketRef.current.emit('attendance:scan', data);
  }, []);

  return {
    socket: socketRef.current,
    joinRole,
    joinBus,
    subscribeBus,
    sendLocation,
    triggerSOS,
    updateTrip,
    scanAttendance,
  };
}
