import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

// ==================== cn() ==================== //
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== Date Formatting ==================== //
export function formatDate(date: string | Date, pattern = "MMM dd, yyyy"): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return format(d, pattern);
}

export function formatRelativeDate(date: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  if (isToday(d)) return `Today at ${format(d, "HH:mm")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "HH:mm")}`;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTime(date: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "HH:mm");
}

// ==================== Score Formatting ==================== //
export function formatScore(score: number, max = 100): string {
  if (score === null || score === undefined) return "N/A";
  return `${Math.round(score)}/${max}`;
}

export function formatPercentage(value: number, decimals = 1): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function formatCurrency(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    if (amount >= 10_00_000) return `₹${(amount / 10_00_000).toFixed(1)}L`;
    if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}K`;
    return `₹${amount}`;
  }
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
}

// ==================== Trust Score ==================== //
export type TrustLevel = "critical" | "low" | "medium" | "high" | "elite";

export function getTrustLevel(score: number): TrustLevel {
  if (score < 40) return "critical";
  if (score < 60) return "low";
  if (score < 80) return "medium";
  if (score < 95) return "high";
  return "elite";
}

export function getTrustLevelColor(score: number): string {
  if (score < 40) return "#ef4444"; // red
  if (score < 60) return "#f59e0b"; // yellow
  if (score < 80) return "#3b82f6"; // blue
  if (score < 95) return "#10b981"; // green
  return "#06b6d4";                  // cyan (elite)
}

export function getTrustLevelLabel(score: number): string {
  if (score < 40) return "Critical";
  if (score < 60) return "Low";
  if (score < 80) return "Medium";
  if (score < 95) return "High";
  return "Elite";
}

export function getTrustLevelGlow(score: number): string {
  if (score < 40) return "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.2)";
  if (score < 60) return "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)";
  if (score < 80) return "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)";
  if (score < 95) return "0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.2)";
  return "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)";
}

export function getTrustRingGradient(score: number): string {
  if (score < 40) return "url(#trust-gradient-red)";
  if (score < 60) return "url(#trust-gradient-yellow)";
  if (score < 80) return "url(#trust-gradient-blue)";
  if (score < 95) return "url(#trust-gradient-green)";
  return "url(#trust-gradient-cyan)";
}

// ==================== Misc Helpers ==================== //
export function getDifficultyColor(difficulty: "EASY" | "MEDIUM" | "HARD" | string): string {
  switch (difficulty.toUpperCase()) {
    case "EASY": return "#10b981";
    case "MEDIUM": return "#f59e0b";
    case "HARD": return "#ef4444";
    default: return "#94a3b8";
  }
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    CANDIDATE: "#6366f1",
    TEACHER: "#8b5cf6",
    MENTOR: "#06b6d4",
    RECRUITER: "#10b981",
    PLACEMENT_OFFICER: "#f59e0b",
    ADMIN: "#ef4444",
    SUPER_ADMIN: "#ec4899",
  };
  return colors[role] || "#94a3b8";
}

export function getRoleBadgeClasses(role: string): string {
  const classes: Record<string, string> = {
    CANDIDATE: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    TEACHER: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    MENTOR: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    RECRUITER: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    PLACEMENT_OFFICER: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    ADMIN: "bg-red-500/20 text-red-300 border-red-500/30",
    SUPER_ADMIN: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };
  return classes[role] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarUrl(name: string, userId?: string): string {
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1,06b6d4,8b5cf6&fontSize=42&fontWeight=600`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateXP(completedMissions: number, totalMissions: number): number {
  return Math.round((completedMissions / totalMissions) * 100);
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🔥";
  if (streak >= 14) return "⚡";
  if (streak >= 7) return "✨";
  if (streak >= 3) return "💪";
  return "🌱";
}
