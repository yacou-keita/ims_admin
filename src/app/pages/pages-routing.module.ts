import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';


import { RoleGuard } from '../@core/guards/role.guard';
import { USERROLE } from '../@core/models/user';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default/default.component';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { ChooseClassNameComponent } from './choose-class-name/choose-class-name.component';
import { ClassRoomGuard } from '../@core/guards/class-room.guard';
import { AddClassNameComponent } from './add-class-name/add-class-name.component';
import { DailyDetailComponent } from './teacher/child-daily-information/daily-detail/daily-detail.component';
import { NotificationComponent } from './admin/notification/notification.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'choose/classname', component:ChooseClassNameComponent},
      { path: 'children', loadChildren: () => import('./admin/children/children.module').then(m => m.ChildrenModule) },
      { path: 'profile', loadChildren: () => import('./admin/profile/profile.module').then(m => m.ProfileModule) },

      { 
        path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), 
        canActivate:[RoleGuard],data: {role_name: USERROLE.Admin} 
      },      
      { path: 'teacher', loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule), 
        canActivate:[RoleGuard],data: {role_name: USERROLE.Teacher} 
      },
      { path: '404', component:NotFoundComponent},
      { path: 'notallowed', component:NotAllowedComponent},
      { path: 'default', component:DefaultComponent},   
      { path: 'add/classname', component:AddClassNameComponent},
      { path: 'childdailyinformation/:id', loadChildren: () => import('./teacher/child-daily-information/child-daily-information.module').then(m => m.ChildDailyInformationModule) },
      { path: 'notifications', component:NotificationComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
