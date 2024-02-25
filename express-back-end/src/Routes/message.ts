import { Router } from "express";
import * as MessageController from "../Controllers/MessageController";

const router = Router();

router.get("/group/:groupUuId", MessageController.getGroupMessages);
router.get("/user/:userUuId", MessageController.getUserMessages);

export default router;