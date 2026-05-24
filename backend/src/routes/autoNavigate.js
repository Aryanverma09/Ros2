import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.post("/nav-goal", (req, res) => {

  const { x, y, z, w } = req.body;

  const command = `
  docker exec ros2_container bash -c "
    source /opt/ros/humble/setup.bash &&
    source install/setup.bash &&

    ros2 action send_goal /navigate_to_pose \
    nav2_msgs/action/NavigateToPose \
    '{
      pose: {
        header: {
          frame_id: \"map\"
        },
        pose: {
          position: {
            x: ${x},
            y: ${y},
            z: 0.0
          },
          orientation: {
            z: ${z},
            w: ${w}
          }
        }
      }
    }'
  "
  `;

  exec(command, (error, stdout, stderr) => {

    if (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Navigation failed",
      });
    }

    console.log(stdout);
    console.log(stderr);

    res.json({
      success: true,
      message: "Goal sent successfully",
    });
  });
});
export default router;