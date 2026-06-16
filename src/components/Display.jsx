import React from "react";
import CameraView from "./CameraView";
import MapView from "./MapView";

const Display = ({ setRosStatus, setCameraStatus }) => {
  return (
    <section className="grid w-full max-w-[calc(100vw-2rem)] grid-cols-1 gap-5 lg:max-w-[calc(100vw-280px)] xl:grid-cols-2">
      <div className="min-w-0">
        <CameraView setCameraStatus={setCameraStatus} />
      </div>

      <div className="min-w-0">
        <MapView setRosStatus={setRosStatus} />
      </div>
    </section>
  );
};

export default Display;