import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

export const SELECTBUTTON_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AppSelectButtonComponent),
  multi: true,
};

@Component({
  selector: 'app-select-button',
  template: `
    <div [ngClass]="'p-selectbutton p-buttonset p-component'" [ngStyle]="style" [class]="styleClass" role="group">
      <div
        *ngFor="let option of options; let i = index"
        #btn
        class="p-button p-component"
        [class]="option.styleClass"
        role="button"
        [attr.aria-pressed]="isSelected(option)"
        [ngClass]="{
          'p-highlight': isSelected(option),
          'p-disabled': disabled || isOptionDisabled(option),
          'p-button-icon-only': option.icon && !getOptionLabel(option)
        }"
        (click)="onItemClick($event, option, i)"
        (keydown.enter)="onItemClick($event, option, i)"
        [attr.title]="option.title"
        [attr.aria-label]="option.label"
        (blur)="onBlur()"
        [attr.tabindex]="disabled ? null : tabindex"
        pRipple
      >
        <ng-container *ngIf="!itemTemplate; else customcontent">
          <span [ngClass]="'p-button-icon p-button-icon-left'" [class]="option.icon" *ngIf="option.icon"></span>
          <span class="p-button-label">{{ getOptionLabel(option) }}</span>
        </ng-container>
        <ng-template #customcontent>
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: option, index: i }"></ng-container>
        </ng-template>
      </div>
    </div>
  `,
  providers: [SELECTBUTTON_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSelectButtonComponent extends SelectButton {
  @HostBinding('class') class = 'p-element';
}
