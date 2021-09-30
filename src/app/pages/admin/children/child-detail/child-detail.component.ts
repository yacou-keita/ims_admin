import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildService } from '../../../../@core/services/child.service';
import { switchMap } from 'rxjs/operators';
import { Child } from '../../../../@core/models/child';
import { UsersService } from '../../../../@core/services/users.service';
import { User, USERROLE } from '../../../../@core/models/user';
import { NbDialogService } from '@nebular/theme';
import { YesNoDialogComponent } from '../../../../components/yes-no-dialog/yes-no-dialog.component';
import { ToastService } from '../../../../@core/services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isInvalidControl } from '../../../../@core/utils/form.util';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'ngx-child-detail',
  templateUrl: './child-detail.component.html',
  styleUrls: ['./child-detail.component.scss','../add-child/add-child.component.scss']
})
export class ChildDetailComponent implements OnInit {
  childForm:FormGroup;
  childId:number;
  currentUser = {role:{} , role_name:{} , classNames:{}} as User;
  child:Child;
  classNameList = [];
  selectedItem;
  nationalities = [];
  selectedNation = [];
  privacy = ['video','newsLetter','fridaysLetter','internetSite','yearbook','flyer','magazine','facebook','instagram'];
  privacySelected = [];
  others = ['reenrollment','dischargeOfResponibility','imageRights','healthProtocol','financialContract','interieurRules'];
  othersSelected = [];
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
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private userService:UsersService,
    private childService:ChildService,
    private toastService:ToastService,
    private fb:FormBuilder,
    private dialogService:NbDialogService
  ) { 
    this.userService.getCurrentUser().subscribe((user:User)=>{this.currentUser = user;})
    this.route.paramMap.pipe(switchMap(
      params => {
        this.childId = Number(params.get('childId'));
        return this.childService.getChildById(this.childId);
      }
    )).subscribe((child:Child) => {
      this.child = child;
      this.childForm.reset(child);
      if(this.child.flag_video == true){
        this.privacySelected.push('video')
      }
      if(this.child.flag_newsletter == true){
        this.privacySelected.push('newsLetter')
      }
      if(this.child.flag_friday_letter == true){
        this.privacySelected.push('fridaysLetter')
      }
      if(this.child.flag_internet_sites == true){
        this.privacySelected.push('internetSite')
      }
      if(this.child.flag_yearbook == true){
        this.privacySelected.push('yearbook')
      }
      if(this.child.flag_flyer == true){
        this.privacySelected.push('flyer')
      }
      if(this.child.flag_magazine == true){
        this.privacySelected.push('magazine')
      }
      if(this.child.flag_facebook == true){
        this.privacySelected.push('facebook')
      }
      if(this.child.flag_instagram == true){
        this.privacySelected.push('instagram')
      }
      if(this.child.flag_re_enrollment == true){
        this.othersSelected.push('reenrollment')
      }
      if(this.child.flag_responsibility_discharge == true){
        this.othersSelected.push('dischargeOfResponibility')
      }
      if(this.child.flag_image_rights == true){
        this.othersSelected.push('imageRights')
      }
      if(this.child.flag_health_protocols == true){
        this.othersSelected.push('healthProtocol')
      }
      if(this.child.flag_fin_contract == true){
        this.othersSelected.push('financialContract')
      }
      if(this.child.flag_interieur_rules == true){
        this.othersSelected.push('interieurRules')
      }
      this.userService.getClasses().subscribe((classes) => {
        this.classNameList = classes;
        this.classNameList.forEach((val,i)=>{
          if(this.child.nameOfClass == val.name){
            this.selectedItem = val.name;
          }
        })
      })
      this.userService.getNationalities().subscribe((nationalities) =>{
        this.nationalities = nationalities;
        let nat = this.child.nationality.substring(2, this.child.nationality.length-2).split('\", \"');
        //this.child.nationality = nat
        //nat = nat.split('\", \"')
        this.nationalities.forEach((val,i)=>{
         nat.forEach((v,i) => {
            if(v == val.name){
              this.selectedNation.push(val)
            }
          })
          // if(this.child.nationality == val.name){
          //   this.selectedNation.push(val.name);
          // }
          this.childForm.get("nationality").setValue(this.selectedNation);
        })
      })
      console.log('child >>', this.child.siblings_data)
      //this.child.nationality = this.child.nationality.replace(/[\[\]'"]+/g,'')//(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
    })
  }
  private destroy$:Subject<void>=new Subject<void>();
  ngOnInit(): void {
    this.childForm = this.fb.group({
      photo:[undefined],
      photoFile:[undefined],
      first_name: ['', Validators.required],
      last_name:  ['', Validators.required],
      // moment().subtract(15,'years').toDate()
      birth:['', Validators.required],
      gender:['', Validators.required],
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
      emailOfFather:['',[Validators.email]],
      flag_video:[''],
      flag_newsletter:[''],
      flag_friday_letter:[''],
      flag_internet_sites:[''],
      flag_yearbook:[''],
      flag_flyer:[''],
      flag_magazine:[''],
      flag_facebook:[''],
      flag_instagram:[''],
      flag_re_enrollment:[''],
      flag_responsibility_discharge:[''],
      flag_image_rights:[''],
      flag_health_protocols:[''],
      flag_fin_contract:[''],
      flag_interieur_rules:[''],   
    });
    
  }
  onSiblingClick(sibling:Child){
    this.router.navigate([`../${sibling.id}`],{relativeTo:this.route});
  }
  onRemoveSiblingClick(){
    this.dialogService.open(YesNoDialogComponent,{context:{
      title:'This child will be removed from sibling. Are you going to continue?'
    }}).onClose.subscribe(ret=>{
      if(ret==true)
        this.childService.RemoveChildFromSibling(this.child).subscribe( groupId=>{
          this.child.sibling_group = groupId;
          this.child.siblings_data=[];          
        })
    })
  }
  onAddSiblingClick(){
    this.router.navigate(['addsiblings'],{relativeTo:this.route});
  }
  onSetPWDClick(){
    this.router.navigate(['setpwd'],{relativeTo:this.route});
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
  back(){
    this.router.navigate(['/children']);
  }
  isTeacher(){
    return this.currentUser.role_name == USERROLE.Teacher;
  }
  getPhotoOfChild(){
    if(this.child)
      return this.child.photo? this.child.photo:'';
    return '';
  }
  isAdmin(user:User){
    return user.role_name == USERROLE.Admin;
  }
  changeListener(event):void {
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.childForm.get('photo').setValue(event.target.result);        
      }
      this.childForm.get('photoFile').setValue(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onSubmit(){ 
    this.childForm.markAllAsTouched();
    if(this.childForm.valid){
      let data=this.childForm.value;
      let nat = [];
      data.nameOfClass = this.selectedItem;
      
      if(data.nationality.length > 1){
        data.nationality.forEach((val,i)=>{
              nat.push(val.name);
        })
        data.nationality = nat;
      }
      
      if(!data.photo) data.photo = undefined;
      if(this.video){
        data.flag_video = this.video;
      }
      if(this.newsLetter){
        data.flag_newsletter = this.newsLetter;
      }
      if(this.fridaysLetter){
        data.flag_friday_letter = this.fridaysLetter;
      }
      if(this.internetSite){
        data.flag_internet_sites = this.internetSite;
      }
      if(this.yearbook){
        data.flag_yearbook = this.yearbook;
      }
      if(this.flyer){
        data.flag_flyer = this.flyer;
      }
      if(this.magazine){
        data.flag_magazine = this.magazine;
      }
      if(this.facebook){
        data.flag_facebook = this.facebook;
      }
      if(this.instagram){
        data.flag_instagram = this.instagram;
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
      
      data.birth = moment(data.birth).format("YYYY-MM-DD")
      this.childService.UpdateChild(this.childId,data).subscribe(_=>{
        this.toastService.success('Child Details has been updated successfully','success');
      })
    }
  }
  onDelete(){
    this.dialogService.open(YesNoDialogComponent,{context:{
      title:'Are you sure?'
    }}).onClose.subscribe(ret=>{
      if(ret==true)
        this.childService.deleteChild(this.childId).subscribe(_=>{
          this.toastService.warning('Child has been deleted','Delete');
          this.router.navigate(['..'],{relativeTo:this.route});
        })
    })    
  }
  get photo():string{
    return this.childForm.get('photo').value? this.childForm.get('photo').value : '';
  }
  isInvalidControl = isInvalidControl;
  ngOnDestroy() {    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
