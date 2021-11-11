import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { User } from '../../../@core/models/user';
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
  constructor(private router:Router,private userService:UsersService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user:User)=>{
      this.user = user;
      this.userService.getNotification(user.id).subscribe(data => {
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
    this.userService.putNotification(not.id).subscribe(res =>{
      console.log('ret >>', res)
    })
    if(not.module == 'Appointment')
      this.router.navigate([`/appointment`]);
    if(not.module == 'message')
    this.router.navigate([`/messagecenter`]);
  }
}
