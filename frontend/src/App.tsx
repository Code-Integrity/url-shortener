// frontend/src/App.tsx
import React, { useState } from "react";
import axios from "axios";

interface ShortenResponse {
  shortId: string;
  originalUrl: string;
}

export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch backend base URL from Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      const response = await axios.post<ShortenResponse>(
        `${API_BASE_URL}/shorten`,
        {
          originalUrl,
        },
      );

      // Construct the absolute short URL pointing to the backend redirect endpoint
      const generatedUrl = `${API_BASE_URL}/${response.data.shortId}`;
      setShortUrl(generatedUrl);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        const errData = err.response.data.error;

        if (typeof errData === "object" && errData !== null) {
          setError(errData.message || JSON.stringify(errData));
        } else {
          setError(String(errData));
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    } catch (err) {
      setError("Failed to copy to clipboard.");
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.card}>
        <h1 style={styles.title}>URL Shortener</h1>
        <p style={styles.subtitle}>
          Enter a long URL to make it concise and easy to share.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <div style={styles.errorContainer}>{error}</div>}

        {shortUrl && (
          <div style={styles.resultContainer}>
            <p style={styles.resultTitle}>Your shortened URL:</p>
            <div style={styles.resultRow}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.shortLink}
              >
                {shortUrl}
              </a>
              <button onClick={handleCopy} style={styles.copyButton}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Inline CSS styles for clear, responsive, and minimalist recruiter-friendly UI
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#f4f5f7",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "500px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1f36",
    margin: "0 0 10px 0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "15px",
    color: "#4f566b",
    margin: "0 0 30px 0",
    textAlign: "center",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    fontSize: "15px",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    backgroundColor: "#635bff",
    color: "#ffffff",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorContainer: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#fdf2f2",
    color: "#de3618",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
  },
  resultContainer: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  resultTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4f566b",
    margin: "0 0 8px 0",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  shortLink: {
    fontSize: "15px",
    color: "#635bff",
    fontWeight: "500",
    textDecoration: "none",
    wordBreak: "break-all",
  },
  copyButton: {
    backgroundColor: "#ffffff",
    border: "1px solid #a3acb9",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
};
