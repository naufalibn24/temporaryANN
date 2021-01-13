import * as mongoose from "mongoose";

export default interface Igroup extends mongoose.Document {
  _tournamentId: any;
  teams: [
    {
      _userId: any;
      phoneNumber: string;
    }
  ];
}
