import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    dep: { type: String, required: true },
  },
  { collection: "courses" }
);
courseSchema.index({ name: "text" });
const Course = mongoose.model("course", courseSchema);
export default Course;
