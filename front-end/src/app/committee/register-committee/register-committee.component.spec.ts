import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCommitteeComponent } from './register-committee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

describe('RegisterCommitteeComponent', () => {
  let component: RegisterCommitteeComponent;
  let fixture: ComponentFixture<RegisterCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [RegisterCommitteeComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(RegisterCommitteeComponent);
    component = fixture.componentInstance;
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
});
