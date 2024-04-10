const express = require("express");
const router = express.Router();

const {
  createConnection,
  getAllConnections,
  verifyConnection,
  getAllPendingConnections,
  updateConnection,
  deleteConnection,
  findMutualConnection,
  findConnectionCount,
  getConnectionByUserId,
  getAllConnectionsByUserId,
  removeConnection,
  deleteCascade,
} = require("../controllers/connectionController.js");

const { auth } = require("../middlewares/auth.js");
router.route("/create").post(auth, createConnection);
router.route("/getAll/:userId").get(auth, getAllConnections);
router.route("/getAllByUserId/:userId").get(auth, getAllConnectionsByUserId);
router.route("/getAllPending/:userId").get(auth, getAllPendingConnections);
router.route("/verify/:connectionId").get(auth, verifyConnection);
router.route("/remove/:connectionId").delete(auth, removeConnection);
router.route("/update/:connectionId").put(auth, updateConnection);
router.route("/delete/:connectionId").delete(auth, deleteConnection);
router.route("/deleteCascade/:id").delete(deleteCascade);
router.route("/getConnectionCount/:userId").get(auth, findConnectionCount);
router.route("/getConnectionByUserId/:userId").get(auth, getConnectionByUserId);
router.route("/findMutual/:person2Id").get(auth, findMutualConnection);

module.exports = router;
