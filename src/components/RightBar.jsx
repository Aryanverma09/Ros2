import React, { useEffect, useState } from "react";

const RightBar = () => {

  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState("");



  // FETCH MAPS
  const fetchMaps = async () => {

    try {

      const response = await fetch("http://localhost:5000/api/maps");

      const data = await response.json();

      if (data.success) {
        setMaps(data.maps);
      }

    } catch (error) {
      console.log(error);
    }
  };



  // LOAD MAP
  const loadMap = async (mapName) => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/load-map",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mapName,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {

        setActiveMap(mapName);

        alert(`${mapName} Loaded Successfully`);
      }

    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    fetchMaps();
  }, []);




  return (
    <div className="w-full h-screen bg-[#8e97a8] p-4 overflow-y-auto">

      {/* TITLE */}
      <h1 className="text-white text-2xl font-bold mb-6 text-center">
        Saved Maps
      </h1>



      {/* MAP LIST */}
      <div className="space-y-4">

        {
          maps.map((map, index) => (

            <div
              key={index}
              onClick={() => loadMap(map)}
              className={`
              rounded-xl
              p-4
              shadow-lg
              transition-all
              duration-300
              cursor-pointer
              flex
              items-center
              gap-3
              hover:scale-105

              ${
                activeMap === map
                  ? "bg-green-400 text-white"
                  : "bg-white/90 hover:bg-white"
              }
              `}
            >

              {/* ICON */}
              <div className="text-2xl">
                🗺️
              </div>

              {/* MAP NAME */}
              <div className="font-semibold truncate">
                {map.replace(".yaml", "")}
              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
};

export default RightBar;