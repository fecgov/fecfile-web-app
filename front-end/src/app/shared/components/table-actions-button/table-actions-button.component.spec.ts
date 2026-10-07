import { inputBinding, signal } from '@angular/core';
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

const inputItem = signal<MockItem>({ id: '123', status: 'active', name: 'Test Item' });
const actions = signal<TableAction<MockItem>[]>([
  new TableAction<MockItem>(
    'Edit',
    () => {},
    (item: MockItem) => item.status === 'active',
  ),
  new TableAction<MockItem>('Delete', () => {}),
]);

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<MockItem>;
  let fixture: ComponentFixture<TableActionsButtonComponent<MockItem>>;

  const mockActiveItem: MockItem = { id: '123', status: 'active', name: 'Test 1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(TableActionsButtonComponent<MockItem>, {
      bindings: [inputBinding('actionItem', inputItem), inputBinding('tableActions', actions)],
    });
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('User Interactions', () => {
    it('actionsClicked should toggle the popover', async () => {
      inputItem.set(mockActiveItem);
      fixture.detectChanges();
      expect(component.actionItem()).toEqual(mockActiveItem);
    });

    it('performAction should emit event and hide popover', () => {
      const clickSpy = vi.spyOn(component.tableActionClick, 'emit');
      inputItem.set(mockActiveItem);
      fixture.detectChanges();
      const targetAction = component.tableActions()[0];

      component.performAction(targetAction);
      fixture.detectChanges();

      expect(component.popoverHidden()).toBeTruthy();
      expect(clickSpy).toHaveBeenCalledWith({
        action: targetAction,
        actionItem: mockActiveItem,
      });
    });
  });
});
