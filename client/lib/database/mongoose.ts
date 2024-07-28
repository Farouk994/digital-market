/** @format */

import mongoose, { mongo, Mongoose } from "mongoose";

const mongoUrl = process.env.MONGO_URL;
console.log("mongoURL", mongoUrl);

interface MongoConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// caching connection
// why?
// 1. to avoid creating multiple connections
// 2. to avoid creating multiple models
// 3. to avoid creating multiple schemas
let cached: MongoConnection = (global as any).mongoose || {};
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!mongoUrl) {
    throw new Error("Mongo URL is not provided");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(mongoUrl, {
      dbName: "digiMarket",
      bufferCommands: false,
    });
  cached.conn = await cached.promise;

  return cached.conn;
};
