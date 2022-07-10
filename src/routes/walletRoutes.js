import { addBalance} from "../controllers/walletController"
import { authenticate } from "../authenticate"
import express from "express";
const router = express.Router()

router.put('/addbalance', authenticate, addBalance)
export default router;