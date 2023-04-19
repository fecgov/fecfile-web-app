import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ElectionInputComponent } from './election-input.component';

describe('ElectionInputComponent', () => {
  let component: ElectionInputComponent;
  let fixture: ComponentFixture<ElectionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectionInputComponent, ErrorMessagesComponent],
      imports: [DropdownModule, InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      electionYear: new FormControl(''),
      electionType: new FormControl(''),
      election_other_description: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
