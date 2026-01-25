import React, { useEffect, useRef } from "react";
import * as ROSLIB from "roslib";
import Button from "./Button";
import JoyStick from "./JoyStick";

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
    <div className="h-[30vh] w-[30vw] bg-gray-200 shadow-2xl rounded-2xl flex justify-around items-center p-4">
      <div className=" w-1/2 h-full md:w-60 flex justify-center items-center">
        <JoyStick publish={publish} />
      </div>
      <div className=" w-1/2 h-full flex justify-center items-center">
        <Button publish={publish} />
      </div>
    </div>
  );
};

export default Control;
