import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';
import { CashOnHand } from 'app/shared/models/cash-on-hand.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { CashOnHandService } from 'app/shared/services/cash-on-hand-service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs';
import { InputNumberComponent } from '../../shared/components/inputs/input-number/input-number.component';
import { ButtonDirective } from 'primeng/button';
import { SelectComponent } from 'app/shared/components/select/select.component';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { printFormErrors } from 'app/shared/utils/form.utils';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [ReactiveFormsModule, SelectComponent, InputNumberComponent, ButtonDirective],
})
export class AdminComponent extends DestroyerComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    return;
  }
}
