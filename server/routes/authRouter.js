import { Router } from "express"
import requireAuth from "../middleware/auth.js"
import { deleteAccount, login, logout, refresh, register } from "../controller/authController.js"


const router = Router()



router.post("/register", register) 
router.post("/login", login) 
router.post("/refresh", refresh) 
router.post("/logout", logout) 
router.delete("/account", requireAuth, deleteAccount) 
  

export default router
