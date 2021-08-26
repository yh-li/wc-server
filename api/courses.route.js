import express from "express";
import auth from "../middleware/auth.js";
import AuthCtrl from "./authentication.controller.js";
import CoursesCtrl from "./courses.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();
router.route("/").get(CoursesCtrl.apiGetCourses);
router.route("/id/:id").get(CoursesCtrl.apiGetCourseById);
router.route("/deps").get(CoursesCtrl.apiGetCourseDeps);
router
  .route("/reviews")
  .all(auth.addReview)
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);
router.route("/auth/register").post(AuthCtrl.Register);
router.route("/auth/login").post(AuthCtrl.Login);
router.route("/auth/logout").get(AuthCtrl.Logout);
export default router;
