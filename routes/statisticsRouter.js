import { Router } from "express";

const router = new Router();

router.post("/", () => { });
router.get("/", (req, res) => {
  res.send("stat-handler");
});

export { router as statisticsRouter };
