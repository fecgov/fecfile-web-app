import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationControlBarComponent } from './navigation-control-bar.component';
import { Component, viewChild } from '@angular/core';
import { STANDARD_CONTROLS, Transaction } from 'app/shared/models';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

@Component({
  imports: [NavigationControlBarComponent],
  standalone: true,
  template: `<app-navigation-control-bar [transaction]="transaction" [navigationControls]="navigationControls" />`,
})
class TestHostComponent {
  component = viewChild.required(NavigationControlBarComponent);
  transaction?: Transaction;
  navigationControls = STANDARD_CONTROLS;
}

describe('NavigationControlBarComponent', () => {
  let host: TestHostComponent;
  let component: NavigationControlBarComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationControlBarComponent],
      providers: [provideMockStore(testMockStore())],
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
