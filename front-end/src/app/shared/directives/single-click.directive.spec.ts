import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleClickDirective } from './single-click.directive';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';
import { singleClickReducer } from '../../store/single-click.reducer';

@Component({
  template: '<button #box appSingleClick>Test</button>',
  imports: [SingleClickDirective],
})
class TestComponent {}

describe('SingleClickDirective', () => {
  let des: DebugElement[];
  let fixture: ComponentFixture<TestComponent>;
  let store: Store;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [
        TestComponent,
        SingleClickDirective,
        StoreModule.forRoot({
          singleClickDisabled: singleClickReducer,
        }),
      ],
    }).createComponent(TestComponent);

    store = TestBed.inject(Store);
    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(SingleClickDirective));
  });

  it('should create the directive', () => {
    expect(des.length).toBe(1);
  });

  it('should dispatch singleClickDisableAction when the button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const button = des[0].nativeElement as HTMLButtonElement;

    button.click();

    expect(dispatchSpy).toHaveBeenCalledWith(singleClickDisableAction());
  });

  it('should ignore clicks on the split button dropdown', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const button = des[0].nativeElement as HTMLButtonElement;
    const dropdown = document.createElement('span');
    dropdown.classList.add('p-splitbutton-dropdown');
    button.appendChild(dropdown);

    dropdown.click();

    expect(dispatchSpy).not.toHaveBeenCalledWith(singleClickDisableAction());
  });

  it('should dispatch singleClickEnableAction when the directive is destroyed', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.destroy();

    expect(dispatchSpy).toHaveBeenCalledWith(singleClickEnableAction());
  });

  it('should not directly manipulate the disabled attribute', () => {
    const button = des[0].nativeElement as HTMLButtonElement;
    const setAttributeSpy = vi.spyOn(button, 'setAttribute');
    const removeAttributeSpy = vi.spyOn(button, 'removeAttribute');

    store.dispatch(singleClickDisableAction());
    fixture.detectChanges();

    store.dispatch(singleClickEnableAction());
    fixture.detectChanges();

    expect(setAttributeSpy).not.toHaveBeenCalledWith('disabled', 'true');
    expect(removeAttributeSpy).not.toHaveBeenCalledWith('disabled');
  });
});
