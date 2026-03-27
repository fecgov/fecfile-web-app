import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { TableAction } from './table-actions';
import { ApiService } from 'app/shared/services/api.service';

interface MockItem {
  id: string;
  status: 'active' | 'inactive';
  name: string;
}

@Component({
  imports: [TableActionsButtonComponent],
  standalone: true,
  template: `
    <app-table-actions-button
      [actionItem]="inputItem"
      [tableActions]="actions"
      (tableActionClick)="onActionClick($event)"
    />
  `,
})
class TestHostComponent {
  inputItem: MockItem = { id: '123', status: 'active', name: 'Test Item' };
  inputId: string = '';
  fetchMethod: ((id: string) => Promise<MockItem>) | undefined = undefined;

  actions: TableAction<MockItem>[] = [
    new TableAction<MockItem>(
      'Edit',
      () => {},
      (item: MockItem) => item.status === 'active',
    ),
    new TableAction<MockItem>('Delete', () => {}),
  ];

  component = viewChild.required(TableActionsButtonComponent);

  onActionClick(event: { action: TableAction<MockItem>; actionItem: MockItem }) {
    event.action.isAvailable(event.actionItem);
  }
}

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<MockItem>;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const mockActiveItem: MockItem = { id: '123', status: 'active', name: 'Test 1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent, TestHostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    vi.spyOn(host, 'onActionClick');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('User Interactions', () => {
    it('actionsClicked should toggle the popover', async () => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();

      const popoverInstance = component.op();
      vi.spyOn(popoverInstance, 'toggle');
      expect(component.actionItem()).toEqual(mockActiveItem);
    });

    it('performAction should emit event and hide popover', () => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();
      const targetAction = host.actions[0];
      const popoverInstance = component.op();
      vi.spyOn(popoverInstance, 'hide');

      component.performAction(targetAction);
      fixture.detectChanges();

      expect(popoverInstance.hide).toHaveBeenCalled();
      expect(host.onActionClick).toHaveBeenCalledWith({
        action: targetAction,
        actionItem: mockActiveItem,
      });
    });
  });
});
