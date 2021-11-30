import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AppointmentService } from "../../../../@core/services/appointment.service";
import { UsersService } from "../../../../@core/services/users.service";
import { User } from "../../../../@core/models/user";
import { isInvalidControl } from "../../../../@core/utils/form.util";
import { Appointment, AppointmentStatus, AppointmentType } from "../../../../@core/models/appointment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  MustAfter } from "../../../../@core/utils/validators.util";
import * as moment from "moment";
import { switchMap } from 'rxjs/operators';
import { ToastService } from '../../../../@core/services/toast.service';
import { ChildService } from '../../../../@core/services/child.service';
import { forkJoin } from 'rxjs';
import { Child } from '../../../../@core/models/child';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ngx-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss']
})
export class AppointmentEditComponent implements OnInit {
  @Input('editmode') isEditmode:boolean;
  userId:number;
  appointmentId:number;
  user:User;
  appoinment:Appointment;
  submitButton;
  accpt:boolean = false;
  appointmentForm:FormGroup
  children:Child[];
  teachers:User[];
  showButtons:boolean = true;
  rescheduleText = false;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private toastrService:ToastService,
    private appointmentService:AppointmentService,
    private childService:ChildService,
    private userService:UsersService,
    private fb: FormBuilder,
    private dateAdapter:DateTimeAdapter<any>,
    private translateService:TranslateService,
  ) { 
    this.isEditmode = true;  
    localStorage.setItem('landing','false')  
    dateAdapter.setLocale('en-IN')
    this.translateService.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.dateAdapter.setLocale(event.lang)
    })
  }

  ngOnInit(): void {
    forkJoin({
      teachers:this.userService.getTeachers(),
      children:this.childService.getAllChildren(),
      admins:this.userService.getAdmin(),
    }).subscribe(ret=>{
      this.teachers = ret.teachers;
      this.children = ret.children;
      ret.admins.forEach((val,i)=>{
        this.teachers.push(val);
      })
      
    })
   
    this.appointmentForm = this.fb.group({
      title:['',Validators.required],
      teacher:[{value:'', disabled:this.isEditmode}, [Validators.required]],
      child:[{value:undefined, disabled:this.isEditmode}, [Validators.required, Validators.minLength(1)]],
      start:[moment().toDate(),Validators.required],
      end:[moment().toDate(),Validators.required]
    },{validators:[MustAfter('start','end')]})

    if(this.isEditmode){
      this.route.paramMap.pipe(
        switchMap(
          params => {
            this.appointmentId = Number(params.get('appointment_id'));
            //this.userId = Number(params.get('id'));
            return this.appointmentService.getEventById(this.appointmentId);
          }
        )
      ).subscribe((res:Appointment)=>{
        console.log(res);
        this.appoinment = res;
        if(this.appoinment.color == 'red' || this.appoinment.color == 'blue'){
          this.submitButton = 'Reschedule'
          this.accpt = true;
        }else{
          this.accpt = false;
          this.submitButton = 'Send'
        }
        if(this.appoinment.status == 'reschedule'){
          this.rescheduleText = true
          this.accpt = false;
          this.submitButton = 'Send'
        }else{
          this.rescheduleText = false
        }
        if(localStorage.getItem('childappointments') == 'false'){
          this.userId = this.appoinment.teacher.id;
        }else
          this.userId = this.appoinment.child.id;
        this.InitForm(res);
      })  
    }else{
      this.submitButton = 'Send'
    }
  }
  InitForm(appointment:Appointment){
    console.log(appointment);
    this.appointmentForm.reset(appointment);
    if(appointment.status == AppointmentStatus.ACCEPT){
      this.showButtons = false;
      this.accpt = false;
    }
  }
  get title():string{
    if(this.isEditmode)
      return "Edit Appointment"
    return "Create Appointment"
  }
  onSubmit(){
    this.appointmentForm.markAllAsTouched();
    if(this.appointmentForm.valid){
      if(this.isEditmode){
          Object.assign(this.appoinment, this.appointmentForm.value);
          this.appointmentService.UpdateEventById(this.appoinment).subscribe(()=>{})
          this.toastrService.success('Updated the Appointment Info',"Success");
      }else{
        this.appoinment = Object.assign({}, this.appointmentForm.value);
        this.appoinment.parent = this.appoinment.child.parent;
        this.appoinment.type = AppointmentType.FREE;
        this.appointmentService.CreateEvent(this.appoinment).subscribe(data => {
          this.toastrService.success('Registered the New Appointment',"Success");
          localStorage.setItem('childappointments','true')
          localStorage.setItem('appointedChild',data.parent)
          this.userId = data.child
          this.router.navigate([`/appointment/${data.child}`]);
        })
      }
    }
  }
  reschedule(){
    let dat = { 
      "appointment_id":this.appoinment.id,
      "status": "reschedule",
      "child_id":this.appoinment.child.id,
      "teacher_id":this.appoinment.parent.id
    }
    this.appointmentService.updateAppointment(dat).subscribe(ret => {
      console.log('ret >>',ret)
      //this.navCtrl.navigateBack('/normal_appointment');
      this.toastrService.success('Requested for reschedule',"Success")
    })
  }
  accept(){
    let dat = { 
      "appointment_id":this.appoinment.id,
      "status": "accept",
      "child_id":this.appoinment.child.id,
      "teacher_id":this.appoinment.parent.id
    }
    this.appointmentService.updateAppointment(dat).subscribe(ret => {
      console.log('ret >>',ret)
      //this.navCtrl.navigateBack('/normal_appointment');
      this.toastrService.success('Appointment has been accepted',"Success")
    })
  }
  back(){
    // if(this.userId)
    //   this.router.navigate([`/appointment/${this.userId}`]);
    // else
      this.router.navigate(['/appointment']);
  }
  isInvalidControl = isInvalidControl;
}
