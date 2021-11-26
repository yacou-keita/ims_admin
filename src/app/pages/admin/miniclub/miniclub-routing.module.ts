import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditClubComponent } from './edit-club/edit-club.component';

import { MiniclubComponent } from './miniclub.component';
import { NewClubComponent } from './new-club/new-club.component';

const routes: Routes = [
  { path: '', component: MiniclubComponent },
  { path: 'new', component: NewClubComponent },
  { path: 'edit', component: EditClubComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiniclubRoutingModule { }
