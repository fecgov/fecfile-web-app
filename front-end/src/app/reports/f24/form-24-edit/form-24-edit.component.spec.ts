import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form24Service } from 'app/shared/services/form-24.service';
import { testF24, testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Form24EditComponent } from './form-24-edit.component';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { submit } from '@angular/forms/signals';

describe('Form24EditComponent', () => {
  let component: Form24EditComponent;
  let fixture: ComponentFixture<Form24EditComponent>;
  let form24Service: Form24Service;
  let httpMock: HttpTestingController;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form24EditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form24Service,
        MessageService,
        provideMockStore({
          ...testMockStore(),
          selectors: [{ selector: selectActiveReport, value: testF24() }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Form24EditComponent);
    component = fixture.componentInstance;
    form24Service = TestBed.inject(Form24Service);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should seed form values on initialization based on activeReport store signal', () => {
    expect(component.f24Form.typeName().value()).toBe('24');
    expect(component.f24Form.form24Name().value()).toBe('Initial Name');
  });

  it('should compute the correct prefix title via typeName() helper', () => {
    expect(component.typeName()).toBe('24-Hour:');
  });

  it('should validate name uniqueness against the backend when modified', async () => {
    component.f24Form.form24Name().value.set('Brand New Name');

    fixture.detectChanges();

    const expectedUrl = `${environment.apiUrl}${form24Service.apiEndpoint}/check/?name=24-Hour: Brand New Name`;
    const req = httpMock.expectOne((request) => request.url === expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush({ available: true });
    await fixture.whenStable();

    expect(component.f24Form.form24Name().invalid()).toBe(false);
    httpMock.verify();
  });

  it('should fail validation if the backend responds that the name is taken', async () => {
    component.f24Form.form24Name().value.set('Taken Name');

    fixture.detectChanges();

    const expectedUrl = `${environment.apiUrl}${form24Service.apiEndpoint}/check/?name=24-Hour: Taken Name`;
    const req = httpMock.expectOne((request) => request.url === expectedUrl);
    req.flush({ available: false });
    await fixture.whenStable();

    expect(component.f24Form.form24Name().invalid()).toBe(true);
    expect(component.f24Form.form24Name().errors()[0].message).toContain('already in use');
    httpMock.verify();
  });

  describe('Form Submissions', () => {
    beforeEach(() => {
      vi.spyOn(form24Service, 'update').mockResolvedValue(testF24());
      vi.spyOn(messageService, 'add');
      vi.spyOn(router, 'navigate');
      vi.spyOn(router, 'navigateByUrl');
    });

    it('should route to summary page when intent is "save"', async () => {
      component.setIntent('save');

      await submit(component.f24Form);

      expect(form24Service.update).toHaveBeenCalled();
      expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
      expect(router.navigateByUrl).toHaveBeenCalledWith('/reports');
    });

    it('should route deeper into transactions subview when intent is "continue"', async () => {
      component.setIntent('continue');

      await submit(component.f24Form);

      expect(form24Service.update).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/reports/transactions/report/', '999', 'list']);
    });

    it('should pop error toast message if network update falls over', async () => {
      vi.spyOn(form24Service, 'update').mockRejectedValue(new Error('DB connection timeout'));
      component.setIntent('save');

      await submit(component.f24Form);

      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
          summary: 'Error',
        }),
      );
    });
  });
});
