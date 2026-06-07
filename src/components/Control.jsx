import React, { useEffect, useRef, useState } from "react";
import * as ROSLIB from "roslib";
import Button from "./Button";
import JoyStick from "./JoyStick";
import SaveMap from "./buttons /SaveMap";
import AutoNavigate from "./buttons /WorkingButtons";

const Control = () => {
  const rosRef = useRef(null);
  const cmdVelRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const [rosStatus, setRosStatus] = useState("Connecting...");

  useEffect(() => {
    isMountedRef.current = true;

    const connectToRos = () => {
      if (!isMountedRef.current) return;

      setRosStatus("Connecting...");

      const ros = new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });

      rosRef.current = ros;

      ros.on("connection", () => {
        if (!isMountedRef.current) return;

        console.log("✅ Connected to ROS");
        setRosStatus("Connected");

        cmdVelRef.current = new ROSLIB.Topic({
          ros,
          name: "/cmd_vel",
          messageType: "geometry_msgs/Twist",
        });
      });

      ros.on("error", (e) => {
        console.error("❌ ROS error", e);

        if (!isMountedRef.current) return;

        setRosStatus("Error");
      });

      ros.on("close", () => {
        if (!isMountedRef.current) return;

        console.log("🔁 ROS disconnected, retrying...");
        setRosStatus("Retrying...");
        cmdVelRef.current = null;

        if (!reconnectTimerRef.current) {
          reconnectTimerRef.current = setTimeout(() => {
            reconnectTimerRef.current = null;
            connectToRos();
          }, 2000);
        }
      });
    };

    connectToRos();

    return () => {
      isMountedRef.current = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      try {
        if (rosRef.current) {
          rosRef.current.close();
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  const publish = (linearX, angularZ) => {
    if (!cmdVelRef.current) {
      console.log("ROS not connected yet");
      return;
    }

    cmdVelRef.current.publish({
      linear: { x: linearX, y: 0, z: 0 },
      angular: { x: 0, y: 0, z: angularZ },
    });
  };

  return (
    <section className="relative flex w-full max-w-[900px] flex-col items-center justify-center gap-5 rounded-2xl bg-gray-200 p-4 shadow-2xl sm:p-5 md:flex-row md:gap-4 lg:w-[60vw] xl:w-[50vw]">
      <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
        ROS: {rosStatus}
      </div>

      <div className="flex w-full items-center justify-center md:w-1/3">
        <JoyStick publish={publish} />
      </div>

      <div className="flex w-full items-center justify-center md:w-1/3">
        <Button publish={publish} />
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-3 md:w-1/3">
        <SaveMap />
        <AutoNavigate />
      </div>
    </section>
  );
};

export default Control;