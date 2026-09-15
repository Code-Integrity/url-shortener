import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

// 1. デバッグ用ログとCORSの緩和設定
app.use(
  cors({
    origin: (origin, callback) => {
      // 本番環境での判定ログを可視化
      console.log("--------------------------------------------------");
      console.log("Configured FRONTEND_URL:", `"${process.env.FRONTEND_URL}"`);
      console.log("Incoming Request Origin :", `"${origin}"`);
      console.log("--------------------------------------------------");

      // 切り分けのため、一時的にリクエスト元をすべて許可（true）してCORSポリシーをパスさせる
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// 2. DB疎通確認用のヘルスチェックエンドポイント
app.get("/health", async (req, res) => {
  try {
    // 実際にDBにクエリを投げてPrismaとPostgreSQLの接続をテスト
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

// 既存の /shorten などのルーティングをここに配置
// app.use('/shorten', shortenRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
