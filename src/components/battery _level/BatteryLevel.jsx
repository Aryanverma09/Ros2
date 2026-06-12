import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

const BatteryLevel = ({ rosbridgeUrl = "ws://localhost:9090" }) => {
  const [battery, setBattery] = useState(null);
  const [voltage, setVoltage] = useState(null);
  const [current, setCurrent] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: rosbridgeUrl,
    });

    ros.on("connection", () => {
      setConnected(true);
      setError("");
      console.log("Connected to rosbridge for battery");
    });

    ros.on("error", (err) => {
      setConnected(false);
      setError("ROS connection error");
      console.error("ROS battery connection error:", err);
    });

    ros.on("close", () => {
      setConnected(false);
      console.log("ROS battery connection closed");
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
      setVoltage(msg.voltage?.toFixed(2));
      setCurrent(msg.current?.toFixed(2));
    });

    return () => {
      batteryTopic.unsubscribe();
      ros.close();
    };
  }, [rosbridgeUrl]);

  const getBatteryColor = () => {
    if (battery === null) return "bg-gray-400";
    if (battery > 60) return "bg-green-500";
    if (battery > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (battery === null) return "text-gray-500";
    if (battery > 60) return "text-green-600";
    if (battery > 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="self-start rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-gray-700">
            Battery Level
          </h1>

          <p className={`text-sm font-bold ${getTextColor()}`}>
            {battery !== null ? `${battery}%` : "Waiting..."}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm ${
            battery === null
              ? "bg-gray-100 text-gray-600"
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

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBatteryColor()}`}
          style={{
            width: `${battery !== null ? battery : 0}%`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{connected ? "ROS Connected" : "ROS Connecting..."}</span>
        <span>{voltage ? `${voltage}V` : "--V"}</span>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default BatteryLevel;