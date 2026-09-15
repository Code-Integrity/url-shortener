import "dotenv/config";
import { defineConfig } from "@prisma/config";

// 本番環境の接続文字列（環境変数）がある場合はそれを使い、なければローカルのSQLiteをデフォルトにする
const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
