import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleClickDirective } from './single-click.directive';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { singleClickDisableAction, singleClickEnableAction } from '../../store/single-click.actions';
import { singleClickReducer } from '../../store/single-click.reducer';
import { SplitButton } from 'primeng/splitbutton';

@Component({
  template: '<button #box appSingleClick>Test</button>',
  imports: [SingleClickDirective],
})
class TestComponent {}

@Component({
  template: '<p-splitButton appSingleClick label="Save"></p-splitButton>',
  imports: [SingleClickDirective, SplitButton],
})
class TestSplitButtonComponent {}

describe('SingleClickDirective', () => {
  describe('with button', () => {
    let des: DebugElement[];
    let fixture: ComponentFixture<TestComponent>;
    let store: Store;
    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        imports: [
          TestComponent,
          SingleClickDirective,
          StoreModule.forRoot({ singleClickDisabled: singleClickReducer }),
        ],
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
    it('should prevent default on mousedown to avoid premature input blur and layout shift', () => {
      const button = des[0].nativeElement as HTMLButtonElement;
      const event = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
      vi.spyOn(event, 'preventDefault');

      button.dispatchEvent(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('with SplitButton', () => {
    let splitFixture: ComponentFixture<TestSplitButtonComponent>;
    let store: Store;

    beforeEach(() => {
      splitFixture = TestBed.configureTestingModule({
        imports: [
          TestSplitButtonComponent,
          SingleClickDirective,
          StoreModule.forRoot({ singleClickDisabled: singleClickReducer }),
        ],
      }).createComponent(TestSplitButtonComponent);
      store = TestBed.inject(Store);
      splitFixture.detectChanges();
    });

    it('should update splitBtn disabled and call cd.markForCheck on splitButton', () => {
      const splitBtnDebug = splitFixture.debugElement.query(By.directive(SplitButton));
      const splitBtnInstance = splitBtnDebug.componentInstance as SplitButton;
      const markForCheckSpy = vi.spyOn(splitBtnInstance.cd, 'markForCheck');

      store.dispatch(singleClickDisableAction());
      splitFixture.detectChanges();
      expect(splitBtnInstance.disabled).toBe(true);
      expect(markForCheckSpy).toHaveBeenCalled();

      store.dispatch(singleClickEnableAction());
      splitFixture.detectChanges();
      expect(splitBtnInstance.disabled).toBe(false);
      expect(markForCheckSpy).toHaveBeenCalledTimes(2);
    });

    it('should prevent default on mousedown on the action button but not on the dropdown button', () => {
      const hostEl = splitFixture.debugElement.nativeElement as HTMLElement;
      const actionButton = hostEl.querySelector('.p-splitbutton-button') as HTMLElement;
      const dropdownButton = hostEl.querySelector('.p-splitbutton-dropdown') as HTMLElement;

      const actionEvent = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
      vi.spyOn(actionEvent, 'preventDefault');
      actionButton.dispatchEvent(actionEvent);
      expect(actionEvent.preventDefault).toHaveBeenCalled();

      const dropdownEvent = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
      vi.spyOn(dropdownEvent, 'preventDefault');
      dropdownButton.dispatchEvent(dropdownEvent);
      expect(dropdownEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should only disable on click when targeting the main action button', () => {
      const hostEl = splitFixture.debugElement.nativeElement as HTMLElement;
      const actionButton = hostEl.querySelector('.p-splitbutton-button') as HTMLElement;
      const dropdownButton = hostEl.querySelector('.p-splitbutton-dropdown') as HTMLElement;
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      // Click on dropdown should not disable
      dropdownButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: '[SingleClickButtonDisabled] True' }),
      );

      // Click on container host without targeting action button should not disable
      hostEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: '[SingleClickButtonDisabled] True' }),
      );

      // Click on action button should disable
      actionButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: '[SingleClickButtonDisabled] True' }));
    });
  });
});
