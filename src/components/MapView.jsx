import React, { useEffect, useRef, useState } from "react";
import * as ROSLIB from "roslib";

const ROSBRIDGE_URL = "ws://localhost:9090";

const MapView = ({ setRosStatus = () => {} }) => {
  const canvasRef = useRef(null);

  const rosRef = useRef(null);
  const mapTopicRef = useRef(null);
  const poseTopicRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const mapRef = useRef(null);
  const robotPoseRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");

  const updateRosStatus = (value) => {
    setStatus(value);
    setRosStatus(value);
  };

  const quaternionToYaw = (q) => {
    const siny = 2 * (q.w * q.z + q.x * q.y);
    const cosy = 1 - 2 * (q.y * q.y + q.z * q.z);
    return Math.atan2(siny, cosy);
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return {
      ctx,
      width: rect.width,
      height: rect.height,
    };
  };

  const getTransform = (width, height, info) => {
    const mapWidth = info.width * info.resolution;
    const mapHeight = info.height * info.resolution;

    const padding = 20;

    const scale = Math.min(
      (width - padding * 2) / mapWidth,
      (height - padding * 2) / mapHeight
    );

    return {
      scale,
      offsetX: (width - mapWidth * scale) / 2,
      offsetY: (height - mapHeight * scale) / 2,
    };
  };

  const worldToCanvas = (x, y, info, transform) => {
    const res = info.resolution;

    const mapX = (x - info.origin.position.x) / res;
    const mapY = (y - info.origin.position.y) / res;

    return {
      x: transform.offsetX + mapX * res * transform.scale,
      y: transform.offsetY + (info.height - mapY) * res * transform.scale,
    };
  };

  const drawRobot = (ctx, pose, info, transform, canvasWidth) => {
    if (!pose) return;

    const point = worldToCanvas(
      pose.position.x,
      pose.position.y,
      info,
      transform
    );

    const yaw = quaternionToYaw(pose.orientation);

    const robotRadius = Math.max(8, Math.min(16, canvasWidth / 55));
    const directionLength = robotRadius * 2.4;

    ctx.beginPath();
    ctx.arc(point.x, point.y, robotRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(
      point.x + Math.cos(-yaw) * directionLength,
      point.y + Math.sin(-yaw) * directionLength
    );
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const redraw = () => {
    const canvasData = setupCanvas();
    const map = mapRef.current;

    if (!canvasData || !map) return;

    const { ctx, width, height } = canvasData;
    const info = map.info;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#d1d5db";
    ctx.fillRect(0, 0, width, height);

    const transform = getTransform(width, height, info);
    const cellSize = Math.max(1, info.resolution * transform.scale);

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const value = map.data[x + y * info.width];

        if (value === 0) {
          ctx.fillStyle = "#ffffff";
        } else if (value >= 65) {
          ctx.fillStyle = "#020617";
        } else {
          continue;
        }

        const point = worldToCanvas(
          info.origin.position.x + x * info.resolution,
          info.origin.position.y + y * info.resolution,
          info,
          transform
        );

        ctx.fillRect(point.x, point.y - cellSize, cellSize, cellSize);
      }
    }

    drawRobot(ctx, robotPoseRef.current, info, transform, width);
  };

  const scheduleRedraw = () => {
    if (animationFrameRef.current) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      redraw();
    });
  };

  useEffect(() => {
    let isMounted = true;

    const cleanupTopics = () => {
      try {
        mapTopicRef.current?.unsubscribe();
        poseTopicRef.current?.unsubscribe();
      } catch (error) {
        console.log(error);
      }

      mapTopicRef.current = null;
      poseTopicRef.current = null;
    };

    const scheduleReconnect = () => {
      if (!isMounted || reconnectTimerRef.current) return;

      updateRosStatus("Retrying...");

      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        connectToRos();
      }, 2000);
    };

    const connectToRos = () => {
      if (!isMounted) return;

      updateRosStatus("Connecting...");

      try {
        rosRef.current = new ROSLIB.Ros({
          url: ROSBRIDGE_URL,
        });

        rosRef.current.on("connection", () => {
          if (!isMounted) return;

          updateRosStatus("Connected");
          cleanupTopics();

          mapTopicRef.current = new ROSLIB.Topic({
            ros: rosRef.current,
            name: "/map",
            messageType: "nav_msgs/OccupancyGrid",
          });

          poseTopicRef.current = new ROSLIB.Topic({
            ros: rosRef.current,
            name: "/odom",
            messageType: "nav_msgs/Odometry",
          });

          mapTopicRef.current.subscribe((msg) => {
            mapRef.current = msg;
            scheduleRedraw();
          });

          poseTopicRef.current.subscribe((msg) => {
            robotPoseRef.current = msg.pose.pose;
            scheduleRedraw();
          });
        });

        rosRef.current.on("error", () => {
          if (!isMounted) return;

          updateRosStatus("Error");

          try {
            rosRef.current?.close();
          } catch (error) {
            console.log(error);
          }

          scheduleReconnect();
        });

        rosRef.current.on("close", () => {
          if (!isMounted) return;

          cleanupTopics();
          updateRosStatus("Disconnected");
          scheduleReconnect();
        });
      } catch (error) {
        console.log(error);
        updateRosStatus("Error");
        scheduleReconnect();
      }
    };

    connectToRos();

    const resizeObserver = new ResizeObserver(() => {
      scheduleRedraw();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      isMounted = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      resizeObserver.disconnect();
      cleanupTopics();

      try {
        rosRef.current?.close();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div className="relative h-[34vh] min-h-[260px] max-h-[520px] w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-300 shadow-lg lg:h-[42vh] lg:max-w-[calc(100vw-280px)]">
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Map: {status}
      </div>

      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          imageRendering: "pixelated",
        }}
      />

      {!mapRef.current && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-white/20 bg-black/70 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur-md">
            Waiting for /map
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;