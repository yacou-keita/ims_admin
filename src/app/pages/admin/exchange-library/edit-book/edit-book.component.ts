import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ExchangeLibrary } from '../../../../@core/models/exchangelibrary';
import { ExchangeLibraryService } from '../../../../@core/services/exchange-library.service';
import { ToastService } from '../../../../@core/services/toast.service';

@Component({
  selector: 'ngx-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {
  bookId;
  books:ExchangeLibrary;
  constructor(
    private exchangeLibraryService:ExchangeLibraryService,
    private toastSerivce:ToastService,
    private route:ActivatedRoute,
    private router:Router
    ){
      this.bookId = localStorage.getItem('bookID')
    forkJoin({
      books: this.exchangeLibraryService.getBookById(this.bookId)
    }).subscribe(ret=>{
      this.books = ret.books;      
    })
  }
  ngOnInit(){
    
  }
  onSubmit(data:ExchangeLibrary){
    this.exchangeLibraryService.updateBook(this.bookId,data).subscribe(_=>{            
      this.toastSerivce.success('Book has been updated successfully','success');
      this.back();
    });
  }
  back(){
    this.router.navigate(['..'],{relativeTo:this.route})
  }

}
