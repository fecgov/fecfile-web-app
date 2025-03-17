import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SecondCommitteeAdminDialogComponent } from './second-committee-admin-dialog.component';
import { Store } from '@ngrx/store';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { MessageService } from 'primeng/api';
import { CommitteeMemberEmailValidator } from 'app/shared/utils/validators.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeMember, Roles } from 'app/shared/models';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SecondCommitteeAdminDialogComponent', () => {
  let component: SecondCommitteeAdminDialogComponent;
  let fixture: ComponentFixture<SecondCommitteeAdminDialogComponent>;
  let store: Store;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        SecondCommitteeAdminDialogComponent,
        ErrorMessagesComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore),
        CommitteeMemberService,
        { provide: MessageService, useValue: messageService },
        CommitteeMemberEmailValidator,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondCommitteeAdminDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.get('role')?.value).toBe(Roles.COMMITTEE_ADMINISTRATOR);
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should mark the form as invalid when email is empty', () => {
    component.form.get('email')?.setValue('');
    component.form.get('email')?.markAsTouched();
    fixture.detectChanges();
    expect(component.form.invalid).toBeTrue();
  });

  it('should dispatch singleClickEnableAction when form is invalid on save', () => {
    spyOn(store, 'dispatch');
    component.form.get('email')?.setValue('');
    component.save();
    expect(store.dispatch).toHaveBeenCalledWith(singleClickEnableAction());
  });

  it('should call addMember and show success message on valid form submission', fakeAsync(() => {
    spyOn(store, 'dispatch');
    component.form.get('email')?.setValue('test@example.com');
    component.form.updateValueAndValidity();
    const addMemberSpy = spyOn(component.memberService, 'addMember').and.returnValue(
      Promise.resolve(new CommitteeMember()),
    );
    const membersReloadSpy = spyOn(component.memberService.membersResource, 'reload');
    component.save();
    tick();

    expect(addMemberSpy).toHaveBeenCalledWith('test@example.com', 'COMMITTEE_ADMINISTRATOR' as unknown as typeof Roles);
    expect(membersReloadSpy).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Successful',
      detail: 'Committee Administrator created',
      life: 3000,
    });
  }));
});
