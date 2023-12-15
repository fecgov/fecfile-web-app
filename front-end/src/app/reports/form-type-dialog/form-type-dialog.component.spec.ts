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

  describe('goToReportForm', () => {
    it('should route properly', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.selectedType = FormTypes.F3X;
      component.goToReportForm();
      expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step1');
    });
  });

  describe('dropdownButtonText', () => {
    it('should return an empty span if there is no selected type', () => {
      expect(component.dropdownButtonText).toEqual('<span></span>')
    });
    it('should return a correctly formatted string if there is a selected type', () => {
      component.selectedType = FormTypes.F3X;
      expect(component.dropdownButtonText).toEqual('<span class="option"><b>Form 3X:</b> Report of Receipts and Disbursements</span>')
    })
  });

  describe('updateSelected', () => {
    it('should set the selectedType to the provided type', () => {
      component.updateSelected(FormTypes.F3X);
      expect(component.selectedType).toEqual(FormTypes.F3X);
    });
  });
});
