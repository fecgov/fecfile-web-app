import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { ContactDetailComponent } from './contact-detail.component';
import { UserLoginData } from '../../shared/models/user.model';
import { Roles } from '../../shared/models/role.model';
import { FormBuilder } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

describe('ContactDetailComponent', () => {
  let component: ContactDetailComponent;
  let fixture: ComponentFixture<ContactDetailComponent>;

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      role: Roles.COMMITTEE_ADMIN,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DialogModule],
      declarations: [ContactDetailComponent],
      providers: [
        FormBuilder,
        MessageService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: 'selectUserLoginData', value: userLoginData }],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
