/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { NbIconLibraries } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService,
    private iconsLibrary: NbIconLibraries,
    private translateService:TranslateService,private dateAdapter:DateTimeAdapter<any>,
    ) {
    this.iconsLibrary.registerFontPack('fa',{ packClass: 'fa', iconClassPrefix: 'fa' })
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    dateAdapter.setLocale('en-IN')
    this.translateService.onLangChange.subscribe((event:LangChangeEvent)=>{
      this.dateAdapter.setLocale(event.lang)
    })
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }
}
