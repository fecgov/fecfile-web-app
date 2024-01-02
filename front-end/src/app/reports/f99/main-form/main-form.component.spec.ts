import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFormComponent } from './main-form.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { AppSelectButtonComponent } from 'app/shared/components/app-selectbutton.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { RouterTestingModule } from '@angular/router/testing';
import { Form99Service } from 'app/shared/services/form-99.service';
import { SharedModule } from 'app/shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Form99 } from 'app/shared/models/form-99.model';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  let router: Router;
  let form99Service: Form99Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SelectButtonModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        RadioButtonModule,
        CalendarModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [MainFormComponent, LabelPipe, AppSelectButtonComponent],
      providers: [Form99Service, FormBuilder, MessageService, FecDatePipe, provideMockStore(testMockStore)],
    });
    router = TestBed.inject(Router);
    form99Service = TestBed.inject(Form99Service);
    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('/reports');
  });

  it('should save', () => {
    component.form.patchValue({
      message_text: 'message',
    });
    const createSpy = spyOn(form99Service, 'create').and.returnValue(of(Form99.fromJSON({})));
    const updateSpy = spyOn(form99Service, 'update').and.returnValue(of(Form99.fromJSON({})));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.save();

    expect(navigateSpy).toHaveBeenCalledWith('/reports');
    expect(createSpy).toHaveBeenCalledTimes(1);

    component.reportId = '999';
    component.save('continue');

    expect(navigateSpy).toHaveBeenCalledWith('/reports');
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
