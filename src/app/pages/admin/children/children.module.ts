import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildrenRoutingModule } from './children-routing.module';
import { ChildrenComponent } from './children.component';
import { ChildListModule } from '../../../shared/child-list/child-list.module';
import { NbCardModule, NbButtonModule, NbIconModule, NbTooltipModule, NbUserModule, NbInputModule, NbPopoverModule, NbSelectModule, NbCheckboxModule } from '@nebular/theme';
import { ChildDetailComponent } from './child-detail/child-detail.component';
import { AddSiblingComponent } from './add-sibling/add-sibling.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTranslateModule } from '../../../shared-translate/shared-translate.module';
import { SetChildPWDComponent } from './set-child-pwd/set-child-pwd.component';
import { AddChildComponent } from './add-child/add-child.component';
import { OwlDateTimeModule, OwlMomentDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from '@danielmoncada/angular-datetime-picker';
import { DateFilterPipe } from '../../../shared/date-filter.pipe';

export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD/MM/YYYY',
  fullPickerInput: 'DD/MM/YYYY hh:mm a',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'hh:mm a',
  monthYearLabel: 'MMM-YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM-YYYY'
};

@NgModule({
  declarations: [ChildrenComponent, ChildDetailComponent, AddSiblingComponent, SetChildPWDComponent, AddChildComponent],
  imports: [
    CommonModule,
    ChildrenRoutingModule,
    ChildListModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbUserModule,
    NbPopoverModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    OwlNativeDateTimeModule,
    SharedTranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class ChildrenModule { }
