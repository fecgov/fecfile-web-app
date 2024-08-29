import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RegisterCommitteeComponent } from './register-committee.component';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

describe('RegisterCommitteeComponent', () => {
  let component: RegisterCommitteeComponent;
  let fixture: ComponentFixture<RegisterCommitteeComponent>;
  let committeeAccountService: CommitteeAccountService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastModule, DialogModule],
      declarations: [RegisterCommitteeComponent],
      providers: [MessageService, CommitteeAccountService, provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(RegisterCommitteeComponent);
    component = fixture.componentInstance;
    committeeAccountService = TestBed.inject(CommitteeAccountService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only submit with a valid committee id', waitForAsync(async () => {
    const promisedCommittee = new Promise<CommitteeAccount>(() => {
      CommitteeAccount.fromJSON({});
    });
    const spy = spyOn(committeeAccountService, 'registerCommitteeAccount').and.returnValue(promisedCommittee);
    const routerSpy = spyOn(router, 'navigateByUrl');
    const committeeIdField = component.form.get('committee-id') as AbstractControl;
    component.registerMembership();

    expect(committeeIdField.value).toEqual('');
    expect(component.form.valid).toBeFalse();
    expect(spy).not.toHaveBeenCalled();

    committeeIdField.setValue('NOTVALID');
    expect(component.form.valid).toBeFalse();
    component.registerMembership();
    expect(spy).not.toHaveBeenCalled();

    component.form.get('committee-id')?.setValue('C00000000');
    expect(component.form.valid).toBeTrue();

    await component.registerMembership();

    expect(spy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith('/select-committee');
  }));
});
