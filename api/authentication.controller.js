import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export default class AuthCtrl {
  static async Register(req, res, next) {
    try {
      const { email, password, confirmPassword } = req.body;
      //do validation
      if (!email || !password || !confirmPassword)
        return res
          .status(400)
          .json({ errorMessage: "Please enter the required fields." });
      if (password.length < 6)
        return res.status(400).json({
          errorMessage: "Password needs to be at least 6 characters.",
        });
      if (password !== confirmPassword)
        return res.status(400).json({ errorMessage: "Passwords don't match." });
      //one email can only be connected to at most 1 account
      const existingUser = await User.findOne({ email: email }); //in short we can say email here
      if (existingUser) {
        return res
          .status(400)
          .json({ errorMessage: "An account with this email already exists." });
      }
      console.log(existingUser);
      //hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = new User({
        email,
        passwordHash,
      });
      const savedUser = await newUser.save();
      //log the user in
      //only my server is allowed to issue login permissions
      //create a token through JWT
      const token = jwt.sign(
        {
          user: savedUser._id,
        },
        process.env.JWT_SECRET
      );
      console.log(token);
      //send token in a http-only cookie
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send(); //cookie's name is token
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      //do validation
      if (!email || !password)
        return res
          .status(400)
          .json({ errorMessage: "Please enter the required fields." });
      const existingUser = await User.findOne({ email: email }); //in short we can say email here
      if (!existingUser)
        return res
          .status(401)
          .json({ errorMessage: "Wrong email or password." });
      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!passwordCorrect)
        return res
          .status(401)
          .json({ errorMessage: "Wrong email or password." });

      //sign the token
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET
      );
      //send token in a http-only cookie
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send(); //cookie's name is token
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
  static async Logout(req, res, next) {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        //completely removes the cookie
      })
      .send();
  }
}
