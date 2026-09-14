// backend/prisma.config.ts
import "dotenv/config"; // 環境変数を読み込むために必要です
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Railwayの環境変数 DATABASE_URL をここで吸い上げるように一元化します
    url: env("DATABASE_URL"),
  },
});
