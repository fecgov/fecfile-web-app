import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { Button, ButtonModule } from 'primeng/button';

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent;
  let fixture: ComponentFixture<TableActionsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayPanelModule, ButtonModule],
      declarations: [TableActionsButtonComponent, Button],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionsButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
