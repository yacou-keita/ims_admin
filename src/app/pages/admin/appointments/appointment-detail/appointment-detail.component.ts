import { Component, OnInit, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CalendarEvent, CalendarView, CalendarEventAction, DAYS_OF_WEEK } from "angular-calendar";
import { DOCUMENT } from '@angular/common';
import { AppointmentService } from "../../../../@core/services/appointment.service";
import { UsersService } from "../../../../@core/services/users.service";
import { ChildService } from "../../../../@core/services/child.service";
import { User, USERROLE } from "../../../../@core/models/user";
import { Appointment, AppointmentType } from "../../../../@core/models/appointment";
import { calendarEventFromAppointment, calendarEventFromPresetAppointment } from "../../../../@core/utils/calendar.util";


import * as moment from "moment";
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, observable } from "rxjs";

import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { fork } from 'cluster';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { YesNoDialogComponent } from '../../../../components/yes-no-dialog/yes-no-dialog.component';
import { ToastService } from '../../../../@core/services/toast.service';
import { Child } from '../../../../@core/models/child';
import { LeafletBaseLayersDirective } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'ngx-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  events: CalendarEvent[]
  activeDayIsOpen:boolean = true;
  weekStartsOn;
  userId:number;
  user:User;
  child:Child;
  private readonly darkThemeClass = 'dark-theme';
  fromLand = false;
  childSel = false;
  children:Child;
  parentIds = [];
  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    //   a11yLabel: 'Detail',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {        
    //     this.onDetailEvent(event);
    //   },
    // },    
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {        
        this.onDeleteEvent(event);
      },
    },  
    
  ];
  constructor(
    @Inject(DOCUMENT) private document,
    private appointmentService:AppointmentService,
    private userService:UsersService,
    private route:ActivatedRoute,
    private router:Router,
    private dialogService:NbDialogService,
    private toastrService:ToastService,
    private childService: ChildService
  ) { 
    if(localStorage.getItem('landing')== 'true')
      this.fromLand = true;
    this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
  }

  ngOnInit(): void {
    this.document.body.classList.add(this.darkThemeClass);
    if(localStorage.getItem('landing')== 'true'){
      this.route.paramMap.pipe(
        switchMap(
          params => {
            //this.userId = Number(params.get('id'));
            return forkJoin({
             // user:this.userService.getUserById(this.userId),
              //appointments:this.appointmentService.getEventsByUserId(this.userId)
              appointments:this.appointmentService.getEventsOfCurrentUser(),
              presetappointments:this.appointmentService.GetAllPresetAppointments()
            });
          }
        ),
        map(( {appointments,presetappointments}:{ appointments:Appointment[],presetappointments} )=>{        
         // this.user= user;        
         let obj = appointments.map(item=>{this.parentIds.push({id:item.id, val:item.parent.id})      
                return calendarEventFromAppointment(item, this.actions);})
          obj = obj.concat(presetappointments.map(item=>{return calendarEventFromPresetAppointment(item, this.actions);}))
          return obj;
        })
      ).subscribe((res:CalendarEvent[])=>{this.events = res.filter(f => f !== undefined && f !== null) as CalendarEvent[];})
    }else{
      if(localStorage.getItem('childappointments') == 'true'){
        this.childSel = true;
        this.route.paramMap.pipe(
          switchMap(
            params => {
              this.userId = Number(params.get('id'));
                return forkJoin({
                  child:this.childService.getChildById(this.userId),
                  appointments:this.appointmentService.getEventsByUserId(parseInt(localStorage.getItem('appointedChild')))
                  // appointments:this.appointmentService.getEventsOfCurrentUser()
                });
              
            }
          ),
          map(( {child,appointments}:{child:Child, appointments:Appointment[]} )=>{        
            this.child= child;        
            return appointments.map(item=>{     
              if(item.child.id == this.child.id)               
                return calendarEventFromAppointment(item, this.actions);
            })
          })
        ).subscribe((res:CalendarEvent[])=>{this.events = res.filter(f => f !== undefined && f !== null) as CalendarEvent[];})
      }else{
        this.route.paramMap.pipe(
          switchMap(
            params => {
              this.userId = Number(params.get('id'));
              return forkJoin({
                user:this.userService.getUserById(this.userId),
                appointments:this.appointmentService.getEventsByUserId(this.userId)
                // appointments:this.appointmentService.getEventsOfCurrentUser()
              });
            }
          ),
          map(( {user,appointments}:{user:User, appointments:Appointment[]} )=>{        
            this.user= user;        
            return appointments.map(item=>{                    
              return calendarEventFromAppointment(item, this.actions);
            })
          })
        ).subscribe((res:CalendarEvent[])=>{this.events = res.filter(f => f !== undefined && f !== null) as CalendarEvent[];})
      }
     
    }
    
  }
  eveclicked({ event }: { event: CalendarEvent }): void {
    console.log( event);
    this.onDetailEvent(event);
  }
  onDetailEvent(event: CalendarEvent): void {
    if(this.fromLand == true){}
    if(event.meta == AppointmentType.FREE){
      if(this.fromLand == true){
        let childID;
        this.parentIds.forEach(val => {
          if(val.id == event.id){
            this.router.navigate([`/appointment/${val.val}/${event.id}`])
          }
        })
        
      }else{
        this.router.navigate([event.id],{relativeTo:this.route})
      }
    }
      // this.router.navigate([event.id,event.id])
    if(event.meta == AppointmentType.PRESET){
      //this.router.navigate([`/appointment/preset/${event.id}`]);
    }
  }
  onDeleteEvent(event: CalendarEvent): void {
    console.log('event >>',event)
    this.dialogService.open(YesNoDialogComponent,{context:{
      title:'Are you sure?'
    }}).onClose.subscribe(ret=>{
      if(ret==true){
        if(event.meta == 'free'){
          this.appointmentService.deleteEventById(event.id).subscribe(_=>{
            let index = this.events.findIndex(item=>{
              return item.id == event.id;
            })
            this.events.splice(index,1);
            this.events = Object.assign([], this.events);
            this.toastrService.success('Deleted the Appointment',"Success");
          });
        }else if(event.meta == 'preset'){
          this.appointmentService.deletePresetAppointmentById(event.id).subscribe(_=>{
            let index = this.events.findIndex(item=>{
              return item.id == event.id;
            })
            this.events.splice(index,1);
            this.events = Object.assign([], this.events);
            window.location.reload();
            this.toastrService.success('Deleted the Preset Appointment',"Success");
          });
        }
        
      }
    });
    
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (moment(date).isSame(this.viewDate,'month')) {
      if (
        (moment(date).isSame(this.viewDate,'day') && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  back(){
    this.router.navigate(['/appointment'])
  }
  ngOnDestroy(): void {
    this.document.body.classList.remove(this.darkThemeClass);
  }
  getName(user:User){
    if (!user) return ''
    if(user.role_name == USERROLE.Teacher)
      if(user.child) return user.child.first_name +' '+ user.child.last_name;
    return user.first_name + ' ' + user.last_name
  }
  getPicture(user:User){
    if (!user) return '';
    if(user.role_name == USERROLE.Teacher)
      if(user.child) return user.child.photo
    return user.picture
  }
}
