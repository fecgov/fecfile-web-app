import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenubarModule } from 'primeng/menubar';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { SharedModule } from 'app/shared/shared.module';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [
        LayoutComponent,
      ],
      providers: [LayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
