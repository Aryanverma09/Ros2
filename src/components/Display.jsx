import React from "react";

const Display = () => {
  return (
    <div className="h-[60vh] w-[80vw] bg-amber-300 rounded-2xl flex justify-center items-center overflow-hidden">
      <img
        src="http://localhost:8080/stream?topic=camera/image_raw&transport=compressed"
        alt="TurtleBot3 Camera"
        className="h-full w-full object-cover rounded-2xl"
      />
    </div>
  );
};

export default Display;
