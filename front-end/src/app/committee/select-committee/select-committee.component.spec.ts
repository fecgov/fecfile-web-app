import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SelectCommitteeComponent } from './select-committee.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeStore } from '../committee.store';

describe('SelectCommitteeComponent', () => {
  let component: SelectCommitteeComponent;
  let fixture: ComponentFixture<SelectCommitteeComponent>;
  let testCommitteeAccountService: CommitteeAccountService;
  let committeeStore: CommitteeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectCommitteeComponent],
      providers: [
        CommitteeAccountService,
        provideMockStore(testMockStore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        CommitteeStore,
      ],
    });
    committeeStore = TestBed.inject(CommitteeStore);
    testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    fixture = TestBed.createComponent(SelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate committee', async () => {
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;
    testCommittee.id = '123';
    const setCommiteeSpy = vi.spyOn(committeeStore, 'setCommittee');
    const activateSpy = vi.spyOn(testCommitteeAccountService, 'activateCommittee').mockResolvedValue(testCommittee);

    await component.activateCommittee(testCommittee);
    expect(activateSpy).toHaveBeenCalledWith('123');
    expect(setCommiteeSpy).toHaveBeenCalledWith(testCommittee);
  });
});
