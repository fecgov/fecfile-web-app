import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CreateCommitteeComponent } from './create-committee.component';

describe('CreateCommitteeComponent', () => {
  let component: CreateCommitteeComponent;
  let fixture: ComponentFixture<CreateCommitteeComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [CreateCommitteeComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(CreateCommitteeComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search filings', () => {
    const testFecApiService = TestBed.inject(FecApiService);
    const spy = spyOn(testFecApiService, 'queryFilings').and.callFake(() =>
      Promise.resolve([new FecFiling()] as FecFiling[]),
    );
    component.search({ query: 'query' });

    expect(spy).toHaveBeenCalledWith('query', 'F1');
  });
  it('should select committee', () => {
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);

    expect(component.selectedCommittee?.name).toEqual(filing.committee_name);
    expect(component.selectedCommittee?.committee_id).toBe(filing.committee_id);
  });
  it('should create committee', () => {
    const testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    const spy = spyOn(testCommitteeAccountService, 'createCommitteeAccount').and.callFake(() =>
      Promise.resolve(new CommitteeAccount()),
    );
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);
    component.createAccount();

    expect(spy).toHaveBeenCalledWith(filing.committee_id);
  });
  it('should fail to create committee', waitForAsync(() => {
    const filing = new FecFiling();
    filing.committee_id = 'C12345678';
    filing.committee_name = 'test name';
    component.select(filing);
    component.createAccount();
    const req = httpTestingController.expectOne(`${environment.apiUrl}/committees/create_account/`);
    expect(req.request.method).toEqual('POST');
    req.flush(null);
    httpTestingController.verify();
    setTimeout(() => {
      expect(component.unableToCreateAccount).toBeTrue();
    }, 500);
  }));
});
