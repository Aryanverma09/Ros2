import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Camera,
  Navigation,
  Map,
  FileText,
  Settings,
  Cpu,
  ChevronDown,
  ShieldCheck,
  X,
  LogOut,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const menuItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Live View", icon: Camera },
  { label: "Navigation", icon: Navigation },
  { label: "Map Builder", icon: Map },
  { label: "Logs", icon: FileText },
  { label: "Robot Settings", icon: Cpu },
  { label: "UI Settings", icon: Settings },
];

const Sidebar = ({ open = false, onClose }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("User fetch failed:", error);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("Logout failed:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const userName = user?.username || "Robo Controller";
  const userRole = user?.role || "Administrator";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-white/10 bg-[#020b1c] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            {/* <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg shadow-blue-500/20">
              <img
                src="/logo/x.png"
                alt="HXR Logo"
                className="h-10 w-10 object-contain"
              />
            </div> */}

            <div className="min-w-0 leading-tight">
              <h1 className="text-sm font-bold tracking-wide text-white">
                ROBOTICS
              </h1>

              <p className="text-sm font-bold text-blue-400">
                CONTROL CENTER
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                    item.active
                      ? "bg-blue-600/30 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={22}
                    className={
                      item.active ? "text-blue-400" : "text-slate-300"
                    }
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-4 px-4 pb-5">
          {/* System Status */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  System Status
                </p>

                <p className="mt-1 text-xs font-medium text-green-400">
                  All Systems Operational
                </p>
              </div>
            </div>

            <div className="mt-5 flex h-16 items-center justify-center rounded-xl border border-blue-500/10 bg-blue-500/5">
              <ShieldCheck size={42} className="text-blue-500/40" />
            </div>
          </div>

          {/* User Card */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.07]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                  {initials || "RC"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {userName}
                  </p>

                  <p className="truncate text-xs capitalize text-slate-400">
                    {userRole}
                  </p>
                </div>
              </div>

              <ChevronDown
                size={18}
                className={`shrink-0 text-slate-300 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute bottom-[62px] left-0 right-0 rounded-2xl border border-white/10 bg-[#06152f] p-2 shadow-2xl">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;