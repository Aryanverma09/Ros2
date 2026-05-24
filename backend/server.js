import express from "express";
import cors from "cors";

import mapRoutes from "./src/routes/mapRoute.js";
import navigationRoutes from "./src/routes/autoNavigate.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", mapRoutes,navigationRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});