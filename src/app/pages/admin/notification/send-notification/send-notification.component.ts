import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../@core/services/notification.service';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { UsersService } from '../../../../@core/services/users.service';
import { User } from "../../../../@core/models/user";
import { ChildService } from '../../../../@core/services/child.service';
import { Child } from '../../../../@core/models/child';
import { ToastService } from '../../../../@core/services/toast.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  children:Child[];
  notificationForm:FormGroup;
  classNameList = []
  childSelected:boolean = false;
  classSelected:boolean = false;
  selectedOption;
  constructor(
    private fb:FormBuilder,
    private notificationService:NotificationService,
    private childService:ChildService,
    private toastrService:ToastService,
    private userService:UsersService,
    private router:Router
    ){ 
      this.notificationForm = fb.group({
        user_ids:[[],Validators.minLength(1)],
        module:['', Validators.required],
        notificationMessage: ['', Validators.required],
        classroom_id:[[],Validators.minLength(1)]
        //isBroadCast:[false, Validators.nullValidator],        
      })
      this.children = [];
    }

  ngOnInit(): void {
    this.childService.getAllChildren().subscribe((child:Child[])=>{
      this.children=child;
    })
    this.userService.getClasses().subscribe((classes) => {
      this.classNameList = classes;
    })
  }
  onSubmit(){
    this.notificationForm.markAllAsTouched();
    let parent =[];
    let classNams = [];
    if(this.notificationForm.valid){
      if(this.classSelected){
        let data = Object.assign({}, this.notificationForm.value);
        delete data.user_ids
        data.classroom_id.forEach(val =>{
          classNams.push(val.id)
        })
        console.log('data >>',data.classroom_id)
        if(classNams){
          data.classroom_id = classNams;
          this.notificationService.composeNotification(data).subscribe(res => {
            this.toastrService.success('Notification posted successfully','success');
            this.router.navigate(['/notifications']);
          })
        }
      }else if(this.childSelected){
        let data = Object.assign({}, this.notificationForm.value);
        delete data.classroom_id
        data.user_ids.forEach(val =>{
          parent.push(val.parent.id)
        })
        console.log('data >>',data)
        if(parent){
          data.user_ids = parent;
          this.notificationService.composeNotification(data).subscribe(res => {
            this.toastrService.success('Notification posted successfully','success');
            this.router.navigate(['/notifications']);
          })
        }
      }
    }
  }
  back(){
    this.router.navigate(['/notifications']);
  }
  selectOption(opt){
   if(opt == 'classroom'){
    this.classSelected = true;
    this.childSelected = false;
   }else if(opt == 'child'){
    this.classSelected = false;
    this.childSelected = true;
   }
    
  }
  isInvalidControl = isInvalidControl
}
