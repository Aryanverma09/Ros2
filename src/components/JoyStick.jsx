import React, { useRef } from "react";
import { Joystick } from "react-joystick-component";

const MAX_LINEAR = 0.5;    // Forward / backward speed
const MAX_ANGULAR = 0.5;  // Left / right rotation speed
const DEAD_ZONE = 0.15;   // Ignore small joystick movement

const JoyStick = ({ publish }) => {
  const lastSent = useRef({ x: 0, z: 0 });

  const handleMove = (event) => {
    if (!publish) return;

    // Normalize joystick values (-1 to 1)
    let normX = event.x ;
    let normY = event.y ;

    // Dead zone to prevent jitter
    if (Math.abs(normX) < DEAD_ZONE) normX = 0;
    if (Math.abs(normY) < DEAD_ZONE) normY = 0;

    // Correct ROS directions
    const linearX = normY * MAX_LINEAR;     // UP → forward
    const angularZ = -normX * MAX_ANGULAR;  // LEFT → left

    // Avoid sending duplicate values
    if (
      lastSent.current.x === linearX &&
      lastSent.current.z === angularZ
    ) {
      return;
    }

    lastSent.current = { x: linearX, z: angularZ };
    publish(linearX, angularZ);
  };

  const handleStop = () => {
    lastSent.current = { x: 0, z: 0 };
    publish(0, 0); // STOP robot
  };

  return (
    <div className="flex justify-center items-center">
      <Joystick
        size={120}
        baseColor="#000"
        stickColor="#fff"
        move={handleMove}
        stop={handleStop}
      />
    </div>
  );
};

export default JoyStick;
