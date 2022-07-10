import { buyShare, sellShare, checkStock, subscribe } from "../controllers/stockController"
import { authenticate } from "../authenticate"
import express from "express";
const router = express.Router()

router.use(authenticate)

router.get('/:stockSymbol', checkStock)
router.put('/:stockSymbol/buy', buyShare)
router.put('/:stockSymbol/sell', sellShare)
router.post('/:stockSymbol/subscribe', subscribe)

export default router;