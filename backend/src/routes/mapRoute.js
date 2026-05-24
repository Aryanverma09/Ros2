import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.post("/save-map", (req, res) => {

  const mapName = `map_${Date.now()}`;

  const command = `
  docker exec ros2_container bash -c "
  source /opt/ros/humble/setup.bash &&
  source /root/ros2_ws/install/setup.bash &&

  ros2 run nav2_map_server map_saver_cli \
  -f /root/ros2_ws/maps/${mapName} \
  --ros-args \
  -p use_sim_time:=true \
  -p map_subscribe_transient_local:=true \
  -p save_map_timeout:=20.0
  "
  `;

  exec(command, (error, stdout, stderr) => {

    if (error) {

      console.log(stderr);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
      map: mapName,
    });

  });

});

router.get("/maps", (req, res) => {

  const command = `
  docker exec ros2_container bash -c "
  ls /root/ros2_ws/maps
  "
  `;

  exec(command, (error, stdout, stderr) => {

    if (error) {

      console.log(stderr);

      return res.status(500).json({
        success: false,
      });
    }

    const maps = stdout
      .split("\n")
      .filter(file => file.endsWith(".yaml"));

    res.json({
      success: true,
      maps,
    });

  });

});
router.post("/load-map", (req, res) => {

  const { mapName } = req.body;

  const command = `
  docker exec ros2_container bash -c "
  source /opt/ros/humble/setup.bash &&
  source /root/ros2_ws/install/setup.bash &&

  ros2 launch nav2_bringup localization_launch.py \
  map:=/root/ros2_ws/maps/${mapName}
  "
  `;

  exec(command, (error, stdout, stderr) => {

    if (error) {

      console.log(stderr);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
    });

  });

});



export default router;