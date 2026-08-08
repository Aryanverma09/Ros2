import React, { useEffect, useRef, useState } from "react";

const STREAM_URL =
  "http://192.168.1.14:8080/stream?topic=/image_raw&transport=compressed";

const CameraView = ({ setCameraStatus = () => {} }) => {
  const [reloadKey, setReloadKey] = useState(Date.now());
  const [status, setStatus] = useState("Connecting...");
  const retryTimerRef = useRef(null);

  const updateStatus = (value) => {
    setStatus(value);
    setCameraStatus(value);
  };

  const retryStream = () => {
    updateStatus("Retrying...");

    if (retryTimerRef.current) return;

    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      setReloadKey(Date.now());
    }, 2000);
  };

  useEffect(() => {
    updateStatus("Connecting...");

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative flex h-[34vh] min-h-[260px] max-h-[520px] w-full max-w-[calc(100vw-2rem)] items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-lg lg:h-[42vh] lg:max-w-[calc(100vw-280px)]">
      {/* Status Badge */}
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Camera: {status}
      </div>

      {/* Live Camera Stream */}
      <img
        key={reloadKey}
        src={`${STREAM_URL}&reload=${reloadKey}`}
        alt="Live robot camera feed"
        className="h-full w-full object-contain rotate-180"
        draggable="false"
        onLoad={() => updateStatus("Connected")}
        onError={retryStream}
      />

      {/* Empty / Loading Layer */}
      {status !== "Connected" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black">
          <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur-md">
            {status}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;