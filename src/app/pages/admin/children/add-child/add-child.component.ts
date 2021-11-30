import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from "@angular/common";
import { ChildService } from '../../../../@core/services/child.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AtleastOneValidator } from '../../../../@core/utils/validators.util';
import { NameOfClass } from '../../../../@core/models/child';
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { ToastService } from '../../../../@core/services/toast.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import * as moment from 'moment';
import { UsersService } from '../../../../@core/services/users.service';
import { AddNewItemComponent } from '../../../add-new-item/add-new-item.component';
import { DateFilterPipe } from '../../../../shared/date-filter.pipe';
@Component({
  selector: 'ngx-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.scss']
})
export class AddChildComponent implements OnInit {
  childForm:FormGroup;
  classNameList = [];
  nationalities = [];
  isSubmitting:boolean = false;
  //dateFormat = 'dd/mm/yyyy';
  privacy = ['video','newsLetter','fridaysLetter','internetSite','yearbook','flyer','magazine','facebook','instagram'];
  others = ['reenrollment','dischargeOfResponibility','imageRights','healthProtocol','financialContract','interieurRules']
  video:boolean = false;
  newsLetter:boolean = false;
  fridaysLetter:boolean = false;
  internetSite:boolean = false;
  yearbook:boolean = false;
  flyer:boolean = false;
  magazine:boolean = false;
  facebook:boolean = false;
  instagram:boolean = false;
  reenrollment:boolean = false;
  dischargeOfResponibility:boolean = false;
  imageRights:boolean = false;
  healthProtocol:boolean = false;
  financialContract:boolean = false;
  interieurRules:boolean = false;

  constructor(private location:Location,
    private childService:ChildService,
    private toastService:ToastService,
    private translateService:TranslateService,
    private dateAdapter:DateTimeAdapter<any>,
    private userService:UsersService,
    private fb:FormBuilder,
    private dialogService:NbDialogService,
    private datePipe: DatePipe
    ) {
      dateAdapter.setLocale('en-IN')
      //this.dateAdapter.setLocale(this.translateService.currentLang);
    this.translateService.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.dateAdapter.setLocale(event.lang)
    })
      this.classNameList = this.childService.classNameList;
      this.childForm = this.fb.group({
        photo:[undefined],
        photoFile:[undefined],
        first_name: ['', Validators.required],
        last_name:  ['', Validators.required],
        // moment().subtract(15,'years').toDate()
        birth:['', Validators.required],
        gender:['Male', Validators.required],
        // nationality:['',Validators.required],
        nationality:[[],Validators.required],
        address:[''],
        nameOfClass:['', Validators.required],
        firstNameOfMother:['',Validators.required],
        lastNameOfMother:['',Validators.required],
        phoneOfMother:[''],
        firstNameOfFather:['', Validators.required],
        lastNameOfFather:['',Validators.required],
        emailOfMother:['',[Validators.email]],
        phoneOfFather:[''],
        emailOfFather:['',[Validators.email]]      
      });
      this.childForm['birth'] = datePipe.transform(this.childForm['birth'],'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.userService.getClasses().subscribe((classes) => {
      this.classNameList = classes;
    })
    this.userService.getNationalities().subscribe((nationalities) =>{
      this.nationalities = nationalities;
    })
  }
  privacyCheck(event,name){
    if(name == 'video'){
      this.video = true
    }
    if(name == 'newsLetter'){
      this.newsLetter = true
    }
    if(name == 'fridaysLetter'){
      this.fridaysLetter = true
    }
    if(name == 'internetSite'){
      this.internetSite = true
    }
    if(name == 'yearbook'){
      this.yearbook = true
    }
    if(name == 'flyer'){
      this.flyer = true
    }
    if(name == 'magazine'){
      this.magazine = true
    }
    if(name == 'facebook'){
      this.facebook = true
    }
    if(name == 'instagram'){
      this.instagram = true
    }

  }
  othersCheck(event,name){
    if(name == 'reenrollment'){
      this.reenrollment = true
    }
    if(name == 'dischargeOfResponibility'){
      this.dischargeOfResponibility = true
    }
    if(name == 'imageRights'){
      this.imageRights = true
    }
    if(name == 'healthProtocol'){
      this.healthProtocol = true
    }
    if(name == 'financialContract'){
      this.financialContract = true
    }
    if(name == 'interieurRules'){
      this.interieurRules = true
    }

  }
  onSubmit(){
    this.childForm.markAllAsTouched();
    if(this.childForm.valid){
      let data=this.childForm.value;
      let nat = [];
      data.nameOfClass = data.nameOfClass.name;
      data.nationality.forEach((val,i)=>{
        nat.push(val.name);
      })
      data.nationality = nat;
      if(!data.photo) data.photo = undefined;
      if(this.video){
        data.privacyRights.push({'Video':"true"});
      }
      if(this.newsLetter){
        data.privacyRights.push({'NewsLetter':"true"});
      }
      if(this.fridaysLetter){
        data.privacyRights.push({'FridaysLetter':"true"});
      }
      if(this.internetSite){
        data.privacyRights.push({'InternetSite':"true"});
      }
      if(this.yearbook){
        data.privacyRights.push({'Yearbook':"true"});
      }
      if(this.flyer){
        data.privacyRights.push({'Flyer':"true"});
      }
      if(this.magazine){
        data.privacyRights.push({'Video':"true"});
      }
      if(this.facebook){
        data.privacyRights.push({'Facebook':"true"});
      }
      if(this.instagram){
        data.privacyRights.push({'Instagram':"true"});
      }
      if(this.magazine){
        data.privacyRights.push({'Magazine':'true'})
      }
      if(this.reenrollment){
        data.flag_re_enrollment = this.reenrollment;
      }
      if(this.dischargeOfResponibility){
        data.flag_responsibility_discharge = this.dischargeOfResponibility;
      }
      if(this.imageRights){
        data.flag_image_rights = this.imageRights;
      }
      if(this.healthProtocol){
        data.flag_health_protocols = this.healthProtocol;
      }
      if(this.financialContract){
        data.flag_fin_contract = this.financialContract;
      }
      if(this.interieurRules){
        data.flag_interieur_rules = this.interieurRules;
      }

      data.authPersons = []
      data.emergencyContacts = []
      console.log('data',data)
      data.birth = moment(data.birth).format("YYYY-MM-DD")
      this.isSubmitting = true
      this.childService.addNewChild(data).subscribe(_=>{
        this.isSubmitting = false;
        this.toastService.success('New Child has been added succesfully','success');
      })
    }
  }
  addNewNationaliy(){
    this.dialogService.open(AddNewItemComponent,{context:{
      title:'Add New Nationality'
    }}).onClose.subscribe(ret=>{
      if(ret==true)
      window.location.reload();
    })
  }
  changeListener(event):void {
    console.log(event);
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.childForm.get('photo').setValue(event.target.result);        
      }
      this.childForm.get('photoFile').setValue(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  back(){
    this.location.back();
  }
  get photo():string{
    return this.childForm.get('photo').value? this.childForm.get('photo').value : '';
  }
  isInvalidControl=isInvalidControl;
}
