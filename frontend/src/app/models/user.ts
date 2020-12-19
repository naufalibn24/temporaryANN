import { Role } from "./role";

export class User {
    id: number;
    username:string;
    nama:string;
    kelurahan:string;
    birthdate:Date;
    phonenumber:number;
    email:string;
    password:string;
    picture:string;
    subdistrict:number;
    role: Role;
    token?: string; 
  }
