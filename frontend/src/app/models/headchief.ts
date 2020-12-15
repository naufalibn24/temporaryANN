export class chief {
  _id: string;
  subDistrict: string;
}

export class seeParticipantList {
  tournamentnames: string;
  participant: Ipart[];
}

export class Ipart {
  score: number;
  _id: string;
  _userId: string;
}
