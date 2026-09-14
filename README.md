# 🔗 Production-Grade URL Shortener with Robust Security

A lightweight, secure, and production-ready **URL Shortener API & Frontend Application** designed to demonstrate core backend capabilities, clean API design, and proactive security engineering practices to hiring managers and recruiters.

---

## 🚀 Live Demo & Deployments

- **Frontend Web App:** [https://vercel.app](https://vercel.app) (Hosted on Vercel)
- **Backend API Server:** [https://onrender.com](https://onrender.com) (Hosted on Render/Railway)

---

## 🛡️ Key Security & Architecture Features

This project bypasses quick, superficial implementations by integrating standard security principles out of the box:

- **Cryptographically Secure ID Generation:** Utilizes Node.js standard `crypto.randomBytes` to prevent URL enumeration and enumeration-based brute force attacks. Bypasses predictive `Math.random()`.
- **OWASP-Compliant Validation:** Strict URL schema validation enforcing strict protocols (`http:` and `https:` only) to neutralize Server-Side Request Forgery (SSRF) and XSS payload injections.
- **Economic DoS / Brute-Force Prevention:** Implements rate-limiting at the middleware level (`express-rate-limit`), restricting standard IP requests to a max of 10 requests per minute.
- **Strict CORS Enforcement:** Hardcoded origin restriction to guarantee that only the specific trusted frontend application domain can interact with backend state-mutating endpoints.
- **HTTP Header Protection:** Integrated `helmet` middleware to inject crucial defensive layers against common web vulnerabilities (Clickjacking, XSS, etc.).
- **Anti-Scraping / Enumeration Prevention:** Short URL redirects return explicit `302 Found` statuses paired with strict `Cache-Control: no-store` headers, ensuring scrapers cannot cache mappings or exhaust database throughput.

---

## ⚙️ Tech Stack & Dependencies

### Backend

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **ORM:** Prisma v7 (Leveraging latest secure **Driver Adapters** architectural patterns)
- **Database:** SQLite (Local Development) / PostgreSQL (Production)

### Frontend

- **Framework:** React 19 (Vite, TypeScript)
- **HTTP Client:** Axios

---

## 🗂️ Directory Structure

```text
url-shortener/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express App configuration & Security Middlewares
│   │   ├── routes/
│   │   │   └── shorten.ts    # Shorten core logic & Redirect handlers
│   │   └── generated/prisma  # Secure local custom ORM generation client
│   ├── prisma/
│   │   └── schema.prisma     # Production/Local schema declarations
│   └── package.json
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
# Setup environment variables
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL="http://localhost:5174"' >> .env

# Synchronize Database and generate Prisma Client
npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate dev --name init

# Start development server
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
    "originalUrl": "https://google.com..."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "shortId": "5CDtX9",
    "originalUrl": "https://google.com..."
  }
  ```

### 2. Redirect to Original URL

- **Endpoint:** `GET /:shortId`
- **Response (302 Found):** Redirects seamlessly to the mapped `originalUrl`.
