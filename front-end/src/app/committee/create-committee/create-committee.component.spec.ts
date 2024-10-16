import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { CreateCommitteeComponent } from './create-committee.component';

describe('CreateCommitteeComponent', () => {
  let component: CreateCommitteeComponent;
  let fixture: ComponentFixture<CreateCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [CreateCommitteeComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(CreateCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search filings', () => {
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;
    const testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    const spy = spyOn(testCommitteeAccountService, 'getUncreatedCommittee').and.returnValue(of(testCommittee));

    expect(component.selectedCommittee).toBeFalsy();
    component.search(testCommitteeId);
    expect(spy).toHaveBeenCalledWith(testCommitteeId);
  });

  it('should handle successful search', () => {
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;

    expect(component.unableToCreateAccount).toBeFalse();
    expect(component.selectedCommittee).toBeFalsy();
    component.handleSuccessfulSearch(testCommittee);
    expect(component.unableToCreateAccount).toBeFalse();
    expect(component.selectedCommittee?.committee_id).toEqual(testCommitteeId);
  });

  it('should handle failed search', () => {
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;

    expect(component.unableToCreateAccount).toBeFalse();
    expect(component.selectedCommittee).toBeFalsy();
    component.handleFailedSearch();
    expect(component.unableToCreateAccount).toBeTrue();
    expect(component.selectedCommittee).toBeFalsy();
  });

  it('should create committee', () => {
    const testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    const spy = spyOn(testCommitteeAccountService, 'createCommitteeAccount').and.callFake(() =>
      Promise.resolve(new CommitteeAccount()),
    );
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;

    component.selectedCommittee = testCommittee;
    component.createAccount();

    expect(spy).toHaveBeenCalledWith(testCommitteeId);
  });
});
