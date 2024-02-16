import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { environment } from '../../../environments/environment';
import { MemoText } from '../models/memo-text.model';
import { MemoTextService } from './memo-text.service';

describe('MemoTextService', () => {
  let service: MemoTextService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MemoTextService, provideMockStore(testMockStore)],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MemoTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get should return a specific memo text record', () => {
    const memoText: MemoText = MemoText.fromJSON({id: '999'});

    service.get('999').subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/${memoText.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(memoText);
    httpTestingController.verify();
  });

  it('#getForReportId should return memo texts for report id', () => {
    const memoTexts: MemoText[] = [MemoText.fromJSON({id: '999'})];

    service.getForReportId('1').subscribe((response: MemoText[]) => {
      expect(response).toEqual(memoTexts);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/?report_id=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(memoTexts);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', fakeAsync(() => {
    const memoText: MemoText = new MemoText();

    service.create(memoText).subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });
    tick(100);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(memoText);
    httpTestingController.verify();
  }));

  it('#update() should PUT a payload', fakeAsync(() => {
    const memoText: MemoText = MemoText.fromJSON({id: '999'});

    service.update(memoText).subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });
    tick(100);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/${memoText.id}/?fields_to_validate=`);
    expect(req.request.method).toEqual('PUT');
    req.flush(memoText);
    httpTestingController.verify();
  }));

  describe('#delete()', () => {
    it('should DELETE a record', () => {
      const memoText: MemoText = MemoText.fromJSON({id: '999'});

      service.delete(memoText).subscribe((response: null) => {
        expect(response).toBeNull();
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/999`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(null);
      httpTestingController.verify();
    });
  });

});
