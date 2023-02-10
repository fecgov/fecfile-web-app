import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeDialogComponent } from './form-type-dialog.component';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormTypeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
