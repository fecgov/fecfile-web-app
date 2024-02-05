import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommitteeComponent } from './select-committee.component';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

describe('SelectCommitteeComponent', () => {
  let component: SelectCommitteeComponent;
  let fixture: ComponentFixture<SelectCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCommitteeComponent],
      imports: [HttpClientTestingModule],
      providers: [CommitteeAccountService, FecApiService, provideMockStore(testMockStore), HttpClient],
    });
    fixture = TestBed.createComponent(SelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
