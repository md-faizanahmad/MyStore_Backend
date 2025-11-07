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

import mongoose from "mongoose";

export default async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI missing");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
}
