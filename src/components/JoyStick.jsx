import React, { useRef } from "react";
import { Joystick } from "react-joystick-component";

const MAX_LINEAR = 1.5;
const MAX_ANGULAR = 1.5;
const DEAD_ZONE = 0.15;

const JoyStick = ({ publish }) => {
  const lastSent = useRef({ x: 0, z: 0 });

  const handleMove = (event) => {
    if (!publish) return;

    let normX = event.x;
    let normY = event.y;

    if (Math.abs(normX) < DEAD_ZONE) normX = 0;
    if (Math.abs(normY) < DEAD_ZONE) normY = 0;

    const linearX = normY * MAX_LINEAR;
    const angularZ = -normX * MAX_ANGULAR;

    if (lastSent.current.x === linearX && lastSent.current.z === angularZ) {
      return;
    }

    lastSent.current = { x: linearX, z: angularZ };
    publish(linearX, angularZ);
  };

  const handleStop = () => {
    lastSent.current = { x: 0, z: 0 };
    publish(0, 0);
  };

  return (
    <div className="flex min-h-[140px] w-full items-center justify-center">
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