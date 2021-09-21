import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildService } from '../../../../@core/services/child.service';
import { switchMap } from 'rxjs/operators';
import { Child } from '../../../../@core/models/child';
import { UsersService } from '../../../../@core/services/users.service';
import { User, USERROLE } from '../../../../@core/models/user';
import { NbDialogService } from '@nebular/theme';
import { YesNoDialogComponent } from '../../../../components/yes-no-dialog/yes-no-dialog.component';
import { group } from 'console';
import { ToastService } from '../../../../@core/services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isInvalidControl } from '../../../../@core/utils/form.util';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'ngx-child-detail',
  templateUrl: './child-detail.component.html',
  styleUrls: ['./child-detail.component.scss']
})
export class ChildDetailComponent implements OnInit {
  childForm:FormGroup;
  childId:number;
  currentUser:User;
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
      if(this.child.video == true){
        this.privacySelected.push('video')
      }
      if(this.child.newsLetter == true){
        this.privacySelected.push('newsLetter')
      }
      if(this.child.fridaysLetter == true){
        this.privacySelected.push('fridaysLetter')
      }
      if(this.child.internetSite == true){
        this.privacySelected.push('internetSite')
      }
      if(this.child.yearbook == true){
        this.privacySelected.push('yearbook')
      }
      if(this.child.flyer == true){
        this.privacySelected.push('flyer')
      }
      if(this.child.magazine == true){
        this.privacySelected.push('magazine')
      }
      if(this.child.facebook == true){
        this.privacySelected.push('facebook')
      }
      if(this.child.instagram == true){
        this.privacySelected.push('instagram')
      }
      if(this.child.reenrollment == true){
        this.othersSelected.push('reenrollment')
      }
      if(this.child.dischargeOfResponibility == true){
        this.othersSelected.push('dischargeOfResponibility')
      }
      if(this.child.imageRights == true){
        this.othersSelected.push('imageRights')
      }
      if(this.child.healthProtocol == true){
        this.othersSelected.push('healthProtocol')
      }
      if(this.child.financialContract == true){
        this.othersSelected.push('financialContract')
      }
      if(this.child.interieurRules == true){
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
        console.log('nat >>',nat)
        //nat = nat.split('\", \"')
        this.nationalities.forEach((val,i)=>{
         nat.forEach((v,i) => {
            if(v == val.name){
              this.selectedNation.push(val.id)
            }
          })
          // if(this.child.nationality == val.name){
          //   this.selectedNation.push(val.name);
          // }
        })
        console.log('slected nation >>', this.selectedNation)
      })
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
      emailOfFather:['',[Validators.email]],
      video:[''],
      newsLetter:[''],
      fridaysLetter:[''],
      internetSite:[''],
      yearbook:[''],
      flyer:[''],
      magazine:[''],
      facebook:[''],
      instagram:[''],
      reenrollment:[''],
      dischargeOfResponibility:[''],
      imageRights:[''],
      healthProtocol:[''],
      financialContract:[''],
      interieurRules:[''],   
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
          this.child.siblings=[];          
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
        data.video = this.video;
      }
      if(this.newsLetter){
        data.newsLetter = this.newsLetter;
      }
      if(this.fridaysLetter){
        data.fridaysLetter = this.fridaysLetter;
      }
      if(this.internetSite){
        data.internetSite = this.internetSite;
      }
      if(this.yearbook){
        data.yearbook = this.yearbook;
      }
      if(this.flyer){
        data.flyer = this.flyer;
      }
      if(this.magazine){
        data.magazine = this.magazine;
      }
      if(this.facebook){
        data.facebook = this.facebook;
      }
      if(this.instagram){
        data.instagram = this.instagram;
      }
      if(this.reenrollment){
        data.reenrollment = this.reenrollment;
      }
      if(this.dischargeOfResponibility){
        data.dischargeOfResponibility = this.dischargeOfResponibility;
      }
      if(this.imageRights){
        data.imageRights = this.imageRights;
      }
      if(this.healthProtocol){
        data.healthProtocol = this.healthProtocol;
      }
      if(this.financialContract){
        data.financialContract = this.financialContract;
      }
      if(this.interieurRules){
        data.interieurRules = this.interieurRules;
      }

      data.authPersons = []
      data.emergencyContacts = []
      console.log('data',data)
      data.birth = moment(data.birth).format("YYYY-MM-DD")
      this.childService.UpdateChild(data).subscribe(_=>{
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
