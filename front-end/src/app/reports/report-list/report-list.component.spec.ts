import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'app/shared/services/api.service';
import { ReportListComponent } from './report-list.component';
import { F3xSummary, F3xFormTypes } from '../../shared/models/f3x-summary.model';
import { Report } from '../../shared/interfaces/report.interface';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TableModule, ToolbarModule, RouterTestingModule.withRoutes([])],
      declarations: [ReportListComponent],
      providers: [
        ConfirmationService,
        MessageService,
        ApiService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getEmptyItem should return a new F3xSummary instance', () => {
    const item: F3xSummary = component['getEmptyItem']();
    expect(item.id).toBe(null);
  });

  it('#displayName should display the item form_type code', () => {
    const item: Report = F3xSummary.fromJSON({ form_type: F3xFormTypes.F3XT });
    expect(item.form_type).toBe(F3xFormTypes.F3XT);
  });
});
