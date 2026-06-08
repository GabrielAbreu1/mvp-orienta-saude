import { Router, type IRouter } from "express";
import healthRouter from "./health";
import triagemRouter from "./triagem/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(triagemRouter);

export default router;
