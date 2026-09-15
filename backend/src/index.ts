import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// ★【超重要】本番環境の PostgreSQL へ安全かつ確実に接続するためのプール設定に変更します
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 10, // 接続数の上限を明示してエラーを防ぐ
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

const app = express();

// --- ★CORS設定を本番環境（Vercel）とプレフライト（OPTIONS）に最適化します ---
app.use(
  cors({
    origin: [
      "https://vercel.app", // 本番環境（Vercel）のURL
      "http://localhost:5173", // ローカル開発用（Vite標準）
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200, // ブラウザのPreflight（事前確認リクエスト）を確実に200 OKでパスさせる
  }),
);

app.use(express.json());

// ★【重要】URL短縮ルーターを登録
// ルーター側で router.post("/shorten", ...) と定義されているため、第一引数は "/" で完全に一致します！
app.use("/", shortenRouter);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
