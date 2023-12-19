import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SingleClickDirective } from './single-click.directive';
import { SharedModule } from "../shared.module";
import { By } from "@angular/platform-browser";
import { Store, StoreModule } from "@ngrx/store";
import { spinnerOffAction } from "../../store/spinner.actions";
import { spinnerReducer } from "../../store/spinner.reducer";

@Component({
  standalone: true,
  template: "<button #box appSingleClick>Test</button>",
  imports: [SharedModule],
})
class TestComponent {
}

describe('SingleClickDirective', () => {
  let des: DebugElement[];
  let fixture: ComponentFixture<TestComponent>;
  let store: Store;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, SharedModule, StoreModule.forRoot({spinnerOn: spinnerReducer})],
    }).createComponent(TestComponent);
    store = TestBed.inject(Store);
    fixture.detectChanges(); // initial binding
    // all elements with an attached SingleClickDirective
    des = fixture.debugElement.queryAll(By.directive(SingleClickDirective));
  });

  it('should create instance and add+remove disabled attribute', fakeAsync(() => {
    const button = des[0].nativeElement as HTMLButtonElement;
    spyOn(button, 'setAttribute');
    spyOn(button, 'removeAttribute');
    button.click();
    tick(300);
    expect(button.setAttribute).toHaveBeenCalledWith('disabled', 'true');
    expect(button.setAttribute).toHaveBeenCalledTimes(1);
    store.dispatch(spinnerOffAction());
    tick(300);
    expect(button.removeAttribute).toHaveBeenCalledTimes(1);

  }));

});
