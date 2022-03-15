import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { messages } from "../dummy";
import { Observable, of } from 'rxjs';
import { Message } from '../models/message';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  api_url = environment.API_URL;
  constructor(private httpClient:HttpClient) { 
  }
  getNotification(userId) :Observable<any>{
    return this.httpClient.get(`${this.api_url}/notification/getUserNotif/${userId}`)
  }
  putNotification(id) :Observable<any>{
    return this.httpClient.put(`${this.api_url}/notification/global/${id}/`,{'is_read': true})
  }
  composeNotification(data) :Observable<any>{
    console.log(data)
    return this.httpClient.post(`${this.api_url}/notification/global/`,data)
  }
  deleteNotification(id) :Observable<any>{
    return this.httpClient.delete(`${this.api_url}/notification/global/${id}/`)
  }
}
