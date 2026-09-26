import { Router } from "express"
import requireAuth from '../middleware/auth.js'
import { addFavorite, removeFavorite, getUserFavorites} from "../controller/favoriteController.js"



const router = Router()

router.post("/", requireAuth, addFavorite)
router.delete("/:movieId", requireAuth, removeFavorite)
router.get("/user/:userId",getUserFavorites)

export default router