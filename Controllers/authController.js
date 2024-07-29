import User from "../Models/userModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All the fields are required"));
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Registerd Successfully", result: newUser });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All the Fields are Required"));
  }
  try {
    const userDetail = await User.findOne({ email });
    const userPassword = bcryptjs.compareSync(password, userDetail.password);
    if (!userDetail || !userPassword) {
      return next(errorHandler(400, "Invalid Credentials"));
    }
    const token = jwt.sign(
      { id: userDetail._id, isAdmin: userDetail.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    const { password: passkey, ...rest } = userDetail._doc;
    res
      .status(200)
      .json({ message: "User Logged In Successfully", rest, token });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, profilePic } = req.body;
  try {
    const userDetail = await User.findOne({ email });
    if (userDetail) {
      const token = jwt.sign(
        { id: userDetail._id, isAdmin: userDetail.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password: passkey, ...rest } = userDetail._doc;

      res
        .status(200)
        .json({ message: "User Logged In Successfully", rest, token });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        userName:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: profilePic,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin:newUser.isAdmin }, process.env.JWT_SECRET_KEY);
      const { password: passkey, ...rest } = newUser._doc;

      res
        .status(200)
        .json({ message: "User Logged In Successfully", rest, token });
    }
  } catch (error) {
    next(error);
  }
};
