import mongoose from "mongoose";

const profilSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  lastename: {
    type: String,
  },
  mail: {
    type: String,
  },
  photo: {
    type: String,
  },
});

profilSchema.methods.toJSON = function () {
  const profilOBJ = this.toObject();
  profilOBJ.id = profilOBJ._id;
  delete profilOBJ._id;
  delete profilOBJ.__v;
  return profilOBJ;
};

const Profil = mongoose.model("Profil", profilSchema);

export default Profil;
