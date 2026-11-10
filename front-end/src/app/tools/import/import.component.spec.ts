import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ContactImportJob, ImportService } from 'app/shared/services/import.service';
import { ImportComponent } from './import.component';

const job = (state: string): ContactImportJob => ({
  id: 7,
  import_status: state,
  total_rows: 4,
  totals: { new: 4 },
  errors: [],
  preview: [],
});

describe('ImportComponent contacts workflow', () => {
  let fixture: ComponentFixture<ImportComponent>;
  let updates: Subject<ContactImportJob>;
  let service: { upload: ReturnType<typeof vi.fn>; confirm: ReturnType<typeof vi.fn>; watch: ReturnType<typeof vi.fn> };
  const file = new File(['type,name\nORG,Example'], 'contacts.csv', { type: 'text/csv' });

  beforeEach(async () => {
    updates = new Subject<ContactImportJob>();
    service = {
      upload: vi.fn().mockResolvedValue(job('CREATED')),
      confirm: vi.fn().mockResolvedValue(job('CONFIRMED')),
      watch: vi.fn().mockReturnValue(updates),
    };
    await TestBed.configureTestingModule({
      imports: [ImportComponent],
      providers: [{ provide: ImportService, useValue: service }],
    }).compileComponents();
    fixture = TestBed.createComponent(ImportComponent);
    fixture.detectChanges();
  });

  it('validates, waits for confirmation, and displays completion', async () => {
    await fixture.componentInstance.upload({ files: [file] });
    expect(service.upload).toHaveBeenCalledWith(file);
    expect(service.confirm).not.toHaveBeenCalled();
    updates.next(job('PARSED'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('4 contacts passed validation');
    expect(fixture.nativeElement.textContent).toContain('Confirm import');
    await fixture.componentInstance.confirm();
    expect(service.confirm).toHaveBeenCalledWith(7);
    updates.next(job('IMPORTED'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Imported 4 contacts');
  });

  it('blocks confirmation on invalid rows and displays field errors', async () => {
    await fixture.componentInstance.upload({ files: [file] });
    updates.next({ ...job('INPUT_ERROR'), errors: [{ row: 3, fields: { candidate_id: ['Invalid candidate ID'] } }] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No contacts were saved');
    expect(fixture.nativeElement.textContent).toContain('CSV row 3');
    expect(fixture.nativeElement.textContent).toContain('Invalid candidate ID');
    await fixture.componentInstance.confirm();
    expect(service.confirm).not.toHaveBeenCalled();
  });

  it('requires status recovery after a lost confirmation response', async () => {
    await fixture.componentInstance.upload({ files: [file] });
    updates.next(job('PARSED'));
    service.confirm.mockRejectedValue('network error');
    await fixture.componentInstance.confirm();
    expect(fixture.componentInstance.canConfirm()).toBe(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Retry status check');
  });

  it('rejects invalid files and ignores repeated uploads while busy', async () => {
    await fixture.componentInstance.upload({ files: [new File([], 'empty.csv')] });
    expect(service.upload).not.toHaveBeenCalled();
    const pending = fixture.componentInstance.upload({ files: [file] });
    await fixture.componentInstance.upload({ files: [file] });
    await pending;
    expect(service.upload).toHaveBeenCalledTimes(1);
  });
});
