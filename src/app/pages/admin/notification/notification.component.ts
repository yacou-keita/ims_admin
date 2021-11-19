import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { User } from '../../../@core/models/user';
import { NotificationService } from '../../../@core/services/notification.service';
import { UsersService } from '../../../@core/services/users.service';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  //private currentUserSubscription:Subscription;
  private user:User;
  notifications
  constructor(private router:Router,private userService:UsersService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user:User)=>{
      this.user = user;
      this.notificationService.getNotification(user.id).subscribe(data => {
        this.notifications = data;
       })
    })
   
  }
  compose(){
    this.router.navigate(['/notification/compose'])
  }
  getFormatDate(date:string){
    let md = moment(date);
    if(md.isValid)
      return md.format('LT');
    return '';
  }
  goTo(not){
    this.notificationService.putNotification(not.id).subscribe(res =>{
      console.log('ret >>', res)
    })
    if(not.module == 'Appointment')
      this.router.navigate([`/appointment`]);
    if(not.module == 'Message')
    this.router.navigate([`/messagecenter`]);
  }
  delete(not){
    console.log('not >>',not)
    this.notificationService.deleteNotification(not.id).subscribe(res =>{
      console.log('ret >>', res)
      this.notificationService.getNotification(this.user.id).subscribe( data => {
        console.log('notification data >>', data)
        this.notifications = data;
      })
    })
  }
}
