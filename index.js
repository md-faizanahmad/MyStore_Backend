// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import serverless from "serverless-http";

import adminRoutes from "./src/routes/adminRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();

const app = express();

// --- core middleware ---
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-store-admin-five.vercel.app", // your FE live domain (change if different)
    ],
    credentials: true,
  })
);

// --- db connect ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in env");
}
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- routes base ---
app.use("/mystoreapi/admin", adminRoutes);
app.use("/mystoreapi/categories", categoryRoutes);
app.use("/mystoreapi/products", productRoutes);

// app.get("/", (_req, res) => {
//   res.send("MyStore API is running 🚀");
// });

// app.get("/", (_req, res) => {
//   res.send(`
//     <h3>MyStore API is running 🚀</h3>
//     <p>Visit the live site here:
//       <a href="https://my-store-admin-five.vercel.app/" target="_blank">
//         MyStore Admin
//       </a>
//       <ul>
//       <li>UserId: admin@mystore.com</li>
//       <li>password: admin123</li>
//       </ul>
//     </p>
//   `);
// });

///Custom Backend For Api-
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MyStore API - Powered by Vercel</title>
      <style>
        body {
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #023f53ff, #000000ff);
          color: #fff;
          margin: 0;
          padding: 0;
          margin-top:25px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          background: rgba(12, 94, 152, 1);
          padding: 30px 40px;
          margin-top:15px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          max-width: 500px;
          width: 90%;
          backdrop-filter: blur(8px);
          animation: fadeIn 1s ease-in-out;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1rem;
          line-height: 1.6;
        }
        a {
          color: #ffffffff;
          text-decoration: none;
          font-weight: 600;text-decoration: underline;
        }
        a:hover {
          text-decoration: underline;
          color: #fff;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 15px 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          text-align: left;
          padding: 10px 20px;
        }
        li {
          margin: 6px 0;
          font-size: 0.95rem;
        }
        .tech {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px;
          font-size: 0.9rem;
          margin-top: 15px;
          text-align: left;
        }
        footer {
          margin-top: 20px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .container { padding: 20px; }
          h1 { font-size: 1.6rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 MyStore API is Running</h1>
        <p>Welcome to the <strong>MyStore Backend</strong> — powering your eCommerce dashboard.</p>
        <p>
          Visit the live site here: 
          <br>
          <a href="https://my-store-admin-five.vercel.app/" target="_blank">
            MyStore Admin Dashboard
          </a>
        </p>

        <ul>
          <li><strong>User ID:</strong> admin@mystore.com</li>
          <li><strong>Password:</strong> admin123</li>
        </ul>

        <div class="tech">
          <h3>⚙️ Tech & Hosting Info</h3>
          <p>This project uses:</p>
          <ul>
            <li>🖥️ <strong>Vercel Serverless Functions</strong> – Free hosting for API</li>
            <li>🗄️ <strong>MongoDB Atlas (Free Tier)</strong> – Cloud database</li>
            <li>☁️ <strong>Cloudinary (Free Plan)</strong> – Image hosting & optimization</li>
            <li>💻 <strong>Node.js + Express.js</strong> – Server & API logic</li>
          </ul>
          <p style="font-size:0.9rem;opacity:0.9;">⚠️ Please upload optimized images (<strong>&lt;500KB</strong>) to stay within free plan limits.</p>
        </div>

        <footer>
          &copy; ${new Date().getFullYear()} MyStore • Built with ❤️ using JavaScript & Node.js
        </footer>
      </div>

      <script>
        alert("Welcome to MyStore API — powered by free cloud stack 🌐");
      </script>
    </body>
    </html>
  `);
});

// --- server (local) vs serverless (vercel) ---
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export const handler = serverless(app);
export default app;
