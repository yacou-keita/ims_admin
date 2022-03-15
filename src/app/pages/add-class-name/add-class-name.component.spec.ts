import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassNameComponent } from './add-class-name.component';

describe('AddClassNameComponent', () => {
  let component: AddClassNameComponent;
  let fixture: ComponentFixture<AddClassNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClassNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
