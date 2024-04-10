const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnAuthenticatedError,
  InternalServerError,
  NotFoundError,
} = require("../errors/index.js");
const axios = require("axios");
const { default: mongoose } = require("mongoose");

const getUserByGoogleId = async (req, res, next) => {
  const { googleId } = req.params;
  try {
    const user = await User.findOne({ googleId });
    if (user) {
      res.status(StatusCodes.OK).json({ resUser: user });
    } else {
      const error = new NotFoundError("User Not Found!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getUserByEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(StatusCodes.OK).json({ resUser: user });
    } else {
      const error = new NotFoundError("User Not Found!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new BadRequestError("Invalid Id!!");
      next(error);
      return;
    }
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(StatusCodes.OK).json({ resUser: user });
    } else {
      const error = new NotFoundError("User Not Found!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!!!");
    next(error);
    return;
  }
};

const signInUser = async (req, res, next) => {
  const profile = req.body.profile;
  try {
    const { email, displayName, image, googleId } = profile;
    if (!email || !displayName || !image || !googleId) {
      const error = new BadRequestError("Please Provide All Values!!");
      next(error);
      return;
    }
    const existingUser = await User.findOne({ email: profile.email });
    if (existingUser) {
      existingUser.isVerified = true;
      existingUser.displayName = displayName;
      existingUser.image = image;
      existingUser.googleId = googleId;
      const resUser = await existingUser.save();
      res.status(StatusCodes.OK).json({ resUser: resUser });
    } else {
      const newUser = await User.create({
        email,
        displayName,
        image,
        googleId,
        isVerified: true,
      });
      res.status(StatusCodes.CREATED).json({ resUser: newUser });
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const createProfile = async (req, res, next) => {
  const { profile } = req.body;
  const { userId } = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new BadRequestError("Invalid Id!!");
      next(error);
      return;
    }
    const existingUser = await User.findOne({ email: profile.email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already exist" });
    } else {
      const newUser = await User.create({
        ...profile,
        createdBy: userId,
        isVerified: false,
      });
      return res.status(StatusCodes.CREATED).json({ resUser: newUser });
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const updateProfile = async (req, res, next) => {
  const { profileId } = req.params;
  const updatedProfile = req.body.profile;
  const { userId } = req.user;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(profileId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      const error = new BadRequestError("Invalid Id!!");
      next(error);
      return;
    }
    const profile = await User.findOne({ _id: profileId });
    if (!profile) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });
    }
    if (
      userId === String(profile._id) ||
      (userId === String(profile.createdBy) && profile.isVerified !== true)
    ) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: profileId },
        { ...updatedProfile }
      );
      return res.status(StatusCodes.OK).json({ resUser: updatedUser });
    } else {
      const error = new BadRequestError("You Can't Edit This Profile!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const deleteProfile = async (req, res, next) => {
  const { profileId } = req.params;
  const { userId } = req.user;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(profileId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      const error = new BadRequestError("Invalid Id!!");
      next(error);
      return;
    }
    const profile = await User.findOne({ _id: profileId });
    if (!profile) {
      const error = new NotFoundError("Profile Not Found!!");
      next(error);
      return;
    }
    if (
      profileId === userId ||
      (userId === String(profile.createdBy) && profile.isVerified !== true)
    ) {
      const response = await axios.delete(
        `http://localhost:5002/connection/deleteCascade/${profileId}`
      );
      if (response.status === 200) {
        const deletedUser = await User.findOneAndDelete({ _id: profileId });
        return res.status(StatusCodes.OK).json({ resUser: deletedUser });
      } else {
        const error = new InternalServerError("Something Went Wrong!!");
        next(error);
        return;
      }
    } else {
      const error = new BadRequestError("You Can't Delete This Profile!!");
      next(error);
      return;
    }
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

const SearchUser = async (req, res, next) => {
  // try {
  //   if (search === "undefined" || search === "") {
  //     const users = await User.find({});
  //     return res.status(StatusCodes.OK).json({ resUser: users });
  //   } else {
  //     // const users = await User.find({ $text: { $search: search } });
  //     const users = await User.find({
  //       $where: function () {
  //         for (var key in this) {
  //           if (this[key].includes(search)) {
  //             return true;
  //           }
  //         }
  //         return false;
  //       },
  //     });
  //     return res.status(StatusCodes.OK).json({ resUser: users });
  //   }
  // } catch (err) {
  //   const error = new InternalServerError("Something Went Wrong!!");
  //   next(error);
  //   return;
  // }
  try {
    const users = await User.find({});
    return res.status(StatusCodes.OK).json({ resUser: users });
  } catch (err) {
    const error = new InternalServerError("Something Went Wrong!!");
    next(error);
    return;
  }
};

module.exports = {
  getUserByGoogleId,
  getUserByEmail,
  getUserById,
  signInUser,
  createProfile,
  updateProfile,
  deleteProfile,
  SearchUser,
};
