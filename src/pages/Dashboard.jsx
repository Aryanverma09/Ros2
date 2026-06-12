import React, { useState } from "react";
import Display from "../components/Display";
import Control from "../components/Control";
import Setting from "../components/Settings/Setting";
import BatteryLevel from "../components/battery _level/BatteryLevel";
import SpeedLevel from "../components/Speed_level/SpeedLevel";
import FireDetection from "../components/fire_detection/FireDetection";

const Dashboard = () => {
  const [rosStatus, setRosStatus] = useState("Connecting...");
  const [cameraStatus, setCameraStatus] = useState("Connecting...");

  const getStatusIcon = (status) => {
    if (status === "Connected") return "✅";
    if (status === "Connecting..." || status === "Retrying...") return "⚠️";
    return "❌";
  };

  const getStatusColor = (status) => {
    if (status === "Connected") return "bg-green-100 text-green-600";
    if (status === "Connecting..." || status === "Retrying...")
      return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  const getStatusTextColor = (status) => {
    if (status === "Connected") return "text-green-600";
    if (status === "Connecting..." || status === "Retrying...")
      return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-white">
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-[1500px] flex-col items-center justify-start gap-4 px-3 py-4 pb-28 sm:gap-5 sm:px-5 lg:px-8">
        {/* Top Navbar */}
        <div className="flex w-full max-w-[1280px] items-center justify-between rounded-2xl border border-gray-200 bg-black px-4 py-3 shadow-xl sm:px-6 lg:px-8">
          {/* <img
            src="/logo/hxr_text_final copy.png"
            alt="HXR Logo"
            className="h-14 w-24 shrink-0 rounded-xl object-contain sm:h-16 sm:w-32"
          /> */}

          <div className="flex min-w-0 flex-1 items-center justify-center px-3 text-center">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-gray-100 sm:text-lg">
                Robotics Control Center
              </h1>

              <p className="truncate text-xs font-medium text-gray-400 sm:text-sm">
                Robot Dashboard
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
            System Healthy
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid w-full max-w-[1280px] grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* ROS Connection Card */}
          <div className="flex min-h-[112px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex w-full items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getStatusColor(
                  rosStatus
                )}`}
              >
                {getStatusIcon(rosStatus)}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-gray-700">
                  ROS Connection
                </h1>

                <p
                  className={`truncate text-sm font-bold ${getStatusTextColor(
                    rosStatus
                  )}`}
                >
                  {rosStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Camera Connection Card */}
          <div className="flex min-h-[112px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex w-full items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getStatusColor(
                  cameraStatus
                )}`}
              >
                {getStatusIcon(cameraStatus)}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-gray-700">
                  Camera Connection
                </h1>

                <p
                  className={`truncate text-sm font-bold ${getStatusTextColor(
                    cameraStatus
                  )}`}
                >
                  {cameraStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Battery Level Card */}
          <div className="min-h-[112px] [&>*]:h-full">
            <BatteryLevel />
          </div>

          {/* Speed Level Card */}
          <div className="min-h-[112px] [&>*]:h-full">
            <SpeedLevel />
          </div>

          {/* Fire Detection Card */}
          <div className="min-h-[112px] [&>*]:h-full">
            <FireDetection />
          </div>
        </div>

        {/* Display Section */}
        <div className="w-full max-w-[1280px]">
          <Display
            setRosStatus={setRosStatus}
            setCameraStatus={setCameraStatus}
          />
        </div>

        {/* Control Section */}
        <div className="w-full max-w-[1280px]">
          <Control />
        </div>
      </main>

      <Setting />
    </div>
  );
};

export default Dashboard;