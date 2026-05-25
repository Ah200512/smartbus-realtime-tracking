import { prisma } from '../lib/prisma.js';

export async function connectDB() {
  try {
    console.log('📡 Attempting to connect to Supabase Postgres via Prisma');
    await prisma.$connect();
    console.log('✅ Supabase Postgres connected');
    return prisma;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Supabase connection failed: ${error.message}`);
    } else {
      console.error('❌ Unknown error connecting to Supabase');
    }
    process.exit(1);
  }
}
