import mongoose from "mongoose";
import crypto from "crypto";
const Session = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokens: {
    type: String,
    required: true,
  },
  exp: {
    type: Date,
    required: true,
    // default : new Date(Date.now()+1000*3600*24*7)
  },
});
Session.pre("validate", function (next) {
  if (!this.tokens) {
    this.tokens = crypto.randomBytes(16).toString("base64url");
  }
  if (!this.exp) {
    this.exp = new Date(Date.now() + 1000 * 3600 * 24 * 7);
  }
  next();
});
Session.methods.toJSON = function () {
  const sessionOBJ = this.toObject();
  sessionOBJ.id = sessionOBJ._id;
  delete sessionOBJ._id;
  delete sessionOBJ.__v;
  return sessionOBJ;
};
export const SessionModel = mongoose.model("Session", Session);
