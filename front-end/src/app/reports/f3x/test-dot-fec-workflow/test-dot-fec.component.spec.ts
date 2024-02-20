import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { SharedModule } from 'app/shared/shared.module';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';
import { TestDotFecComponent } from './test-dot-fec.component';

describe('TestDotFecComponent', () => {
  let component: TestDotFecComponent;
  let fixture: ComponentFixture<TestDotFecComponent>;
  let reportService: Form3XService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, DividerModule, SharedModule],
      declarations: [TestDotFecComponent],
      providers: [TestDotFecComponent, provideMockStore(testMockStore)],
    }).compileComponents();
    fixture = TestBed.createComponent(TestDotFecComponent);
    reportService = TestBed.inject(Form3XService);
    apiService = TestBed.inject(ApiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#generate() calls the service', fakeAsync(() => {
    const updateSpy = spyOn(reportService, 'update').and.returnValue(of(Form3X.fromJSON({})));
    const apiServicePostSpy = spyOn(apiService, 'post').and.returnValue(of());
    component.generate();
    tick(5001);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(updateSpy).toHaveBeenCalled();
      expect(apiServicePostSpy).toHaveBeenCalled();
    });
  }));
});
