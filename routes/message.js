const express = require("express");
const router = express.Router();

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const messageController = require("../controllers/message");
const authenticator = require("../middleware/auth");

router.post("/send", authenticator.authenticate, messageController.saveMessage);

router.get("/fetchNewMsgs", messageController.fetchNewMessages);

// router.post(
//   "/upload",
//   authMiddleware.authenticate,
//   upload.single("image"),
//   chatcontroller.uploadFile
// );

module.exports = router;
