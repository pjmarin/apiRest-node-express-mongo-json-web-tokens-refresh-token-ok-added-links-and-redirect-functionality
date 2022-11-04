import { Router } from "express";
import { redirectNanoLink } from "../controllers/redirect.controller.js";
import { paramNanoLinkValidator } from "../middlewares/validatorManager.js";
const router = Router();

router.get("/:nanoLink", paramNanoLinkValidator, redirectNanoLink);

export default router;