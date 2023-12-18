import express from "express";
import cn from "./concterDB/cn.js";
import User from "./Shema/user.js";
import { SessionModel } from "./Shema/session.js";
import cors from "cors";
const app = express();
cn()
  .then(() => {
    console.log("connection to database");
  })
  .catch((err) => {
    console.err("error connecting database");
  });
app.use(express.json());
app.use(cors());

app.post("/api/singUp", async (req, res) => {
  const data = req.body;
  if (!data.mail || !data.password) {
    return res.status(403).json({
      message: "on a pas tout les informations",
    });
  }
  const mail = await User.findOne({
    mail: data.mail,
  });
  if (mail) {
    return res.status(403).json({
      message: "elle existe cette mail ",
    });
  }
  const user = new User(data);
  user
    .save()
    .catch((err) => {
      if (err.message.startsWith("User validation failed: mail:")) {
        return res.status(400).json({
          messgae: "Invalid email format",
        });
      }
      res.status(400).json({
        messgae: "Erorre",
      });
    })
    .then(async (response) => {
      const tokens = await SessionModel.create({
        userId: response._id,
      });
      res.status(200).json({
        response,
        tokens,
      });
    });
});

app.post("/api/login", async (req, res) => {
  try {
    const data = req.body;
    if (!data.mail || !data.password) {
      return res.status(403).json({
        message: "on a pas tout les informations",
      });
    }
    const user = await User.findOne({
      mail: data.mail,
      password: data.password,
    });
    console.log(user);

    if (!user) {
      res.status(400).json({
        message: "error email or password",
      });
    }
    const tokens = await SessionModel.create({
      userId: user._id,
    });
    res.status(200).json({
      user,
      tokens,
    });
  } catch (err) {
    console.error(err);
  }
});
app.listen(3000, () => {
  console.log("conntect to servur to port 3000");
});
