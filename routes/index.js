import { Router } from "express";
import { cardRouter } from "./cardRouter.js";
import { statisticsRouter } from "./statisticsRouter.js";
import { userRouter } from "./userRouter.js";

const router = new Router();

router.use("/cards", cardRouter);
router.use("/users", userRouter);
router.use("/stats", statisticsRouter);

export { router };