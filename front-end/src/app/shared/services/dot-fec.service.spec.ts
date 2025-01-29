import { TestBed } from '@angular/core/testing';
import { DotFecService, Download } from './dot-fec.service';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { Report } from '../models/report.model';
import { ApiService } from './api.service';
import { RendererFactory2 } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const childNodesMap = new WeakMap();

class MockRendererFactory {
  createRenderer() {
    return {
      createElement: () => {
        const attributes: { [key: string]: string } = {};
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAttribute: (element: any, name: string, value: string) => {
            element[name] = value;
          },
          getAttribute: (name: string) => attributes[name],
          click: jasmine.createSpy('click'),
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      appendChild: (parent: any, child: any) => {
        if (!childNodesMap.has(parent)) {
          childNodesMap.set(parent, []);
        }
        childNodesMap.get(parent).push(child);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAttribute: (element: any, name: string, value: string) => {
        element[name] = value;
      },
    };
  }
}

describe('DotFecService', () => {
  let service: DotFecService;
  const actions$ = new Subject<{ type: string }>();
  let apiService: ApiService;
  let report: Report;
  let download: Download;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DotFecService,
        ApiService,
        provideMockStore(testMockStore),
        { provide: Actions, useValue: actions$ },
        { provide: RendererFactory2, useClass: MockRendererFactory },
      ],
    });
    apiService = TestBed.inject(ApiService);
    service = TestBed.inject(DotFecService);

    report = { id: 'a' } as Report;
    download = { taskId: '1', report, isComplete: false, name: 'Test.fec' };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear downloads list on logout', () => {
    service.downloads.next([download]);
    expect(service.downloads.getValue().length).toEqual(1);
    actions$.next({ type: '[User Login Data] Discarded' });
    expect(service.downloads.getValue().length).toEqual(0);
  });

  it('should generate FEC file', async () => {
    const response = { status: 'testStatus', file_name: 'testFileName', task_id: 'testTaskId' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(apiService, 'post').and.returnValue(Promise.resolve(response) as Promise<any>);

    const result = await service.generateFecFile(report);

    expect(apiService.post).toHaveBeenCalledWith(`/web-services/dot-fec/`, { report_id: report.id });
    expect(service.downloads.getValue().length).toBe(1);
    expect(service.downloads.getValue()[0].taskId).toBe(response.task_id);
    expect(service.downloads.getValue()[0].report).toBe(report);
    expect(service.downloads.getValue()[0].name).toBe(response.file_name);
    expect(service.downloads.getValue()[0].isComplete).toBe(false);
    expect(result).toEqual(service.downloads.getValue()[0]);
  });

  it('should download FEC file', async () => {
    const dotFEC = 'test content';
    spyOn(apiService, 'getString').and.returnValue(Promise.resolve(dotFEC));
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:testBlob');
    const link = {
      href: '',
      download: '',
      click: jasmine.createSpy('click'),
      getAttribute: (name: string) => {
        if (name === 'href') {
          return 'blob:testBlob';
        } else if (name === 'download') {
          return `${download.report.id}.fec`;
        } else {
          return '';
        }
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(document, 'createElement').and.returnValue(link as any);
    spyOn(service['renderer'], 'createElement').and.returnValue(link);
    await service.downloadFecFile(download);

    expect(apiService.getString).toHaveBeenCalledWith(`/web-services/dot-fec/${download.id}/`);
    expect(link.getAttribute('href')).toBe('blob:testBlob');
    expect(link.getAttribute('download')).toBe(`${download.report.id}.fec`);
    expect(link.click).toHaveBeenCalled();
  });

  it('should check FEC file', async () => {
    const response = { done: true, id: 'testId' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(apiService, 'get').and.returnValue(Promise.resolve(response) as Promise<any>);

    service.downloads.next([download]);
    await service.checkFecFileTask(download);

    expect(apiService.get).toHaveBeenCalledWith(`/web-services/dot-fec/check/${download.taskId}/`);
    expect(service.downloads.getValue()[0].isComplete).toBe(true);
    expect(service.downloads.getValue()[0].id).toBe(response.id);
  });
});
