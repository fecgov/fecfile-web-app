import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'app/shared/services/api.service';
import { ReportListComponent } from './report-list.component';
import { F3xSummary, F3xFormTypes } from '../../shared/models/f3x-summary.model';
import { Report } from '../../shared/interfaces/report.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TableModule, ToolbarModule, RouterTestingModule.withRoutes([])],
      declarations: [ReportListComponent],
      providers: [ConfirmationService, MessageService, ApiService, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getEmptyItem should return a new F3xSummary instance', () => {
    const item: F3xSummary = component['getEmptyItem']();
    expect(item.id).toBe(undefined);
  });

  it('#addItem should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.addItem();
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step1');
  });

  it('#editItem should route properly', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.editItem({ id: 999, change_of_address: null } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step2/999');

    component.editItem({ id: 999, change_of_address: true } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/cash-on-hand/999');
  });

  it('#displayName should display the item form_type code', () => {
    const item: Report = F3xSummary.fromJSON({ form_type: F3xFormTypes.F3XT });
    const name: string = component.displayName(item);
    expect(name).toBe(F3xFormTypes.F3XT);
  });
});
