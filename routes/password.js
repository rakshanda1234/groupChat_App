const path = require("path");
const passowordController = require("../controllers/passwordController");

const middlewareAuthentication = require("../middleware/auth");

const express = require("express");

const router = express.Router();

router.get(
  "/updatepassword/:resetpasswordid",
  passowordController.getUpdatepassword
);

router.use("/forgotpassword", passowordController.getForgotpassword);
router.get("/resetpassword/:id", passowordController.getResetpassword);

module.exports = router;
