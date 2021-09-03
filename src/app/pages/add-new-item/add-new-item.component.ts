import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ToastService } from '../../@core/services/toast.service';
import { UsersService } from '../../@core/services/users.service';

@Component({
  selector: 'ngx-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.scss']
})
export class AddNewItemComponent implements OnInit {
  @Input() title:string;
  newItem:any;
  constructor(protected dialogRef: NbDialogRef<AddNewItemComponent>,private userService:UsersService,private toastService:ToastService) { }

  ngOnInit(): void {
  }

  submit(){
    this.userService.postNationality(this.newItem).subscribe((res:any) => {
      this.toastService.success('New Nationality has been added succesfully','success');
      window.location.reload();
    })
    this.dialogRef.close()
  }

}
