import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import {  
  NbCardModule,   
  NbInputModule,
  NbIconModule,
  NbPopoverModule,
  NbButtonModule, NbCheckboxModule, NbTooltipModule} from '@nebular/theme';
import { SharedTranslateModule } from '../../../shared-translate/shared-translate.module';
@NgModule({
  declarations: [UserDetailComponent],
  imports: [
    CommonModule,
    UserDetailRoutingModule,
    NbCardModule,
    NbInputModule,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    NbTooltipModule,
    SharedTranslateModule,
    NbPopoverModule ,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule
  ]
})
export class UserDetailModule { }
