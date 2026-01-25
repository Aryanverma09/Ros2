import React from "react";

const Display = () => {
  return (
    <div className="flex justify-center items-center gap-5">
      <div className="h-[50vh] w-[35vw] border-2 rounded-2xl flex justify-center items-center overflow-hidden">
        <img
        alt="Camera feed"
          src="http://localhost:8080/stream?topic=camera/image_raw&transport=compressed"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="h-[50vh] w-[35vw] border-2 rounded-2xl flex justify-center items-center overflow-hidden">
        <img
        alt="Map"
          src="http://localhost:8080/stream?topic=camera/image_raw&transport=compressed"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Display;
