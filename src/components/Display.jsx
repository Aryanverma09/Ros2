import React from "react";

const Display = () => {
  return (
    <div className="h-[60vh] w-[80vw] bg-amber-300 rounded-2xl flex justify-center items-center overflow-hidden">
      <img
        src="http://192.168.1.3:8080/stream?topic=camera/image_raw/compressed"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default Display;
