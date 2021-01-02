import * as mongoose from "mongoose";
import Igroup from "../models/interfaces/GroupInterface";

const GroupSchema = new mongoose.Schema({
  _tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
  member: [
    {
      _userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      phoneNumber: { type: String, required: true },
    },
  ],
  groupName: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, required: true },
  subDistrict: { type: String, required: true },
  groupPict: {
    type: String,
  },
});

const Group = mongoose.model<Igroup>("Group", GroupSchema);
export default Group;
