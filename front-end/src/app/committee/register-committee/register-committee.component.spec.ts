import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RegisterCommitteeComponent } from './register-committee.component';

describe('RegisterCommitteeComponent', () => {
  let component: RegisterCommitteeComponent;
  let fixture: ComponentFixture<RegisterCommitteeComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [RegisterCommitteeComponent],
      providers: [MessageService, provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(RegisterCommitteeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select committee', () => {
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);

    expect(component.selectedCommittee?.name).toEqual(filing.committee_name);
    expect(component.selectedCommittee?.committee_id).toBe(filing.committee_id);
  });

  it('should register committee', () => {
    const testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    const spy = spyOn(testCommitteeAccountService, 'registerCommitteeAccount').and.callFake(() =>
      Promise.resolve(new CommitteeAccount()),
    );
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);
    component.createAccount();

    expect(spy).toHaveBeenCalledWith(filing.committee_id);
  });

  it('should fail to register committee', waitForAsync(() => {
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);
    component.createAccount();
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/register/`);
    expect(req.request.method).toEqual('POST');
    req.flush(null);
    httpTestingController.verify();
    setTimeout(() => {
      expect(component.unableToCreateAccount).toBeTrue();
    }, 500);
  }));
});
