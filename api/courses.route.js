import express from "express";
import jwt from "jsonwebtoken";
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
router.route("/auth/loggedIn").get((req, res) => {
  try {
    const token = req.cookies.token;
    //const user_id = req.cookies.user_id;
    const username = req.cookies.username;
    //console.log("TOKEN: ", token);
    //console.log(res.send);
    //if (!token) return res.send({ loggedIn: false, loggedInUser: null });
    if (!token) return res.send({ loggedInUsername: null });
    jwt.verify(token, process.env.JWT_SECRET);
    res.send({
      loggedInUsername: username,
    });
  } catch (err) {
    console.error(err);
    res.send({ loggedInUsername: null }); //not logged in
    //don't need to throw an error
    //cookie is http only the frontend cannot check the cookie
  }
});
export default router;
