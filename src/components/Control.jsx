import React, { useEffect, useRef, useState } from "react";
import * as ROSLIB from "roslib";
import Button from "./Button";
import JoyStick from "./JoyStick";
import SaveMap from "./buttons /SaveMap";
import AutoNavigate from "./buttons /SetGoalButton";

const Control = () => {
  const rosRef = useRef(null);
  const cmdVelRef = useRef(null);
  const odomTopicRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const [rosStatus, setRosStatus] = useState("Connecting...");
  const [velocity, setVelocity] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);

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

        odomTopicRef.current = new ROSLIB.Topic({
          ros,
          name: "/odom",
          messageType: "nav_msgs/Odometry",
        });

        odomTopicRef.current.subscribe((message) => {
          if (!isMountedRef.current) return;

          const linearX = message?.twist?.twist?.linear?.x || 0;
          const linearY = message?.twist?.twist?.linear?.y || 0;
          const angularZ = message?.twist?.twist?.angular?.z || 0;

          const currentVelocity = Math.sqrt(
            linearX * linearX + linearY * linearY
          );

          setVelocity(currentVelocity);
          setAngularVelocity(angularZ);
        });
      });

      ros.on("error", (error) => {
        console.error("❌ ROS error:", error);

        if (!isMountedRef.current) return;

        setRosStatus("Error");
      });

      ros.on("close", () => {
        if (!isMountedRef.current) return;

        console.log("🔁 ROS disconnected, retrying...");
        setRosStatus("Retrying...");

        cmdVelRef.current = null;

        if (odomTopicRef.current) {
          try {
            odomTopicRef.current.unsubscribe();
          } catch (error) {
            console.log(error);
          }
        }

        odomTopicRef.current = null;

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
        reconnectTimerRef.current = null;
      }

      try {
        if (odomTopicRef.current) {
          odomTopicRef.current.unsubscribe();
        }

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
      linear: {
        x: linearX,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: angularZ,
      },
    });
  };

  return (
    <section className="relative mx-auto w-full max-w-[1280px] rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl sm:p-5 lg:p-6">
      {/* Header */}
      {/* <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            🎮
          </div>

          <h2 className="text-base font-bold text-gray-900 sm:text-lg">
            Manual Control
          </h2>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            rosStatus === "Connected"
              ? "bg-green-100 text-green-700"
              : rosStatus === "Error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          ROS: {rosStatus}
        </div>
      </div> */}

      {/* Main Responsive Control Layout */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1.15fr_1fr_0.9fr]">
        {/* Joystick */}
        <div className="flex min-h-[190px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <JoyStick publish={publish} />
        </div>

        {/* Direction Buttons */}
        <div className="flex min-h-[190px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Button publish={publish} />
        </div>

        {/* Velocity Cards */}
        <div className="flex min-h-[190px] flex-col justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {/* Velocity */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 14l4-4" />
                  <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                  <path d="M12 19h.01" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Velocity</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {velocity.toFixed(1)}
                  <span className="ml-1 text-sm font-semibold text-gray-500">
                    m/s
                  </span>
                </h3>
              </div>
            </div>
          </div>

          {/* Angular Velocity */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Angular Velocity
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {angularVelocity.toFixed(1)}
                  <span className="ml-1 text-sm font-semibold text-gray-500">
                    rad/s
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex min-h-[190px] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm [&>*]:w-full">
          <h1 className="text-center font-bold">Action</h1>
          <SaveMap />
          <AutoNavigate />
        </div>
      </div>
    </section>
  );
};

export default Control;