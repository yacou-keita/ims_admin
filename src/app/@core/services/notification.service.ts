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
  
}
