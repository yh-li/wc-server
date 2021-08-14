import ReviewsDAO from "../dao/reviewsDAO.js";
export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const courseId = req.body.course_id;
      const review = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();
      const ReviewResponse = await ReviewsDAO.addReview(
        courseId,
        userInfo,
        review,
        date
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const text = req.body.text;
      const date = new Date();
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date
      );
      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update review - user may not be original poster"
        );
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.query.id;
      const userId = req.body.user_id; //usually in delete request
      //there should not be any parameters in the body
      //here we would like to check if the user is the original poster
      //but it should be more complex than providing the user id in the delete request
      console.log("Delete Request Received");
      console.log(reviewId);
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
