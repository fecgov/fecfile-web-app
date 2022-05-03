import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

import { CreateF3xStep2Component } from './create-f3x-step2.component';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { environment } from '../../../../../environments/environment';
import { CommitteeAccount } from '../../../../shared/models/committee-account.model';
import { selectCommitteeAccount } from '../../../../store/committee-account.selectors';

describe('CreateF3xStep2Component', () => {
  let component: CreateF3xStep2Component;
  let fixture: ComponentFixture<CreateF3xStep2Component>;
  let router: Router;
  let httpTestingController: HttpTestingController;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
      ],
      declarations: [CreateF3xStep2Component],
      providers: [
        provideMockStore({
          initialState: { fecfile_online_committeeAccount: committeeAccount },
          selectors: [{ selector: selectCommitteeAccount, value: committeeAccount }],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(CreateF3xStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save should go back when back button pressed', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.report = F3xSummary.fromJSON({
      id: '999',
    });

    component.save('back');

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${component.report.id}/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(component.report);
    // httpTestingController.verify();
    expect(navigateSpy).toHaveBeenCalledWith(['/reports/f3x/create/step1/999']);
  });
});
