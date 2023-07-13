import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CommitteeBannerComponent } from './committee-banner.component';

describe('CommitteeBannerComponent', () => {
  let component: CommitteeBannerComponent;
  let fixture: ComponentFixture<CommitteeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [CommitteeBannerComponent],
      providers: [CommitteeBannerComponent, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
