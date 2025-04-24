/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ReportService } from 'app/shared/services/report.service';
import { testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ElementRef, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { createSignal } from '@angular/core/primitives/signals';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore),
        { provide: ReportService, useValue: jasmine.createSpyObj('ReportService', ['getAllReports']) },
      ],
    }).compileComponents();

    reportService = TestBed.inject(ReportService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllReports on ngOnInit', async () => {
    const reports = [testActiveReport];
    (reportService.getAllReports as jasmine.Spy).and.returnValue(Promise.resolve(reports));
    expect(reportService.getAllReports).toHaveBeenCalled();
    expect(component.reports).toEqual(reports);
  });

  it('should adjust height on ngAfterViewInit', () => {
    spyOn(component, 'adjustHeight');
    const changes = new Subject();
    const elements = {
      changes: changes.asObservable(),
    };
    (component.elements as any) = createSignal(elements as unknown as QueryList<ElementRef>);

    changes.next({});
    expect(component.adjustHeight).toHaveBeenCalled();
  });

  it('should adjust height of elements', () => {
    const elements = [createElement()];
    component.adjustHeight(elements);
    expect(elements[0].nativeElement.style.height).toEqual('308px');

    elements.push(createElement());
    component.adjustHeight(elements);
    expect(elements[0].nativeElement.style.height).toEqual('144px');

    elements.push(createElement());
    component.adjustHeight(elements);
    expect(elements[0].nativeElement.style.height).toEqual('100px');
  });
});

function createElement(): ElementRef<HTMLParagraphElement> {
  const p = document.createElement('p');
  p.className = 'card-text';
  p.textContent = 'APRIL 15 QUARTERLY REPORT (Q1)';
  return new ElementRef(p);
}
