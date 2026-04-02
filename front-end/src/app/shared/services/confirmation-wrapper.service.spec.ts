import type { MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ConfirmationWrapperService } from './confirmation-wrapper.service';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { Contact, ContactTypes } from '../models/contact.model';
import { TransactionTemplateMapType } from '../models/transaction-type.model';

describe('ConfirmationWrapperService', () => {
  let service: ConfirmationWrapperService;
  let confirmationService: MockedObject<ConfirmationService>;

  beforeEach(() => {
    const spy = {
      confirm: vi.fn().mockName('ConfirmationService.confirm'),
    };
    TestBed.configureTestingModule({
      providers: [ConfirmationWrapperService, { provide: ConfirmationService, useValue: spy }],
    });
    service = TestBed.inject(ConfirmationWrapperService);
    confirmationService = TestBed.inject(ConfirmationService) as MockedObject<ConfirmationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should confirm with user', async () => {
    const form = new FormGroup({});
    const contactConfig = { contact_1: { name: 'name' } };
    const getContact = () => new Contact();
    const getTemplateMap = (): TransactionTemplateMapType =>
      ({ organization_name: 'name' }) as TransactionTemplateMapType;

    confirmationService.confirm.mockImplementation((config: Confirmation) => config.accept?.());

    const result = await service.confirmWithUser(form, contactConfig, getContact, getTemplateMap);
    expect(result).toBe(true);
  });

  it('should generate confirmation message for individual', () => {
    const form = new FormGroup({
      last_name: new FormControl('Doe'),
      first_name: new FormControl('John'),
    });
    const templateMap: TransactionTemplateMapType = {
      last_name: 'last_name',
      first_name: 'first_name',
    } as TransactionTemplateMapType;
    const message = service.getCreateTransactionContactConfirmationMessage(
      ContactTypes.INDIVIDUAL,
      form,
      templateMap,
      'contact_1',
    );
    expect(message).toContain('John');
    expect(message).toContain('Doe');
  });
});
