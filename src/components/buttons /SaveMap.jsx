import React from "react";

const SaveMap = () => {
  const saveMap = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/save-map", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        alert(`Map Saved: ${data.map}`);
      } else {
        alert("Failed to save map");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <button
      onClick={saveMap}
      className="w-full max-w-[180px] rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition-colors hover:bg-gray-400"
    >
      Save Map
    </button>
  );
};

export default SaveMap;