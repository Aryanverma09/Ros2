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
    });

    ros.on("error", () => {
      setConnected(false);
    });

    ros.on("close", () => {
      setConnected(false);
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

  const statusText = fireDetected
    ? "Fire Detected"
    : connected
      ? "Scanning..."
      : "Retrying...";

  const subText = fireDetected
    ? "Alert active"
    : connected
      ? "No fire detected"
      : "Waiting for robot";

  const cardColor = fireDetected
    ? "border-red-300 bg-red-50"
    : "border-slate-200 bg-white";

  const iconColor = fireDetected
    ? "bg-red-100 text-red-600"
    : connected
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";

  const textColor = fireDetected
    ? "text-red-600"
    : connected
      ? "text-green-600"
      : "text-yellow-600";

  return (
    <>
      <div
        className={`relative flex h-full min-h-0 w-full overflow-hidden rounded-2xl border p-3 shadow-sm ${cardColor}`}
      >
        <div className="min-w-0 pr-11">
          <h2 className="truncate text-sm font-bold leading-none text-slate-900">
            Fire Detection
          </h2>

          <p className={`mt-1 truncate text-xs font-bold ${textColor}`}>
            {statusText}
          </p>

          <p className="mt-1 truncate text-[11px] font-medium text-slate-500">
            {subText}
          </p>
        </div>

        <div
          className={`absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-sm ${iconColor}`}
        >
          {fireDetected ? "🔥" : connected ? "●" : "⚠️"}
        </div>
      </div>

      {fireDetected && !dismissed && (
        <div className="pointer-events-none fixed right-6 top-24 z-[9999] w-[320px] max-w-[calc(100vw-3rem)]">
          <div className="pointer-events-auto rounded-2xl border border-red-300 bg-red-600 p-4 text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl">
                🔥
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-extrabold">Fire Detected</h2>

                  <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="rounded-full px-2 text-lg leading-none text-white/80 hover:bg-white/20 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-1 text-sm font-medium text-red-50">
                  Robot camera detected fire in the environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FireDetection;