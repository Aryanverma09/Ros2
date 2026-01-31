import React from "react";
import CameraView from "../components/CameraView";
import LidarView from "../components/LidarView";

const Display = () => {
  return (
    <div className="flex justify-center items-center gap-5">
      <CameraView />
      <LidarView />
    </div>
  );
};

export default Display;
