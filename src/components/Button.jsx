import { MoveDown, MoveLeft, MoveRight, MoveUp } from "lucide-react";
import React, { useRef, useEffect } from "react";

const Button = ({ publish }) => {
  const intervalRef = useRef(null);
  const activeCommand = useRef(null);

  /* ================= CORE ROS PUBLISH ================= */

  const startPublishing = (linear, angular) => {
    const cmd = `${linear},${angular}`;
    if (activeCommand.current === cmd) return;

    stopPublishing();
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

        const A = gp.buttons[0]?.pressed;
        const B = gp.buttons[1]?.pressed;
        const X = gp.buttons[2]?.pressed;
        const Y = gp.buttons[3]?.pressed;

        const x = gp.axes[0];
        const y = gp.axes[1];

        if (Y) {
          startPublishing(0.5, 0);
        } else if (A) {
          startPublishing(-0.5, 0);
        } else if (X) {
          startPublishing(0, 0.5);
        } else if (B) {
          startPublishing(0, -0.5);
        } else if (y < -deadzone) {
          startPublishing(0.5, 0);
        } else if (y > deadzone) {
          startPublishing(-0.5, 0);
        } else if (x < -deadzone) {
          startPublishing(0, 0.5);
        } else if (x > deadzone) {
          startPublishing(0, -0.5);
        } else {
          stopPublishing();
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, []);

  /* ================= UI ================= */

  const controlBtn =
    "flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-md transition active:scale-95 sm:h-14 sm:w-14";

  return (
    <div className="flex min-h-[180px] w-full max-w-[260px] flex-col items-center justify-around gap-3">
      {/* UP */}
      <button
        className={controlBtn}
        onMouseDown={() => startPublishing(0.5, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
        onTouchStart={() => startPublishing(0.5, 0)}
        onTouchEnd={stopPublishing}
      >
        <MoveUp className="text-white" />
      </button>

      {/* LEFT + STOP + RIGHT */}
      <div className="flex w-full items-center justify-around gap-3">
        <button
          className={controlBtn}
          onMouseDown={() => startPublishing(0, 0.5)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
          onTouchStart={() => startPublishing(0, 0.5)}
          onTouchEnd={stopPublishing}
        >
          <MoveLeft className="text-white" />
        </button>

        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-md transition active:scale-95 sm:h-14 sm:w-14"
          onClick={stopPublishing}
        >
          <span className="text-xs font-bold text-white sm:text-sm">STOP</span>
        </button>

        <button
          className={controlBtn}
          onMouseDown={() => startPublishing(0, -0.5)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
          onTouchStart={() => startPublishing(0, -0.5)}
          onTouchEnd={stopPublishing}
        >
          <MoveRight className="text-white" />
        </button>
      </div>

      {/* DOWN */}
      <button
        className={controlBtn}
        onMouseDown={() => startPublishing(-0.5, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
        onTouchStart={() => startPublishing(-0.5, 0)}
        onTouchEnd={stopPublishing}
      >
        <MoveDown className="text-white" />
      </button>
    </div>
  );
};

export default Button;