import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateF24Component } from './create-f24.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form24Service } from 'app/shared/services/form-24.service';
import { testCommitteeAccount, testF24 } from 'app/shared/utils/unit-test.utils';

describe('CreateF24Component', () => {
  let component: CreateF24Component;
  let fixture: ComponentFixture<CreateF24Component>;
  let form24Service: jasmine.SpyObj<Form24Service>;
  let router: Router;
  beforeEach(async () => {
    const form24ServiceSpy = jasmine.createSpyObj('Form24Service', ['getAllReports', 'create']);

    await TestBed.configureTestingModule({
      imports: [CreateF24Component],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({ initialState: { committeeAccount: testCommitteeAccount } }),
        { provide: Form24Service, useValue: form24ServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateF24Component);
    component = fixture.componentInstance;
    form24Service = TestBed.inject(Form24Service) as jasmine.SpyObj<Form24Service>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set form24Name when selectedForm24Type changes', () => {
    expect(component.form24Name()).toBe('');
    component.selectedForm24Type.set('24');
    fixture.detectChanges();
    expect(component.form24Name()).toBe('24-HOUR: Report of Independent Expenditure');
  });

  it('should validate form24Name correctly', fakeAsync(() => {
    component.form24Names.set(['24 HOUR TEST']);
    TestBed.flushEffects();
    expect(component.form24Names.value()).toEqual(['24 HOUR TEST']);

    // Name is empty
    component.form24Name.set('');
    fixture.detectChanges();
    expect(component.form24NameErrors()).toBe('Name is required');

    // Name is already in use
    component.selectedForm24Type.set('24');
    fixture.detectChanges();
    component.form24Name.set('24 HOUR TEST');
    fixture.detectChanges();
    expect(component.form24NameErrors()).toBe('This name is already in use. Please choose a different name.');

    // Valid name
    component.form24Name.set('New Valid Name');
    fixture.detectChanges();
    expect(component.form24NameErrors()).toBeUndefined();
  }));

  it('should create F24 and navigate upon success', fakeAsync(() => {
    form24Service.getAllReports.and.resolveTo([]);
    form24Service.create.and.returnValue(Promise.resolve(testF24));
    spyOn(router, 'navigateByUrl');

    component.selectedForm24Type.set('24');
    component.form24Name.set('Valid Report Name');

    component.createF24().then(() => {
      expect(form24Service.create).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/reports/transactions/report/${testF24.id}/list`);
    });
    tick();
  }));

  it('should handle error during create F24', fakeAsync(() => {
    form24Service.create.and.rejectWith('Error creating F24');

    component.selectedForm24Type.set('24');
    component.form24Name.set('Valid Report Name');

    component.createF24().catch((error) => {
      expect(error).toBe('Error creating F24');
    });
    tick();
  }));
});
