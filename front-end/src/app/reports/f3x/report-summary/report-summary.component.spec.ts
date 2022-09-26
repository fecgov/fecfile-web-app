import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { ReportSummaryComponent } from './report-summary.component';

describe('ReportSummaryComponent', () => {
  let component: ReportSummaryComponent;
  let fixture: ComponentFixture<ReportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CardModule, RouterTestingModule.withRoutes([])],
      declarations: [ReportSummaryComponent],
      providers: [ReportSummaryComponent, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
