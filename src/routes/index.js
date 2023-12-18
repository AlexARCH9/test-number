import { Router } from "express";
import sequelize from "../db/db.js";

const router = Router()

router.get("/", (_req, res) => {
  res.render("index");
});

router.post("/phone", (req, res) => {
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

router.get("/show/:uuid", (req, res) => {
  const id = req.params.uuid;
  sequelize.model("Phones").findOne({ where: { id } }).then((data) => {
    res.render("showphone", { phoneNumber: data.phone });
  }).catch((err) => {
    console.error(err);
    res.sendStatus(404);
  });
});

export default router;
