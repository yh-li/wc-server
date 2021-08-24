import CoursesDAO from "../dao/coursesDAO.js";
export default class CouresesController {
  static async apiCreateCourse(req, res, next) {
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
  }
  static async apiGetCourses(req, res, next) {
    const coursesPerPage = req.query.coursesPerPage
      ? parseInt(req.query.query.couresePerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    let filters = {};
    if (req.query.dep) {
      filters.dep = req.query.dep;
    } else if (req.query.no) {
      filters.no = req.query.no;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }
    console.log(filters);
    const { coursesList, totalNumCourses } = await CoursesDAO.getCourses({
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
    };
    res.json(response);
  }
  static async apiGetCourseById(req, res, next) {
    try {
      let id = req.params.id || {};
      let course = await CoursesDAO.getCourseById(id);
      if (!course) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(course);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
  static async apiGetCourseDeps(req, res, next) {
    try {
      let deps = await CoursesDAO.getDeps();
      res.json(deps);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
