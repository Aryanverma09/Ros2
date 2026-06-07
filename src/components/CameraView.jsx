import React from "react";

const CameraView = () => {
  return (
    <div className="flex h-[280px] w-full max-w-[680px] items-center justify-center overflow-hidden rounded-2xl border-2 border-black bg-black shadow-lg sm:h-[340px] lg:h-[50vh] lg:w-[45vw] xl:w-[35vw]">
      <img
        alt="Camera feed"
        src="http://localhost:8080/stream?topic=/camera/image_raw&transport=compressed"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default CameraView;