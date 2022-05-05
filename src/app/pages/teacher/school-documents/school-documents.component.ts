import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../@core/models/user';
import { DocumentsService } from '../../../@core/services/documents.service';
import { UsersService } from '../../../@core/services/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-school-documents',
  templateUrl: './school-documents.component.html',
  styleUrls: ['./school-documents.component.scss']
})
export class SchoolDocumentsComponent implements OnInit {

  public documents: any[] = [];
  private currentUserSubscription: Subscription;
  private user: User
  notification_id: number
  constructor(private documentService: DocumentsService, private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.notification_id = this.route.snapshot.params.id
    this.currentUserSubscription = this.userService.currentUserSubject.subscribe(user => {
      this.user = user;
    })

    this.getDocuments();
  }


  private getDocuments() {
    this.documentService.getDocuments().subscribe(documents => {

      documents.forEach(val => {

        this.user.classNames.forEach(v => {

          if (val.documentfor == v.toString()) {

            this.documents.push(val);
          }
        });

      });
    });
  }
}
