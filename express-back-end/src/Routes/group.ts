import { Router } from "express";
import GroupController from "../Controllers/GroupController";

const router = Router();

router.get("/:groupUuid/members", GroupController.getGroupMembers);
router.delete("/:groupUuid/exit", GroupController.exitFromGroup);

router.post("/", GroupController.createNewGroup);


export default router;