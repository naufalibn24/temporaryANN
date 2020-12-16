import * as mongoose from "mongoose";
import bcrypt from "bcrypt";
import IUserProfile from "./interfaces/User_ProfileInterface";

export const userProfileSchema = new mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    _tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
    },
    _groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    birthDate: { type: Date, required: true },
    subDistrict: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["kelapa gading", "jelambar", "klender", "kemang"],
    },
    phoneNumber: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    picture: { type: String },
  },
  { timestamps: true, collection: "Profile", autoIndex: true }
);

const Profile = mongoose.model<IUserProfile>("Profile", userProfileSchema);
export default Profile;
