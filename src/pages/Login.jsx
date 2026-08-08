import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b1c] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb_0%,transparent_34%)] opacity-30" />

      <div className="relative grid w-full max-w-[1050px] overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-[#020b1c] p-10 text-white lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <img
                src="/logo/x.png"
                alt="HXR Logo"
                className="h-11 w-11 object-contain"
              />
            </div>

            <div>
              <h1 className="text-lg font-black leading-none">ROBOTICS</h1>
              <p className="mt-1 text-sm font-bold text-blue-400">
                CONTROL CENTER
              </p>
            </div>
          </div>

          <div className="mt-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-300">
              <ShieldCheck size={34} />
            </div>

            <h2 className="mt-6 text-4xl font-black leading-tight">
              Secure Robot Control Access
            </h2>

            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-300">
              Login is required before accessing robot camera, map, navigation,
              movement controls, and emergency functions.
            </p>
          </div>
        </div>

        <div className="flex min-h-[620px] items-center justify-center bg-[#f8fafc] p-6 sm:p-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">
                <img
                  src="/logo/x.png"
                  alt="HXR Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>

              <h1 className="mt-4 text-xl font-black text-slate-950">
                ROBOTICS CONTROL CENTER
              </h1>
            </div>

            <h2 className="text-3xl font-black text-slate-950">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Enter your operator credentials to continue.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Username
                </label>

                <div className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-blue-500">
                  <User size={20} className="text-slate-400" />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter username"
                    className="h-13 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <div className="flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-blue-500">
                  <Lock size={20} className="text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="h-13 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-13 w-full rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking..." : "Login Securely"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-medium text-slate-400">
              Unauthorized access to robot controls is blocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;