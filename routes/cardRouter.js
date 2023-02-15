import { Router } from "express";
import { cardController } from "../controllers/cardController.js";

const router = new Router();

router.post("/", cardController.create);
router.get("/", cardController.getAll);

export { router as cardRouter };
