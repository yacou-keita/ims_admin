import { Component, OnInit } from '@angular/core';
import { DocumentsService } from "../../../@core/services/documents.service";
import { documents } from '../../../@core/dummy';
import { Document, DocumentFor } from '../../../@core/models/document';
import { ToastService } from '../../../@core/services/toast.service';
import { UsersService } from '../../../@core/services/users.service';
@Component({
  selector: 'ngx-school-documents',
  templateUrl: './school-documents.component.html',
  styleUrls: ['./school-documents.component.scss']
})
export class SchoolDocumentsComponent implements OnInit {

  public documents:any[];
  public isAdd:boolean = false;
  public selectList = ['All','Teacher','Admin','Parents'];
  public selectedItem = 'All'
  public currentClassName = 'All'
  public docFor = 'All';
  public docForClass = 'All'
  public classNameList = ['All','Teachers','Admin','All ClassRooms'];
  constructor(private documentService:DocumentsService, private toastService:ToastService, private userService:UsersService) { }

  ngOnInit(): void {
    this.documents=[];
    this.documentService.getDocuments().subscribe(documents=>{
      this.documents = documents;
    })
    this.userService.getClasses().subscribe((classes) => {
      classes.forEach((val,i)=>{
        this.classNameList.push(val.name);
      })
      // this.selectList.forEach((val,i)=>{
      //   this.classNameList.push(val)
      // })
    })
  }
  get forClassroomDocuments(){
    return this.documents.filter((item:Document) => {
      return item.documentfor == this.docForClass
    })
  }
  get forAllDocuments(){
    return this.documents.filter((item:Document) => {
      return item.documentfor == this.docFor
    })
  }
  selectValue(event){
    console.log('eve >>', event)
    if(event=='Teachers')
    {this.docFor ='Teacher'}
    else{this.docFor = event;}
    
    this.forAllDocuments
  }
  selectClass(event){
    console.log('eve >>', event)
    if(event=='Teachers')
    {this.docForClass ='Teacher'}
    else if(event=='All ClassRooms')
    {this.docForClass ='Classroom'}
    else{
    this.docForClass = event;
    }
    this.forClassroomDocuments
  }
  onUploaded(data){
    this.documents.push({
      name:data.data.name,
      url:data.data.url,
      documentfor:data.documentFor
    })
  }

  removeDocument(document:Document) {

    this.documentService.deleteDocument(document.id).toPromise().then(_ =>{
      this.toastService.success('Document has been deleted','success');
      this.documents = this.documents.reduce((retArray, item:Document)=>{
        if(item.id != document.id)
          retArray.push(item);
        return retArray
      }, [])
      window.location.reload();
    })
  }

}
