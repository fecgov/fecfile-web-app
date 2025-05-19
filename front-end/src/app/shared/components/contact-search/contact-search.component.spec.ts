import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSearchComponent } from './contact-search.component';

describe('ContactSearchComponent', () => {
  let component: ContactSearchComponent;
  let fixture: ComponentFixture<ContactSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
