import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // .env の DATABASE_URL をそのまま安全に読み込みます
    url: env("DATABASE_URL"),
  },
});
