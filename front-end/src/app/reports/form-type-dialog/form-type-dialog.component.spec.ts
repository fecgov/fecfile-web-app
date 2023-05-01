import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormTypes } from 'app/shared/utils/form-type.utils';
import { RouterTestingModule } from '@angular/router/testing';

import { FormTypeDialogComponent } from './form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), DialogModule],
      declarations: [Dialog, FormTypeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTypeDialogComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#goToReportForm should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.selectedType = FormTypes.F3X;
    component.goToReportForm();
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step1');
  });
});
