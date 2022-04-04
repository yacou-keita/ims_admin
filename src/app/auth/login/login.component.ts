import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";
import { UsersService } from '../../@core/services/users.service';
import { NbMenuService } from '@nebular/theme';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';
  showPassword: boolean = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  rememberMe = false;

  constructor(protected service: AuthService,protected router: Router, private userService:UsersService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.errors = [];
    this.messages = [];    
    let user = this.user;
    this.submitted=true;
    this.service.login(user.email,user.password).subscribe((res:any) => {
      console.log(res);
      localStorage.setItem('access_token', res.token)
      this.userService.current_user = undefined;
      // localStorage.setItem('class_name', "Baobab");
      this.userService.getCurrentUser().toPromise().then(_=>{
        this.router.navigate(['/profile'])
        this.submitted = false;
      })
      
      this.submitted=true;
    },
    (error:any)=>{
      console.log(error);
      console.log("====================")
      this.submitted=false;
      this.errors=['login failed']
      this.showMessages['error']=true
    }
    );
  }

  changeShowPasswordValue():void{
    this.showPassword = !this.showPassword
  }
}
