import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { SendNotificationComponent } from './send-notification/send-notification.component';
import { NbCardModule, NbButtonModule, NbInputModule, NbCheckboxModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SharedTranslateModule } from '../../../shared-translate/shared-translate.module';


@NgModule({
  declarations: [NotificationComponent, SendNotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    ReactiveFormsModule,
    SharedModule,
    SharedTranslateModule
  ]
})
export class NotificationModule { }
