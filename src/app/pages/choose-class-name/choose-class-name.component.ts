import { Component, OnInit } from '@angular/core';
import { ChildService } from '../../@core/services/child.service';
import { NameOfClass } from '../../@core/models/child';
import { UsersService } from '../../@core/services/users.service';
import { User, USERROLE } from '../../@core/models/user';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuService } from '@nebular/theme';
@Component({
  selector: 'ngx-choose-class-name',
  templateUrl: './choose-class-name.component.html',
  styleUrls: ['./choose-class-name.component.scss']
})
export class ChooseClassNameComponent implements OnInit {
  private current_user:User;
  public nameList:NameOfClass[]
  public currentClassName:NameOfClass;
  constructor(
    private childService:ChildService,
    private userService:UsersService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService,
    private router:Router
    ) { 
      this.currentClassName =  this.childService.getCurrentClassName()
    }
    open() {
      this.dialogService.open(ChooseClassNameComponent, {
        // context: {
        //   title: 'Choose Classroom',
        // },
      });
    }
  ngOnInit(): void {
    this.nameList =[];
    this.userService.getCurrentUser().subscribe(item=>{
      this.current_user = item
      if(this.current_user.role_name == USERROLE.Teacher)
        this.nameList = this.current_user.classNames;
      if(this.current_user.role_name == USERROLE.Admin)
        this.nameList = this.childService.classNameList;
    });
  }
  isTeacher(){
    if (!this.current_user) return false;
    return this.current_user.role_name == USERROLE.Teacher
  }
  selectClass(name){
    console.log('nam >>',name)
    this.childService.setCurrentClassName(name);
    this.currentClassName = name;
    this.menuService.navigateHome();
  }
}
