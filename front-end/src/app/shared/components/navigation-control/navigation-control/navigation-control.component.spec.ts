import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { ButtonModule } from 'primeng/button';
import { NavigationControlComponent } from './navigation-control.component';

describe('NavigationControlComponent', () => {
  let component: NavigationControlComponent;
  let fixture: ComponentFixture<NavigationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule],
      declarations: [NavigationControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event', () => {
    // spy on event emitter
    spyOn(component.navigate, 'emit');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.navigate.emit).toHaveBeenCalledWith(new NavigationEvent());
  });
});
