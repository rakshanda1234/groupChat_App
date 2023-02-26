const Message = require("../models/message");
const Group = require("../models/group");
const GroupUser = require("../models/groupUser");
const { Op } = require("sequelize");
// const S3Services = require("../services/s3Services");

exports.saveMessage = async (req, res, next) => {
  try {
    const message = req.body.message;
    const groupId = req.body.groupId;
    console.log(message);
    if (isValidMessage(message)) {
      const groupUser = await GroupUser.findOne({
        where: {
          groupId: groupId,
          userId: req.user.id,
        },
      });
      if (!groupUser) {
        throw new Error("user not found in group");
      }
      await req.user.createMessage({
        message: message,
        groupId: groupId,
        from: req.user.name,
      });

      res.status(200).json({ message: "msg saved to database" });
    } else {
      throw new Error("invalid message format");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.fetchNewMessages = async (req, res, next) => {
  try {
    const lastMsgId = +req.query.lastMsgId;
    const groupId = +req.query.groupId;
    console.log("msg id in backend:", lastMsgId);
    // console.log("grp id in backend to fetch msg:", groupId);
    // const group = await Group.findByPk(groupId);
    // const messages = await Message.findAll({where: {[Op.and]:[{id:  {[Op.gt]: lastMsgId}}, {groupId: groupId}]}});
    const messages = await Message.findAll({
      where: { id: { [Op.gt]: lastMsgId } },
    });

    if (messages.length > 0) {
      res.status(200).json({ messages: messages });
    } else {
      res.status(201).json({ message: "no new messages" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "could not fetch messages" });
  }
};

function isValidMessage(message) {
  if (typeof message === "string" && message.length > 0) {
    return true;
  } else {
    return false;
  }
}

// exports.uploadFile = async (req, res) => {
//   try {
//     console.log(req.file);
//     const filename = `user-${req.user.id}/${
//       req.file.filename
//     }_${new Date()}.png`;

//     console.log(filename);
//     const fileURL = await S3Services.uploadToS3(req.file.path, filename);
//     res.status(200).json({ success: true, fileURL });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };
