import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../@core/services/notification.service';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { UsersService } from '../../../../@core/services/users.service';
import { User } from "../../../../@core/models/user";
import { ChildService } from '../../../../@core/services/child.service';
import { Child } from '../../../../@core/models/child';
import { ToastService } from '../../../../@core/services/toast.service';
@Component({
  selector: 'ngx-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  children:Child[];
  notificationForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private notificationService:NotificationService,
    private childService:ChildService,
    private toastrService:ToastService,
    ){ 
      this.notificationForm = fb.group({
        user_ids:[[],Validators.minLength(1)],
        module:['', Validators.required],
        notificationMessage: ['', Validators.required],
        //isBroadCast:[false, Validators.nullValidator],        
      })
      this.children = [];
    }

  ngOnInit(): void {
    this.childService.getAllChildren().subscribe((child:Child[])=>{
      this.children=child;
    })
  }
  onSubmit(){
    this.notificationForm.markAllAsTouched();
    let parent =[];
    if(this.notificationForm.valid){
      let data = Object.assign({}, this.notificationForm.value);
      data.user_ids.forEach(val =>{
        parent.push(val.parent.id)
      })
      console.log('data >>',data)
      if(parent){
        data.user_ids = parent;
        this.notificationService.composeNotification(data).subscribe(res => {
          this.toastrService.success('Notification posted successfully','success');
        })
      }
      
    }
  }
  isInvalidControl = isInvalidControl
}
