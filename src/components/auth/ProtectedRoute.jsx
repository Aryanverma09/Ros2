import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const controller = new AbortController();

      const timer = setTimeout(() => {
        controller.abort();
      }, 3000);

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (res.ok) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        setAllowed(false);
      } finally {
        clearTimeout(timer);
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020b1c] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold">
          Checking secure access...
        </div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;