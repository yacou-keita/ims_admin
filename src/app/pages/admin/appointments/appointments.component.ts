import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { User, USERROLE } from '../../../@core/models/user';
import { CellAvatarComponent } from "../parent-list/cell-avatar/cell-avatar.component";
import { UsersService } from '../../../@core/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChildService } from '../../../@core/services/child.service';
import { Child } from '../../../@core/models/child';
@Component({
  selector: 'ngx-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  parents: User[] = [];
  teachers: User[] = [];
  children: Child[] = [];
  teacher_src: LocalDataSource;
  parent_src: LocalDataSource;
  teacherSelected = false;
  childSelected = false;
  settings = {
    actions:{
      add:false,
      edit:false,
      delete:false,
      position:'right'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    hideSubHeader:true,
    hideHeader:true,
    pager:{
      perPage:4
    },
    columns: {
      picture:{
        type: 'custom',
        renderComponent: CellAvatarComponent,
      }      
    },
  };
  

  constructor(private userService: UsersService, 
    private childService:ChildService,
    private router:Router,
    private route:ActivatedRoute) {
    this.teacher_src = new LocalDataSource();
    this.parent_src = new LocalDataSource();
  }
  
  ngOnInit(): void {
    localStorage.setItem('landing','true');
    forkJoin({
      teachers:this.userService.getTeachers(),
      children:this.childService.getAllChildren(),
    }).subscribe(ret=>{
      this.teachers = ret.teachers;
      this.children = ret.children;
    })
  }
  teacherDetails(){
   this.teacherSelected = true;
  }
  childDetails(){
    this.childSelected = true;
  }
  onTeacherSelect(event){
    localStorage.setItem('landing','false');
    let selected_user:User = event;
    this.router.navigate([selected_user.id],{relativeTo:this.route});
  }
  onChildSelect(event){
    localStorage.setItem('landing','false');
    localStorage.setItem('childappointments','true')
    let selectedChild:Child = event;
    this.router.navigate([selectedChild.id],{relativeTo:this.route});
  }

  newAppointment(){
    this.router.navigate(['/appointment/new'])
  }
  newPreset(){
    this.router.navigate(['/appointment/new/preset'])
  }

}
