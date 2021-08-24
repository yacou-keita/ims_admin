import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
@Component({
  selector: 'ngx-cell-avatar-with-check-box',
  templateUrl: './cell-avatar-with-check-box.component.html',
  styleUrls: ['./cell-avatar-with-check-box.component.scss']
})
export class CellAvatarWithCheckBoxComponent implements OnInit, ViewCell {

  @Input() value: string | number;
  @Input() rowData: any;
  constructor() { }

  ngOnInit(): void {
    // if(this.rowData.checked)
    //   this.rowData.checked = false;
  }
  onClick(){
    if(this.rowData.checked)
      this.rowData.checked = !this.rowData.checked;
    else
      this.rowData.checked = true;
  }
}
