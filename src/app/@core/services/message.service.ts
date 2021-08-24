import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { messages, deepMessages } from "../dummy";
import { Observable, of } from 'rxjs';
import { Message, MessageType } from '../models/message';
import { User, USERROLE } from '../models/user';
import { DateAdapter } from '@angular/material/core';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  api_url = environment.API_URL;

  constructor(private httpClient:HttpClient) { 
  }

  newMessage():Message{
    return {
      id:undefined,
      subject:undefined,
      sender:undefined,
      receiver:undefined,
      content:undefined,
      attachedFiles:undefined,
      headerMessage:undefined,
      msgType: MessageType.Normal,
      created_at:undefined
    }
  }
  getAdminHeaderMessage():Observable<Message[]>{
    return this._getHeaderMessages();
    
  }
  _getHeaderMessages():Observable<Message[]>{
    return this.httpClient.get<Message[]>(`${this.api_url}/messages/getHeaderMessages/`);
  }
  getHeaderMessagesOfCurrentUser():Observable<Message[]>{
    return this._getHeaderMessages();
  }
  getMessageLinked(msgId:number):Observable<Message[]>{
    return this.httpClient.get<Message[]>(`${this.api_url}/messages/${msgId}/linkedMessage/`);
  }
  sendMessage(msg:Message):Observable<Message>{
    let data:any =msg;
    data.receiver = msg.receiver.id;
    data.sender = msg.sender.id;
    if(data.child)
      data.child = data.child.id;
    return this.httpClient.post<Message>(`${this.api_url}/messages/`, data);
    
  }



  getSenderName(msg:Message){
    switch(msg.sender.role){
      case USERROLE.Admin:
        return 'Admin Center';
      case USERROLE.Parent:
        return msg.child.first_name + " " + msg.child.last_name;
      case USERROLE.Teacher:
        return msg.sender.first_name + " " + msg.sender.last_name;
    }
  }
  getReceiverName(msg:Message){
    switch(msg.receiver.role){
      case USERROLE.Admin:
        return 'Admin Center';
      case USERROLE.Parent:
        return msg.child.first_name + " " + msg.child.last_name;
      case USERROLE.Teacher:
        return msg.receiver.first_name + " " + msg.receiver.last_name;
    }
  }
  getSenderPhotoUrl(msg:Message){
    if(msg.sender.role == USERROLE.Parent)  return msg.child.photo
    else return msg.sender.picture
  }
  getReceiverPhotoUrl(msg:Message){
    if(msg.receiver.role == USERROLE.Parent)  return msg.child.photo
    else return msg.receiver.picture
  }
}
