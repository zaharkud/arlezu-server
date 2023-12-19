import { Router } from "express";
import { activeCardController } from "../controllers/activeCardController.js";

const router = new Router();

router.post("/", activeCardController.create);
router.post("/changeRepeatTime", activeCardController.changeRepeatTime);
router.get("/", activeCardController.getAll);

export { router as activeCardRouter };