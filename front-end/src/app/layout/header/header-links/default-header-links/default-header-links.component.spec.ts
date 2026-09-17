import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultHeaderLinksComponent } from './default-header-links.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideRouter } from '@angular/router';
import { LoginService } from 'app/shared/services/login.service';
import { ElectionCycleStore } from 'app/tools/election-cycle/election-cycle.store';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form3Service } from 'app/shared/services/form-3.service';
import { Mock } from 'vitest';

describe('DefaultHeaderLinksComponent', () => {
  let component: DefaultHeaderLinksComponent;
  let fixture: ComponentFixture<DefaultHeaderLinksComponent>;
  let toolsHide: Mock;
  let accountHide: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultHeaderLinksComponent],
      providers: [
        provideMockStore(testMockStore()),
        provideRouter([]),
        LoginService,
        ElectionCycleStore,
        Form3Service,
        Form3XService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultHeaderLinksComponent);
    component = fixture.componentInstance;

    toolsHide = vi.spyOn(component.toolsOp(), 'hide');
    accountHide = vi.spyOn(component.accountOp(), 'hide');

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleTools', () => {
    it('should hide account popover and toggle tools popover', () => {
      const toolsToggle = vi.spyOn(component.toolsOp(), 'toggle');
      const mockEvent = new Event('click');

      component.toggleTools(mockEvent);

      expect(accountHide).toHaveBeenCalledTimes(1);
      expect(toolsToggle).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('toggleAccount', () => {
    it('should hide tools popover and toggle account popover', () => {
      const accountToggle = vi.spyOn(component.accountOp(), 'toggle');
      const mockEvent = new Event('click');

      component.toggleAccount(mockEvent);

      expect(toolsHide).toHaveBeenCalledTimes(1);
      expect(accountToggle).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('onDocumentClick', () => {
    it('should hide both popovers when click target is outside both menu elements', () => {
      const outerElement = document.createElement('div');

      const mockEvent = { target: outerElement } as unknown as MouseEvent;

      component.onDocumentClick(mockEvent);
      expect(toolsHide).toHaveBeenCalledTimes(1);
      expect(accountHide).toHaveBeenCalledTimes(1);
    });

    it('should not hide tools popover when clicking inside #tools-menu-link', () => {
      const toolsWrapper = document.createElement('div');
      toolsWrapper.id = 'tools-menu-link';
      const innerChild = document.createElement('span');
      toolsWrapper.appendChild(innerChild);

      const mockEvent = { target: innerChild } as unknown as MouseEvent;

      component.onDocumentClick(mockEvent);

      expect(toolsHide).not.toHaveBeenCalled();
      expect(accountHide).toHaveBeenCalledTimes(1);
    });

    it('should not hide account popover when clicking inside #account-menu-link', () => {
      const accountWrapper = document.createElement('div');
      accountWrapper.id = 'account-menu-link';
      const innerChild = document.createElement('span');
      accountWrapper.appendChild(innerChild);

      const mockEvent = { target: innerChild } as unknown as MouseEvent;

      component.onDocumentClick(mockEvent);

      expect(toolsHide).toHaveBeenCalledTimes(1);
      expect(accountHide).not.toHaveBeenCalled();
    });
  });
});
