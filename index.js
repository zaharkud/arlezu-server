import "dotenv/config.js"
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import fileUpload from "express-fileupload";
import cors from "cors";

import { router } from "./routes/index.js";
import sequelize from "./db.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";

import schedule from "node-schedule";
import { Op } from "@sequelize/core";
import { ActiveCard } from "./models/model.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 6000;


const reduceCardsRepeatTime = schedule.scheduleJob({ hour: 11, minute: 52 }, async () => {
  const activeCards = await ActiveCard.findAll({ where: { repeatTime: { [Op.gt]: 1 } }, });
  for (let card of activeCards) {
    await card.increment({ repeatTime: -1 });
  }
});

app.use(cors({
  origin: ["https://arlezu.ru", "http://localhost:3000"],
  default: "https://arlezu.ru"
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Starting on port: ${PORT} `);
    });

  } catch (err) {
    console.log("Error " + err);
  }
}

start();