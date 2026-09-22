import { Router } from "express"

import {
  addReview,
  getMovieReviews,
  getReview,
  removeReview
} from "../controller/reviewController.js"

const router = Router()

router.post("/", addReview)

router.get("/movie/:movieId", getMovieReviews)

router.get("/:id", getReview)

router.delete("/:id", removeReview)

export default router