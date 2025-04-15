import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from 'app/shared/models';
@Injectable({
  providedIn: 'root',
})
export class TransactionTypeService {}
