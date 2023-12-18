import express from "express";
import fs from "fs";
import { DataTypes, Sequelize } from "sequelize";
import { config } from "./config.js";
import { randomUUID } from "crypto";
import router from "./routes/index.js";

const app = express();

// Setup simple views
app.engine("ntl", (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);

    const rendered = content.toString()
      .replace("#phone#", `<span>${options.phoneNumber}</span>`);
    return callback(null, rendered);
  });
});
app.set("views", "./src/views");
app.set("view engine", "ntl");

app.use(express.urlencoded());
app.use(router);

app.listen(config.PORT, () => {
  console.log(`[APP] The server is ready on port: ${config.PORT}`);
});
