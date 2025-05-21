import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSearchComponent } from './contact-search.component';
import { provideHttpClient } from '@angular/common/http';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [ContactSearchComponent],
  standalone: true,
  template: `<app-contact-search [key]="key" [isBare]="isBare"></app-contact-search>`,
})
class TestHostComponent {
  key = 'contact_1';
  isBare = true;

  component = viewChild.required(ContactSearchComponent);
}

describe('ContactSearchComponent', () => {
  let component: ContactSearchComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSearchComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
