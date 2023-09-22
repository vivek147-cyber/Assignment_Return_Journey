import express from "express";
import { register,verifyotp} from "../controllers/user_registration.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify-otp", verifyotp);


export default router;