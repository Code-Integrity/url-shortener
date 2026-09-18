import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import dotenv from "dotenv";
import crypto from "crypto";

import { prisma } from "../index";

dotenv.config();

const router = Router();

/**
 * OWASP-compliant simple URL validation
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Cryptographically secure random string generation for short keys (6-8 characters)
 */
function generateShortId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * 3) + 6;

  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

/**
 * POST /shorten - Create a shortened URL
 */
router.post("/shorten", (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== "string") {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      res
        .status(422)
        .json({ error: "Invalid URL format. Only HTTP/HTTPS are allowed." });
      return;
    }

    let shortId = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      shortId = generateShortId();
      const existing = await prisma.url.findUnique({ where: { id: shortId } });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      res.status(500).json({
        error: "Failed to generate a unique short URL. Please try again.",
      });
      return;
    }

    const urlEntry = await prisma.url.create({
      data: {
        id: shortId,
        originalUrl,
      },
    });

    console.log(
      `[INFO] [${new Date().toISOString()}] Short URL created: ${shortId} -> ${originalUrl}`,
    );

    res.status(201).json({
      shortId: String(urlEntry.id),
      originalUrl: String(urlEntry.originalUrl),
    });
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

/**
 * GET /:shortId - Redirect to the original URL
 */
router.get("/:shortId", (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shortId } = req.params;

    const urlEntry = await prisma.url.findUnique({
      where: { id: shortId },
    });

    if (!urlEntry) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    res.writeHead(302, {
      Location: String(urlEntry.originalUrl),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    });
    res.end();
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
