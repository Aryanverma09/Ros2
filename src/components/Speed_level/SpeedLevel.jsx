import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

const SpeedLevel = ({ rosbridgeUrl = "ws://localhost:9090" }) => {
  const [speed, setSpeed] = useState(0);
  const [angularSpeed, setAngularSpeed] = useState(0);
  const [connected, setConnected] = useState(false);

  const maxSpeed = .50; // TurtleBot3 safe max speed approx for UI bar

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: rosbridgeUrl,
    });

    ros.on("connection", () => {
      setConnected(true);
      console.log("Connected to rosbridge for speed");
    });

    ros.on("error", (err) => {
      setConnected(false);
      console.error("ROS speed connection error:", err);
    });

    ros.on("close", () => {
      setConnected(false);
      console.log("ROS speed connection closed");
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
    <div className="self-start rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-gray-700">Speed</h1>

          <p className="text-sm font-bold text-blue-600">
            {speed.toFixed(2)} m/s
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-sm text-blue-600">
          🏎️
        </div>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{
            width: `${speedPercent}%`,
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{connected ? "ROS Connected" : "ROS Connecting..."}</span>
        <span>{angularSpeed.toFixed(2)} rad/s</span>
      </div>
    </div>
  );
};

export default SpeedLevel;