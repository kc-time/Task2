import { register, login, logout } from "../controllers/userController"
import express from "express";
import { authenticate } from "../authenticate";

const router = express.Router()

router.post(register)
router.post('/login', login)
router.post('/logout', logout)

export default router;