import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { F3FormTypes } from 'app/shared/models';
import { Form3Service } from 'app/shared/services/form-3.service';
import { CreateF3Step1Component } from './create-f3-step1.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

let component: CreateF3Step1Component;
let fixture: ComponentFixture<CreateF3Step1Component>;

async function setup(params: { reportId?: string }) {
  await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, CreateF3Step1Component],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideNoopAnimations(),
      Form3Service,
      MessageService,
      {
        provide: ActivatedRoute,
        useValue: {
          params: of(params),
          snapshot: { params: of(params) },
        },
      },
      provideMockStore(testMockStore()),
    ],
  }).compileComponents();
}

describe('CreateF3Step1Component: New', () => {
  beforeEach(async () => {
    await setup({});

    fixture = TestBed.createComponent(CreateF3Step1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize the form for a new report', () => {
    expect(component).toBeTruthy();
    expect(component.reportId()).toBeNull();
    // the next line is redundant given the one following it but ensures F3A member is referenced in codebase for knip
    expect(component.form.get('form_type')?.value).not.toBe(F3FormTypes.F3A);
    expect(component.form.get('form_type')?.value).toBe(F3FormTypes.F3N);
  });
});
