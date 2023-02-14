const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const sequelize = require("./util/database");

const User = require("./models/user");

const userRoutes = require("./routes/user");
const { error } = require("console");

app.use("/user", userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
