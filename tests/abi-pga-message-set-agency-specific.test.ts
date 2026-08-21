import { describe, it, expect } from 'vitest';

/**
 * CATAIR PGA Message Set - Agency-Specific Variant Records Test Suite
 * Source: docs/plans/catair-source-docs/08-pga-message-set-2026-07.pdf
 */

interface FieldSpec {
  name: string;
  start: number;
  end: number;
  length: number;
  class: string;
  status: 'M' | 'C' | 'O';
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

export const PGA_RECORD_PG05: RecordSpec = {
  recordId: 'PG05',
  name: 'FWS Genus/Species/Sub-Species Detail',
  pageCitations: 'Page 25',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Scientific Genus Name', start: 5, end: 26, length: 22, class: '22X', status: 'C' },
    { name: 'Scientific Species Name', start: 27, end: 48, length: 22, class: '22X', status: 'C' },
    { name: 'Scientific Sub Species Name', start: 49, end: 66, length: 18, class: '18X', status: 'C' },
    { name: 'Scientific Species Code', start: 67, end: 73, length: 7, class: '7AN', status: 'C' },
    { name: 'FWS Description Code', start: 74, end: 80, length: 7, class: '7AN', status: 'C' },
  ],
};

export const PGA_RECORD_PG17: RecordSpec = {
  recordId: 'PG17',
  name: 'FWS Common Name & Venomous/Cartons Detail',
  pageCitations: 'Page 33',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Common Name (Specific)', start: 5, end: 34, length: 30, class: '30X', status: 'C' },
    { name: 'Common Name (General)', start: 35, end: 64, length: 30, class: '30X', status: 'C' },
    { name: 'Live Venomous Wildlife Code', start: 65, end: 65, length: 1, class: '1A', status: 'C' },
    { name: 'Cartons Containing Wildlife', start: 66, end: 70, length: 5, class: '5N', status: 'C' },
    { name: 'Filler', start: 71, end: 80, length: 10, class: '10X', status: 'M' },
  ],
};

export const PGA_RECORD_PG23: RecordSpec = {
  recordId: 'PG23',
  name: 'FDA Affirmation of Compliance',
  pageCitations: 'Page 39',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Affirmation of Compliance Code', start: 5, end: 9, length: 5, class: '5X', status: 'M' },
    { name: 'Affirmation of Compliance Description', start: 10, end: 79, length: 70, class: '70X', status: 'C' },
    { name: 'Filler', start: 80, end: 80, length: 1, class: '1X', status: 'M' },
  ],
};

export const PGA_RECORD_PG28: RecordSpec = {
  recordId: 'PG28',
  name: 'FDA Can Dimensions & Tracking Number',
  pageCitations: 'Page 44',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Can Dimensions #1', start: 5, end: 8, length: 4, class: '4N', status: 'C' },
    { name: 'Can Dimensions #2', start: 9, end: 12, length: 4, class: '4N', status: 'C' },
    { name: 'Can Dimension #3', start: 13, end: 16, length: 4, class: '4N', status: 'C' },
    { name: 'Package Tracking Number Code', start: 17, end: 20, length: 4, class: '4AN', status: 'C' },
    { name: 'Package Tracking Number', start: 21, end: 70, length: 50, class: '50AN', status: 'C' },
    { name: 'Filler', start: 71, end: 80, length: 10, class: '10X', status: 'M' },
  ],
};

export const PGA_RECORD_PG31: RecordSpec = {
  recordId: 'PG31',
  name: 'NOAA/NMFS Harvesting Vessel Characteristic',
  pageCitations: 'Page 50',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Commodity Harvesting Vessel Characteristic Type Code', start: 5, end: 7, length: 3, class: '3AN', status: 'M' },
    { name: 'Commodity Harvesting Vessel Characteristic', start: 8, end: 42, length: 35, class: '35X', status: 'M' },
    { name: 'Unit of Measure (conveyance)', start: 43, end: 45, length: 3, class: '3AN', status: 'C' },
    { name: 'Harvested Commodity Net Weight', start: 46, end: 55, length: 10, class: '10N', status: 'C', impliedDecimals: 2 },
    { name: 'Filler', start: 56, end: 80, length: 25, class: '25X', status: 'M' },
  ],
};

export const PGA_RECORD_PG33: RecordSpec = {
  recordId: 'PG33',
  name: 'NOAA/NMFS Commodity Geographic Area',
  pageCitations: 'Page 52',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'Commodity Geographic Area Code', start: 5, end: 13, length: 9, class: '9X', status: 'C' },
    { name: 'Commodity Geographic Area Name', start: 14, end: 78, length: 65, class: '65X', status: 'C' },
    { name: 'Filler', start: 79, end: 80, length: 2, class: '2X', status: 'M' },
  ],
};

export const PGA_RECORD_PG35: RecordSpec = {
  recordId: 'PG35',
  name: 'DOT/NHTSA Conformance Bond Detail',
  pageCitations: 'Page 54',
  totalLength: 80,
  fields: [
    { name: 'Control Identifier', start: 1, end: 2, length: 2, class: '2A', status: 'M' },
    { name: 'Record Type', start: 3, end: 4, length: 2, class: '2N', status: 'M' },
    { name: 'DOT Surety Code', start: 5, end: 7, length: 3, class: '3AN', status: 'C' },
    { name: 'DOT Bond Serial Number', start: 8, end: 37, length: 30, class: '30X', status: 'C' },
    { name: 'DOT Bond Qualifier', start: 38, end: 38, length: 1, class: '1N', status: 'C', notes: '1=Single, 2=Continuous' },
    { name: 'DOT Bond Amount', start: 39, end: 46, length: 8, class: '8N', status: 'C', impliedDecimals: 0, notes: 'Whole U.S. dollars' },
    { name: 'Filler', start: 47, end: 80, length: 34, class: '34X', status: 'M' },
  ],
};

const ALL_RECORDS: RecordSpec[] = [
  PGA_RECORD_PG05,
  PGA_RECORD_PG17,
  PGA_RECORD_PG23,
  PGA_RECORD_PG28,
  PGA_RECORD_PG31,
  PGA_RECORD_PG33,
  PGA_RECORD_PG35,
];

describe('CATAIR PGA Message Set - Agency-Specific Variant Records Validation', () => {
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
});
