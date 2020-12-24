import * as mongoose from "mongoose";
import bcrypt from "bcrypt";
import IUser from "./interfaces/UserInterface";

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "unregistered",
      enum: [
        "admin",
        "headchief",
        "comittee",
        "participant",
        "user",
        "unregistered",
      ],
      lowercase: true,
    },
    resetLink: { data: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  try {
    const salt: any = await bcrypt.genSalt(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
