import * as mongoose from "mongoose";
import ItournamentRules from "./interfaces/TournamentRulesInterface";

const tournamentRulesSchema = new mongoose.Schema({
  age: Number,
  subdistrict: String,
  groupMember: { type: Number, default: 1 },
  minParticipant: Number,
  maxParticipant: { type: Number, default: 100 },
  rulesName: { type: String, unique: true, required: true, lowercase: true },
});

const TournamentRules = mongoose.model<ItournamentRules>(
  "Rules",
  tournamentRulesSchema
);
export default TournamentRules;
