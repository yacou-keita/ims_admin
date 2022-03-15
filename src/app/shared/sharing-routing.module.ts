import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/components/user-list/user-list.component';


const routes: Routes = [
    { path: 'userlist', component:UserListComponent },
    // { path: 'new/preset',component:AppointmentPresetCreateComponent },
    // { path: 'new', component:AppointmentCreateComponent },
    
    // { path:'preset/:appointment_id/:classroom/', component:AppointmentPresetEditComponent},
    // { path: ':id', component: AppointmentDetailComponent},
    // { path:':id/:appointment_id', component:AppointmentEditComponent},
    
    // { path: '', component: AppointmentsComponent }
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SharingRoutingModule { }