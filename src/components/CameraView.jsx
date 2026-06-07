import React, { useEffect, useRef, useState } from "react";

const STREAM_URL =
  "http://localhost:8080/stream?topic=/camera/image_raw&transport=compressed";

const CameraView = () => {
  const [reloadKey, setReloadKey] = useState(Date.now());
  const [status, setStatus] = useState("Connecting...");
  const retryTimerRef = useRef(null);

  const retryStream = () => {
    setStatus("Retrying...");

    if (retryTimerRef.current) return;

    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      setReloadKey(Date.now());
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex h-[280px] w-full max-w-[680px] items-center justify-center overflow-hidden rounded-2xl border-2 border-black bg-black shadow-lg sm:h-[340px] lg:h-[50vh] lg:w-[45vw] xl:w-[35vw]">
      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white">
        Camera: {status}
      </div>

      <img
        key={reloadKey}
        alt="Camera feed"
        src={`${STREAM_URL}&reload=${reloadKey}`}
        className="h-full w-full object-cover"
        onLoad={() => setStatus("Connected")}
        onError={retryStream}
      />
    </div>
  );
};

export default CameraView;