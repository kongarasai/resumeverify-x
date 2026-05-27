"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, BookOpen, Briefcase, Users, Search,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight, MessageSquare,
  Zap, Target, Trophy, Menu, X, Command, Brain, GraduationCap,
  Building, Calendar
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getSidebarLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case "TEACHER":
        return [
          { href: "/teacher", icon: LayoutDashboard, label: "Teacher Dashboard" },
          { href: "/groups", icon: Users, label: "My Groups" },
          { href: "/teacher/ai-tools", icon: Brain, label: "AI Tools" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
      case "MENTOR":
        return [
          { href: "/mentor", icon: LayoutDashboard, label: "Mentor Board" },
          { href: "/groups", icon: Users, label: "Student Groups" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
      case "RECRUITER":
        return [
          { href: "/recruiter", icon: LayoutDashboard, label: "Recruiter Hub" },
          { href: "/recruiter/pipeline", icon: Briefcase, label: "Hiring Pipeline" },
          { href: "/connect", icon: Zap, label: "Talent Search" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
      case "PLACEMENT_OFFICER":
        return [
          { href: "/placement", icon: LayoutDashboard, label: "Placement Drive" },
          { href: "/rankings", icon: Trophy, label: "Student Ranks" },
          { href: "/connect", icon: Zap, label: "Connect Hub" },
          { href: "/groups", icon: Users, label: "Drive Groups" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
      case "ADMIN":
      case "SUPER_ADMIN":
      case "UNIVERSITY_ADMIN":
      case "COMPANY_ADMIN":
        return [
          { href: "/admin", icon: LayoutDashboard, label: "System Admin" },
          { href: "/groups", icon: Users, label: "System Groups" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
      case "CANDIDATE":
      default:
        return [
          { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/profile", icon: User, label: "My Profile" },
          { href: "/learning", icon: BookOpen, label: "Learning" },
          { href: "/career", icon: Target, label: "Career" },
          { href: "/jobs", icon: Briefcase, label: "Jobs" },
          { href: "/groups", icon: Users, label: "Groups" },
          { href: "/connect", icon: Zap, label: "Connect" },
          { href: "/messages", icon: MessageSquare, label: "Messages" },
          { href: "/rankings", icon: Trophy, label: "Rankings" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ];
    }
  };

  if (!user) return null;

  const currentSidebarLinks = getSidebarLinks();

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 h-full bg-[#0d0d16] border-r border-white/5 flex flex-col z-40"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">RX</span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 font-bold text-white text-sm whitespace-nowrap"
              >
                ResumeVerify X
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {currentSidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-white border border-violet-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon size={18} className={`flex-shrink-0 ${isActive ? "text-violet-400" : ""}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User + Collapse */}
        <div className="border-t border-white/5 p-2 space-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </motion.button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <header className="h-16 bg-[#0d0d16]/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4 z-30">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 flex-1 max-w-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:border-violet-500/50 transition-all text-sm"
          >
            <Search size={15} />
            <span>Search anything...</span>
            <kbd className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-[#13131f] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Command size={16} className="text-gray-400" />
                <input
                  autoFocus
                  placeholder="Search or type a command..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
                />
                <kbd className="text-xs text-gray-500 border border-white/10 px-1.5 py-0.5 rounded">ESC</kbd>
              </div>
              <div className="p-2 space-y-1">
                {[
                  { label: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard" },
                  { label: "Start Interview", icon: Zap, href: "/interview/new" },
                  { label: "Upload Resume", icon: User, href: "/profile" },
                  { label: "Generate Career Plan", icon: Target, href: "/career" },
                  { label: "View Leaderboard", icon: Trophy, href: "/rankings" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setCommandPaletteOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white cursor-pointer transition-all">
                      <item.icon size={16} className="text-violet-400" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
