const express = require("express");
const router = express.Router();

const {
  getUserByGoogleId,
  signInUser,
  createProfile,
  updateProfile,
  deleteProfile,
  getUserById,
  getUserByEmail,
  SearchUser,
} = require("../controllers/userController.js");
const { auth } = require("../middlewares/auth");
router.route("/signIn").post(signInUser);
router.route("/getOneByGoogleId/:googleId").get(getUserByGoogleId);
router.route("/getOneByEmail/:email").get(getUserByEmail);
router.route("/getOneById/:id").get(getUserById);
router.route("/createProfile").post(auth, createProfile);
router.route("/updateProfile/:profileId").put(auth, updateProfile);
router.route("/deleteProfile/:profileId").delete(auth, deleteProfile);
router.route("/search").get(SearchUser);

module.exports = router;
