import { Router } from "express";
import * as UserController from "../Controllers/UserController";
import * as GroupController from "../Controllers/GroupController";

const router = Router();

router.post("/change/avatar", UserController.changeAvatar);

router.get("/groups/:userUuId", GroupController.getUserGroups);
router.get("/friends/:userUuId", UserController.getUserFriends);


export default router;