import { Router } from "express";
import UserController from "../Controllers/UserController";
import GroupController from "../Controllers/GroupController";

const router = Router();

router.post("/change/avatar", UserController.changeAvatar);
router.put("/change/name", UserController.changeName);

router.get("/groups/:userUuid", GroupController.getUserGroups);
router.get("/friends/:userUuid", UserController.getUserFriends);

router.post("/addFriend", UserController.addFriend);

export default router;