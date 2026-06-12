import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

const FireDetection = ({ rosbridgeUrl = "ws://localhost:9090" }) => {
  const [connected, setConnected] = useState(false);
  const [fireDetected, setFireDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: rosbridgeUrl,
    });

    ros.on("connection", () => {
      setConnected(true);
      console.log("Connected to rosbridge for fire detection");
    });

    ros.on("error", (error) => {
      setConnected(false);
      console.error("ROS fire detection connection error:", error);
    });

    ros.on("close", () => {
      setConnected(false);
      console.log("ROS fire detection connection closed");
    });

    const fireTopic = new ROSLIB.Topic({
      ros,
      name: "/fire_detected",
      messageType: "std_msgs/msg/Bool",
    });

    fireTopic.subscribe((message) => {
      const detected = Boolean(message.data);

      setFireDetected(detected);

      if (!detected) {
        setDismissed(false);
      }
    });

    return () => {
      fireTopic.unsubscribe();
      ros.close();
    };
  }, [rosbridgeUrl]);

  return (
    <div className="relative h-full">
      {/* Fire Detection Card */}
      <div
        className={`flex h-full min-h-[112px] rounded-2xl border bg-white p-4 shadow-xl transition-all duration-300 ${
          fireDetected
            ? "border-red-400 shadow-red-200"
            : "border-gray-200"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-gray-900">
              Fire Detection
            </h2>

            <p
              className={`mt-1 truncate text-sm font-bold ${
                fireDetected
                  ? "text-red-600"
                  : connected
                    ? "text-green-600"
                    : "text-yellow-600"
              }`}
            >
              {fireDetected
                ? "Fire Detected"
                : connected
                  ? "Scanning..."
                  : "Retrying..."}
            </p>

            <p className="mt-3 line-clamp-2 text-xs font-medium text-gray-500">
              {fireDetected
                ? "Fire detected in camera view"
                : connected
                  ? "No fire detected"
                  : "Waiting for ROS connection"}
            </p>
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
              fireDetected
                ? "bg-red-100 text-red-600"
                : connected
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {fireDetected ? "🔥" : connected ? "🟢" : "⚠️"}
          </div>
        </div>
      </div>

      {/* Small Toast Alert */}
      {fireDetected && !dismissed && (
        <div className="pointer-events-none fixed right-6 top-24 z-[9999] w-[320px] max-w-[calc(100vw-3rem)]">
          <div className="pointer-events-auto rounded-2xl border border-red-300 bg-red-600 p-4 text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl">
                🔥
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-extrabold">
                    Fire Detected
                  </h2>

                  <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="rounded-full px-2 text-lg leading-none text-white/80 hover:bg-white/20 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-1 text-sm font-medium text-red-50">
                  TurtleBot camera detected fire in the environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireDetection;