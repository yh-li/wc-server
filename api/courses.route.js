import express from "express";
import CoursesCtrl from "./courses.controller.js";
import ReviewsCtrl from "./reviews.controller.js";
const router = express.Router();
router.route("/").get(CoursesCtrl.apiGetCourses);
router.route("/id/:id").get(CoursesCtrl.apiGetCourseById);
router.route("/deps").get(CoursesCtrl.apiGetCourseDeps);
router
  .route("/reviews")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);
export default router;
