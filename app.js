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
const Message = require("./models/message");

User.hasMany(Message);
Message.belongsTo(User);

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const { error } = require("console");

app.use("/user", userRoutes);
app.use("/message", messageRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
