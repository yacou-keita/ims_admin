import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private router:Router,) { }

  ngOnInit(): void {
  }
  compose(){
    this.router.navigate(['/notification/compose'])
  }
}
