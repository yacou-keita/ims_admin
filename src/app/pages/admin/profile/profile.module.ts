import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NbMenuModule, 
  NbCardModule,   
  NbInputModule,
  NbIconModule,
  NbPopoverModule,
  NbButtonModule} from '@nebular/theme';
import { SharedTranslateModule } from '../../../shared-translate/shared-translate.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NbCardModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbPopoverModule ,
    SharedTranslateModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
