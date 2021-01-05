import * as mongoose from "mongoose";

export default interface ITournamentReport extends mongoose.Document {
  participant: [
    {
      _groupId: any;
      _userId: any;
      score: Number;
      picture: String;
      fullname: String;
    }
  ];
  _tournamentId: any;
  // stageName: string;
  stageName: number;
}
