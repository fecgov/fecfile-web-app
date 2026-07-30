import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectCommitteeComponent } from './select-committee.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';

describe('SelectCommitteeComponent', () => {
  let component: SelectCommitteeComponent;
  let fixture: ComponentFixture<SelectCommitteeComponent>;
  let store: MockStore;
  let testCommitteeAccountService: CommitteeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectCommitteeComponent],
      providers: [
        CommitteeAccountService,
        provideMockStore(testMockStore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    store = TestBed.inject(MockStore);
    testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    fixture = TestBed.createComponent(SelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate committee', async () => {
    vi.spyOn(store, 'dispatch');
    const activateSpy = vi
      .spyOn(testCommitteeAccountService, 'activateCommittee')
      .mockImplementation(() => Promise.resolve(new CommitteeAccount()));
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;
    testCommittee.id = '123';

    await component.activateCommittee(testCommittee);
    expect(activateSpy).toHaveBeenCalledWith('123');
    expect(store.dispatch).toHaveBeenCalledWith(setCommitteeAccountDetailsAction({ payload: new CommitteeAccount() }));
  });
});
