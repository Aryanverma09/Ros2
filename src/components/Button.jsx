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
    const gp = navigator.getGamepads()[0];

    if (gp) {
      const deadzone = 0.25;

      // 🎮 Buttons
      const A = gp.buttons[0]?.pressed; // Backward
      const B = gp.buttons[1]?.pressed; // Rotate Right
      const X = gp.buttons[2]?.pressed; // Rotate Left
      const Y = gp.buttons[3]?.pressed; // Forward

      const x = gp.axes[0]; // Left stick X
      const y = gp.axes[1]; // Left stick Y

      // 🔥 BUTTON PRIORITY
      if (Y) {
        startPublishing(0.5, 0);       // Forward
      }
      else if (A) {
        startPublishing(-0.5, 0);      // Backward
      }
      else if (X) {
        startPublishing(0,0.5);       // Rotate Left
      }
      else if (B) {
        startPublishing(0, -0.5);      // Rotate Right
      }

      // 🕹️ JOYSTICK FALLBACK
      else if (y < -deadzone) {
        startPublishing(0.5, 0);
      } 
      else if (y > deadzone) {
        startPublishing(-0.5, 0);
      }
      else if (x < -deadzone) {
        startPublishing(0, 0.5);
      } 
      else if (x > deadzone) {
        startPublishing(0, -0.5);
      }

      // 🧍 IDLE
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
        onMouseDown={() => startPublishing(0.5, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveUp className="text-white" />
      </button>

      {/* LEFT + STOP + RIGHT */}
      <div className="w-full flex justify-around items-center">
        <button
          className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
          onMouseDown={() => startPublishing(0, 0.5)}
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
          onMouseDown={() => startPublishing(0, -0.5)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
        >
          <MoveRight className="text-white" />
        </button>
      </div>

      {/* DOWN */}
      <button
        className="bg-black h-14 w-14 rounded-full flex justify-center items-center"
        onMouseDown={() => startPublishing(-0.5, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveDown className="text-white" />
      </button>

    </div>
  );
};

export default Button;
  