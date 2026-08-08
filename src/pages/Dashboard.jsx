import React, { useState } from "react";
import { Menu } from "lucide-react";

import Display from "../components/Display";
import Control from "../components/Control";
import BatteryLevel from "../components/battery _level/BatteryLevel";
import SpeedLevel from "../components/Speed_level/SpeedLevel";
import FireDetection from "../components/fire_detection/FireDetection";
import Sidebar from "../components/layout/Sidebar";
import Login from "./Login";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rosStatus, setRosStatus] = useState("Connecting...");
  const [cameraStatus, setCameraStatus] = useState("Connecting...");

  const getStatusIcon = (status) => {
    if (status === "Connected") return "✅";
    if (status === "Connecting..." || status === "Retrying...") return "⚠️";
    return "❌";
  };

  const getStatusColor = (status) => {
    if (status === "Connected") return "bg-green-100 text-green-600";
    if (status === "Connecting..." || status === "Retrying...") {
      return "bg-yellow-100 text-yellow-600";
    }
    return "bg-red-100 text-red-600";
  };

  const getStatusTextColor = (status) => {
    if (status === "Connected") return "text-green-600";
    if (status === "Connecting..." || status === "Retrying...") {
      return "text-yellow-600";
    }
    return "text-red-600";
  };

  const StatusBox = ({ title, status }) => {
    return (
      <div className="flex h-[10vh] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex w-full items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${getStatusColor(
              status,
            )}`}
          >
            {getStatusIcon(status)}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-700">
              {title}
            </h2>

            <p
              className={`mt-1 truncate text-sm font-bold ${getStatusTextColor(
                status,
              )}`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen w-full lg:pl-[240px]">
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Monitor and control your robot in real time
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              System Healthy
            </div>
          </header>

          {/* Status Cards */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatusBox title="Robot Connected" status={rosStatus} />
            <StatusBox title="Camera Connected" status={cameraStatus} />

            <div className="h-[92px] min-w-0 overflow-hidden [&>*]:!h-full [&>*]:!min-h-0 [&>*]:!w-full [&>*]:!max-w-none [&>*]:!p-3">
              <BatteryLevel />
            </div>

            <div className="h-[92px] min-w-0 overflow-hidden [&>*]:!h-full [&>*]:!min-h-0 [&>*]:!w-full [&>*]:!max-w-none [&>*]:!p-3">
              <SpeedLevel />
            </div>

            <div className="h-[92px] min-w-0 overflow-hidden [&>*]:!h-full [&>*]:!min-h-0 [&>*]:!w-full [&>*]:!max-w-none [&>*]:!p-3">
              <FireDetection />
            </div>
          </section>

          {/* Camera + Map Section */}
          <section className="mt-5 min-w-0 overflow-hidden">
            <Display
              setRosStatus={setRosStatus}
              setCameraStatus={setCameraStatus}
            />
          </section>

          {/* Control Section */}
          <section className="mt-5 min-w-0 overflow-hidden">
            <Control />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
