import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { MessageService } from 'primeng/api';
import { CreateF3XStep1Component } from './create-f3x-step1.component';

describe('CreateF3XStep1Component', () => {
  let component: CreateF3XStep1Component;
  let fixture: ComponentFixture<CreateF3XStep1Component>;

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };
    await TestBed.configureTestingModule({
      declarations: [CreateF3XStep1Component, LabelPipe],
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
    fixture = TestBed.createComponent(CreateF3XStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
