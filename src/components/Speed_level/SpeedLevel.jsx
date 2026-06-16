import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

const SpeedLevel = ({ rosbridgeUrl = "ws://localhost:9090" }) => {
  const [speed, setSpeed] = useState(0);
  const [angularSpeed, setAngularSpeed] = useState(0);
  const [connected, setConnected] = useState(false);

  const maxSpeed = 0.5;

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: rosbridgeUrl });

    ros.on("connection", () => {
      setConnected(true);
    });

    ros.on("error", () => {
      setConnected(false);
    });

    ros.on("close", () => {
      setConnected(false);
    });

    const odomTopic = new ROSLIB.Topic({
      ros,
      name: "/odom",
      messageType: "nav_msgs/msg/Odometry",
    });

    odomTopic.subscribe((msg) => {
      const vx = msg.twist.twist.linear.x || 0;
      const vy = msg.twist.twist.linear.y || 0;
      const wz = msg.twist.twist.angular.z || 0;

      const linearSpeed = Math.sqrt(vx * vx + vy * vy);

      setSpeed(linearSpeed);
      setAngularSpeed(Math.abs(wz));
    });

    return () => {
      odomTopic.unsubscribe();
      ros.close();
    };
  }, [rosbridgeUrl]);

  const speedPercent = Math.min((speed / maxSpeed) * 100, 100);

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold leading-none text-slate-800">
            Speed
          </h2>

          <p className="mt-1 truncate text-xs font-bold text-blue-600">
            {speed.toFixed(2)} m/s
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm text-blue-600">
          🏎️
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${speedPercent}%` }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500">
        <span className="truncate">
          {connected ? "ROS Connected" : "ROS Connecting..."}
        </span>
        <span className="shrink-0">{angularSpeed.toFixed(2)} rad/s</span>
      </div>
    </div>
  );
};

export default SpeedLevel;