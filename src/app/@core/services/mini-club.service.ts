import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { messages, deepMessages, miniClubs } from "../dummy";
import { Observable, of } from 'rxjs';
import { Message } from '../models/message';
import { User, USERROLE } from '../models/user';
import { MiniClub } from '../models/miniclub';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MiniClubService {
  api_url = environment.API_URL;
  constructor(private httpClient:HttpClient) { 

  }
  getAllMiniClub():Observable<MiniClub[]>{    
    return this.httpClient.get<MiniClub[]>(`${this.api_url}/miniclubs/`);
  }
  getMiniClub(id):Observable<MiniClub[]>{
    return this.httpClient.get<MiniClub[]>(`${this.api_url}/miniclubs/${id}/`);
  }
  addNewMiniClub(data:any):Observable<any>{
    console.log('yacou test',data)
    return this.httpClient.post(`${this.api_url}/miniclubs/`, data);
    // eturn this.httpClient.post(`http://3.136.224.87/api/miniclubs/`, data);
  }
  removeMiniClub(data:MiniClub):Observable<any>{
    return this.httpClient.delete(`${this.api_url}/miniclubs/${data.id}/`);
  }
  editMiniClub(data:any):Observable<any>{
    return this.httpClient.put(`${this.api_url}/miniclubs/${data.id}/`, data);
  }
}
