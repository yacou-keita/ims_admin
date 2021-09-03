import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassName } from '../../@core/models/user';
import { ToastService } from '../../@core/services/toast.service';
import { UsersService } from '../../@core/services/users.service';
import { isInvalidControl } from '../../@core/utils/form.util';

@Component({
  selector: 'ngx-add-class-name',
  templateUrl: './add-class-name.component.html',
  styleUrls: ['./add-class-name.component.scss','../admin/exchange-library/book-form/book-form.component.scss']
})
export class AddClassNameComponent implements OnInit {
  @Input() initdata:ClassName;
  @Output('onSubmit') submitEvent =  new EventEmitter<any>();
  classForm:FormGroup;
  //book:ClassName;
  classes = [];
  constructor(
    private userService: UsersService,
    private fb:FormBuilder,
    private toastService:ToastService,
  ) { }

  ngOnInit(): void {
    this.classForm = this.fb.group({
      name:['', Validators.required],
      //comment:['', Validators.nullValidator]
    })
  }
  onSubmit() {
    if(this.classForm.valid){
      let data =this.classForm.value;
      data['id']= parseInt(localStorage.getItem('classId'))
      data['createdBy']=2;
      this.userService.postClassName(data).subscribe((res:any) => {
        this.toastService.success('New Class has been added succesfully','success');
        window.location.reload();
      })
    }
  }
  isInvalidControl = isInvalidControl
}
