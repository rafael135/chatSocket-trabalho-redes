import { Router } from "express";
import GroupController from "../Controllers/GroupController";

const router = Router();

router.post("/", GroupController.createNewGroup);


export default router;