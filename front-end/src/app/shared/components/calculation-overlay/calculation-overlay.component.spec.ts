import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from 'primeng/overlay';
import { CalculationOverlayComponent } from './calculation-overlay.component';

describe('CalculationOverlayComponent', () => {
  let component: CalculationOverlayComponent;
  let fixture: ComponentFixture<CalculationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, CalculationOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
