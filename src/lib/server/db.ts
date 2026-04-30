import mongoose from "mongoose";

const MONGODB_URI: string = (() => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }
  return uri;
})();

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalWithMongoose._mongooseCache ?? {
  conn: null,
  promise: null,
};

globalWithMongoose._mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
