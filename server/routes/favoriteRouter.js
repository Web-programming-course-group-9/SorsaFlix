import { Router } from "express"
import requireAuth from '../middleware/auth.js'
import { addFavorite, removeFavorite } from "../controller/favoriteController.js"



const router = Router()

router.post("/", requireAuth, addFavorite)
router.delete("/:movieId", requireAuth, removeFavorite)

export default router