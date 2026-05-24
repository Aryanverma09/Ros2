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
    <div>
      <button
        onClick={saveMap}
        className="bg-gray-300 p-2 rounded-lg shadow-md hover:bg-gray-400 transition-colors w-full mb-4"
      >
        Save Map
      </button>
    </div>
  );
};

export default SaveMap;