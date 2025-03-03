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
import { provideRouter } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';

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
        provideRouter([
          { path: '', component: LayoutComponent },
          { path: 'reports', component: ReportListComponent },
        ]),
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

  it('should update downloads and sidebarVisible', async () => {
    await component.router.navigateByUrl('/reports');
    const downloads = [download];
    dotFecService.downloads.set(downloads);
    expect(component.sidebarVisible()).toBeTrue();

    dotFecService.downloads.set([]);
    expect(component.sidebarVisible()).toBeFalse();

    dotFecService.downloads.set(downloads);
    expect(component.sidebarVisible()).toBeTrue();

    await component.router.navigateByUrl('');
    expect(component.sidebarVisible()).toBeFalse();
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
