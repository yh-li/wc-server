import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  course_id: { type: mongoose.ObjectId, required: true },
  user_id: { type: mongoose.ObjectId, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  create_date: { type: Date, required: true },
});
const Review = mongoose.model("review", reviewSchema);
export default Review;
