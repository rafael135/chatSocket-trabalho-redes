import { Router } from "express";
import userRoutes from "./user";
import Auth from "../Middlewares/Auth";

import * as AuthController from "../Controllers/AuthController";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.use("/user", Auth, userRoutes);


export default router;