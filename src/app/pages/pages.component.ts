import { Component } from '@angular/core';

import { MENU_ITEMS, TEACHER_MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../@core/services/users.service';
import { User, USERROLE } from '../@core/models/user';
import { UserService } from '../@core/mock/users.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu;
  constructor(private translateService: TranslateService, private userService:UsersService) {
    this.menu=[];
    this.userService.getCurrentUser().subscribe((user:User) => {
      if( user.role_name === USERROLE.Admin)
        this.menu = MENU_ITEMS;
      if( user.role_name === USERROLE.Teacher)
        this.menu = TEACHER_MENU_ITEMS;
      this._TranslateMenu();
    })


  }
  _TranslateMenu(){
    for (const each of this.menu ) {
      this.translateService.stream(each.title).subscribe(res => {
        each.title = res;
      });
      if (each.children) {
        for (const eachChild of each.children) {
          this.translateService.stream(eachChild.title).subscribe(res => {
            eachChild.title = res;
          });
        }
      }
    }
  }
}
