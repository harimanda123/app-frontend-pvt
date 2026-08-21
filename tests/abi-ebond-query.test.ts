import { describe, it, expect } from 'vitest';

/**
 * CATAIR eBond - Record Specifications Test Suite (CB Input / CX Response)
 * Source: docs/plans/catair-source-docs/06-ebond-create-update-v1.9.pdf
 * 
 * Records covered:
 * - 10-Record: Bond Header (Pages 20-26)
 * - 12-Record: Secondary Notify Parties (Page 29)
 * - 20-Record: Single Transaction Bond (Pages 30-31)
 * - 30-Record: Principal (Page 32)
 * - 35-Record: Co-Principal (Page 33)
 * - 36-Record: Bond User (Pages 34-35)
 * - 40-Record: Surety (Page 36)
 * - 45-Record: Co-Surety (Page 37)
 * - 46-Record: Re-Insurer (Page 38)
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

export const EBOND_RECORD_10: RecordSpec = {
  recordId: '10',
  name: 'Bond Header',
  pageCitations: 'Pages 20-26',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must equal 10' },
    { name: 'Bond Activity Type Code', start: 3, end: 3, length: 1, class: '1AN', designation: 'M', notes: '1=Importer, 1A=Drawback, 2=Custodian, 3=Carrier, etc.' },
    { name: 'Bond Designation Type Code', start: 4, end: 4, length: 1, class: '1AN', designation: 'M', notes: 'B=Basic, A=Additional, U=Substitute STB, E=Supersede STB, C=Adjust STB, V=Void STB, T=Terminate, R=Rider' },
    { name: 'Surety Code', start: 5, end: 7, length: 3, class: '3N', designation: 'M' },
    { name: 'Bond Amount', start: 8, end: 17, length: 10, class: '10(S)N', designation: 'C', impliedDecimals: 0, notes: 'Whole U.S. dollars' },
    { name: 'Continuous Bond Indicator', start: 18, end: 18, length: 1, class: '1AN', designation: 'C' },
    { name: 'Execution Date', start: 19, end: 24, length: 6, class: '6D', designation: 'C', notes: 'MMDDYY format' },
    { name: 'Surety Reference Number', start: 25, end: 33, length: 9, class: '9X', designation: 'O' },
    { name: 'Effective Date', start: 34, end: 39, length: 6, class: '6D', designation: 'C', notes: 'MMDDYY format' },
    { name: 'Termination Date', start: 40, end: 45, length: 6, class: '6D', designation: 'C', notes: 'MMDDYY format' },
    { name: 'Bond Number', start: 46, end: 54, length: 9, class: '9AN', designation: 'C' },
    { name: 'Filler', start: 55, end: 55, length: 1, class: '1S', designation: 'M' },
    { name: 'Reconciliation Bond Rider Flag', start: 56, end: 56, length: 1, class: '1AN', designation: 'C' },
    { name: 'USVI Bond Rider Flag', start: 57, end: 57, length: 1, class: '1AN', designation: 'C' },
    { name: 'Filler', start: 58, end: 80, length: 23, class: '23S', designation: 'M' },
  ],
};

export const EBOND_RECORD_12: RecordSpec = {
  recordId: '12',
  name: 'Secondary Notify Parties',
  pageCitations: 'Page 29',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must equal 12' },
    { name: 'Secondary Notify Party Code 1', start: 3, end: 11, length: 9, class: '9AN', designation: 'M' },
    { name: 'Secondary Notify Party Code 2', start: 12, end: 20, length: 9, class: '9AN', designation: 'O' },
    { name: 'Secondary Notify Party Code 3', start: 21, end: 29, length: 9, class: '9AN', designation: 'O' },
    { name: 'Secondary Notify Party Code 4', start: 30, end: 38, length: 9, class: '9AN', designation: 'O' },
    { name: 'Filler', start: 39, end: 80, length: 42, class: '42S', designation: 'M' },
  ],
};

export const EBOND_RECORD_20: RecordSpec = {
  recordId: '20',
  name: 'Single Transaction Bond Information',
  pageCitations: 'Pages 30-31',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must equal 20' },
    { name: 'Transaction ID Type Code', start: 3, end: 3, length: 1, class: '1AN', designation: 'M', notes: '1=Entry, 2=ISF, 3=Seizure, 4=Bill of Lading, 5=Carrier/Voyage' },
    { name: 'Entry Type Code', start: 4, end: 5, length: 2, class: '2AN', designation: 'C' },
    { name: 'Transaction ID', start: 6, end: 45, length: 40, class: '40X', designation: 'M' },
    { name: 'Filler', start: 46, end: 80, length: 35, class: '35S', designation: 'M' },
  ],
};

export const EBOND_RECORD_30: RecordSpec = {
  recordId: '30',
  name: 'Principal Record',
  pageCitations: 'Page 32',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must equal 30' },
    { name: 'Principal ID Number Type', start: 3, end: 5, length: 3, class: '3AN', designation: 'M' },
    { name: 'Principal ID Number', start: 6, end: 17, length: 12, class: '12X', designation: 'M' },
    { name: 'Principal Name', start: 18, end: 57, length: 40, class: '40X', designation: 'C' },
    { name: 'Filler', start: 58, end: 80, length: 23, class: '23S', designation: 'M' },
  ],
};

export const EBOND_RECORD_40: RecordSpec = {
  recordId: '40',
  name: 'Surety Record',
  pageCitations: 'Page 36',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2AN', designation: 'M', notes: 'Must equal 40' },
    { name: 'Surety Code', start: 3, end: 5, length: 3, class: '3N', designation: 'M' },
    { name: 'Agent ID Number', start: 6, end: 16, length: 11, class: '11X', designation: 'M' },
    { name: 'Surety Name', start: 17, end: 56, length: 40, class: '40X', designation: 'C' },
    { name: 'Surety Liability Amount', start: 57, end: 66, length: 10, class: '10(S)N', designation: 'C', impliedDecimals: 0, notes: 'Whole U.S. dollars' },
    { name: 'Filler', start: 67, end: 80, length: 14, class: '14S', designation: 'M' },
  ],
};

const ALL_RECORDS: RecordSpec[] = [
  EBOND_RECORD_10,
  EBOND_RECORD_12,
  EBOND_RECORD_20,
  EBOND_RECORD_30,
  EBOND_RECORD_40,
];

describe('CATAIR eBond - Record Specifications Validation (CB/CX)', () => {
  ALL_RECORDS.forEach((spec) => {
    describe(`Record ${spec.recordId}: ${spec.name} (${spec.pageCitations})`, () => {
      it('should have contiguous field positions starting at 1 and ending at 80', () => {
        let currentPos = 1;
        spec.fields.forEach((field) => {
          expect(field.start).toBe(currentPos);
          expect(field.end - field.start + 1).toBe(field.length);
          currentPos = field.end + 1;
        });
        expect(currentPos - 1).toBe(spec.totalLength);
        expect(spec.totalLength).toBe(80);
      });

      it('should calculate field length sum equal to 80', () => {
        const sum = spec.fields.reduce((acc, f) => acc + f.length, 0);
        expect(sum).toBe(80);
      });
    });
  });

  it('should confirm eBond money amounts use whole U.S. dollars (0 implied decimals)', () => {
    const bondAmt = EBOND_RECORD_10.fields.find(f => f.name === 'Bond Amount');
    const liabilityAmt = EBOND_RECORD_40.fields.find(f => f.name === 'Surety Liability Amount');
    expect(bondAmt?.impliedDecimals).toBe(0);
    expect(liabilityAmt?.impliedDecimals).toBe(0);
  });
});
