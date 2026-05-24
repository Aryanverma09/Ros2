import React from "react";
import CameraView from "../components/CameraView";
import LidarView from "../components/LidarView";
import MapView from "./MapView";

const Display = () => {
  return (
    <div className="flex justify-center items-center gap-5">
      <CameraView />
      {/* <LidarView /> */}
      <MapView/>
    </div>
  );
};

export default Display;
