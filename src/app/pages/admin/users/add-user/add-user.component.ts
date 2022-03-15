import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService } from '../../../../@core/services/users.service';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { NbToastrService } from '@nebular/theme';
import { User, USERROLE } from '../../../../@core/models/user';
import { MustMatch } from '../../../../@core/utils/validators.util';
import { generateRandomPassword } from '../../../../@core/utils/password.util';
import { ToastService } from '../../../../@core/services/toast.service';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userId: number;
  user:User;
  profileForm: FormGroup;
  genereatedPwd:string;
  errors;
  showPassword:boolean = false;
  showPassword1:boolean = false;
  role_name;
  role;
  title;
  constructor(private route:ActivatedRoute,private fb: FormBuilder, private userService:UsersService, private toastrService:ToastService,private router:Router,private dateTimeAdapter: DateTimeAdapter<any>) { 
    dateTimeAdapter.setLocale('en-IN')
    this.genereatedPwd = generateRandomPassword(12);
    this.role_name = localStorage.getItem('role_name');
    this.profileForm = this.fb.group({
      first_name:['', Validators.required],
      last_name:['', Validators.required],
      dob:[''],
      email:['', [Validators.email]],
      phoneNumber:[''],
      username:['',Validators.required],
      notes:[''],
      role:[],
      picture:[undefined],
      pictureFile:[undefined],
      pwd:['', Validators.required],
      confirm_pwd:['']
    },{ validators:[MustMatch('pwd', 'confirm_pwd')] });
  }

  ngOnInit(): void {
    if(this.role_name == 'Teacher'){
      this.title = 'New Teacher'
      this.role = 3;
    }else if(this.role_name == 'Admin'){
      this.title = 'New Admin'
      this.role = 2;
    }
    else if(this.role_name == 'Assistant'){
      this.title = 'New Assistant'
      this.role = 6;
    }
    else if(this.role_name == 'Personnel'){
      this.title = 'New Personnel'
      this.role = 7;
    }
  }
  isInvalidControl = isInvalidControl;

  setPassword(elem){
    elem.select()
    elem.setSelectionRange(0, 99999);
    document.execCommand("copy");
    this.profileForm.get('pwd').setValue(this.genereatedPwd);
    this.profileForm.get('confirm_pwd').setValue(this.genereatedPwd);
    this.toastrService.show(this.genereatedPwd, 'Password Copied');
  }

  changeListener(event):void {
    console.log(event);
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.profileForm.get('picture').setValue(event.target.result);        
      }
      this.profileForm.get('pictureFile').setValue(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onFormSubmit(){
    this.profileForm.markAllAsTouched();
    //this.profileForm['role']= this.role;
    if(this.profileForm.valid){
      let data =this.profileForm.value;
      data['role'] = this.role
      data['password'] = this.profileForm.value['pwd'];
      console.log('data >>', data);
      this.userService.AddUser(data).subscribe(
        _=>{
          this.toastrService.success('New User Added','Success');
        },
        err=>{
          this.errors = err.error;
          Object.keys(this.errors).forEach(key=>{
            this.profileForm.get(key).setErrors({hostError:true});
          })
        }
      )
    }
  }
  get picture():string { 
    if(!this.profileForm.get('picture').value)
      return '';
    return this.profileForm.get('picture').value;
  }
  back(){
      this.router.navigate(['/users']);
  }
  get roleList(){
    let ret =[];
    Object.keys(USERROLE).forEach(value=>{
      if(USERROLE[value] != USERROLE.Parent)
        ret.push(USERROLE[value]);
    })
    return ret;
  }
}
