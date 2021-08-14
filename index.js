import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import CoursesDAO from "./dao/coursesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 5000;
//now we'll connect to the database
MongoClient.connect(process.env.WisCourse_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500, //ms
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    //right after we have connected to the database
    //and before we start the server
    //client is a connection
    await CoursesDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    //this is where we start the server
    //this is after we connected to the database
    app.listen(port, () => {
      console.log(`web server listening on port ${port}`);
    });
  });
