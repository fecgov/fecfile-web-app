import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form24SignalSchema } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { testF24, testMockStore } from 'app/shared/utils/unit-test.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { beforeEach, describe, expect, it } from 'vitest';
import { Form24EditComponent } from './form-24-edit.component';

describe('Form24EditComponent', () => {
  let component: Form24EditComponent;
  let fixture: ComponentFixture<Form24EditComponent>;
  let form24Service: Form24Service;
  let router: Router;
  let messageService: MessageService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form24EditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form24Service,
        MessageService,
        Form24SignalSchema,
        provideMockStore({
          ...testMockStore(),
          selectors: [{ selector: selectActiveReport, value: testF24() }],
        }),
      ],
    }).compileComponents();

    form24Service = TestBed.inject(Form24Service);
    fixture = TestBed.createComponent(Form24EditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should seed form values on initialization based on activeReport store signal', () => {
    expect(component.form.type().value()).toBe('24');
    expect(component.form.typelessName().value()).toBe('Initial Name');
  });

  it('should compute the correct prefix title via type() helper', () => {
    expect(component.typeHour()).toBe('24-Hour:');
  });

  it('should validate name uniqueness', async () => {
    component.form.typelessName().value.set('Brand New Name');
    fixture.detectChanges();
    expect(component.form.typelessName().invalid()).toBe(false);
  });

  it('should fail validation if the name is taken', async () => {
    const test_name = 'Taken Name';
    component.form.type().value.set('24');
    component.form.typelessName().value.set(test_name);
    fixture.detectChanges();

    httpTestingController.expectOne(
      `${environment.apiUrl}/reports/form-24/validation_check/?name=24-Hour: Initial Name&exclude_ids=999`,
    );
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/reports/form-24/validation_check/?name=24-Hour: Taken Name&exclude_ids=999`,
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ valid: false }); // Simulate a response indicating the name is already in use
    httpTestingController.verify();
    await fixture.whenStable();

    expect(component.form.typelessName().invalid()).toBe(true);
    expect(component.form.typelessName().errors()[0].message).toContain('already in use');
  });

  describe('Form Submissions', () => {
    beforeEach(() => {
      vi.spyOn(form24Service, 'update').mockResolvedValue(testF24());
      vi.spyOn(messageService, 'add');
      vi.spyOn(router, 'navigate');
      vi.spyOn(router, 'navigateByUrl');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/reports/form-24/validation_check/?name=24-Hour: Initial Name&exclude_ids=999`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ valid: true }); // Simulate a response indicating the name is valid
    });

    it('should route to summary page when intent is "save"', async () => {
      await component.submitForm();
      expect(form24Service.update).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
      expect(router.navigateByUrl).toHaveBeenCalledWith('/reports');
    });

    it('should route deeper into transactions subview when intent is "continue"', async () => {
      await component.submitForm('continue');
      expect(form24Service.update).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/reports/transactions/report/', '999', 'list']);
    });

    it('should pop error toast message if network update falls over', async () => {
      vi.spyOn(form24Service, 'update').mockRejectedValue(new Error('DB connection timeout'));
      await component.submitForm();
      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
          summary: 'Error',
        }),
      );
    });
  });
});
