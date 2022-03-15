import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../@core/models/user';
import { DocumentsService } from '../../../@core/services/documents.service';
import { UsersService } from '../../../@core/services/users.service';

@Component({
  selector: 'ngx-school-documents',
  templateUrl: './school-documents.component.html',
  styleUrls: ['./school-documents.component.scss']
})
export class SchoolDocumentsComponent implements OnInit {

  public documents:any[] = [];
  private currentUserSubscription:Subscription;
  private user:User
  constructor(private documentService:DocumentsService,private userService: UsersService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUserSubject.subscribe(user=>{
      this.user = user;
    })
    this.documentService.getDocuments().subscribe(documents=>{
      //this.documents = documents;
      documents.forEach(val => {
        this.user.classNames.forEach(v =>{
          if(val.documentfor == v.toString()){
            this.documents.push(val)
          }
        })
        
      })
    })
    
  }

}
