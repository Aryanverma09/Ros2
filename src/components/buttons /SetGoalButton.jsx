import React, { useState } from "react";
import MapView from "../MapView";

const MAP_WIDTH = 700;
const MAP_HEIGHT = 500;

const AutoNavigate = () => {
  const [goalMode, setGoalMode] = useState(false);
  const [points, setPoints] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // AUTO EXPLORE
  const handleAutoExplore = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/navigate", {
        method: "POST",
      });

      const data = await res.json();
      alert(data.message || "Auto Explore Started");
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  // OPEN GOAL MAP
  const handleSetGoal = () => {
    setGoalMode(true);
  };

  // CREATE MULTIPLE POINTS
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    setPoints((prev) => [...prev, { px, py }]);
  };

  // EXECUTE ALL GOALS
  const handleExecuteGoal = async () => {
    if (points.length === 0) {
      alert("Please select at least one goal");
      return;
    }

    try {
      setIsSending(true);

      for (const point of points) {
        const x = ((point.px / MAP_WIDTH) * 10 - 5).toFixed(2);
        const y = (((MAP_HEIGHT - point.py) / MAP_HEIGHT) * 10 - 5).toFixed(2);

        await fetch("http://localhost:5000/api/nav-goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            x: parseFloat(x),
            y: parseFloat(y),
            z: 0.0,
            w: 1.0,
          }),
        });
      }

      alert("All Goals Sent");

      setGoalMode(false);
      setPoints([]);
    } catch (error) {
      console.log(error);
      alert("Navigation Failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full">
      {/* BUTTONS */}
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <button
          onClick={handleAutoExplore}
          className="w-full max-w-[180px] rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
        >
          Auto Explore
        </button>

        <button
          onClick={handleSetGoal}
          className="w-full max-w-[180px] rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
        >
          Set Goal
        </button>
      </div>

      {/* GOAL MODAL */}
      {goalMode && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="max-h-[95dvh] w-full max-w-[820px] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl">
            <h2 className="mb-3 text-center text-lg font-bold text-gray-900">
              Select Navigation Goals
            </h2>

            {/* MAP SCROLL WRAPPER */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-300 bg-gray-100 p-2">
              <div
                className="relative h-[500px] w-[700px] overflow-hidden rounded-xl border border-black bg-white"
              >
                {/* REAL MAP VIEW */}
                <div className="absolute inset-0 z-0 h-full w-full">
                  <MapView isStatic />
                </div>

                {/* CLICK LAYER */}
                <div
                  onClick={handleMapClick}
                  className="absolute inset-0 z-20 cursor-crosshair"
                />

                {/* ROBOT CENTER POINT */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-blue-500 shadow-lg" />

                {/* MULTIPLE GOALS */}
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="pointer-events-none absolute z-40 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white shadow-lg"
                    style={{
                      left: point.px - 12,
                      top: point.py - 12,
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setPoints([])}
                disabled={isSending}
                className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setGoalMode(false);
                    setPoints([]);
                  }}
                  disabled={isSending}
                  className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExecuteGoal}
                  disabled={isSending || points.length === 0}
                  className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Execute"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoNavigate;