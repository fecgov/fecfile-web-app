import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCommitteeComponent } from './register-committee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

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
});
