import {
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
  Square,
} from "lucide-react";
import React, { useRef } from "react";

const Button = ({ publish }) => {
  const intervalRef = useRef(null);

  const startPublishing = (linear, angular) => {
    stopPublishing(); // safety
    intervalRef.current = setInterval(() => {
      publish(linear, angular);
    }, 100);
  };

  const stopPublishing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    publish(0, 0);
  };

  return (
    <div className="h-full flex flex-col justify-around items-center w-full">

      {/* UP */}
      <button
        className="bg-amber-400 h-14 w-14 rounded-full flex justify-center items-center"
        onMouseDown={() => startPublishing(1, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveUp />
      </button>

      {/* LEFT + STOP + RIGHT */}
      <div className="w-full flex justify-around items-center">
        <button
          className="bg-amber-400 h-14 w-14 rounded-full flex justify-center items-center"
          onMouseDown={() => startPublishing(0, 1)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
        >
          <MoveLeft />
        </button>

        <button
          className="bg-amber-400 h-14 w-14 rounded-full flex justify-center items-center"
          onClick={stopPublishing}
        >
          <Square />
        </button>

        <button
          className="bg-amber-400 h-14 w-14 rounded-full flex justify-center items-center"
          onMouseDown={() => startPublishing(0, -1)}
          onMouseUp={stopPublishing}
          onMouseLeave={stopPublishing}
        >
          <MoveRight />
        </button>
      </div>

      {/* DOWN */}
      <button
        className="bg-amber-400 h-14 w-14 rounded-full flex justify-center items-center"
        onMouseDown={() => startPublishing(-1, 0)}
        onMouseUp={stopPublishing}
        onMouseLeave={stopPublishing}
      >
        <MoveDown />
      </button>

    </div>
  );
};

export default Button;
