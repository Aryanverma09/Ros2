import React from "react";

const CameraView = () => {
  return (
    <div className="h-[50vh] w-[35vw] border-2 rounded-2xl flex justify-center items-center overflow-hidden">
      <img
        alt="Camera feed"
        src="http://localhost:8080/stream?topic=camera/image_raw&transport=compressed"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default CameraView;
