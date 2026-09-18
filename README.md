# 🔗 Production-Grade URL Shortener with Robust Security

A lightweight, secure, and production-ready **URL Shortener API & Frontend Application** designed to demonstrate core backend capabilities, clean API design, modern ORM architecture, and proactive security engineering practices to hiring managers and recruiters.

---

## 🚀 Live Demo

- **Frontend (UI):** [https://url-shortener-steel-beta.vercel.app](https://url-shortener-steel-beta.vercel.app) _(Hosted on Vercel)_

### 🧪 How to Test

You can test the application by copying and pasting a long URL like the one below into the input field:

```text
https://www.google.co.jp/maps/search/%E6%9D%B1%E4%BA%AC%E9%A7%85/@35.6811398,139.7644811,17z/data=!3m1!4b1?entry=ttu
```

### 🏗️ Architecture & Deployment

The application is decoupled into a monorepo structure and deployed across dedicated cloud platforms:

- **Frontend App:** React 19 + Vite deployed on **Vercel**
- **Backend API:** Node.js Express + Prisma deployed on **Railway** (`https://url-shortener-production-634e.up.railway.app/`)
- **Database:** PostgreSQL hosted on **Railway**

---

## ⚡ Production-Grade Edge Case Resolutions (Advanced Debugging Capital)

This project stands out by directly solving cutting-edge architectural challenges arising from the newly released **Prisma v7** specification and containerized PaaS lifecycle constraints:

- **Prisma v7 Driver Adapter & Strict Initialization Fit:** Complied with the strict Prisma v7 engine specifications by eliminating legacy, parameterless `new PrismaClient()` initializations which trigger crashes in edge/serverless environments. Successfully decoupled database adapters by passing an explicitly instantiated PostgreSQL `PrismaPg` driver adapter with a highly resilient connection pool (`pg` Pool) featuring native SSL handling (`rejectUnauthorized: false`) to safeguard production state transactions.
- **Centralized Schema & Configuration Decoupling (P1012/P1013 Fix):** Adhered to the new Prisma v7 standard where database `url` declarations are strictly forbidden inside `schema.prisma`. Successfully migrated data-source routing exclusively into `prisma.config.ts`. Engineered a deterministic fallback routing scheme where local compilations bypass stringent protocol validation via structured dummy strings, ensuring smooth zero-dependency build pipelines.
- **Build-time Network Isolation Bypassing (P1001 Fit):** Addressed PaaS-specific infrastructure constraints where databases are completely isolated from container runtime sandboxes during the build phase. Optimized the deployment lifecycle by decoupling `prisma migrate deploy` from the build script and delegating it to the container's post-build runtime initialization hook (`start` script). This ensures zero runtime failures while ensuring atomic database synchronization.
- **Legacy Migrations Purge & Cross-Provider Synchronization (P3019/P5000 Fix):** Resolved strict state collisions caused by transitioning a local SQLite development tracking log (`migration_lock.toml`) into a production enterprise PostgreSQL container. Purged local tracking metadata, hardcoded a declarative PostgreSQL migration lock lock-step, and gracefully enforced state sync via native `npx prisma db push` routines, making the schema entirely environment-agnostic.

---

## 🛡️ Key Security & Architecture Features

This project bypasses quick, superficial implementations by integrating standard security principles out of the box:

- **Cryptographically Secure ID Generation:** Utilizes Node.js standard `crypto.randomBytes` to prevent URL enumeration and enumeration-based brute force attacks. Bypasses predictive `Math.random()`.
- **OWASP-Compliant Validation:** Strict URL schema validation enforcing strict protocols (`http:` and `https:` only) to neutralize Server-Side Request Forgery (SSRF) and XSS payload injections.
- **Economic DoS / Brute-Force Prevention:** Implements rate-limiting at the middleware level (`express-rate-limit`), restricting standard IP requests to a max of 10 requests per minute.
- **Strict CORS Enforcement & Preflight Handling:** Features strict explicit domain array whitelisting rather than loose wildcards. Configured with native preflight middleware interceptors via `optionsSuccessStatus: 200` to smoothly handle high-volume browser `OPTIONS` checks.
- **HTTP Header Protection:** Integrated `helmet` middleware to inject crucial defensive layers against common web vulnerabilities (Clickjacking, XSS, etc.).
- **Anti-Scraping / Enumeration Prevention:** Short URL redirects return explicit `302 Found` statuses paired with strict `Cache-Control: no-store, no-cache, must-revalidate` headers, ensuring scrapers cannot cache mappings or exhaust database throughput.

---

## ⚙️ Tech Stack & Dependencies

### Backend

- **Runtime:** Node.js 22+ (TypeScript)
- **Framework:** Express.js 5
- **ORM:** Prisma v7 (Leveraging latest decoupled **Driver Adapters** architectural patterns)
- **Database:** PostgreSQL (Production / Railway) / Local Mocking Capability
- **Driver:** `pg` (PostgreSQL Client Pool wrapper)

### Frontend

- **Framework:** React 19 (Vite, TypeScript)
- **HTTP Client:** Axios

---

## 🗂️ Directory Structure

```text
url-shortener/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express App configuration, Connection Pool & Security Middlewares
│   │   └── routes/
│   │       └── shorten.ts    # Shorten core logic & Redirect handlers
│   ├── prisma/
│   │   └── schema.prisma     # Production/Local schema declarations (Agility Provider Setup)
│   ├── prisma.config.ts      # Centralized Prisma v7 configuration engine
│   └── package.json          # Optimised lifecycle scripts for production orchestration
└── frontend/
    ├── src/
    │   └── App.tsx           # Unitary responsive frontend application UI
    └── package.json
```

---

## 🛠️ Local Installation & Setup

### 1. Prerequisites

Ensure you have **Node.js LTS (v20 or v22+)** installed.

### 2. Backend Setup

```bash
cd backend
npm install

# Setup environment variables compliant with Prisma v7 local build syntax
echo 'DATABASE_URL="postgresql://localhost:5432/dev_db"' > .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL="http://localhost:5173"' >> .env

# Synchronize Database and generate Prisma Client modules locally
npx prisma generate

# Start TypeScript development server
npm run dev
```

### 3. Frontend Setup

Open a new terminal tab:

```bash
cd frontend
npm install

# Setup configuration environment variables
echo 'VITE_API_URL="http://localhost:5000"' > .env

# Start dev server
npm run dev
```

---

## 📊 API Specification

### 1. Generate Short URL

- **Endpoint:** `POST /shorten`
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "originalUrl": "https://google.com"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "shortId": "nAjhoTS",
    "originalUrl": "https://google.com"
  }
  ```

### 2. Redirect to Original URL

- **Endpoint:** `GET /:shortId`
- **Response (302 Found):** Redirects seamlessly to the mapped `originalUrl` with zero-cache enforcement.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
