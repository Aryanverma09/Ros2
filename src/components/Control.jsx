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
        url: "ws://192.168.1.14:9090",
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
    <section className="relative mx-auto w-[min(96vw,80rem)] rounded-[clamp(1rem,2vw,1.5rem)] border border-gray-200 bg-white p-[clamp(0.75rem,1.4vw,1.5rem)] shadow-2xl">
  {/* Main Responsive Control Layout */}
  <div className="grid w-full grid-cols-1 gap-[clamp(0.75rem,1.4vw,1.25rem)] sm:grid-cols-2 xl:grid-cols-[minmax(180px,0.9fr)_minmax(220px,1.15fr)_minmax(220px,1fr)_minmax(180px,0.85fr)]">
    {/* Joystick */}
    <div className="flex min-h-[clamp(10rem,24dvh,15rem)] w-full items-center justify-center rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-200 bg-white p-[clamp(0.75rem,1.4vw,1rem)] shadow-sm">
      <JoyStick publish={publish} />
    </div>

    {/* Direction Buttons */}
    <div className="flex min-h-[clamp(10rem,24dvh,15rem)] w-full items-center justify-center rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-200 bg-white p-[clamp(0.75rem,1.4vw,1rem)] shadow-sm">
      <Button publish={publish} />
    </div>

    {/* Velocity Cards */}
    <div className="flex min-h-[clamp(10rem,24dvh,15rem)] w-full flex-col justify-center gap-[clamp(0.7rem,1.2vw,1rem)] rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-200 bg-white p-[clamp(0.75rem,1.4vw,1rem)] shadow-sm">
      {/* Velocity */}
      <div className="rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-100 bg-gray-50 p-[clamp(0.75rem,1.2vw,1rem)] shadow-sm">
        <div className="flex items-center gap-[clamp(0.75rem,1.5vw,1rem)]">
          <div className="flex size-[clamp(2.5rem,4vw,2.9rem)] shrink-0 items-center justify-center rounded-[clamp(0.8rem,1.3vw,1rem)] bg-white shadow-sm">
            <svg
              className="size-[clamp(1.25rem,2vw,1.5rem)] text-gray-700"
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

          <div className="min-w-0">
            <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-gray-500">
              Velocity
            </p>
            <h3 className="text-[clamp(1.35rem,2.4vw,1.6rem)] font-bold leading-tight text-gray-900">
              {velocity.toFixed(1)}
              <span className="ml-1 text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-gray-500">
                m/s
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Angular Velocity */}
      <div className="rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-100 bg-gray-50 p-[clamp(0.75rem,1.2vw,1rem)] shadow-sm">
        <div className="flex items-center gap-[clamp(0.75rem,1.5vw,1rem)]">
          <div className="flex size-[clamp(2.5rem,4vw,2.9rem)] shrink-0 items-center justify-center rounded-[clamp(0.8rem,1.3vw,1rem)] bg-white shadow-sm">
            <svg
              className="size-[clamp(1.25rem,2vw,1.5rem)] text-gray-700"
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

          <div className="min-w-0">
            <p className="text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-gray-500">
              Angular Velocity
            </p>
            <h3 className="text-[clamp(1.35rem,2.4vw,1.6rem)] font-bold leading-tight text-gray-900">
              {angularVelocity.toFixed(1)}
              <span className="ml-1 text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold text-gray-500">
                rad/s
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex min-h-[clamp(10rem,24dvh,15rem)] w-full flex-col items-center justify-center gap-[clamp(0.65rem,1.2vw,0.9rem)] rounded-[clamp(0.9rem,1.5vw,1.25rem)] border border-gray-200 bg-white p-[clamp(0.75rem,1.4vw,1rem)] shadow-sm [&>*]:w-full">
      <h1 className="text-center text-[clamp(0.9rem,1.5vw,1rem)] font-bold text-gray-900">
        Modes
      </h1>

      <SaveMap />
      <AutoNavigate />
    </div>
  </div>
</section>
  );
};

export default Control;