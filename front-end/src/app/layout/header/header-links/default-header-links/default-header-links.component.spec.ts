import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultHeaderLinksComponent } from './default-header-links.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideRouter } from '@angular/router';
import { LoginService } from 'app/shared/services/login.service';
import { ElectionCycleStore } from 'app/tools/election-cycle/election-cycle.store';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form3Service } from 'app/shared/services/form-3.service';

describe('DefaultHeaderLinksComponent', () => {
  let component: DefaultHeaderLinksComponent;
  let fixture: ComponentFixture<DefaultHeaderLinksComponent>;

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

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDocumentClick', () => {
    it('should hide both popovers when click target is outside both menu elements', () => {
      component.toolsHidden.set(false);
      component.accountHidden.set(false);
      fixture.detectChanges();
      const outerElement = document.createElement('div');
      const mockEvent = { target: outerElement } as unknown as MouseEvent;

      component.onDocumentClick(mockEvent);
      expect(component.toolsHidden()).toBeTruthy();
      expect(component.accountHidden()).toBeTruthy();
    });

    it('should not hide tools popover when clicking inside #tools-menu-link', () => {
      component.toolsHidden.set(false);
      component.accountHidden.set(false);
      const toolsWrapper = document.createElement('div');
      toolsWrapper.id = 'tools-menu-link';
      const innerChild = document.createElement('span');
      toolsWrapper.appendChild(innerChild);

      const mockEvent = { target: innerChild } as unknown as MouseEvent;
      component.onDocumentClick(mockEvent);

      expect(component.toolsHidden()).toBeFalsy();
      expect(component.accountHidden()).toBeTruthy();
    });

    it('should not hide account popover when clicking inside #account-menu-link', () => {
      component.toolsHidden.set(false);
      component.accountHidden.set(false);
      const accountWrapper = document.createElement('div');
      accountWrapper.id = 'account-menu-link';
      const innerChild = document.createElement('span');
      accountWrapper.appendChild(innerChild);

      const mockEvent = { target: innerChild } as unknown as MouseEvent;
      component.onDocumentClick(mockEvent);

      expect(component.toolsHidden()).toBeTruthy();
      expect(component.accountHidden()).toBeFalsy();
    });
  });
});
