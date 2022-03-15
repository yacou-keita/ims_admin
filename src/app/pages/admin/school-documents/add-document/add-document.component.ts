import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgxFileUploadStorage, NgxFileUploadRequest,NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadFactory } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DocumentsService } from '../../../../@core/services/documents.service';
import { DocumentFor } from '../../../../@core/models/document';
import { environment } from "../../../../../environments/environment";
import { UsersService } from '../../../../@core/services/users.service';
@Component({
  selector: 'ngx-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  @Output('onUploaded') onUploadedEvent = new EventEmitter();
  selectList:any;
  uploadUrl:string;
  documentFor:DocumentFor;
  Classroom = DocumentFor.Classroom;
  All = DocumentFor.All;
  Teacher = DocumentFor.Teacher;
  Admin = DocumentFor.Admin;
  Baobab = DocumentFor.Baobab;
  Iroko = DocumentFor.Iroko;
  Bamboo = DocumentFor.Bamboo;
  Acajou = DocumentFor.Acajou;
  Samba = DocumentFor.Samba;
  public uploadStates = NgxFileUploadState;
  public uploads: NgxFileUploadRequest[] = [];

  public destroy$: Subject<boolean> = new Subject();
  public storageClasrrom: NgxFileUploadStorage;
  public storageAll: NgxFileUploadStorage;
  public uploadedClassroomRequestIds:any[];
  public uploadedAllRequestIds:any[];
  public constructor(         
    private documentService:DocumentsService,
    private userService:UsersService
  ) {
    this.documentFor = DocumentFor.All;
    this.uploadUrl = `${environment.API_URL}/upload/document/`;
    // this.userService.getClasses().subscribe((classes) => {
      
    //   classes.forEach((val,i)=>{
    //     this.selectList.push({key:val.name,value:val.name});
    //   })
    // })
    this.selectList = Object.keys(DocumentFor).map(key=>{return {key:key, value:DocumentFor[key]}});
    this.storageClasrrom = new NgxFileUploadStorage({
      concurrentUploads: 4,
    });
    this.storageAll = new NgxFileUploadStorage({
      concurrentUploads: 4,
    });
    this.uploadedClassroomRequestIds = [];
    this.uploadedAllRequestIds = [];
    this.storageClasrrom.change().subscribe((requests:NgxFileUploadRequest[])=>{
      requests.forEach(item=>{        
        if(item.isCompleted()){
          if(this.documentFor == 'Classroom'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Classroom, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Baobab'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Baobab, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Iroko'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Iroko, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Bamboo'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Bamboo, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Acajou'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Acajou, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Samba'){
            if(!this.uploadedClassroomRequestIds.includes(item.requestId)){
              this.uploadedClassroomRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Samba, data:item.data.response.body});
            }
          }
          
          
        }
      })
    })

    this.storageAll.change().subscribe((requests:NgxFileUploadRequest[])=>{
      requests.forEach(item=>{        
        if(item.isCompleted()){
          if(this.documentFor == 'All'){
            if(!this.uploadedAllRequestIds.includes(item.requestId)){
              this.uploadedAllRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.All, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Teacher'){
            if(!this.uploadedAllRequestIds.includes(item.requestId)){
              this.uploadedAllRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Teacher, data:item.data.response.body});
            }
          }else if(this.documentFor == 'Admin'){
            if(!this.uploadedAllRequestIds.includes(item.requestId)){
              this.uploadedAllRequestIds.push(item.requestId);
              this.onUploadedEvent.emit({documentFor:DocumentFor.Admin, data:item.data.response.body});
            }
          }
          
          
        }
      })
    })
    
    
  }

  ngOnInit(): void {
  }
  selectChange($event){
    this.documentFor = $event;

  }

}
