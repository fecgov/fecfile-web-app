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
import { Form1MService } from 'app/shared/services/form-1m.service';
import { SharedModule } from 'app/shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Form1M } from 'app/shared/models/form-1m.model';
import { ConfirmationService } from 'primeng/api';

describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;
  let router: Router;
  let form1mService: Form1MService;

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
      providers: [
        ConfirmationService,
        Form1MService,
        FormBuilder,
        MessageService,
        FecDatePipe,
        provideMockStore(testMockStore),
      ],
    });
    router = TestBed.inject(Router);
    form1mService = TestBed.inject(Form1MService);
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

  xit('should save', () => {
    component.form.patchValue({
      committee_type: 'X',
      filer_committee_id_number: 'C000000001',
      committee_name: 'test committee',
      street_1: '123 Main St.',
      street_2: '',
      city: 'test city',
      state: 'DC',
      zip: '22222',
      affiliated_date_form_f1_filed: Date(),
      affiliated_committee_fec_id: 'C00000002',
      affiliated_committee_name: 'affiliated committee',
    });
    const createSpy = spyOn(form1mService, 'create').and.returnValue(of(Form1M.fromJSON({})));
    const updateSpy = spyOn(form1mService, 'update').and.returnValue(of(Form1M.fromJSON({})));
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.save();

    expect(navigateSpy).toHaveBeenCalledWith('/reports');
    expect(createSpy).toHaveBeenCalledTimes(1);

    component.reportId = '999';
    component.report = Form1M.fromJSON({ id: '999' });
    component.save('continue');

    expect(navigateSpy).toHaveBeenCalledWith('/reports');
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
