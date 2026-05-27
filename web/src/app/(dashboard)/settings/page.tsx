"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Bell, Link2, Palette, HelpCircle, User, Eye, EyeOff, Monitor, Smartphone, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import toast from "react-hot-toast";

const tabs = [
  { label: "Profile", icon: User },
  { label: "Security", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Connected", icon: Link2 },
  { label: "Appearance", icon: Palette },
  { label: "Help", icon: HelpCircle },
];

const connectedAccounts = [
  { name: "GitHub", icon: "GH", color: "from-gray-700 to-gray-900", connected: true, username: "rahulkumar_dev", lastSync: "2 hours ago" },
  { name: "LeetCode", icon: "LC", color: "from-orange-600 to-orange-800", connected: true, username: "rahul_dev", lastSync: "1 day ago" },
  { name: "LinkedIn", icon: "LI", color: "from-blue-600 to-blue-800", connected: false, username: null, lastSync: null },
  { name: "CodeChef", icon: "CC", color: "from-yellow-600 to-yellow-800", connected: false, username: null, lastSync: null },
  { name: "HackerRank", icon: "HR", color: "from-green-600 to-green-800", connected: true, username: "rahul_coder", lastSync: "3 days ago" },
];

const sessions = [
  { device: "Chrome on Windows", ip: "192.168.1.5", location: "Chennai, IN", lastActive: "Active now", current: true },
  { device: "Safari on iPhone", ip: "10.0.0.12", location: "Chennai, IN", lastActive: "3 hours ago", current: false },
  { device: "Firefox on Linux", ip: "203.0.113.5", location: "Mumbai, IN", lastActive: "2 days ago", current: false },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", bio: "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.patch("/users/me", formData);
      updateUser(formData);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab List */}
        <div className="sm:w-48 space-y-1">
          {tabs.map((t, i) => (
            <button key={t.label} onClick={() => setActiveTab(i)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${activeTab === i ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-6 space-y-5">

              {/* Profile Tab */}
              {activeTab === 0 && (
                <>
                  <h2 className="text-sm font-semibold text-white border-b border-white/5 pb-3">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-violet-500/50" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Email</label>
                      <input value={user?.email} disabled className="w-full bg-white/3 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} placeholder="Tell others about yourself..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-violet-500/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-violet-500/50" />
                    </div>
                    <button onClick={saveProfile} disabled={saving} className="px-5 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}

              {/* Security Tab */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Change Password</h3>
                    <div className="space-y-3">
                      {["current", "new", "confirm"].map((field) => (
                        <div key={field} className="relative">
                          <label className="text-xs text-gray-400 mb-1 block capitalize">{field} Password</label>
                          <input
                            type={showPw ? "text" : "password"}
                            value={passwords[field as keyof typeof passwords]}
                            onChange={e => setPasswords({...passwords, [field]: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-violet-500/50 pr-10"
                          />
                          <button onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-300">
                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      ))}
                      <button className="px-5 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-all">Update Password</button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-white">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Extra security for your account</p>
                      </div>
                      <button onClick={() => setTwoFA(!twoFA)} className={`w-11 h-6 rounded-full transition-all ${twoFA ? "bg-violet-600" : "bg-white/10"} relative`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFA ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-5">
                    <h3 className="text-sm font-medium text-white mb-3">Active Sessions</h3>
                    <div className="space-y-2">
                      {sessions.map((s, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${s.current ? "border-violet-500/30 bg-violet-500/5" : "border-white/5 bg-white/3"}`}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5">
                              {s.device.includes("iPhone") ? <Smartphone size={14} className="text-gray-400" /> : <Monitor size={14} className="text-gray-400" />}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">{s.device} {s.current && <span className="ml-2 text-violet-400 text-xs">(Current)</span>}</p>
                              <p className="text-xs text-gray-500">{s.ip} · {s.location} · {s.lastActive}</p>
                            </div>
                          </div>
                          {!s.current && <button className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-all">Revoke</button>}
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full py-2 text-xs text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all flex items-center justify-center gap-1">
                      <Trash2 size={12} /> Logout All Other Devices
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Accounts */}
              {activeTab === 3 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-white border-b border-white/5 pb-3">Connected Accounts</h2>
                  {connectedAccounts.map((acc) => (
                    <div key={acc.name} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-xs font-bold`}>{acc.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-white">{acc.name}</p>
                          <p className="text-xs text-gray-400">{acc.connected ? `@${acc.username} · synced ${acc.lastSync}` : "Not connected"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {acc.connected ? (
                          <>
                            <button className="text-xs px-3 py-1 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all">Sync</button>
                            <button className="text-xs px-3 py-1 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all">Disconnect</button>
                          </>
                        ) : (
                          <button className="text-xs px-3 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all">Connect</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other tabs placeholder */}
              {![0, 1, 3].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <Settings size={18} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">{tabs[activeTab].label} settings</p>
                  <p className="text-gray-600 text-xs mt-1">Coming soon</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
