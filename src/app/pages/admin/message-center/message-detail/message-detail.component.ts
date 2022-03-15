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
import { NbDialogService } from '@nebular/theme';
import { YesNoDialogComponent } from '../../../../components/yes-no-dialog/yes-no-dialog.component';
import { ToastService } from '../../../../@core/services/toast.service';

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
              private userService:UsersService,
              private route:ActivatedRoute,
              private router:Router,
              private _location:Location,
              private toastrService:ToastService,
              private dialogService:NbDialogService
    ) {

    }


  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user:User)=>{ this.currentUser = user ;})
    this.route.paramMap.pipe(switchMap(
      params => {
        this.headermsgId = Number(params.get('id'));
        return forkJoin({
          user:this.userService.getCurrentUser(),
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
      this.messages.forEach(val => {
        val.attachedFiles.forEach(v => {
          if(v.file.indexOf('.png', v.file.length - '.png'.length) !== -1 || v.file.indexOf('.png', v.file.length - '.jpg'.length) !== -1){
            v.fileType = true;
          }else
            v.fileType = false;
          let files = v.file.split("Files/")
            v.filename = files[1]
        })
      })
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
  onDelete(id){
    this.dialogService.open(YesNoDialogComponent,{context:{
      title:'Are you going to delete?'
    }}).onClose.subscribe(ret=>{
      if(ret==true){
        this.messageSerivce.deleteMessage(id).subscribe(res=>{
          // if(this.userService.localSource){
          //   this.userService.localSource.remove(this.user);
          // }
          this.toastrService.info("User has been deleted", "success");
          this.router.navigate(['..'],{relativeTo:this.route});
        })
      }
    })
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
