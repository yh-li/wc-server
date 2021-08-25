import express from "express";
import CoursesCtrl from "./courses.controller.js";
import ReviewsCtrl from "./reviews.controller.js";
import User from "../models/userModel.js";
const router = express.Router();
router.route("/").get(CoursesCtrl.apiGetCourses);
router.route("/create").post(CoursesCtrl.apiCreateCourse);
router.route("/id/:id").get(CoursesCtrl.apiGetCourseById);
router.route("/deps").get(CoursesCtrl.apiGetCourseDeps);
router
  .route("/reviews")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);
router.post("/auth", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    //do validation
    if (!email || !password || !confirmPassword)
      return res
        .status(400)
        .json({ errorMessage: "Please enter the required fields." });
    if (password.length < 6)
      return res
        .status(400)
        .json({ errorMessage: "Password needs to be at least 6 characters." });
    if (password !== confirmPassword)
      return res.status(400).json({ errorMessage: "Passwords don't match." });
    //one email can only be connected to at most 1 account
    const existingUser = await User.findOne({ email: email }); //in short we can say email here
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "An account with this email already exists." });
    }
    console.log(existingUser);
    return res.status(200).send("Success");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
export default router;
