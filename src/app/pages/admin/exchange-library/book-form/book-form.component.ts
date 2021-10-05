import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Child } from '../../../../@core/models/child';
import { BookStatus, ExchangeLibrary } from '../../../../@core/models/exchangelibrary';
import { ChildService } from '../../../../@core/services/child.service';
import { ExchangeLibraryService } from '../../../../@core/services/exchange-library.service';
import { UsersService } from '../../../../@core/services/users.service';
import { isInvalidControl } from "../../../../@core/utils/form.util";

@Component({
  selector: 'ngx-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  @Input('data') initdata:ExchangeLibrary;
  @Input('edit') edit:boolean;
  @Output('onSubmit') submitEvent =  new EventEmitter<any>();
  bookForm:FormGroup;
  book;
  children:Child[];
  bookId;
  pageTitle;
  submit;
  constructor(
    private fb:FormBuilder, private userService:UsersService, private childService:ChildService,
    private exchangeLibraryService: ExchangeLibraryService,private dateAdapter:DateTimeAdapter<any>,
  ) { dateAdapter.setLocale('en-IN')}

  ngOnInit(): void {
    if(this.edit == true){
      this.pageTitle ="Edit Book Details"
      this.submit = "Update"
      this.bookId = localStorage.getItem('bookID')
      forkJoin({
        children:this.childService.getAllChildren(),
      books: this.exchangeLibraryService.getBookById(this.bookId)
      }).subscribe(ret=>{
        this.children = ret.children;
        this.book = ret.books
        this.bookForm.reset(this.book)  
      })
    }else{
      this.pageTitle = "New Book"
      this.submit = "Add"
      forkJoin({
        children:this.childService.getAllChildren(),
      // books: this.exchangeLibraryService.getBookById(this.bookId)
      }).subscribe(ret=>{
        this.children = ret.children;
        // this.book = ret.books
        // this.bookForm.reset(this.book)  
      })
    }
    this.bookId = localStorage.getItem('bookID')
    forkJoin({
      children:this.childService.getAllChildren(),
     // books: this.exchangeLibraryService.getBookById(this.bookId)
    }).subscribe(ret=>{
      this.children = ret.children;
      // this.book = ret.books
      // this.bookForm.reset(this.book)  
    })
    this.bookForm = this.fb.group({
      title:['', Validators.required],
      picture:['', Validators.nullValidator],
      pictureFile:undefined,
      author:['',Validators.nullValidator],
      code:['',Validators.nullValidator],
      donator:['',Validators.nullValidator],
      comment:['', Validators.nullValidator],
      status:[BookStatus.PRESENT, Validators.nullValidator],
      child:['',Validators.nullValidator],
      booked_on:['',Validators.nullValidator],
      returned_on:['',Validators.nullValidator],
      booked_status:['',Validators.nullValidator]
    })
    if(!this.initdata)
    {
      if(this.book){
        this.bookForm.reset(this.book)
      }else{
        this.initdata = {
          id:undefined,
          title:undefined,
          picture:undefined,
          author:undefined,
          code:undefined,
          status:BookStatus.PRESENT,
          donator:undefined,
          child:undefined,
          booked_on:null,
          booked_status:'false',
          returned_on:null
        }
      }
      
    }else{
      this.bookForm.reset(this.initdata)
    }
  }

  changeListener(event):void {
    console.log(event);
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.bookForm.get('picture').setValue(event.target.result);        
      }
      this.bookForm.get('pictureFile').setValue(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  get picture():string { return this.bookForm.get('picture').value}
  onFormSubmit(){
    this.bookForm.markAllAsTouched();
    if(this.bookForm.valid){
      
      if(this.bookForm.value.booked_on){
        this.bookForm.value.booked_on = moment(this.bookForm.value.booked_on).format("YYYY-MM-DD")
        this.bookForm.value.booked_status = true
      }else
        this.bookForm.value.booked_on = null;
      if(this.bookForm.value.returned_on){
        this.bookForm.value.returned_on = moment(this.bookForm.value.returned_on).format("YYYY-MM-DD")
        this.bookForm.value.booked_status = false
      }else
        this.bookForm.value.returned_on = null;
      this.book = Object.assign(this.initdata, this.bookForm.value);
      this.submitEvent.emit(this.book);
    }
  }
  isInvalidControl = isInvalidControl

}
