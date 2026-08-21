import { describe, it, expect } from 'vitest';

/**
 * CATAIR Statement Processing - Statement Update/Delete (SU), ACH Payment (RM), and Q7 Extended Test Suite
 * Sources:
 * - docs/plans/catair-source-docs/05-daily-statement.pdf
 * - docs/plans/catair-source-docs/05b-periodic-monthly-statement.pdf (Page 19-21)
 */

interface FieldSpec {
  name: string;
  start: number;
  end: number;
  length: number;
  class: string;
  designation: 'M' | 'C' | 'O';
  impliedDecimals?: number;
  notes?: string;
}

interface RecordSpec {
  recordId: string;
  name: string;
  pageCitations: string;
  totalLength: number;
  fields: FieldSpec[];
}

export const STATEMENT_RECORD_Q7: RecordSpec = {
  recordId: 'Q7',
  name: 'Entry Summaries Deleted',
  pageCitations: 'docs/plans/catair-source-docs/05b-periodic-monthly-statement.pdf Pages 19-21',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must always equal Q7' },
    { name: 'Periodic Daily Statement Number', start: 3, end: 12, length: 10, class: '10AN', designation: 'M' },
    { name: 'Entry Filer Code 1', start: 13, end: 15, length: 3, class: '3AN', designation: 'M' },
    { name: 'Filler 1', start: 16, end: 17, length: 2, class: '2S', designation: 'M' },
    { name: 'Entry Number 1', start: 18, end: 25, length: 8, class: '8AN', designation: 'M' },
    { name: 'Delete Source 1', start: 26, end: 28, length: 3, class: '3AN', designation: 'M', notes: 'ABI = Deleted via SU application by filer, CBP = Deleted by CBP' },
    { name: 'Entry Filer Code 2', start: 29, end: 31, length: 3, class: '3AN', designation: 'M' },
    { name: 'Filler 2', start: 32, end: 33, length: 2, class: '2S', designation: 'M' },
    { name: 'Entry Number 2', start: 34, end: 41, length: 8, class: '8AN', designation: 'M' },
    { name: 'Delete Source 2', start: 42, end: 44, length: 3, class: '3AN', designation: 'C' },
    { name: 'Entry Filer Code 3', start: 45, end: 47, length: 3, class: '3AN', designation: 'M' },
    { name: 'Filler 3', start: 48, end: 49, length: 2, class: '2S', designation: 'M' },
    { name: 'Entry Number 3', start: 50, end: 57, length: 8, class: '8AN', designation: 'M' },
    { name: 'Delete Source 3', start: 58, end: 60, length: 3, class: '3AN', designation: 'C' },
    { name: 'Entry Filer Code 4', start: 61, end: 63, length: 3, class: '3AN', designation: 'M' },
    { name: 'Filler 4', start: 64, end: 65, length: 2, class: '2S', designation: 'M' },
    { name: 'Entry Number 4', start: 66, end: 73, length: 8, class: '8AN', designation: 'M' },
    { name: 'Delete Source 4', start: 74, end: 76, length: 3, class: '3AN', designation: 'C' },
    { name: 'Filler', start: 77, end: 80, length: 4, class: '4S', designation: 'M' },
  ],
};

describe('CATAIR Statement Processing - Record Q7 & Application Controls Validation', () => {
  it('should verify Record Q7 has contiguous field positions from 1 to 80', () => {
    let currentPos = 1;
    STATEMENT_RECORD_Q7.fields.forEach((field) => {
      expect(field.start).toBe(currentPos);
      expect(field.end - field.start + 1).toBe(field.length);
      currentPos = field.end + 1;
    });
    expect(currentPos - 1).toBe(STATEMENT_RECORD_Q7.totalLength);
    expect(STATEMENT_RECORD_Q7.totalLength).toBe(80);
  });

  it('should calculate field length sum equal to 80', () => {
    const sum = STATEMENT_RECORD_Q7.fields.reduce((acc, f) => acc + f.length, 0);
    expect(sum).toBe(80);
  });

  it('should verify Delete Source codes ABI and CBP', () => {
    const deleteSourceField = STATEMENT_RECORD_Q7.fields.find(f => f.name === 'Delete Source 1');
    expect(deleteSourceField?.notes).toContain('ABI');
    expect(deleteSourceField?.notes).toContain('CBP');
  });
});
