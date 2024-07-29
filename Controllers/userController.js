import bcryptjs from 'bcryptjs';
import { errorHandler } from "../Utils/Error.js";
import User from "../Models/userModel.js";

export const updateUser = async (req, res, next) => {
    const {id} = req.params;
    // console.log(id);
    // console.log(req.user.id);
  if (req.user.id != id) {
    return next(errorHandler(401, "Unauthorized access to update the user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be atleast 6 characters"));
    }
  }
  req.body.password = bcryptjs.hashSync(req.body.password,10)
  if (req.body.userName.length < 7 || req.body.userName.length > 16) {
    return next(
      errorHandler(400, "Username must be between 7 and 16 characters")
    );
  }
  if (req.body.userName.includes(" ")) {
    return next(errorHandler(400, "Usename must not contain spaces"));
  }
  if (req.body.userName !== req.body.userName.toLowerCase()) {
    return next(errorHandler(400, "Username must be in lowercase"));
  }
  if (!req.body.userName.match(/^[A-Za-z0-9 ]+$/)) {
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );
  }

  try {
   // console.log(req.params.id)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true,
      }
    );
    console.log(updatedUser);
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async(req,res,next)=>{
  if(req.user.id !== req.params.id){
    return next(errorHandler(403,'You are not allowed to delete this user'))
  }
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User deleted successfully')
  } catch (error) {
    next(error)
  }
}