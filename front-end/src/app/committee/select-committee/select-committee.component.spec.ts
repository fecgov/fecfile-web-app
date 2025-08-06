import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommitteeComponent } from './select-committee.component';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('SelectCommitteeComponent', () => {
  let component: SelectCommitteeComponent;
  let fixture: ComponentFixture<SelectCommitteeComponent>;

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
    fixture = TestBed.createComponent(SelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
