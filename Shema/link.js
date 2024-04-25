import mongoose from "mongoose";
const link = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
 lien : {
    type: "String",
}
});
link.methods.toJSON = function () {
  const linkOBJ = this.toObject();
  linkOBJ.id = linkOBJ._id;
  delete linkOBJ._id;
  delete linkOBJ.__v;
  return linkOBJ;
};
export default mongoose.model("Link", link);
