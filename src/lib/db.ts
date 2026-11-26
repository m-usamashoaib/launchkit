import "server-only";
import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// Reuse one connection across hot reloads and serverless invocations.
const globalForMongo = globalThis as unknown as { _mongo?: Cache };
const cache: Cache = (globalForMongo._mongo ??= { conn: null, promise: null });

/**
 * Resolves the MongoDB connection string.
 * Without MONGODB_URI in development, starts an in-memory MongoDB and seeds
 * demo accounts so the app runs with zero setup.
 */
async function resolveUri(): Promise<{ uri: string; seed: boolean }> {
  if (process.env.MONGODB_URI) return { uri: process.env.MONGODB_URI, seed: false };
  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is not set. Add it to your environment variables.");
  }
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const server = await MongoMemoryServer.create();
  console.log("[db] MONGODB_URI not set: using an in-memory database with demo accounts");
  return { uri: server.getUri("launchkit"), seed: true };
}

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= (async () => {
    const { uri, seed } = await resolveUri();
    const conn = await mongoose.connect(uri, { bufferCommands: false });
    if (seed) {
      const { seedDemoData } = await import("./seed");
      await seedDemoData();
    }
    return conn;
  })();
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
