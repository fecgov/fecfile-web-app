import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from '../../../environments/environment';
import { MemoText } from '../models/memo-text.model';
import { MemoTextService } from './memo-text.service';

describe('MemoTextService', () => {
  let service: MemoTextService;
  let httpTestingController: HttpTestingController;
  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MemoTextService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MemoTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get should return a specific memo text record', () => {
    const memoText: MemoText = MemoText.fromJSON({ id: 999 });

    service.get(999).subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/${memoText.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(memoText);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const memoText: MemoText = new MemoText();

    service.create(memoText).subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(memoText);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const memoText: MemoText = MemoText.fromJSON({ id: 999 });

    service.update(memoText).subscribe((response: MemoText) => {
      expect(response).toEqual(memoText);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/memo-text/${memoText.id}/?fields_to_validate=`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(memoText);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const memoText: MemoText = MemoText.fromJSON({ id: 999 });

    service.delete(memoText).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/memo-text/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });
  
});
