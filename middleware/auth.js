import jwt from "jsonwebtoken";
import Review from "../models/reviewModel.js";
import mongoose from "mongoose";
export default class auth {
  static async addReview(req, res, next) {
    try {
      //get the cookie from request header
      console.log(req.cookies);
      const token = req.cookies.token;
      //do we have a token?
      if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      //if this token was not created by JWT_SECRET
      //throw errors
      //else it will decode to get the payload
      //containing user
      req.user = verified.user;
      console.log(verified.user);
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ errorMessage: "Unauthorized" });
    }
  }
}
