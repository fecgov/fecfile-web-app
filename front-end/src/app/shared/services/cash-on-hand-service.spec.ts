import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { CommitteeAccountService } from './committee-account.service';
import { ListRestResponse } from '../models/rest-api.model';
import { CommitteeAccount } from '../models/committee-account.model';
import { CashOnHandService } from './cash-on-hand-service';
import { CashOnHand } from '../models/cash-on-hand.model';
import { HttpResponse } from '@angular/common/http';

describe('CashOnHandService', () => {
  let service: CashOnHandService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CashOnHandService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(CashOnHandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cash on hand', async () => {
    const cashOnHandPromise = service.getCashOnHand(1990);
    const request = httpTestingController.expectOne(`${environment.apiUrl}/cash_on_hand/year/1990/`);
    const mockResponse: HttpResponse<CashOnHand> = new HttpResponse<CashOnHand>({
      body: {
        cash_on_hand: 25.0,
        year: '2024',
      },
      status: 200,
    });
    request.flush(mockResponse);
    await cashOnHandPromise;
    httpTestingController.verify();
  });
});
