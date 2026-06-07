import React, { useEffect, useRef } from "react";
import * as ROSLIB from "roslib";
import Button from "./Button";
import JoyStick from "./JoyStick";
import SaveMap from "./buttons /SaveMap";
import AutoNavigate from "./buttons /WorkingButtons";

const Control = () => {
  const rosRef = useRef(null);
  const cmdVelRef = useRef(null);

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://localhost:9090",
    });

    ros.on("connection", () => {
      console.log("✅ Connected to ROS");
      cmdVelRef.current = new ROSLIB.Topic({
        ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist",
      });
    });

    ros.on("error", (e) => console.error("❌ ROS error", e));
    rosRef.current = ros;
  }, []);

  const publish = (linearX, angularZ) => {
    if (!cmdVelRef.current) return;

    cmdVelRef.current.publish({
      linear: { x: linearX, y: 0, z: 0 },
      angular: { x: 0, y: 0, z: angularZ },
    });
  };

  return (
    <section className="flex w-full max-w-[900px] flex-col items-center justify-center gap-5 rounded-2xl bg-gray-200 p-4 shadow-2xl sm:p-5 md:flex-row md:gap-4 lg:w-[60vw] xl:w-[50vw]">
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