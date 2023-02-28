const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message");
const authenticator = require("../middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/send", authenticator.authenticate, messageController.saveMessage);

router.get("/fetchNewMsgs", messageController.fetchNewMessages);

// router.post("/upload", messageController.uploadFile);

module.exports = router;
