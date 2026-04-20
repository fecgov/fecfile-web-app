import { Component, computed, contentChild, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  imports: [ButtonDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly submitDisabled = input<boolean>();
  readonly visible = model.required<boolean>();
  readonly title = input.required<string>();
  readonly submitLabel = input('Save');
  readonly cancelLabel = input('Cancel');
  readonly showSubmit = input(true);
  readonly showCancel = input(true);
  readonly confirm = output<void>();
  readonly reject = output<void>();

  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly projectedFooter = contentChild('dialogFooterRef');
  readonly hasCustomFooter = computed(() => !!this.projectedFooter());
  readonly closeOnEscape = input(true);

  readonly footerJustification = computed(() =>
    this.showCancel() ? 'flex justify-content-between' : 'flex justify-content-center',
  );

  handleEscape(event: Event) {
    if (this.closeOnEscape()) {
      this.reject.emit();
      this.visible.set(false);
    } else {
      event.preventDefault();
    }
  }

  close() {
    if (!this.dialog().nativeElement.open) return;
    this.visible.set(false);
    this.reject.emit();
  }

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.dialog().nativeElement.showModal();
      } else {
        this.dialog().nativeElement.close();
      }
    });
  }
}
