import * as request from "supertest"
import { app } from '../app';
import IUser from "../models/interfaces/UserInterface";


const url = "http://localhost:5000"
export interface InputUser {
    email: IUser['email'];
    password: IUser['password'];
    username: IUser['username'];
 
}

describe("User Register", () => {
    it("Register", () => {
        const body:InputUser = {
            email : "Hello@gmail.com",
            password : "password",
            username : "username",
        }
      return request.default(url).post("/user/register")
      .set('Accept', 'application/json')
      .send(body)
      .expect(({body})=>{
        expect(body.success).toBeTruthy
        expect(200)
    })
    });
  });

  describe("User Login", () => {
    it("Login", () => {
        const body:InputUser = {
            email : "Hello@gmail.com",
            password : "password",
            username : "username", 
        }
      return request.default(url).post("/user/login")
      .set('Accept', 'application/json')
      .send(body)
      .expect(({body})=>{
          expect(body.token)
          expect(200)
      })
    });
  });

  