import * as mongoose from "mongoose";
import Igroup from "../models/interfaces/GroupInterface";

const BranchesScoringSchema = new mongoose.Schema({
  _tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
  stageName: {
    type: Number,
    default: 0,
  },
  teams: { type: Array },
  results: { type: Array },
});

const BranchesScoring = mongoose.model<any>(
  "BranchesScoring",
  BranchesScoringSchema
);
export default BranchesScoring;
