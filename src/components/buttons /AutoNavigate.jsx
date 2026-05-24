import React, { useState } from "react";
import MapView from "../MapView";
const AutoNavigate = () => {
  const [goalMode, setGoalMode] = useState(false);

  const [points, setPoints] = useState([]);

  // AUTO EXPLORE
  const handleAutoExplore = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/navigate", {
        method: "POST",
      });

      const data = await res.json();

      alert(data.message);
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
    try {
      for (const point of points) {
        // PIXEL → ROS COORDINATES
        const x = ((point.px / 700) * 10 - 5).toFixed(2);

        const y = (((500 - point.py) / 500) * 10 - 5).toFixed(2);

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
    }
  };

  return (
    <div className="p-4">
      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={handleAutoExplore}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Auto Explore
        </button>

        <button
          onClick={handleSetGoal}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Set Goal
        </button>
      </div>

      {/* GOAL MODAL */}
      {goalMode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl">
            {/* MAP */}
            <div
              onClick={handleMapClick}
              className="relative w-[700px] h-[500px] border rounded overflow-hidden cursor-crosshair"
            >
              {/* MAP VIEW */}
              <MapView isStatic />

              {/* ROBOT */}
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white -translate-x-1/2 -translate-y-1/2 z-20" />

              {/* MULTIPLE GOALS */}
              {points.map((point, index) => (
                <div
                  key={index}
                  className="absolute flex items-center justify-center z-30"
                  style={{
                    left: point.px - 12,
                    top: point.py - 12,
                  }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white" />

                  <span className="absolute text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPoints([])}
                className="px-4 py-2 bg-yellow-400 rounded"
              >
                Clear
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGoalMode(false);
                    setPoints([]);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExecuteGoal}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Execute
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
