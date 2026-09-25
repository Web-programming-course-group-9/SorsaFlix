import { Router } from "express"
import requireAuth from "../middleware/auth.js"

import {
  addReview,
  getMovieReviews,
  getReview,
  removeReview
} from "../controller/reviewController.js"

const router = Router()

router.post("/", requireAuth, addReview)

router.get("/movie/:movieId", getMovieReviews)

router.get("/:id", getReview)

router.delete("/:id", requireAuth, removeReview)

export default router