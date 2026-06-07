import React from "react";
import CameraView from "../components/CameraView";
import MapView from "./MapView";

const Display = () => {
  return (
    <section className="flex w-full max-w-[1500px] flex-col items-center justify-center gap-4 lg:flex-row lg:gap-5">
      <CameraView />
      <MapView />
    </section>
  );
};

export default Display;