import { Component, OnInit } from '@angular/core';
import { Child } from "../../../@core/models/child";
import { ChildService } from "../../../@core/services/child.service";
import { UsersService } from '../../../@core/services/users.service';
import { User } from '../../../@core/models/user';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ngx-child-daily-information',
  templateUrl: './child-daily-information.component.html',
  styleUrls: ['./child-daily-information.component.scss']
})
export class ChildDailyInformationComponent implements OnInit {
  children:Child[];
  teacher:User;
  data = {id : 0}
  constructor(
    private childService:ChildService,
    private usersService:UsersService,
    private router:Router,
    private route:ActivatedRoute
    ) {
  }

  ngOnInit(): void {
    this.usersService.getCurrentUser().subscribe((user:User)=>{
      this.teacher = user;      
    })
    this.childService.getAllChildren().subscribe((children=>{
      this.children = children;
    }))
    this.route.params.forEach(i => {
      if(i["id"] != null){
        this.data.id = i["id"];
        this.onSelect(this.data);
      }
    });
  }
  onSelect(selectedChild:any){
    this.router.navigate([selectedChild.id],{relativeTo:this.route,skipLocationChange: true})
  }
}
