import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { User } from "../../models/user";
import { Role } from "../../models/role";
// import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
// import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  headers = new HttpHeaders().set("Content-Types", "application/json");
  datauser = {};

  constructor(private http: HttpClient, private router: Router) {}

  private getUserdata(response) {
    return response.data;
  }

  public getSession(): Promise<boolean> {
    const session = localStorage.getItem("token");
    return new Promise((resolve, reject) => {
      if (session) {
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  }

  public getUserRoles(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.urlAddress}getUserRoles`)
        .pipe(
          catchError((error: any, caught: any) => {
            reject(error);
            return caught;
          }),
          map((res: any) => res.data)
        )
        .subscribe((role: string[]) => {
          resolve(role);
        });
    });
  }

  public areUserRolesAllowed(
    userRoles: string[],
    allowedUserRoles: Role[]
  ): boolean {
    for (const role of userRoles) {
      for (const allowedRole of allowedUserRoles) {
        if (role.toLowerCase() === allowedRole.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  //sign with google
  // GoogleAuth(){
  //   return this.AuthLogin(new firebase.googleAuthProvider())
  // }

  // AuthLogin(provider){
  //   return this.afAuth.signInWithPopup(provider)
  //   .then((result)=>{
  //       alert('you succes signin use google')
  //   })
  //   .catch((error)=>{
  //     alert('error cant login')
  //   })
  // }

  signupUser(user) {
    return (
      this.http.post<any>(`${environment.urlAddress}users/register`, user),
      this.router.navigate(["/notif"])
    );
  }

  signinUser(user) {
    return this.http.post<any>(`${environment.urlAddress}users/login`, user);
  }

  login() {
    return !!localStorage.getItem("access_token");
  }

  getUsername() {
    return this.http
      .get<User[]>(environment.urlAddress + "users")
      .pipe(map(this.getUserdata));
  }

  logoutUser() {
    let removeToken = localStorage.removeItem("access_token");
    if (removeToken == null) {
      this.router.navigate([""]);
    }
  }

  get isLogin(): boolean {
    let token = localStorage.getItem("token");
    return token !== null ? true : false;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUserProfile(_id): Observable<any> {
    let api = `${environment.urlAddress}user/${_id}`;
    return this.http
      .get(api, {
        headers: this.headers,
      })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let pesan = "";

    if (error.error instanceof ErrorEvent) {
      pesan = error.error.message;
    } else {
      pesan = `Error code: ${error.status} \n Pesan Error: ${error.message}`;
    }
    return throwError(pesan);
  }
}
