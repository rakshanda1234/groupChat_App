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
const Group = require("./models/group");
const GroupUser = require("./models/groupUser");

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, { through: GroupUser });
User.belongsToMany(Group, { through: GroupUser });

Group.hasMany(Message);
Message.belongsTo(Group);

const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const chatRoutes = require("./routes/chat");
const { error, group } = require("console");

app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
