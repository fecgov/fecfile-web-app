import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedContactDialogComponent } from './deleted-contact-dialog.component';

describe('DeletedContactDialogComponent', () => {
  let component: DeletedContactDialogComponent;
  let fixture: ComponentFixture<DeletedContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedContactDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
