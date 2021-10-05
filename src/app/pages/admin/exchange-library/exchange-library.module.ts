import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeLibraryRoutingModule } from './exchange-library-routing.module';
import { ExchangeLibraryComponent } from './exchange-library.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookFormComponent } from './book-form/book-form.component';
import { NbAccordionModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbListModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTranslateModule } from '../../../shared-translate/shared-translate.module';
import { ChildListModule } from '../../../shared/child-list/child-list.module';
import { EditBookComponent } from './edit-book/edit-book.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [ExchangeLibraryComponent, AddBookComponent, BookFormComponent, EditBookComponent],
  imports: [
    CommonModule,
    CommonModule,
    NbCardModule,
    NbInputModule,
    NbListModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbAccordionModule,
    NbUserModule,
    NbBadgeModule,
    ChildListModule,
    SharedTranslateModule,
    ExchangeLibraryRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ]
})
export class ExchangeLibraryModule { }
