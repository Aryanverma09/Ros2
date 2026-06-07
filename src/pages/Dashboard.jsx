import React from "react";
import Display from "../components/Display";
import Control from "../components/Control";
import Setting from "../components/Settings/Setting";

const Dashboard = () => {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-white">
      {/* Main Dashboard Area */}
      <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-5 px-3 py-5 sm:gap-6 sm:px-5 lg:gap-8 lg:px-8">
        {/* Status Bar */}
        <div className="nav flex min-h-12 w-full max-w-[720px] flex-wrap items-center justify-center gap-3 rounded-2xl bg-gray-500 px-4 py-3 text-center text-xs uppercase text-white shadow-2xl sm:text-sm md:justify-around md:text-base">
          <h1>✅ ROS Connection</h1>
          <h1>✅ Camera Connection</h1>
        </div>

        <Display />
        <Control />
      </main>

      {/* Floating Settings */}
      <Setting />
    </div>
  );
};

export default Dashboard;