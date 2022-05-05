import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription, timer } from 'rxjs';
import { RippleService } from '../../../@core/utils/ripple.service';
import { AuthService } from "../../../auth.service";
import { UsersService } from "../../../@core/services/users.service";
import { User, USERROLE } from "../../../@core/models/user";
import { TranslateService } from '@ngx-translate/core';
import { ChildService } from '../../../@core/services/child.service';
import { NameOfClass } from '../../../@core/models/child';
import { Router } from '@angular/router';
import { DateTimeAdapter } from "@danielmoncada/angular-datetime-picker";
import * as moment from 'moment';
import { interval } from 'rxjs';
import { NotificationService } from '../../../@core/services/notification.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {


  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  title: string = "Admin Center";
  userPictureOnly: boolean = false;
  user: User;
  currentClassName: NameOfClass;
  private classNameSubscription: Subscription;
  private currentUserSubscription: Subscription;
  selectedCountryCode = 'gb';
  countryCodes = ['gb', 'fr'];
  private current_user: User;
  notificationLength;
  subscription: Subscription;
  //public nameList:NameOfClass[]
  classes = []
  userMenu = [
    { title: 'Profile', url: '/profile', icon: { icon: 'address-card', pack: 'fa' } },
    { title: 'Log out', icon: 'log-out-outline', tagname: 'logout' }
  ];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private authService: AuthService,
    private layoutService: LayoutService,
    private userService: UsersService,
    private childService: ChildService,
    private translateSerivce: TranslateService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService,
    private notificationService: NotificationService
  ) {
    this.userService.getClasses().subscribe((classes) => {
      this.classes = classes;
      this.classes.push({ id: this.classes.length + 1, name: "Add New Class", createdBy: 2 })
      // this.currentClassName = this.classes[1]
    })
  }

  ngOnInit() {
    let lang = localStorage.getItem('lang')
    if (lang) {
      this.translateSerivce.use(lang);
      moment.locale(lang);
      this.selectedCountryCode = lang;
      if (lang == 'en')
        this.selectedCountryCode = 'gb';
    }

    //this.currentClassName = this.childService.getCurrentClassName();  
    this.classNameSubscription = this.childService.currentClassNameSubject.subscribe(name => {
      this.currentClassName = name;
    });
    this.currentUserSubscription = this.userService.currentUserSubject.subscribe(user => {
      this.user = user;

    })
    this.currentClassName = this.childService.getCurrentClassName();
    this.userService.getCurrentUser().subscribe((user: User) => {
      if (user.role_name == USERROLE.Admin)
        this.title = "Admin Center";
      if (user.role_name == USERROLE.Teacher)
        this.title = "Teacher Center";
      this.subscription = timer(0, 30000).pipe(
        switchMap(() => this.notificationService.getNotification(user.id))
      ).subscribe(data => {
        let length = 0;
        data.forEach(val => {
          if (val.is_read == false) {
            length++
          }
        })
        this.notificationLength = length;
      });

    })
    this.menuService.onItemClick
    this.menuService.onItemClick().pipe(
      filter(({ tag }) => tag === 'my-profile-tag'),
      map(({ item }) => item),
    ).subscribe((item: any) => {
      if (item.tagname == 'logout') {
        this.authService.logout();
      }
    })
    // this.userService.getClasses()
    // .pipe(takeUntil(this.destroy$))
    // .subscribe((classes)=>{
    //   this.classes = classes;
    // })
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.user = user;
      })
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);
    this._translateMenu();

    // this.nameList =[];
    // this.userService.getCurrentUser().subscribe(item=>{
    //   this.current_user = item
    //   if(this.current_user.role_name == USERROLE.Teacher)
    //     this.nameList = this.current_user.classNames;
    //   if(this.current_user.role_name == USERROLE.Admin)
    //     this.nameList = this.childService.classNameList;
    // });
  }
  _translateMenu() {
    for (const each of this.userMenu) {
      this.translateSerivce.stream(each.title).subscribe(res => {
        each.title = res;
      });

    }
  }
  selectClass(event) {
    if (event.name == 'Add New Class') {
      this.router.navigate(['/add/classname']);
      localStorage.setItem('classId', event.id)
    } else {
      this.currentClassName = event.name;
      this.childService.setCurrentClassName(event.name);
      localStorage.setItem('class_name', event.name);
      this.menuService.navigateHome();
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/children']));
    }

    //this.router.navigateByUrl('/children');
  }
  changeSelectedCountryCode(value: string): void {
    this.selectedCountryCode = value;
    let lang;
    if (value == 'gb') {
      this.translateSerivce.use('en');
      moment.locale('en')
      localStorage.setItem('lang', 'en')
    } else {
      this.translateSerivce.use(value);
      moment.locale(value);
      localStorage.setItem('lang', value)
    }


  }
  isAdmin(user: User) {
    return user.role_name == USERROLE.Admin;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.classNameSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  navigateToChooseName() {
    this.router.navigate(['/choose/classname']);
  }
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }
  onNotification() {
    this.router.navigate(['/notifications']);
  }
  logout() {
    this.authService.logout();
  }
  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  redirecturl() {
    console.log('logo clicked')
    window.open('https://www.ivorymontessorischool.com/wp-admin/')
  }
}
