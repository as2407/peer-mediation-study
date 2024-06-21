import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Instruction} from "../DTO/instruction";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  // instructionUrl: string = 'instructions.json';
  conservationUrl: string = 'conversation.json';


  getChat():Observable<Instruction[]> {
    return this.http.get<Instruction[]>(this.conservationUrl);
  }



}
