import { Router } from "express"
import requireAuth from '../middleware/auth.js'
import { addFavorite } from "../controller/favoriteController.js"



const router = Router()

router.post("/", requireAuth, addFavorite)


export default router