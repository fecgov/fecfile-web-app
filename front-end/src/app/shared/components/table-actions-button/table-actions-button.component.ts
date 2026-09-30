import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableAction } from './table-actions';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [ButtonModule, Ripple],
})
export class TableActionsButtonComponent<T> {
  private readonly el = inject(ElementRef);
  readonly apiService = inject(ApiService);
  readonly tableActions = input<TableAction<T>[]>([]);
  readonly actionItem = input.required<T>();
  readonly buttonIcon = input('');
  readonly buttonLabel = input('');
  readonly buttonStyleClass = input('');
  readonly buttonAriaLabel = input('');
  readonly buttonDataCy = input('table-actions-trigger');
  readonly actionDataCyPrefix = input('table-action');
  readonly rounded = input(true);
  readonly tableActionClick = output<{ action: TableAction<T>; actionItem: T }>();

  readonly popoverHidden = signal(true);

  readonly filteredActions = computed(() => {
    const item = this.actionItem();
    if (!item) return [];
    return this.tableActions().filter((action) => !action.isAvailable || action.isAvailable(item));
  });

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem() });
    this.popoverHidden.set(true);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInsideThisInstance = this.el.nativeElement.contains(target);
    if (!isInsideThisInstance) this.popoverHidden.set(true);
  }

  actionDataCy(label: string): string {
    return `${this.actionDataCyPrefix()}-${label
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replaceAll(/(^-|-$)/g, '')}`;
  }
}
