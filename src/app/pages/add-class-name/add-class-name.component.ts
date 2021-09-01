import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassName } from '../../@core/models/user';
import { isInvalidControl } from '../../@core/utils/form.util';

@Component({
  selector: 'ngx-add-class-name',
  templateUrl: './add-class-name.component.html',
  styleUrls: ['./add-class-name.component.scss','../admin/exchange-library/book-form/book-form.component.scss']
})
export class AddClassNameComponent implements OnInit {
  @Input() initdata:ClassName;
  @Output('onSubmit') submitEvent =  new EventEmitter<any>();
  classForm:FormGroup;
  book:ClassName;
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.classForm = this.fb.group({
      className:['', Validators.required],
      comment:['', Validators.nullValidator]
    })
  }
  onSubmit() {
    console.log('submit')
  }
  isInvalidControl = isInvalidControl
}
