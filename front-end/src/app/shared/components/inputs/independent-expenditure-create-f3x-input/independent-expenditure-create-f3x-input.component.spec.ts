import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { IndependentExpenditureCreateF3xInputComponent } from './independent-expenditure-create-f3x-input.component';
import { TooltipModule } from 'primeng/tooltip';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('IndependentExpenditureCreateF3xInputComponent', () => {
  let component: IndependentExpenditureCreateF3xInputComponent;
  let fixture: ComponentFixture<IndependentExpenditureCreateF3xInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipModule, IndependentExpenditureCreateF3xInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(IndependentExpenditureCreateF3xInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
