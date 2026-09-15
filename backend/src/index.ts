import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index"; // パスをルーター側と統一

// ★【重要】デフォルトエクスポート(export default)されているため、波括弧を外してインポート
import shortenRouter from "./routes/shorten";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// ★【重要】ルーター側で使い回せるように「export」を頭に付けます
export const prisma = new PrismaClient({ adapter });

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
