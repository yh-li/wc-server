import Course from "../models/courseModel.js";
import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
const ObjectId = mongoose.Types.ObjectId;
export default class CouresesController {
  /*   static async apiCreateCourse(req, res, next) {
    console.log("New Course Request Received from Backend");
    try {
      const courseNo = req.body.number;
      const courseName = req.body.courseName;
      const courseDep = req.body.dep;
      const CourseResponse = await CoursesDAO.addCourse(
        courseNo,
        courseName,
        courseDep
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } */
  static async apiGetCourses(req, res, next) {
    const coursesPerPage = req.query.coursesPerPage
      ? parseInt(req.query.query.couresePerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    let filters = {};
    if (req.query.dep) {
      filters.dep = req.query.dep;
    }
    if (req.query.no) {
      filters.number = " " + req.query.no;
    }
    if (req.query.name) {
      filters["$text"] = { $search: req.query.name };
    }
    console.log(filters);
    const response = await Course.find(filters)
      .skip(coursesPerPage * page)
      .limit(coursesPerPage);
    /*    const { coursesList, totalNumCourses } = await CoursesDAO.getCourses({
      filters,
      page,
      coursesPerPage,
    });
    let response = {
      courses: coursesList,
      page: page,
      filters: filters,
      entries_per_page: coursesPerPage,
      total_results: totalNumCourses,
    }; */
    res.json(response);
  }
  static async apiGetCourseById(req, res, next) {
    try {
      let id = req.params.id || {};
      let course = await Course.findById(ObjectId(id));
      if (!course) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const reviewsPerPage = req.query.coursesPerPage
        ? parseInt(req.query.query.couresePerPage, 10)
        : 20;
      const page = req.query.page ? parseInt(req.query.page, 10) : 0;
      //get reviews
      let reviews = await Review.find({ course_id: ObjectId(id) })
        .skip(reviewsPerPage * page)
        .limit(reviewsPerPage);
      course.reviews = reviews;
      console.log(reviews);
      res.json({ course: course, reviews: reviews });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
  static async apiGetCourseDeps(req, res, next) {
    //const depsPerPage = req.query.coursesPerPage
    //  ? parseInt(req.query.query.couresePerPage, 10)
    //  : 40;
    //const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      let deps = await Course.distinct("dep");
      res.json(deps);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
