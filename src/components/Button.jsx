import {
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
} from "lucide-react";
import React, { useRef, useEffect } from "react";

const Button = ({ publish }) => {
  const intervalRef = useRef(null);
  const activeCommand = useRef(null);

  /* ================= CORE ROS PUBLISH ================= */

  const startPublishing = (linear, angular) => {
    const cmd = `${linear},${angular}`;
    if (activeCommand.current === cmd) return;

    stopPublishing(); // safety
    activeCommand.current = cmd;

    intervalRef.current = setInterval(() => {
      publish(linear, angular);
    }, 100);
  };

  const stopPublishing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeCommand.current = null;
    publish(0, 0);
  };

  /* ================= CONTROLLER BINDING ================= */

  useEffect(() => {
    let animationId;

    const loop = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0]; // first controller

      if (gp) {
        const x = gp.axes[0]; // left stick X
        const y = gp.axes[1]; // left stick Y
        const deadzone = 0.25;

        // FORWARD / BACKWARD
        if (y < -deadzone) {
          startPublishing(1, 0);
        } 
        else if (y > deadzone) {
          startPublishing(-1, 0);
        }

        // LEFT / RIGHT TURN
        else if (x < -deadzone) {
          startPublishing(0, 1);
        } 
        else if (x > deadzone) {
          startPublishing(0, -1);
        }

        // STOP (B / Circle)
        else if (gp.buttons[1]?.pressed) {
          stopPublishing();
        }

        // IDLE
        else {
          stopPublishing();
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="h-full flex flex-col justify-around items-center w-full">

      {/* UP */}
      <button
        className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
        onMouseDown={() => startPublishing(1, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveUp className="text-white" />
      </button>

      {/* LEFT + STOP + RIGHT */}
      <div className="w-full flex justify-around items-center">
        <button
          className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
          onMouseDown={() => startPublishing(0, 1)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
        >
          <MoveLeft className="text-white" />
        </button>

        <button
          className="bg-red-600 h-14 w-14 rounded-full flex justify-center items-center"
          onClick={stopPublishing}
        >
          <span className="text-white font-bold">STOP</span>
        </button>

        <button
          className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
          onMouseDown={() => startPublishing(0, -1)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
        >
          <MoveRight className="text-white" />
        </button>
      </div>

      {/* DOWN */}
      <button
        className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
        onMouseDown={() => startPublishing(-1, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveDown className="text-white" />
      </button>

    </div>
  );
};

export default Button;
