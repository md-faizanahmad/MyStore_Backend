// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
//////////////////new

// src/config/db.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Reuse connection across Vercel cold starts
let cached = globalThis.__mongoose;
if (!cached) {
  cached = globalThis.__mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        // keep options minimal; mongoose v8 handles defaults
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000, // fail fast with clear error
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
