import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { NbDialogService } from '@nebular/theme';
import { MiniClub } from '../../../@core/models/miniclub';
import { MiniClubService } from '../../../@core/services/mini-club.service';
import { ToastService } from '../../../@core/services/toast.service';
import { YesNoDialogComponent } from '../../../components/yes-no-dialog/yes-no-dialog.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-miniclub',
  templateUrl: './miniclub.component.html',
  styleUrls: ['./miniclub.component.scss']
})
export class MiniclubComponent implements OnInit {
  searchWord: string;
  clubInfos: MiniClub[];
  filteredInfos: MiniClub[];
  constructor(
    private miniClubService: MiniClubService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastService,
    private dialogService: NbDialogService,
    private dateAdapter: DateTimeAdapter<any>,
    private translateService: TranslateService,
  ) {
    dateAdapter.setLocale('en-IN')
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.dateAdapter.setLocale(event.lang)
    })
  }

  ngOnInit(): void {
    this.miniClubService.getAllMiniClub().subscribe(data => {
      this.clubInfos = data;
      this.filteredInfos = this.clubInfos;
      this.filteredInfos.forEach(value => {
        value.children.forEach(val => {
          if (value.isPaid) {
            value.isPaid.forEach(v => {
              if (v == val.id) {
                val.isPaid = true;
              } else {
                val.isPaid = false;
              }
            })
          } else
            val.isPaid = false;
        })
      })
    })
  }
  onSearchWordChange(data) {
    this.filteredInfos = this.clubInfos.filter((item: MiniClub) => { return item.title.includes(this.searchWord) });
  }
  newMiniClubClick() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  onDeleteClick(clubInfo: MiniClub) {
    this.dialogService.open(YesNoDialogComponent, {
      context: {
        title: 'Are you sure?'
      }
    }).onClose.subscribe(ret => {
      if (ret == true) {
        this.miniClubService.removeMiniClub(clubInfo).subscribe(_ => {
          this.clubInfos = this.clubInfos.reduce((retArr, item) => {
            if (item.id != clubInfo.id)
              retArr.push(item);
            return retArr;
          }, [])
          this.filteredInfos = this.clubInfos;
          this.toastrService.info('Mini Club has been deleted.', 'success')
        })
      }
    })

  }
  editClub(club) {
    localStorage.setItem('clubId', club.id)
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  isPaid(child) {
    this.filteredInfos.forEach(val => {
      if (val.isPaid) {
        val.isPaid.forEach(v => {
          if (v == child.id)
            return true
          else return false;
        })
      }
    })
  }
  
  formatName(first_name:String,last_name:String):String {
    const name = `${first_name} ${last_name}`
    return this.display_specific_characters  (name,15)
  }

   display_specific_characters  (text, count){
    return text.slice(0, count) + (text.length > count ? "..." : "");
}
}
