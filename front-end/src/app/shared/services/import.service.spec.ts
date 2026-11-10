import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { ContactImportJob, ImportService } from './import.service';

const job = (state: string): ContactImportJob => ({
  id: 12,
  import_status: state,
  total_rows: 1,
  totals: {},
  errors: [],
  preview: [],
});

describe('ImportService', () => {
  let service: ImportService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: { get: () => 'csrf-token' } },
      ],
    });
    service = TestBed.inject(ImportService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('sends original file bytes as multipart with credentials and CSRF', async () => {
    const file = new File(['type,name\nORG,Example'], 'contacts.csv', { type: 'text/csv' });
    const pending = service.upload(file);
    const request = http.expectOne(`${environment.apiUrl}${environment.importUploadEndpoint}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeInstanceOf(FormData);
    const uploaded = request.request.body.get('file') as File;
    expect(uploaded.name).toBe('contacts.csv');
    const text = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(uploaded);
    });
    expect(text).toBe('type,name\nORG,Example');
    expect(request.request.headers.has('Content-Type')).toBe(false);
    expect(request.request.headers.get('x-csrftoken')).toBe('csrf-token');
    expect(request.request.withCredentials).toBe(true);
    request.flush(job('CREATED'));
    expect((await pending).id).toBe(12);
  });

  it('confirms the existing job with credentials', async () => {
    const pending = service.confirm(12);
    const request = http.expectOne(`${environment.apiUrl}/contacts/imports/12/confirm/`);
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    request.flush(job('CONFIRMED'));
    expect((await pending).import_status).toBe('CONFIRMED');
  });

  it('polls until a terminal state and then stops requesting', async () => {
    vi.useFakeTimers();
    const states: string[] = [];
    let completed = false;
    service.watch(12).subscribe({
      next: (value) => states.push(value.import_status),
      complete: () => {
        completed = true;
      },
    });
    await vi.advanceTimersByTimeAsync(0);
    http.expectOne(`${environment.apiUrl}/contacts/imports/12/`).flush(job('PARSING'));
    await vi.advanceTimersByTimeAsync(1000);
    http.expectOne(`${environment.apiUrl}/contacts/imports/12/`).flush(job('PARSED'));
    expect(states).toEqual(['PARSING', 'PARSED']);
    expect(completed).toBe(true);
    await vi.advanceTimersByTimeAsync(2000);
    http.expectNone(`${environment.apiUrl}/contacts/imports/12/`);
  });
});
