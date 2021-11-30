import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { ExchangeLibrary } from '../models/exchangelibrary';
import {books} from '../dummy';
@Injectable({
  providedIn: 'root'
})
export class ExchangeLibraryService {
  api_url = environment.API_URL;
  
  constructor(private httpClient:HttpClient) { 
  }

  getAllBooks():Observable<ExchangeLibrary[]>{
    return this.httpClient.get<ExchangeLibrary[]>(`${this.api_url}/exchangelibraries/`);
  }
  getBookById(id:number):Observable<ExchangeLibrary>{
    return this.httpClient.get<ExchangeLibrary>(`${this.api_url}/exchangelibraries/${id}/`);
  }
  addBook(book:ExchangeLibrary):Observable<any>{
    let data:any = book;
    const formData = new FormData();
    Object.keys(book).forEach((key)=>{
      formData.append(key, book[key]);
    })    
    if(data.pictureFile) formData.set('picture', data.pictureFile);
    if(data.child) formData.set('child', data.child.id)
   // if(data.donator) formData.set('donator',data.donator.first_name+' '+data.donator.last_name)
    if(data.pictureFile) data.picture = data.pictureFile;
    // if(data.child) data.child = data.child.id
    return this.httpClient.post(`${this.api_url}/exchangelibraries/`, formData);    
  }
  updateBook(id:number,book:ExchangeLibrary):Observable<any>{
    let data:any = book;
    const formData = new FormData();
    Object.keys(book).forEach((key)=>{
      formData.append(key, book[key]);
    })    
    if(data.pictureFile) formData.set('picture', data.pictureFile);
    if(data.child) formData.set('child', data.child.id)
   // if(data.donator) formData.set('donator',data.donator.first_name+' '+data.donator.last_name)
    return this.httpClient.put(`${this.api_url}/exchangelibraries/${id}/`, formData);    
  }
  deleteBook(book:ExchangeLibrary):Observable<any>{
    return this.httpClient.delete(`${this.api_url}/exchangelibraries/${book.id}/`);    
  }
  
}
