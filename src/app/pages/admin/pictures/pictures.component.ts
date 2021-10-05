import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Child, NameOfClass } from '../../../@core/models/child';
import { ChildService } from '../../../@core/services/child.service';

@Component({
  selector: 'ngx-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent implements OnInit {
  children:Child[];
  currentClassName:NameOfClass; 
  constructor(
    private childService:ChildService,
    private router:Router,
    private route:ActivatedRoute
    ) {
      localStorage.setItem('fromPicture','true');
  }

  ngOnInit(): void {
    this.currentClassName = this.childService.getCurrentClassName();
    this.childService.getAllChildren().subscribe(children=>{
      this.children = children;
    })
  }
  onSelect(selectedChild:Child){
    this.router.navigate([selectedChild.id],{relativeTo:this.route})
  }

}
