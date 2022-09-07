import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { CommitteeAccountService } from './committee-account.service';

describe('CommitteeAccountService', () => {
  let service: CommitteeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommitteeAccountService, provideMockStore(testMockStore)],
    });

    service = TestBed.inject(CommitteeAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
