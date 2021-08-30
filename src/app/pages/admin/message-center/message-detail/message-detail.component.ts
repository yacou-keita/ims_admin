import { Component, OnInit } from '@angular/core';
import { Message, MessageType } from "../../../../@core/models/message";
import { User,USERROLE } from "../../../../@core/models/user";
import { MessageService } from "../../../../@core/services/message.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../../../../@core/services/users.service';
import { ReplyData } from '../../../../shared/components/reply/reply.component';
import { TagInputItem } from '../../../../shared/components/tag-input/tag-input.component';
import { Child } from '../../../../@core/models/child';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {
  public headermsgId:number;
  public messages:Message[];
  public isReplyMode:boolean;
  public currentUser:User;
  public toContact:User;
  public toChild:Child;

  constructor(private messageSerivce:MessageService,
              private userSerivce:UsersService,
              private route:ActivatedRoute,
              private router:Router,
              private _location:Location
    ) {

    }


  ngOnInit(): void {
    this.userSerivce.getCurrentUser().subscribe((user:User)=>{ this.currentUser = user ;})
    this.route.paramMap.pipe(switchMap(
      params => {
        this.headermsgId = Number(params.get('id'));
        return forkJoin({
          user:this.userSerivce.getCurrentUser(),
          msg: this.messageSerivce.getMessageLinked(this.headermsgId)
        })
      }
    )).subscribe(ret=>{
      this.currentUser = ret.user;
      this.messages = ret.msg;
      if(this.messages[0].sender.id == this.currentUser.id){
        this.toContact = this.messages[0].receiver;
      }else
        this.toContact = this.messages[0].sender;
      this.toChild = this.messages[0].child;
    })
    
    this.isReplyMode = false
  }

  isUserAdmin(user:User):boolean{
    return user.role_name == USERROLE.Admin
  }
  getdata(a){
    alert("asdf");
    console.log(a);

  }
  getFormatDate(date:string){
    let md = moment(date);
    if(md.isValid)
      return md.format('LT');
    return '';
  }
  goToMessageCenter(){
    this._location.back()
  }

  onSend(data:ReplyData){    
    let requests=[];
    let msg:Message= this.messageSerivce.newMessage();
      msg.subject = this.messages[0].subject;
      msg.content = data.content;
      msg.msgType = MessageType.Normal;
      msg.attachedFiles = data.fileIds;
      msg.sender = this.currentUser;
      msg.child = this.toChild;
      msg.headerMessage = this.headermsgId;
      msg.receiver = this.toContact;    
    this.messageSerivce.sendMessage(msg).subscribe((ret:Message)=>{
      this.isReplyMode = false;
      this.messageSerivce.getMessageLinked(this.headermsgId).subscribe(data=>{this.messages = data;})
    })
    //this.messageSerivce.sendMessage()
  }

  getSenderName = this.messageSerivce.getSenderName;
  getReceiverName = this.messageSerivce.getReceiverName;
  getSenderPhotoUrl = this.messageSerivce.getSenderPhotoUrl;
  getReceiverPhotoUrl = this.messageSerivce.getReceiverPhotoUrl;
}
