import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MiniClub } from '../../../../@core/models/miniclub';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { DateTimeAdapter } from "@danielmoncada/angular-datetime-picker";
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MiniClubService } from '../../../../@core/services/mini-club.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'ngx-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.scss']
})
export class ClubFormComponent implements OnInit {
  @Input('data') initdata:MiniClub;
  @Input('edit') edit:boolean;
  @Output('onSubmit') submitEvent =  new EventEmitter<any>();
  clubForm:FormGroup;
  club:MiniClub;
  clubs;
  children=[];
  constructor(
    private fb:FormBuilder,
    private dateAdapter:DateTimeAdapter<any>,
    private translateService:TranslateService,
    private miniClubService:MiniClubService
  ) { 
    dateAdapter.setLocale('en-IN')
    this.translateService.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.dateAdapter.setLocale(event.lang)
    })
  }

  ngOnInit(): void {
    if(this.edit == true){
      let clubId = localStorage.getItem('clubId')
      forkJoin({
        club: this.miniClubService.getMiniClub(clubId)
      }).subscribe(ret=>{
        this.clubs = ret.club;
        this.clubForm.reset(this.clubs)
        this.clubForm.value.isPaid = []; 
        this.children = this.clubs.children
        this.children.forEach(val =>{
          if(this.clubs.isPaid){
            this.clubs.isPaid.forEach(v => {
              if(v == val.id){
                val.isPaid = true;
              }else{
                val.isPaid = false;
              }
            })
          }else
            val.isPaid = false;
        })
      })
      
    }

    this.clubForm = this.fb.group({
      title:['', Validators.required],
      startDate:[null, Validators.nullValidator],
      endDate:[null, Validators.nullValidator],
      price:['', [Validators.required,Validators.min(1)]],
      limit:[10, [Validators.required, Validators.min(1)]],
      comment:['', Validators.nullValidator],
      children:[[]],
      isPaid:[[],Validators.nullValidator]
    })
    
    if(!this.initdata)
    {
      if(this.clubs){
        this.clubForm.reset(this.initdata)
      }else{
        this.initdata = {
          id:undefined,
          title:undefined,
          comment:undefined,
          startDate:null,
          endDate:null,
          price:undefined,
          limit:undefined,
          children:[],
          isPaid:[]
        }
      }
      
    }else{
      this.clubForm.reset(this.initdata)
    }
  }

  checked(eve,child){
    if(eve == true){
      this.clubForm.value.children.forEach(val => {
        if(child.id == val.id){
          this.clubForm.value.isPaid.push(val.id)
        }
      })
    }else if(eve == false){
      this.clubForm.value.children.forEach(val => {
        if(child.id == val.id){
          this.clubForm.value.isPaid.pop(val.id)
        }
      })
    }
  }

  onFormSubmit(){
    this.clubForm.markAllAsTouched();
    console.log('formulair envoiye:',this.clubForm.markAllAsTouched())
    if(this.clubForm.valid){
      this.club = Object.assign(this.initdata, this.clubForm.value);
      
      // this.club.children.forEach(val => {
      //   if(val.isPaid == true){
      //     this.club.isPaid.push(val.id)
      //   }
      // })
      console.log('onFormSubmit',this.club)
      this.submitEvent.emit(this.club);
    }
  }



  isInvalidControl = isInvalidControl
}
