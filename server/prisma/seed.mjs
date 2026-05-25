import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const buses = [
    { busNumber: 'BUS-001', routeName: 'Chennai Central to SRM', startLocation: 'Chennai Central', endLocation: 'SRM University', capacity: 40, driverName: 'Ramesh', status: 'Active' },
    { busNumber: 'BUS-002', routeName: 'Tambaram to OMR', startLocation: 'Tambaram', endLocation: 'OMR', capacity: 42, driverName: 'Arun', status: 'Active' },
    { busNumber: 'BUS-003', routeName: 'Mylapore Circular', startLocation: 'Mylapore', endLocation: 'Mylapore', capacity: 36, driverName: 'Kumar', status: 'Maintenance' },
  ];

  for (const busData of buses) {
    await prisma.bus.upsert({
      where: { busNumber: busData.busNumber },
      update: busData,
      create: {
        ...busData,
        currentLocation: { lat: 13.0827, lng: 80.2707 },
      },
    });
  }

  const users = [
    { username: 'pranav', email: 'pranav@example.com', password: 'password123', role: 'STUDENT' },
    { username: 'driver1', email: 'driver1@example.com', password: 'password123', role: 'DRIVER' },
    { username: 'admin', email: 'admin@example.com', password: 'password123', role: 'ADMIN' },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        username: userData.username,
        role: userData.role,
      },
      create: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      },
    });

    if (userData.role === 'STUDENT') {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          fullName: 'Pranav',
          registerNumber: 'RA2311003020288',
          department: 'CSE',
          year: 2,
          phone: '+919999999999',
        },
        create: {
          userId: user.id,
          fullName: 'Pranav',
          registerNumber: 'RA2311003020288',
          department: 'CSE',
          year: 2,
          phone: '+919999999999',
        },
      });
    }
  }

  console.log('Seeded Supabase/Postgres with buses, demo users, and a student profile.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
