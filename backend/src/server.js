import "./config/env.js";
import fs from "fs";




import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();
