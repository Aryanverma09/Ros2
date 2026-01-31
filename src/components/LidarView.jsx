import React, { useEffect, useRef } from "react";
import * as ROSLIB from "roslib";


const LidarView = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://localhost:9090",
    });

    ros.on("connection", () => {
      console.log("✅ Connected to ROS 2");
    });

    ros.on("error", (error) => {
      console.error("❌ ROS error:", error);
    });

    const scanTopic = new ROSLIB.Topic({
      ros,
      name: "/scan",
      messageType: "sensor_msgs/LaserScan",
    });

    scanTopic.subscribe((msg) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = "black";

      const scale = 80; // 🔥 increase to zoom (60–80 if needed)

      msg.ranges.forEach((range, i) => {
        if (range > msg.range_min && range < msg.range_max) {
          const angle =
            msg.angle_min + i * msg.angle_increment;

          const x =
            centerX + range * Math.cos(angle) * scale;
          const y =
            centerY - range * Math.sin(angle) * scale;

          ctx.fillRect(x, y, 2, 2);
        }
      });
    });

    return () => {
      scanTopic.unsubscribe();
      ros.close();
    };
  }, []);

  return (
    <div className="h-[50vh] w-[35vw] border-2 rounded-2xl flex justify-center items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full bg-white"
      />
    </div>
  );
};

export default LidarView;
