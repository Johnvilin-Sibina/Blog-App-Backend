import User from "../Models/userModel.js";
import { errorHandler } from "../Utils/Error.js";
import bcryptjs from "bcryptjs";

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
    await newUser.save()
    res.status(200).json({message:"User Registerd Successfully",result:newUser})
  } catch (error) {
    next(error);
  }
};
