"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        <title>ResumeVerify X™ — Verified Talent Platform</title>
        <meta name="description" content="AI-powered resume verification and talent intelligence platform for students and recruiters." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} antialiased`}
        style={{
          background: "#0a0a0f",
          color: "#e2e8f0",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <QueryClientProvider client={queryClient}>
            <div className="noise-overlay" aria-hidden="true" />
            {children}
            <Toaster
              position="top-right"
              gutter={12}
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(14, 14, 28, 0.95)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#0a0a0f" },
                  style: {
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#0a0a0f" },
                  style: {
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  },
                },
              }}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
