import Review from "../models/reviewModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const { course_id, text } = req.body;
      const user_id = req.user;
      const date = new Date();
      //see if there was a review from this user to this course
      const oldReview = Review.find({
        course_id: ObjectId(course_id),
        user_id: ObjectId(user_id),
      });
      if (oldReview)
        return res.status(401).json({
          errorMessage:
            "There was an old review from the current user for the current course.",
        });
      const newReview = new Review({
        course_id: ObjectId(course_id),
        user_id: ObjectId(user_id),
        text: text,
        create_date: date,
      });
      const savedReview = await newReview.save();
      res.json(savedReview);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiUpdateReview(req, res, next) {
    try {
      const review_id = req.body.review_id;
      const theReview = await Review.findById(
        mongoose.Types.ObjectId(review_id)
      );
      console.log("Current user id is ", ObjectId(req.user));
      console.log("The review id is ", ObjectId(theReview.user_id));
      if (!theReview || !ObjectId(req.user).equals(theReview.user_id))
        return res.status(401).json({ errorMessage: "Unauthorized" });
      theReview.text = req.body.newText;
      theReview.create_date = new Date();
      theReview.save();
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiDeleteReview(req, res, next) {
    try {
      const review_id = req.body.review_id;
      const theReview = await Review.findById(
        mongoose.Types.ObjectId(review_id)
      );
      if (!theReview || !ObjectId(req.user).equals(theReview.user_id))
        return res.status(401).json({ errorMessage: "Unauthorized" });
      console.log("Delete Request Received");
      await theReview.remove();
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
