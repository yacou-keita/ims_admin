import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

import { User, USERROLE } from "../../../@core/models/user";
import { UsersService } from "../../../@core/services/users.service";
import { CellAvatarComponent } from "./cell-avatar/cell-avatar.component";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  parents: User[] = [];
  teachers: User[] = [];
  admins: User[] = [];
  assistants: User[] = [];
  personnels: User[] = [];
  // teacher_src: LocalDataSource;
  // parent_src: LocalDataSource;
  // admin_src: LocalDataSource;
  // assistant_src: LocalDataSource;
  // personnel_src: LocalDataSource;
  // settings = {
  //   actions:{
  //     add:false,
  //     edit:false,
  //     delete:false,
  //     position:'right'
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //     saveButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash"></i>',
  //     confirmDelete: true,
  //   },
  //   hideSubHeader:true,
  //   hideHeader:true,
  //   pager:{
  //     perPage:4
  //   },
  //   columns: {
  //     picture:{
  //       type: 'custom',
  //       renderComponent: CellAvatarComponent,
  //     }      
  //   },
  // };
  searchWord:string;
  role;
  roles=[];
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private userService: UsersService,private route:ActivatedRoute,
    private router:Router,) {
    // this.teacher_src = new LocalDataSource();
    // this.parent_src = new LocalDataSource();
    // this.admin_src = new LocalDataSource();
    // this.assistant_src = new LocalDataSource();
    // this.personnel_src = new LocalDataSource();
  }
  
  ngOnInit(): void {
    // this.userService.getTeachers().pipe(takeUntil(this.destroy$)).subscribe((teachers:User[])=>{
    //   this.teachers = teachers;
    //   this.teacher_src.load(this.teachers);
    //   this.userService.localSource = this.teacher_src;
    // })
    // this.userService.getAdmin().pipe(takeUntil(this.destroy$)).subscribe((admins:User[])=>{
    //   this.admins = admins;
    //   this.admin_src.load(this.admins);
    //   this.userService.localSource = this.admin_src;
    // })
    this.userService.getRoles().subscribe((roles) =>{
      this.roles = roles;
    })
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe( (user:User[]) => {
      user.forEach((item) => {
        if(item.role == 2){
          this.admins.push(item)
        }else if(item.role == 3){
          this.teachers.push(item)
        }else if(item.role == 6){
          this.assistants.push(item)
        }else if(item.role == 7){
          this.personnels.push(item)
        }
      })
      // this.teacher_src.load(this.teachers);
      // this.userService.localSource = this.teacher_src;
      // this.admin_src.load(this.admins);
      // this.userService.localSource = this.admin_src;
      // this.assistant_src.load(this.assistants);
      // this.userService.localSource = this.assistant_src;
      // this.personnel_src.load(this.personnels);
      // this.userService.localSource = this.personnel_src;
    })
  }
  onSelect(selectedUser:User){
    this.router.navigate([selectedUser.id],{relativeTo:this.route})
  }
  newTeacher(val){
    localStorage.setItem('role_name',val);
    this.router.navigate(['users/new'])
  }
  // onSearchWordChange(newWord:string){
  //   this.searchWord = newWord;
  //   if(this.searchWord){

  //     this.teacher_src.setFilter([{field:'first_name',search:this.searchWord}, {field:'last_name', search:this.searchWord}], false);    
  //   }else{
  //     this.teacher_src.setFilter(null);
  //   }    
  // }
  ngOnDestroy() {    
    this.userService.localSource = undefined;
    this.destroy$.next();
    this.destroy$.complete();
  }

}
