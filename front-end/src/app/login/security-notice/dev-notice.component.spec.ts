import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevNoticeComponent } from './dev-notice.component';

describe('DevNoticeComponent', () => {
  let component: DevNoticeComponent;
  let fixture: ComponentFixture<DevNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DevNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
