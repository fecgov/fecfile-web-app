import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndependentExpenditureCreateF3xInputComponent } from './independent-expenditure-create-f3x-input.component';
import { TooltipModule } from 'primeng/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

describe('IndependentExpenditureCreateF3xInputComponent', () => {
  let component: IndependentExpenditureCreateF3xInputComponent;
  let fixture: ComponentFixture<IndependentExpenditureCreateF3xInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndependentExpenditureCreateF3xInputComponent],
      imports: [HttpClientTestingModule, TooltipModule],
      providers: [provideMockStore(testMockStore), RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IndependentExpenditureCreateF3xInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
