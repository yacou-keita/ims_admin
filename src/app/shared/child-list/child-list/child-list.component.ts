import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Child, NameOfClass } from "../../../@core/models/child";
import { LocalDataSource } from 'ng2-smart-table';
import { ChildCellComponent } from "../child-cell/child-cell.component";
import { User } from '../../../@core/models/user';
import { UsersService } from '../../../@core/services/users.service';
import { ChildService } from '../../../@core/services/child.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-child-list',
  templateUrl: './child-list.component.html',
  styleUrls: ['./child-list.component.scss']
})
export class ChildListComponent implements OnInit, OnChanges {

  @Input() data;
  @Output('onselect') onSelectEvent = new EventEmitter();
  searchWord:string;
  parents: Child[] = [];
  others: User[] = [];
  classNameList=[];
  currentClassName;
  fromChild = false;
  parent_src: LocalDataSource;
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
        renderComponent: ChildCellComponent,
      }      
    },
  };
  purpose:string;
  constructor(private userService:UsersService,private childService:ChildService,private router:Router,) {
    this.parent_src = new LocalDataSource();
    if(localStorage.getItem('fromChild') == 'true' || localStorage.getItem('fromPicture') == 'true')
        this.fromChild = true;
  }

  ngOnInit(): void {
    if(this.data){
      if(localStorage.getItem('fromChild') == 'true' || localStorage.getItem('fromPicture') == 'true')
        this.fromChild = true;
      if(localStorage.getItem('role') != 'Parent'){
        this.parents = this.data;
        this.parent_src.load(this.parents);
      }else{
        this.others = this.data;
        this.parent_src.load(this.others);
      }
    }
    this.classNameList.push({id: 0, name: "All", createdBy: 2});
    this.userService.getClasses().subscribe((classes) => {
     
      classes.forEach((val,i)=>{
        this.classNameList.push(val);
      })
      this.classNameList.push({id:this.classNameList.length+1, name:"Add New Class", createdBy:2})
    })
  }
  ngOnChanges(changes:SimpleChanges){
    if('data' in changes){
      if(this.data)
        this.parent_src.load(this.data);
    }
  }
  selectClass(event){
    this.currentClassName = event.name
    if(event.name == 'All'){
      this.childService.getAllChildren().subscribe(children=>{
        this.parent_src.load(children);
      })
    }else if(event.name == 'Add New Class'){
      this.router.navigate(['/add/classname']);
      localStorage.setItem('classId',event.id)
    }else{
      this.childService.getChildrenByClassName(event.name).subscribe(data=>{
        this.parent_src.load(data);
      })
    }
  }
  onSearchWordChange(newWord:string){
    this.searchWord = newWord;
    if(this.searchWord){

      this.parent_src.setFilter([{field:'first_name',search:this.searchWord}, {field:'last_name', search:this.searchWord}], false);    
    }else{
      this.parent_src.setFilter(null);
    }    
  }
  onRowSelect(event) {
    let selected_user:Child = event.data;
    this.onSelectEvent.emit(selected_user);
  } 

}
