import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';

import { ExchangeLibraryComponent } from './exchange-library.component';

const routes: Routes = [
  { path: '', component: ExchangeLibraryComponent },
  { path: 'new', component: AddBookComponent },
  { path: 'edit', component: EditBookComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeLibraryRoutingModule { }
