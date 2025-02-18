import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTypes } from 'app/shared/utils/form-type.utils';
import { RouterTestingModule } from '@angular/router/testing';

import { FormTypeDialogComponent } from './form-type-dialog.component';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Form24Service } from 'app/shared/services/form-24.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { Form24 } from 'app/shared/models/form-24.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';

describe('FormTypeDialogComponent', () => {
  let component: FormTypeDialogComponent;
  let fixture: ComponentFixture<FormTypeDialogComponent>;
  let router: Router;
  let form24Service: Form24Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'reports/transactions/report/2401/list',
            redirectTo: '',
          },
        ]),
        DialogModule,
        HttpClientTestingModule,
      ],
      declarations: [Dialog, FormTypeDialogComponent],
      providers: [
        Form24Service,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({
                  report_type: ReportTypes.F3X,
                }),
              },
            },
            params: of({
              catalog: 'receipt',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTypeDialogComponent);
    router = TestBed.inject(Router);
    form24Service = TestBed.inject(Form24Service);
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

  describe('updateSelected', () => {
    it('should set the selectedType to the provided type', () => {
      component.updateSelected(FormTypes.F3X);
      expect(component.selectedType).toEqual(FormTypes.F3X);
    });
  });

  describe('selectItem', () => {
    it('should set selectedForm24Type to undefined when item is already selected', () => {
      component.selectedForm24Type = '24';
      component.selectItem('24');
      expect(component.selectedForm24Type).toBeUndefined();
    });

    it('should set selectedForm24Type to the item when a different item is selected', () => {
      component.selectedForm24Type = '24';
      component.selectItem('48');
      expect(component.selectedForm24Type).toEqual('48');
    });

    it('should set selectedForm24Type to the item when no item is currently selected', () => {
      expect(component.selectedForm24Type).toBeUndefined();
      component.selectItem('24');
      expect(component.selectedForm24Type).toEqual('24');
    });
  });

  it('should create Form24', () => {
    component.updateSelected(FormTypes.F24);
    expect(component.selectedType).toEqual(FormTypes.F24);

    component.selectedForm24Type = '48';

    const create = spyOn(form24Service, 'create').and.returnValue(
      of(
        Form24.fromJSON({
          id: 2401,
        }),
      ),
    );

    component.goToReportForm();
    expect(create).toHaveBeenCalled();
  });

  let focusedElement: Element;
  function getMockActiveElement() {
    return focusedElement;
  }

  describe('handleTabKey', () => {
    beforeEach(() => {
      component.firstElement = new ElementRef(document.getElementById('close-button'));
      component._lastElement = new ElementRef(document.getElementById('submit-button'));
      component.form24FocusElement = new ElementRef(document.getElementById('48-button'));
      component.dropdownElement = new ElementRef(document.getElementById('typeDropdown'));
    });

    it('should focus on firstElement when Tab is pressed without Shift', fakeAsync(() => {
      focusedElement = component.lastElement;
      spyOnProperty(document, 'activeElement', 'get').and.callFake(getMockActiveElement);
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      spyOn(component.firstElement!.nativeElement, 'focus');
      component.handleTabKey(event);
      expect(component.firstElement!.nativeElement.focus).toHaveBeenCalled();
    }));

    it('should focus on firstElement when Tab is pressed with Shift', () => {
      focusedElement = component.firstElement?.nativeElement;
      spyOnProperty(document, 'activeElement', 'get').and.callFake(getMockActiveElement);
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      spyOn(component.lastElement, 'focus');
      component.handleTabKey(event);
      expect(component.lastElement.focus).toHaveBeenCalled();
    });
  });

  describe('get lastElement', () => {
    it('should return form24FocusElement when isSubmitDisabled and selectedType is F24', () => {
      component.selectedType = component.formTypes.F24;
      expect(component.lastElement).toBe(component.form24FocusElement?.nativeElement);
    });
  });

  describe('isSubmitDisabled', () => {
    it('should return true when createRoute is falsy and selectedType is F24 without selectedForm24Type', () => {
      component.selectedType = component.formTypes.F24;
      component.selectedForm24Type = undefined;
      expect(component.isSubmitDisabled).toBe(true);
    });
  });
});
