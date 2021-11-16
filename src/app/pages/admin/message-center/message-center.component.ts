import { Component, OnInit } from '@angular/core';
import { Message } from "../../../@core/models/message";
import { User,USERROLE } from "../../../@core/models/user";
import { MessageService } from "../../../@core/services/message.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'ngx-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {

  public messages:Message[];

  constructor(private messageSerivce:MessageService,
              private route:ActivatedRoute,
              private router:Router,
    ) { }

  ngOnInit(): void {
    this.messageSerivce.getAdminHeaderMessage().subscribe((msgs)=>{      
      this.messages = msgs;
      this.messages.sort((a:Message,b:Message)=>{
        let ma = moment(a.created_at);
        let mb = moment(b.created_at);
        if(ma.isAfter(mb)) return 1;
        return 0;
      })
    })
  }
  compose(){
    this.router.navigate(['/messagecenter/compose'])
  }
  getFormatDate(date:string){
    let md = moment(date);
    if(md.isValid)
      return md.format('LT');
    return '';
  }
  goToMessageDetail(msg:Message){
    this.messageSerivce.updateMessage(msg.id).subscribe(res =>{
      console.log('ret >>', res)
    })
    if(msg.headerMessage)
      this.router.navigate([msg.headerMessage],{relativeTo:this.route})
    else
      this.router.navigate([msg.id],{relativeTo:this.route})
  }
  getSenderName = this.messageSerivce.getSenderName;
  getReceiverName = this.messageSerivce.getReceiverName;
  getSenderPhotoUrl = this.messageSerivce.getSenderPhotoUrl;
  getReceiverPhotoUrl = this.messageSerivce.getReceiverPhotoUrl;
  
}
