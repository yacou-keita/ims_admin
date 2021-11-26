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
    this.clubForm = this.fb.group({
      title:['', Validators.required],
      startDate:[null, Validators.nullValidator],
      endDate:[null, Validators.nullValidator],
      price:['', [Validators.required,Validators.min(1)]],
      limit:[10, [Validators.required, Validators.min(1)]],
      comment:['', Validators.nullValidator]
    })
    if(this.edit == true){
      let clubId = localStorage.getItem('clubId')
      forkJoin({
        club: this.miniClubService.getMiniClub(clubId)
      }).subscribe(ret=>{
        this.clubs = ret.club;      
      })
      this.clubForm.reset(this.clubs)
    }
    // this.dateAdapter.setLocale(this.translateService.currentLang)
    // this.translateService.onLangChange.subscribe((lang:LangChangeEvent)=>{this.dateAdapter.setLocale(lang.lang)});
    
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
          children:[]
        }
      }
      
    }else{
      this.clubForm.reset(this.initdata)
    }
  }
  onFormSubmit(){
    this.clubForm.markAllAsTouched();
    if(this.clubForm.valid){
      this.club = Object.assign(this.initdata, this.clubForm.value);
      this.submitEvent.emit(this.club);
    }
  }
  isInvalidControl = isInvalidControl
}
