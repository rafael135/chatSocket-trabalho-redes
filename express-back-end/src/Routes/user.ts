import { Router } from "express";
import * as UserController from "../Controllers/UserController";

const router = Router();

router.post("/change/avatar", UserController.changeAvatar);


export default router;