import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableActionsButtonComponent } from './table-actions-button.component';

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent;
  let fixture: ComponentFixture<TableActionsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverlayPanelModule,
      ],
      declarations: [TableActionsButtonComponent],
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
