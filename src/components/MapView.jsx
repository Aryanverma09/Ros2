import React, { useEffect, useRef, useState } from "react";
import * as ROSLIB from "roslib";

const MapView = ({setRosStatus}) => {
  const canvasRef = useRef(null);

  const mapRef = useRef(null);
  const robotPoseRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");

  // QUATERNION → YAW
  const quaternionToYaw = (q) => {
    const siny = 2 * (q.w * q.z + q.x * q.y);

    const cosy = 1 - 2 * (q.y * q.y + q.z * q.z);

    return Math.atan2(siny, cosy);
  };

  // MAP SCALE + CENTER
  const getTransform = (canvas, info) => {
    const mapWidth = info.width * info.resolution;

    const mapHeight = info.height * info.resolution;

    const padding = 20;

    const scale = Math.min(
      (canvas.width - padding * 2) / mapWidth,
      (canvas.height - padding * 2) / mapHeight,
    );

    return {
      scale,

      offsetX: (canvas.width - mapWidth * scale) / 2,

      offsetY: (canvas.height - mapHeight * scale) / 2,
    };
  };

  // WORLD → CANVAS
  const worldToCanvas = (x, y, info, transform) => {
    const res = info.resolution;

    const mapX = (x - info.origin.position.x) / res;

    const mapY = (y - info.origin.position.y) / res;

    return {
      x: transform.offsetX + mapX * res * transform.scale,

      y: transform.offsetY + (info.height - mapY) * res * transform.scale,
    };
  };

  // DRAW ROBOT
  const drawRobot = (ctx, pose, info, transform) => {
    if (!pose) return;

    const point = worldToCanvas(
      pose.position.x,
      pose.position.y,
      info,
      transform,
    );

    const yaw = quaternionToYaw(pose.orientation);

    ctx.beginPath();

    ctx.arc(point.x, point.y, 18, 0, Math.PI * 2);

    ctx.fillStyle = "red";
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.stroke();

    // DIRECTION
    ctx.beginPath();

    ctx.moveTo(point.x, point.y);

    ctx.lineTo(point.x + Math.cos(-yaw) * 45, point.y + Math.sin(-yaw) * 45);

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 5;
    ctx.stroke();
  };

  // DRAW EVERYTHING
  const redraw = () => {
    const canvas = canvasRef.current;
    const map = mapRef.current;

    if (!canvas || !map) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#d1d5db";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const info = map.info;

    const transform = getTransform(canvas, info);

    const cellSize = Math.max(2, info.resolution * transform.scale);

    // MAP
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const value = map.data[x + y * info.width];

        if (value === 0) ctx.fillStyle = "#ffffff";
        else if (value > 65) ctx.fillStyle = "#000000";
        else continue;

        const point = worldToCanvas(
          info.origin.position.x + x * info.resolution,
          info.origin.position.y + y * info.resolution,
          info,
          transform,
        );

        ctx.fillRect(point.x, point.y, cellSize, cellSize);
      }
    }

    // ROBOT
    drawRobot(ctx, robotPoseRef.current, info, transform);
  };

  // ROS
  useEffect(() => {
    let ros = null;
    let mapTopic = null;
    let poseTopic = null;
    let reconnectTimer = null;
    let isMounted = true;

    const cleanupTopics = () => {
      try {
        if (mapTopic) mapTopic.unsubscribe();
        if (poseTopic) poseTopic.unsubscribe();
      } catch (error) {
        console.log(error);
      }

      mapTopic = null;
      poseTopic = null;
    };

    const scheduleReconnect = () => {
      if (!isMounted || reconnectTimer) return;

      setStatus("Retrying...");
      setRosStatus("Retrying...");

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectToRos();
      }, 2000);
    };

    const connectToRos = () => {
      if (!isMounted) return;

      setStatus("Connecting...");
      // setRosStatus("Connecting...");

      ros = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });

      ros.on("connection", () => {
        if (!isMounted) return;

        setStatus("Connected");
        setRosStatus("Connected");

        cleanupTopics();

        // MAP
        mapTopic = new ROSLIB.Topic({
          ros,
          name: "/map",
          messageType: "nav_msgs/OccupancyGrid",
        });

        // ROBOT POSITION
        poseTopic = new ROSLIB.Topic({
          ros,
          name: "/odom",
          messageType: "nav_msgs/Odometry",
        });

        mapTopic.subscribe((msg) => {
          mapRef.current = msg;
          redraw();
        });

        poseTopic.subscribe((msg) => {
          robotPoseRef.current = msg.pose.pose;
          redraw();
        });
      });

      ros.on("error", () => {
        if (!isMounted) return;
        setStatus("Error");
        setRosStatus("Error");
      });

      ros.on("close", () => {
        if (!isMounted) return;

        cleanupTopics();
        setStatus("Disconnected");
        setRosStatus("Disconnected");
        scheduleReconnect();
      });
    };

    connectToRos();

    window.addEventListener("resize", redraw);

    return () => {
      isMounted = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      cleanupTopics();

      window.removeEventListener("resize", redraw);

      try {
        if (ros) ros.close();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div className="relative h-[280px] w-full max-w-[680px] overflow-hidden rounded-2xl border-2 border-black bg-gray-300 shadow-lg sm:h-[340px] lg:h-[45vh] lg:w-[62vw] xl:w-[55vw]">
      {/* STATUS */}
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
        {status}
      </div>

      {/* MAP */}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

export default MapView;
