import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleClickDirective } from './single-click.directive';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { singleClickEnableAction } from '../../store/single-click.actions';
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
      imports: [TestComponent, SingleClickDirective, StoreModule.forRoot({ singleClickDisabled: singleClickReducer })],
    }).createComponent(TestComponent);
    store = TestBed.inject(Store);
    fixture.detectChanges(); // initial binding
    // all elements with an attached SingleClickDirective
    des = fixture.debugElement.queryAll(By.directive(SingleClickDirective));
  });

  it('should create instance and add+remove disabled attribute', () => {
    expect(des.length).toBe(1);
    const button = des[0].nativeElement as HTMLButtonElement;
    vi.spyOn(button, 'setAttribute');
    vi.spyOn(button, 'removeAttribute');
    button.click();
    fixture.detectChanges();
    expect(button.setAttribute).toHaveBeenCalledWith('disabled', 'true');
    expect(button.setAttribute).toHaveBeenCalledTimes(1);
    store.dispatch(singleClickEnableAction());
    fixture.detectChanges();
    expect(button.removeAttribute).toHaveBeenCalledTimes(1);
  });
});
