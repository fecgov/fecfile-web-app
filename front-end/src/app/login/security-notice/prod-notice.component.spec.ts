import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdNoticeComponent } from './prod-notice.component';

describe('ProdNoticeComponent', () => {
  let component: ProdNoticeComponent;
  let fixture: ComponentFixture<ProdNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
