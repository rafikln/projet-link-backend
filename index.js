import express from "express";
import cn from "./concterDB/cn.js";
import User from "./Shema/user.js";
import Link from "./Shema/link.js";
import Profil from "./Shema/profil.js";
import { SessionModel } from "./Shema/session.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import fs from "fs";
import { log } from "console";

const app = express();

cn()
  .then(() => {
    console.log("connection to database");
  })
  .catch((err) => {
    console.err("error connecting database");
  });
app.use(fileUpload());
app.use(express.json());
app.use(cors());




app.use("/static/public", express.static("static/public"));
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
      const profil = await Profil.create({
        userId: response._id,
        name: "",
        lastename: "",
        mail: "",
        photo: null,
      });
      const links = await Link.create({
        userId: response._id,
        lien: "[]",
      });
      res.status(200).json({
        user: response,
        tokens,
        profil,
        lien: "[]",
      });
    });
});

app.post("/api/login", async (req, res) => {
  try {
    const data = req.body;
    //pour véréfer le mail et le password
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
    //pour cree le token

    const tokens = await SessionModel.create({
      userId: user._id,
    });

    const links = await Link.findOne({
      userId: user._id,
    });
    const profil = await Profil.findOne({
      userId: user._id,
    });

    res.status(200).json({
      user,
      tokens,
      lien: links.lien,
      profil,
    });
  } catch (err) {
    console.error(err);
  }
});
app.put("/api/profil", async (req, res) => {
  try {
    const data = req.body;
    const updatedProfil = await Profil.findOneAndUpdate(
      { userId: data.id },
      {
        name: data.myprofil.name,
        lastename: data.myprofil.lastename,
        mail: data.myprofil.mail,
      },
      { new: true, useFindAndModify: false }
    );
    const updatedlist = await Link.findOneAndUpdate(
      { userId: data.id },
      { lien: data.mylist },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      mylist:data.mylist,
      myprofil:data.myprofil
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});
app.put("/api/photo", async (req, res) => {
  try {
    const data=req.body;
    const picture = req.files?.photo;
     if(picture)
     {
      const picturePath = `./static/public/${picture.md5}.jpeg`;

      fs.writeFile(picturePath, picture.data, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error writing file" });
        }
   
      
        const im = `${req.protocol}://${req.get("host")}/static/public/${picture.md5}.jpeg`;
        
       const p= await Profil.findOneAndUpdate(
        { userId: data.id },
        { photo: im },
        { new: true, useFindAndModify: false }
       )
        res.status(200).json({
          img: im
        });
      
    });
   
  }
 } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});


app.get("/api/user/:id", async (req, res) => {
  const data = req.params.id;
  const links = await Link.findOne({
    userId: data,
  });

  let profil = await Profil.findOne({
    userId: data,
  });
  let user = await User.findOne({
    _id: data,
  });
  let mail = user.mail;
 console.log(mail);
  res.status(200).json({
    links: links,
    profil: profil,
    mail: mail,
  });
});

app.listen(3000, () => {
  console.log("conntect to servur to port 3000");
});
