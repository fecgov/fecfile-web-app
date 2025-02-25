import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadTrayComponent } from './download-tray.component';
import { Actions } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Subject } from 'rxjs';
import { DotFecService, Download } from 'app/shared/services/dot-fec.service';
import { Report } from 'app/shared/models/report.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DownloadTrayComponent', () => {
  let component: DownloadTrayComponent;
  let fixture: ComponentFixture<DownloadTrayComponent>;
  const actions$ = new Subject<{ type: string }>();
  let dotFecService: DotFecService;
  let report: Report;
  let download: Download;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DownloadTrayComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DotFecService,
        provideMockStore(testMockStore),
        { provide: Actions, useValue: actions$ },
      ],
    });
    fixture = TestBed.createComponent(DownloadTrayComponent);
    dotFecService = TestBed.inject(DotFecService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    report = { id: 'a' } as Report;
    download = { taskId: '1', report, isComplete: false, name: 'Test.fec' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update downloads and sidebarVisible', () => {
    expect(component.sidebarVisible()).toBeFalse();
    expect(dotFecService.downloads()).toEqual([]);
    const downloads = [download];
    dotFecService.downloads.set(downloads);
    expect(dotFecService.downloads()).toEqual(downloads);
    expect(component.sidebarVisible()).toBeTrue();
  });

  it('should remove download and update sidebarVisible', () => {
    const downloads = [download];
    dotFecService.downloads.set(downloads);

    component.removeDownload(download);

    expect(dotFecService.downloads()).toEqual([]);
    expect(component.sidebarVisible()).toBeFalse();
  });

  it('should call downloadFecFile on download', () => {
    const downloads = [download];
    dotFecService.downloads.set(downloads);
    spyOn(dotFecService, 'downloadFecFile');

    component.download(download);

    expect(dotFecService.downloadFecFile).toHaveBeenCalledWith(download);
  });
});
