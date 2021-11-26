import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { MiniClub } from '../../../../@core/models/miniclub';
import { MiniClubService } from '../../../../@core/services/mini-club.service';
import { ToastService } from '../../../../@core/services/toast.service';

@Component({
  selector: 'ngx-edit-club',
  templateUrl: './edit-club.component.html',
  styleUrls: ['./edit-club.component.scss']
})
export class EditClubComponent implements OnInit {
  private clubId
  public club:MiniClub[];
  constructor(
    private miniClubService:MiniClubService,
    private route:ActivatedRoute,
    private toastrService:ToastService,
    private router:Router
    ){
      this.clubId = localStorage.getItem('clubId')
      forkJoin({
        club: this.miniClubService.getMiniClub(this.clubId)
      }).subscribe(ret=>{
        this.club = ret.club;      
      })
  }
  ngOnInit(){
    
  }
  onSubmit(data:MiniClub){
    this.miniClubService.addNewMiniClub(data).subscribe(_=>{
      this.toastrService.success('New Mini Club Item has been created', 'success');
      this.back();
    });
  }
  back(){
    this.router.navigate(['..'],{relativeTo:this.route})
  }

}
