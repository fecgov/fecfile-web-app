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
import { NavigationBehaviorOptions, Router, UrlTree } from '@angular/router';

describe('CreateCommitteeComponent', () => {
  let component: CreateCommitteeComponent;
  let fixture: ComponentFixture<CreateCommitteeComponent>;
  let testCommitteeAccountService: CommitteeAccountService;
  let router: Router;
  let routerSpy: jasmine.Spy<(url: string | UrlTree, extras?: NavigationBehaviorOptions) => Promise<boolean>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [CreateCommitteeComponent],
      providers: [ConfirmationService, MessageService, provideMockStore(testMockStore)],
    });
    testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
    router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigateByUrl');
    fixture = TestBed.createComponent(CreateCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    it('should search filings', () => {
      const testCommitteeId = 'C12345678';
      const testCommittee = new CommitteeAccount();
      testCommittee.committee_id = testCommitteeId;
      const testCommitteeAccountService = TestBed.inject(CommitteeAccountService);
      const spy = spyOn(testCommitteeAccountService, 'getAvailableCommittee').and.returnValue(of(testCommittee));

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
  });

  it('should create committee and redirect to reports page', async () => {
    const spy = spyOn(testCommitteeAccountService, 'createCommitteeAccount').and.callFake(() => {
      const committeeAccount = new CommitteeAccount();
      committeeAccount.committee_id = 'C12345678';
      committeeAccount.id = '123';
      return Promise.resolve(committeeAccount);
    });
    const activateSpy = spyOn(testCommitteeAccountService, 'activateCommittee').and.callFake(() =>
      Promise.resolve(true),
    );
    const testCommitteeId = 'C12345678';
    const testCommittee = new CommitteeAccount();
    testCommittee.committee_id = testCommitteeId;

    component.selectedCommittee = testCommittee;
    await component.createAccount();

    expect(spy).toHaveBeenCalledWith(testCommitteeId);
    expect(activateSpy).toHaveBeenCalledWith('123');
    expect(routerSpy).toHaveBeenCalledWith('');
  });

  it('should handle failed create', async () => {
    const spy = spyOn(testCommitteeAccountService, 'createCommitteeAccount').and.callFake(() =>
      Promise.reject(new Error()),
    );

    expect(component.unableToCreateAccount).toBeFalse();
    expect(component.selectedCommittee).toBeFalsy();
    await component.createAccount();
    expect(component.unableToCreateAccount).toBeTrue();
    expect(component.selectedCommittee).toBeFalsy();
    expect(spy).toHaveBeenCalledWith('');
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
