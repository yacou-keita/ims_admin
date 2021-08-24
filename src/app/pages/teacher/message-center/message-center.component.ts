import { Component, OnInit } from '@angular/core';
import { Message } from "../../../@core/models/message";
import { User,USERROLE } from "../../../@core/models/user";
import { MessageService } from "../../../@core/services/message.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { UsersService } from '../../../@core/services/users.service';
@Component({
  selector: 'ngx-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {

  public messages:Message[];
  public user:User;
  constructor(private messageSerivce:MessageService,
              private route:ActivatedRoute,
              private userService:UsersService,
              private router:Router,
    ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user:User)=>{
      this.user = user;      
    })
    this.messageSerivce.getHeaderMessagesOfCurrentUser().subscribe((msgs)=>{
      this.messages = msgs;
      this.messages.sort((a:Message,b:Message)=>{
        let ma = moment(a.created_at);
        let mb = moment(b.created_at);
        if(ma.isAfter(mb)) return 1;
        return 0;
      })
    })
  }
  isUserAdmin(user:User):boolean{
    return user.role == USERROLE.Admin
  }
  resolveSenderEmail(msg:Message):string{
    let user = msg.sender;
    if(user.id == this.user.id)
      return "me";
    if(user.role == USERROLE.Admin)
      return "Admin Center";
    if(user.role == USERROLE.Parent)
      return msg.child.first_name + " " + msg.child.last_name;
    return user.first_name + " "+ user.last_name;
  }

  resolveReceiverEmail(msg:Message):string{
    let user = msg.receiver;    
    if(user.id == this.user.id)
      return "me";
    if(user.role == USERROLE.Admin)
      return "Admin Center";
    if(user.role == USERROLE.Parent)
      return msg.child.first_name + " " + msg.child.last_name;
    return user.first_name + " "+ user.last_name;
  }

  resolveSenderPictureUrl(msg:Message):string{
    if(msg.sender.role == USERROLE.Parent)
      return msg.child.photo
    return msg.sender.picture;
  }
  getFormatDate(date:string){
    let md = moment(date);    
    if(md.isValid)
      return md.format('LT');
    return '';
  }
  goToMessageDetail(msg:Message){
    if(msg.headerMessage)
      this.router.navigate([msg.headerMessage],{relativeTo:this.route})
    else
      this.router.navigate([msg.id],{relativeTo:this.route})
  }
}
