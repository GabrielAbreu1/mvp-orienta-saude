import { Router } from "express";
import { perguntasRouter } from "./perguntas.js";
import { analisarRouter } from "./analisar.js";
import { feedbackRouter } from "./feedback.js";

const triagemRouter: Router = Router();

triagemRouter.use(perguntasRouter);
triagemRouter.use(analisarRouter);
triagemRouter.use(feedbackRouter);

export default triagemRouter;
