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
  donator
  otherOpt:boolean= false;
  selectedOption
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
        this.donator = ['Other']
        this.children = ret.children;
        
        this.children.forEach(val => {
          this.donator.push(val.first_name +' '+ val.last_name)
        })
        this.book = ret.books
        this.donator.push(this.book.donator)
        this.children.forEach(val => {
          let name = val.first_name + ' ' + val.last_name
          if(val.id == this.book.child)
            this.book.child = val
          // if(name == this.book.donator)
          //   this.selectedOption = val
        })
        this.selectedOption = this.book.donator
        this.bookForm.reset(this.book)  
      })
    }else{
      this.pageTitle = "New Book"
      this.submit = "Add"
      forkJoin({
        children:this.childService.getAllChildren(),
      // books: this.exchangeLibraryService.getBookById(this.bookId)
      }).subscribe(ret=>{
        this.donator = ['Other']
        this.children = ret.children;
        this.children.forEach(val => {
          this.donator.push(val.first_name +' '+ val.last_name)
        })
        // this.book = ret.books
        // this.bookForm.reset(this.book)  
      })
    }
    this.bookId = localStorage.getItem('bookID')
    forkJoin({
      children:this.childService.getAllChildren(),
     // books: this.exchangeLibraryService.getBookById(this.bookId)
    }).subscribe(ret=>{
      this.donator = ['Other']
      this.children = ret.children;
      this.children.forEach(val => {
        this.donator.push(val.first_name +' '+ val.last_name)
      })
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
      booked_on:[null,Validators.nullValidator],
      returned_on:[null,Validators.nullValidator],
      booked_status:[false,Validators.nullValidator]
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
          status:undefined,
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
  optionClick(opt){
    if(opt == 'Other'){
      this.otherOpt = true
    }else
      this.otherOpt = false;
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
      console.log('photo >>', this.bookForm)
    }
  }
  get picture():string { return this.bookForm.get('picture').value}
  onFormSubmit(){
    this.bookForm.markAllAsTouched();
    if(this.bookForm.valid){
      this.bookForm.value.donator = this.selectedOption 
      if(this.bookForm.value.booked_on){
        this.bookForm.value.booked_on = moment(this.bookForm.value.booked_on).format("YYYY-MM-DD") + 'T08:05:53.000Z'
        this.bookForm.value.booked_status = true
      }else{
        //this.bookForm.value.booked_on = null;
        delete this.bookForm.value.booked_on
        delete this.initdata.booked_on
        delete this.bookForm.value.child
        delete this.initdata.child
      }
      if(this.bookForm.value.returned_on){
        this.bookForm.value.returned_on = moment(this.bookForm.value.returned_on).format("YYYY-MM-DD") + 'T08:05:53.000Z'
        this.bookForm.value.booked_status = false
        this.bookForm.value.status = BookStatus.PRESENT
      }else{
        //this.bookForm.value.returned_on = null;
        delete this.bookForm.value.returned_on
        delete this.initdata.returned_on
      }
      if(this.bookForm.value.pictureFile == null){
        delete this.bookForm.value.pictureFile
        delete this.bookForm.value.picture
        delete this.initdata.picture
      }
      this.book = Object.assign(this.initdata, this.bookForm.value);
      this.submitEvent.emit(this.book);
    }
  }
  isInvalidControl = isInvalidControl

}
