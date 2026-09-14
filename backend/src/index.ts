// backend/src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import shortenRouter from "./routes/shorten";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 1. セキュリティヘッダーの自動付与 (OWASP推奨対策)
app.use(helmet());

// 2. CORS制限 (許可されたフロントエンドドメインのみ接続可能)
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

// 3. 経済的なDoS攻撃/ブルートフォース対策 (1分間に10回までの制限)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分間
  max: 10, // 最大10リクエスト
  message: {
    error: "Too many requests from this IP, please try again after a minute.",
  },
  standardHeaders: true, // `RateLimit-*` ヘッダーを返す
  legacyHeaders: false, // 旧 `X-RateLimit-*` ヘッダーを非表示に
});
app.use(limiter);

// 4. ボディパーサー
app.use(express.json());

// 5. ルーティングの適用
app.use("/", shortenRouter);

// 6. グローバルエラーハンドリング（予期せぬエラーによるスタックトレースの漏洩防止）
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] [${new Date().toISOString()}]`, err.stack || err);
  res.status(500).json({ error: "An internal server error occurred." });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`[START] Server is running on port ${PORT}`);
  console.log(`[START] CORS allowed origin: ${FRONTEND_URL}`);
});
