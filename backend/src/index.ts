import express from "express";
import cors from "cors";
// 1. PostgreSQL 用のドライバーと Prisma アダプターをインポート
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// 2. PostgreSQL の接続プール（Pool）を作成し、PrismaClient にアダプターとして渡す
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // ★ここに adapter を渡すのが必須になりました

const app = express();

// --- 以下の CORS 設定やヘルスチェックは、今のままでバッチリ合っています！ ---
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("--------------------------------------------------");
      console.log("Configured FRONTEND_URL:", `"${process.env.FRONTEND_URL}"`);
      console.log("Incoming Request Origin :", `"${origin}"`);
      console.log("--------------------------------------------------");
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("【Health Check Error】DB connection failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
