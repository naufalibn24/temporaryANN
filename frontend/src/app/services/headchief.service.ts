import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { chief, seeParticipantList } from "../models/headchief";
import { environment } from "../../environments/environment";
import { map } from "jquery";

@Injectable({
  providedIn: "root",
})
export class HeadchiefService {
  constructor(private http: HttpClient, p) {}
  putassigncomittee(comittee: chief): Observable<any> {
    return this.http
      .put<any>(`${environment.urlAddress}/chief/assign`, comittee)
      .pipe<any>((res: any) => res);
  }
  public getparticipants(id): Observable<[seeParticipantList]> {
    return this.http
      .get(`${environment.urlAddress}/chief/participantlist/${id}`)
      .pipe(map(this.getparticipants));
  }
  //  getparticipants(): Observable<[]>{
  //   return this.http
  //     .get<seeParticipantList>(environment.urlAddress + "product")
  //     .pipe(map(this.getparticipants));
  // }
}
