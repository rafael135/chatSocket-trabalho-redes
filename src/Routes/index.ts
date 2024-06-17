import { Router } from "express";
import userRoutes from "./user";
import messageRoutes from "./message";
import groupRoutes from "./group";
import searchRoutes from "./search";
import Auth from "../Middlewares/Auth";

import AuthController from "../Controllers/AuthController";

const router = Router();

//router.post("/register", AuthController.register);
//router.post("/login", AuthController.login);
//router.post("/checkToken", AuthController.checkToken);

//router.use("/user", Auth, userRoutes);
//router.use("/message", Auth, messageRoutes);
//router.use("/group", Auth, groupRoutes);
//router.use("/search", Auth, searchRoutes);


export default router;