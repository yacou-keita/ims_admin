import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
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
  constructor(private location:Location,
    private childService:ChildService,
    private toastService:ToastService,
    private translateService:TranslateService,
    private dateAdapter:DateTimeAdapter<any>,
    private userService:UsersService,
    private fb:FormBuilder,
    private dialogService:NbDialogService
    ) {
      this.dateAdapter.setLocale(this.translateService.currentLang);
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
  }

  ngOnInit(): void {
    this.userService.getClasses().subscribe((classes) => {
      this.classNameList = classes;
    })
    this.userService.getNationalities().subscribe((nationalities) =>{
      this.nationalities = nationalities;
    })
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
