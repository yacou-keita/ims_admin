import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { switchMap } from 'rxjs/operators';
import { __createBinding } from 'tslib';
import { Child, NameOfClass, SiblingChild } from '../../../../@core/models/child';
import { ChildService } from '../../../../@core/services/child.service';
import { ToastService } from '../../../../@core/services/toast.service';

@Component({
  selector: 'ngx-add-sibling',
  templateUrl: './add-sibling.component.html',
  styleUrls: ['./add-sibling.component.scss']
})
export class AddSiblingComponent implements OnInit {

  children:Child[]; // Children who are not siblings of childId
  childId:number;
  child:Child;
  currentClassName:NameOfClass; 
  selectedChildren:Child[];
  constructor(
    private childService:ChildService,
    private router:Router,
    private route:ActivatedRoute,
    private toastrService:ToastService
    ) {
  }

  ngOnInit(): void { 
    this.selectedChildren = [];
    
    this.currentClassName = this.childService.getCurrentClassName();
    this.route.paramMap.pipe(switchMap(
      params => {
        this.childId = Number(params.get('childId'));
        return this.childService.getAllChildren();
      }
    )).subscribe((data:Child[]) => {
      this.children = data.reduce((newData, child:Child)=>{
        if(child.siblings_data == null){
          child.siblings_data = [];
        }
        if(child.id == this.childId)
          this.child = child;
          //if(!child.siblings_data.find((item:SiblingChild)=>{return item.id == this.childId}))
        else {
            newData.push(child);
          }
        
        return newData;
      }, []);  
    })
  }
  onSelect(selectedChild:Child){
    this.router.navigate([selectedChild.id],{relativeTo:this.route})
  }
  back(){
    this.router.navigate(['..'],{relativeTo:this.route});
  }
  onSubmit(){
    this.childService.AddSiblings(this.childId, this.selectedChildren).subscribe(_=>{
      this.toastrService.success('Add Siblings Succesfully', 'success');
      this.router.navigate(['..'],{relativeTo:this.route});
      
    })
    // this.childService.UpdateChild(this.childId,this.selectedChildren).subscribe( _ => {
    //   this.toastrService.success('Child Sibling Details has been updated successfully','success');
    // })
  }
}
