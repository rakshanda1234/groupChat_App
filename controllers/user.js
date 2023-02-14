const { error } = require("console");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    // console.log(name, email, phone, password);
    if (name.length > 0 && email.length > 0 && password.length > 0) {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        return res.status(400).json({ message: "user already exists" });
      }

      bcrypt.hash(password, 10, async (error, hash) => {
        if (error) throw new Error();

        await User.create({
          name: name,
          email: email,
          phone: phone,
          password: hash,
        });
      });
      res.status(200).json({ message: "sign up successfull" });
    } else {
      res.status(400).json({ message: "bad parameters" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
