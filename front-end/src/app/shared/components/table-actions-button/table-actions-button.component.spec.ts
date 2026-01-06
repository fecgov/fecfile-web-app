/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
      [actionItemId]="inputId"
      [getActionItem]="fetchMethod"
      [tableActions]="actions"
      (tableActionClick)="onActionClick($event)"
    />
  `,
})
class TestHostComponent {
  inputItem: MockItem | undefined = undefined;
  inputId: string = '';
  fetchMethod: ((id: string) => Promise<MockItem>) | undefined = undefined;

  actions: TableAction<MockItem>[] = [
    {
      label: 'Edit',
      action: () => {},
      isAvailable: (item: MockItem) => item.status === 'active',
    },
    {
      label: 'Delete',
      action: () => {},
    },
  ] as any;

  component = viewChild.required(TableActionsButtonComponent);

  onActionClick(event: { action: TableAction<MockItem>; actionItem: MockItem }) {
    event.action.isAvailable(event.actionItem);
  }
}

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<MockItem>;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockActiveItem: MockItem = { id: '123', status: 'active', name: 'Test 1' };
  const mockInactiveItem: MockItem = { id: '456', status: 'inactive', name: 'Test 2' };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']); // Mock whatever ApiService does

    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent, TestHostComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    spyOn(host, 'onActionClick');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Data Resolution (updateActionItem)', () => {
    it('should set _actionItem directly when [actionItem] input is provided', async () => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();
      await component.updateActionItem();
      expect(component._actionItem()).toEqual(mockActiveItem);
    });

    it('should fetch data using [getActionItem] when only [actionItemId] is provided', async () => {
      host.inputItem = undefined;
      host.inputId = '999';
      host.fetchMethod = jasmine.createSpy('fetcher').and.resolveTo(mockInactiveItem);
      fixture.detectChanges();
      await component.updateActionItem();
      expect(host.fetchMethod).toHaveBeenCalledWith('999');
      expect(component._actionItem()).toEqual(mockInactiveItem);
    });

    it('should prefer [actionItem] input over fetching if both are present', async () => {
      host.inputItem = mockActiveItem;
      host.inputId = '999';
      host.fetchMethod = jasmine.createSpy('fetcher');
      fixture.detectChanges();
      await component.updateActionItem();
      expect(component._actionItem()).toEqual(mockActiveItem);
      expect(host.fetchMethod).not.toHaveBeenCalled(); // Should not fetch
    });
  });

  describe('Action Filtering (filteredActions computed)', () => {
    it('should filter out actions where isAvailable returns false', async () => {
      host.inputItem = mockInactiveItem;
      fixture.detectChanges();
      await component.updateActionItem();
      const visibleActions = component.filteredActions();
      expect(visibleActions.length).toBe(1);
      expect(visibleActions[0].label).toBe('Delete');
    });

    it('should show all actions if isAvailable returns true or is undefined', async () => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();
      await component.updateActionItem();
      const visibleActions = component.filteredActions();
      expect(visibleActions.length).toBe(2);
    });

    it('should return empty array if _actionItem is undefined', () => {
      host.inputItem = undefined;
      fixture.detectChanges();
      const visibleActions = component.filteredActions();
      expect(visibleActions).toEqual([]);
    });
  });

  describe('User Interactions', () => {
    it('actionsClicked should toggle the popover', async () => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();

      const popoverInstance = component.op();
      spyOn(popoverInstance, 'toggle');

      const mockEvent = new MouseEvent('click');
      await component.actionsClicked(mockEvent);

      expect(popoverInstance.toggle).toHaveBeenCalledWith(mockEvent);
      expect(component._actionItem()).toEqual(mockActiveItem); // Ensures update triggered
    });

    it('performAction should emit event and hide popover', fakeAsync(() => {
      host.inputItem = mockActiveItem;
      fixture.detectChanges();

      component._actionItem.set(mockActiveItem);

      const targetAction = host.actions[0];
      const popoverInstance = component.op();
      spyOn(popoverInstance, 'hide');

      component.performAction(targetAction);
      tick();

      expect(popoverInstance.hide).toHaveBeenCalled();
      expect(host.onActionClick).toHaveBeenCalledWith({
        action: targetAction,
        actionItem: mockActiveItem,
      });
    }));
  });
});
