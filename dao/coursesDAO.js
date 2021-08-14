import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let courses;

export default class CoursesDAO {
  static async injectDB(conn) {
    //how we initially connect to database
    //call this method as soon as the server starts
    //give a reference to the courses database
    if (courses) {
      return;
    }
    try {
      courses = await conn.db(process.env.WisCourse_NS).collection("courses");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in coursesDAO: ${e}`
      );
    }
  }
  static async getCourses({
    filters = null,
    page = 0,
    coursesPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("dep" in filters) {
        query = { dep: { $eq: filters["dep"] } };
      } else if ("no" in filters) {
        query = { number: { $eq: filters["no"] } };
      }
    }
    let cursor;
    try {
      cursor = await courses.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { coursesList: [], totalNumberCourses: 0 };
    }
    //limit the result to page limit
    const displayCursor = cursor
      .limit(coursesPerPage)
      .skip(coursesPerPage * page);
    try {
      const coursesList = await displayCursor.toArray();
      const totalNumCourses = await courses.countDocuments(query);
      return { coursesList, totalNumCourses };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { coursesList: [], totalNumCourses: 0 };
    }
  }
  static async getCourseById(id) {
    try {
      //pipeline is a cool thing about mongo db
      //so you can match different collections together
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id), //match a certain course
          },
        },
        {
          $lookup: {
            //mongodb aggragation pipeline
            //lookup is just a part of it
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$course_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      return await courses.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getCourseByID: ${e}`);
      throw e;
    }
  }
  static async getDeps() {
    let deps = [];
    try {
      deps = await courses.distinct("dep");
      return deps;
    } catch (e) {
      console.error(`Unable to get deps, ${e}`);
      return deps;
    }
  }
}
