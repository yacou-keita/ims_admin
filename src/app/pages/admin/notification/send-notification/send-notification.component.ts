import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../@core/services/notification.service';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { UsersService } from '../../../../@core/services/users.service';
import { User } from "../../../../@core/models/user";
@Component({
  selector: 'ngx-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  parents:User[];
  notificationForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private notificationService:NotificationService,
    private userService:UsersService,
    ){ 
      this.notificationForm = fb.group({
        to:[[],Validators.minLength(1)],
        title:['', Validators.required],
        content: ['', Validators.required],
        isBroadCast:[false, Validators.nullValidator],        
      })
      this.parents = [];
    }

  ngOnInit(): void {
    this.userService.getParents().subscribe((users:User[])=>{
      this.parents=users;
    })
  }
  onSubmit(){
    this.notificationForm.markAllAsTouched();
  }
  isInvalidControl = isInvalidControl
}
