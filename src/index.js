import express from "express";
import fs from "fs";
import { DataTypes, Sequelize } from "sequelize";
import { config } from "./config.js";
import { randomUUID } from "crypto";

const app = express();

// Setup database
const sequelize = new Sequelize(config.URL_DATABASE);

// Models
sequelize.define("Phones", {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: randomUUID(),
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
});

await sequelize.sync({ force: true });

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

app.get("/", (_req, res) => {
  res.render("index");
});
app.post("/phone", (req, res) => {
  const phoneNumber = req.body.phone;
  sequelize.model("Phones").create({ phone: phoneNumber }).then((data) => {
    if (!data) {
      res.sendStatus(404);
      return;
    }
    res.redirect(`/show/${data.id}`);
  }).catch(() => {
    res.sendStatus(500);
  });
});
app.get("/show/:uuid", (req, res) => {
  const id = req.params.uuid;
  sequelize.model("Phones").findOne({ where: { id } }).then((data) => {
    res.render("showphone", { phoneNumber: data.phone });
  }).catch((err) => {
    console.error(err);
    res.sendStatus(404);
  });
});

app.listen(config.PORT, () => {
  console.log(`[APP] The server is ready on port: ${config.PORT}`);
});
