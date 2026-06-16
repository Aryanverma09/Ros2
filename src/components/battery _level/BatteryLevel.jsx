import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

const BatteryLevel = ({ rosbridgeUrl = "ws://localhost:9090" }) => {
  const [battery, setBattery] = useState(null);
  const [voltage, setVoltage] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: rosbridgeUrl });

    ros.on("connection", () => {
      setConnected(true);
      setError("");
    });

    ros.on("error", () => {
      setConnected(false);
      setError("Battery error");
    });

    ros.on("close", () => {
      setConnected(false);
    });

    const batteryTopic = new ROSLIB.Topic({
      ros,
      name: "/battery_state",
      messageType: "sensor_msgs/msg/BatteryState",
    });

    batteryTopic.subscribe((msg) => {
      let percent = msg.percentage;

      if (percent <= 1) {
        percent = Math.round(percent * 100);
      } else {
        percent = Math.round(percent);
      }

      setBattery(percent);
      setVoltage(msg.voltage ? msg.voltage.toFixed(1) : null);
    });

    return () => {
      batteryTopic.unsubscribe();
      ros.close();
    };
  }, [rosbridgeUrl]);

  const getBatteryColor = () => {
    if (battery === null) return "bg-slate-300";
    if (battery > 60) return "bg-green-500";
    if (battery > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (battery === null) return "text-slate-500";
    if (battery > 60) return "text-green-600";
    if (battery > 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold leading-none text-slate-800">
            Battery Level
          </h2>

          <p className={`mt-1 truncate text-xs font-bold ${getTextColor()}`}>
            {battery !== null ? `${battery}%` : "Waiting..."}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
            battery === null
              ? "bg-slate-100 text-slate-500"
              : battery > 60
              ? "bg-green-100 text-green-600"
              : battery > 30
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          🔋
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBatteryColor()}`}
          style={{ width: `${battery !== null ? battery : 0}%` }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500">
        <span className="truncate">
          {error ? error : connected ? "Battery Connected" : "Battery Connecting..."}
        </span>
        <span className="shrink-0">{voltage ? `${voltage}V` : "--V"}</span>
      </div>
    </div>
  );
};

export default BatteryLevel;