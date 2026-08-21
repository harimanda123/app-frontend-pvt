/**
 * CATAIR In-Bond (Chapter 9) Field Specification Tests
 * Source Document: docs/plans/catair-source-docs/06b-in-bond-v51-2026-04.pdf
 * Amendment 51 – April 2026
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CATAIR IN-BOND CHAPTER SCOPE NOTE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Scope Overview & Architectural Pattern:
 * The In-Bond interface allows transmission and management of in-bond movements
 * between automated filers and CBP in ACE via Application Identifier 'QP' (Input,
 * in-bond add/delete) and 'WP' (Input, arrival/export/transfer) with output
 * responses returned under 'QT', 'WT', and 'NS' transaction identifiers.
 *
 * The full standard lifecycle for a non-automated carrier IT-61 in-bond is:
 *   1. Filer transmits QP Long (QP10 + QP20 + QP30 + QP40 + QP50–QP76) to initiate.
 *   2. CBP returns QT response (QP10 echoed + QT95 Accept/Reject per BOL grouping).
 *   3. At origin, cargo departs under bond.
 *   4. At destination, filer transmits WP (WP10 + WP20) to report arrival/export.
 *   5. CBP returns WT response (WP10 + WP20 echoed + WT95 Accept/Reject).
 *   6. CBP sends NS notification (NS10 + NS30 + optional NS40/NS50/NS60) to SNPs.
 *
 * NOTE ON RECORD LENGTHS:
 * All records in this chapter are 80 characters wide per CATAIR standard convention.
 *
 * NOTE ON DATE FIELD FORMATS (per PDF pp. INB-24, INB-57, INB-64, INB-65):
 * - QP20 "Estimated Date of Arrival" (pos 50-55): 6N, MMDDYY format.
 *   PDF p. INB-24 explicitly states "MMDDYY (month, day, year)".
 * - WP20 "Date" (pos 3-8): 6N, YYMMDD format.
 *   PDF p. INB-57 explicitly states "YYMMDD (year, month, day)".
 *   IMPORTANT: WP20 uses YYMMDD, NOT MMDDYY — same chapter, different formats.
 * - NS30 "Action Date" (pos 64-69): 6N, YYMMDD format.
 *   PDF p. INB-64/65 explicitly states "YYMMDD (year, month, day)".
 *
 * NOTE ON DECIMAL CONVENTIONS:
 * - QP10 "Value" (pos 31-38): 8N, whole dollars, no decimals (PDF p. INB-20 explicit).
 * - QP30 "In-Bond Quantity" (pos 69-78): 10N, no decimal convention stated in PDF.
 * - QP40 "Manifest Quantity": Amendment 51 removed "Input only whole numbers; no decimals"
 *   (Table of Changes, PDF p. INB-6). Decimal convention is now UNSPECIFIED in the PDF.
 *
 * NOTE ON FILLER GAPS vs TRAILING FILLERS:
 * - QP20: Internal filler at pos 39-45 (7 chars) between Voyage/Trip Num and Port of Arrival;
 *   trailing filler at pos 60-80 (21 chars).
 * - QP30: Internal filler at pos 4 (1 char) between Action Code and Sequence Number;
 *   trailing filler at pos 79-80 (2 chars).
 * - WP10: Internal filler at pos 52-63 (12 chars) between FIRMS Location and Container Number;
 *   trailing filler at pos 78-80 (3 chars).
 * - QT95/WT95: Internal filler at pos 8 (1 char); trailing filler at pos 48-80 (33 chars).
 * - NS10: Trailing filler at pos 26-80 (55 chars).
 * - NS30: Trailing filler at pos 78-80 (3 chars). The blocks at pos 21-52 (Issuer House Bill,
 *   House Bill Number, Issuer Sub-House Bill, Sub-house Bill Number) are NOT unlabeled filler --
 *   the PDF explicitly names and describes each one (reserved for future use / space fill).
 * - NS40: Trailing filler at pos 42-80 (39 chars).
 * - NS50: Trailing filler at pos 48-80 (33 chars).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SCOPED IN RECORDS (13 records — Core Standard In-Bond Round-Trip):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  INPUT – QP Transaction (In-Bond Initiation):
 *   1. QP10 - In-bond Header (Input, Mandatory):
 *      [Pos 1-80: 2(10)+1(action)+2(entryType)+12(inBondNum)+4(carrier)+4(usPort)+
 *       5(foreignPort)+8(value)+12(bondedCarrierID)+1(ftzInd)+1(btaInd)+28(filler) = 80]
 *   2. QP20 - Conveyance Information (Input, Conditional):
 *      [Pos 1-80: 2(20)+4(importCarrier)+2(mot)+2(country)+23(conveyance)+5(voyage)+
 *       7(filler)+4(portArrival)+6(estDateArrival)+4(ftzFIRMS)+21(filler) = 80]
 *   3. QP30 - Bill of Lading Header (Input, Conditional):
 *      [Pos 1-80: 2(30)+1(action)+1(filler)+4(seqNum)+4(issuerMasterBOL)+12(masterBOLNum)+
 *       4(issuerHouseBill)+12(houseBillNum)+4(issuerSubHouse)+12(subHouseNum)+
 *       12(prevInBondNum)+10(inBondQty)+2(filler) = 80]
 *   4. QP32 - Secondary Notify Parties (Input, Optional):
 *      [Pos 1-80: 2(32)+9(snp1)+9(snp2)+9(snp3)+9(snp4)+42(filler) = 80]
 *   5. QP33 - Reference Identifier (Input, Conditional):
 *      [Pos 1-80: 2(33)+3(qualifier)+30(refId)+45(filler) = 80]
 *
 *  INPUT – WP Transaction (Arrival/Export/Transfer):
 *   6. WP10 - In-bond Event Header (Input, Mandatory):
 *      [Pos 1-80: 2(10)+1(action)+12(inBondNum)+4(issuerMasterBOL)+12(masterBOLNum)+
 *       4(issuerHouseBOL)+12(houseBOLNum)+4(firmsLocation)+12(filler)+14(containerNum)+
 *       3(filler) = 80]
 *   7. WP20 - In-bond Event Detail (Input, Mandatory):
 *      [Pos 1-80: 2(20)+6(date)+6(time)+4(portArrival)+4(inBondCarrier)+
 *       12(bondedCarrierID)+19(cityName)+2(stateCode)+2(exportMOT)+23(exportConveyance) = 80]
 *
 *  OUTPUT – QT Response (In-Bond Transaction Response):
 *   8. QT95 - Error/Warning/Accept Message (Output, Mandatory):
 *      [Pos 1-80: 2(95)+2(msgTypeCode)+3(msgId)+1(filler)+39(narrative)+33(filler) = 80]
 *
 *  OUTPUT – WT Response (Arrival/Export/Transfer Response):
 *   9. WT95 - Error/Warning/Accept Message (Output, Mandatory):
 *      [Pos 1-80: 2(95)+2(msgTypeCode)+3(msgId)+1(filler)+39(narrative)+33(filler) = 80]
 *      (Identical structure to QT95; different transaction context only)
 *
 *  OUTPUT – NS Status Notification:
 *  10. NS10 - Status Notification Header In-bond Info (Output, Conditional):
 *      [Pos 1-80: 2(10)+2(entryType)+12(inBondNum)+4(usPort)+5(foreignDest)+55(filler) = 80]
 *  11. NS30 - Status Notification Detail (Output, Mandatory):
 *      [Pos 1-80: 2(30)+2(dispCode)+4(issuerMasterBill)+12(masterBillNum)+
 *       4(issuerHouseBill)+12(houseBillNum)+4(issuerSubHouse)+12(subHouseBillNum)+
 *       10(qty)+1(negativeInd)+6(actionDate)+4(actionTime)+4(inBondCarrierCode)+
 *       3(filler) = 80]
 *  12. NS40 - Status Notification Detail Continuation (Output, Conditional):
 *      [Pos 1-80: 2(40)+2(entryType)+15(entryNumber)+4(distPort)+4(firmsCode)+
 *       14(containerNum)+39(filler) = 80]
 *  13. NS50 - Status Notification Remarks (Output, Conditional):
 *      [Pos 1-80: 2(50)+45(remarks)+33(filler) = 80]
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EXPLICITLY DEFERRED RECORDS (not part of this pass):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  QP Long BOL detail records (required only for non-automated carrier/FTZ withdrawals):
 *   - QP40 (Bill of Lading Details) - conditional, QP Long only
 *   - QP50 (Foreign Shipper Name/Address) - conditional, QP Long only
 *   - QP51 (Foreign Shipper Address) - optional, QP Long only
 *   - QP52 (Foreign Shipper Telephone/Telex) - optional, QP Long only
 *   - QP55 (Consignee Name/Address) - conditional, QP Long only
 *   - QP56 (Consignee Address) - optional, QP Long only
 *   - QP57 (Consignee Telephone/Telex) - optional, QP Long only
 *   - QP60 (Notify Party Name/Address) - conditional, QP Long only
 *   - QP61 (Notify Party Address) - optional, QP Long only
 *   - QP62 (Notify Party Telephone/Telex) - optional, QP Long only
 *   - QP65 (Bill of Lading Container) - conditional, QP Long only
 *   - QP70 (Harmonized Nomenclature) - conditional, QP Long; mandatory for T&E/IE
 *   - QP71 (Bill Cargo Description) - conditional, QP Long only
 *   - QP72 (Marks and Numbers) - conditional, QP Long only
 *   - QP75 (Hazardous Material) - conditional, hazmat shipments only
 *   - QP76 (Hazardous Material Description) - conditional, hazmat only
 *  NS records for non-QP filers:
 *   - NS05 (Status Notification Header Conveyance Info) - returned to non-QP Customs
 *     Broker ABI filers; NS10 is the QP-specific equivalent (PDF p. INB-18)
 *  NS container detail:
 *   - NS60 (Container Status Notification) - conditional, container-level only
 *  Transmission-structure error records (structural, not record-level):
 *   - EA, EB, EY, EZ - batch/block control error echo records
 *  Rare movement types:
 *   - WP10 Action Code 'Z' (Diversion request) - rare, deferred
 *  Transfer-of-liability:
 *   - WP10 Action Code 'A' (Transfer of in-bond liability) - deferred; WP20
 *     City/State fields are only mandatory for Action Code 'A'
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PDF INCONSISTENCIES / AMBIGUITIES FOUND:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. MIXED DATE FORMATS WITHIN SAME CHAPTER: QP20 estDateOfArrival = MMDDYY (PDF p.
 *     INB-24) vs WP20 date = YYMMDD (PDF p. INB-57) vs NS30 actionDate = YYMMDD
 *     (PDF p. INB-64). Two different 6-char date formats in the same chapter.
 *     Do not assume one format. Tests explicitly guard both.
 *
 *  2. NS30 actionTime is 4-char HHMM (pos 70-73), NOT 6-char HHMMSS. WP20 time is
 *     6-char HHMMSS (pos 9-14). Different time field widths in the same chapter.
 *
 *  3. NS10 "Foreign Destination" (pos 21-25) is typed 5N (numeric only), while the
 *     QP10 equivalent "Port of Foreign Destination" (pos 26-30) is 5AN (alphanumeric).
 *     Position math consistent for both (5 chars). Type difference is real, not an error.
 *
 *  4. QT95 and WT95 have identical 80-column layouts. Both use record type "95",
 *     same field positions/lengths/classes. Contextually different (QP vs WP response)
 *     but structurally identical per PDF.
 *
 *  5. Amendment 51 removed QP40 no-decimals constraint without substituting new guidance.
 *     QP40 Manifest Quantity decimal convention is now UNSPECIFIED in the PDF.
 *
 *  6. NS30 positions 21-52 (32 chars) contain four named "reserved for future use / space
 *     fill" fields. These are NOT unlabeled filler gaps -- each has an explicit field
 *     name in the PDF table (Issuer Code of House Bill Number, House Bill Number,
 *     Issuer Code of Sub-house Bill Number, Sub-house Bill Number).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Inline record specifications (no src/ changes required)
// ---------------------------------------------------------------------------

interface InBondFieldSpec {
  name: string;
  start: number;
  end: number;
  length: number;
  type: string;
  designation: "M" | "C" | "O";
  description?: string;
}

interface InBondRecordSpec {
  recordId: string;
  recordName: string;
  source: string;
  direction: "Input" | "Output";
  transactionId: string;
  length: 80;
  fields: InBondFieldSpec[];
}

// ── QP10 In-bond Header (Input) ─────────────────────────────────────────────
// Source: PDF pp. INB-19 to INB-20
const QP10_IN_BOND_HEADER_SPEC: InBondRecordSpec = {
  recordId: "QP10",
  recordName: "In-bond Header",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-19 to INB-20",
  direction: "Input",
  transactionId: "QP",
  length: 80,
  fields: [
    { name: "recordType",        start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 10" },
    { name: "actionCode",        start:  3, end:  3, length:  1, type: "A",  designation: "M", description: "A=Add, B=Delete from Bill, D=Delete from all Bills" },
    { name: "inBondEntryType",   start:  4, end:  5, length:  2, type: "N",  designation: "C", description: "61=IT, 62=T&E, 63=IE" },
    { name: "inBondNumber",      start:  6, end: 17, length: 12, type: "AN", designation: "M", description: "Conventional 9-position in-bond number, left justified" },
    { name: "inBondCarrierCode", start: 18, end: 21, length:  4, type: "AN", designation: "C", description: "4-digit SCAC, ICAO 3-letter, or IATA 2-char airline code" },
    { name: "usPortOfDest",      start: 22, end: 25, length:  4, type: "N",  designation: "C", description: "Schedule D code: IT=termination, T&E=exportation, IE=arrival" },
    { name: "portOfForeignDest", start: 26, end: 30, length:  5, type: "AN", designation: "C", description: "Schedule K code for T&E/IE; space or zero fill for IT" },
    { name: "value",             start: 31, end: 38, length:  8, type: "N",  designation: "M", description: "Whole dollars, >0, no decimals (PDF p. INB-20 explicit)" },
    { name: "bondedCarrierID",   start: 39, end: 50, length: 12, type: "X",  designation: "C", description: "IRS number or CBP-assigned bonded carrier ID" },
    { name: "ftzWarehouseInd",   start: 51, end: 51, length:  1, type: "A",  designation: "C", description: "Y=FTZ or bonded warehouse withdrawal; otherwise blank" },
    { name: "btaFdaIndicator",   start: 52, end: 52, length:  1, type: "A",  designation: "C", description: "Y/N BTA/FDA indicator; required for T&E 62" },
    { name: "filler",            start: 53, end: 80, length: 28, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── QP20 Conveyance Information (Input) ─────────────────────────────────────
// Source: PDF pp. INB-23 to INB-25
// Date: MMDDYY (PDF p. INB-24: "A date in MMDDYY (month, day, year) format")
const QP20_CONVEYANCE_INFO_SPEC: InBondRecordSpec = {
  recordId: "QP20",
  recordName: "Conveyance Information",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-23 to INB-25",
  direction: "Input",
  transactionId: "QP",
  length: 80,
  fields: [
    { name: "recordType",           start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 20" },
    { name: "importingCarrierCode", start:  3, end:  6, length:  4, type: "AN", designation: "M", description: "SCAC, ICAO, or IATA identifier" },
    { name: "importMOT",            start:  7, end:  8, length:  2, type: "N",  designation: "M", description: "30=Truck, 40=Air, 70=Pipeline" },
    { name: "countryCode",          start:  9, end: 10, length:  2, type: "A",  designation: "C", description: "ISO country code of importing carrier flag" },
    { name: "importingConveyance",  start: 11, end: 33, length: 23, type: "X",  designation: "C", description: "Conveyance name; not required for Air or FTZ" },
    { name: "voyageFlightTripNum",  start: 34, end: 38, length:  5, type: "X",  designation: "C", description: "Voyage/flight/trip number; format NNN, NNNA, NNNN, NNNNA" },
    { name: "filler1",              start: 39, end: 45, length:  7, type: "AN", designation: "M", description: "Space fill (internal gap before Port field)" },
    { name: "portOfImportArrival",  start: 46, end: 49, length:  4, type: "N",  designation: "M", description: "Census Schedule D code (DDPP) of port of unlading" },
    { name: "estDateOfArrival",     start: 50, end: 55, length:  6, type: "N",  designation: "C", description: "MMDDYY format per PDF p. INB-24 (month, day, year); not required for FTZ" },
    { name: "ftzFirmsCode",         start: 56, end: 59, length:  4, type: "AN", designation: "C", description: "FIRMS code of FTZ/warehouse when FTZ flag is set in QP10" },
    { name: "filler2",              start: 60, end: 80, length: 21, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── QP30 Bill of Lading Header (Input) ──────────────────────────────────────
// Source: PDF pp. INB-26 to INB-28
const QP30_BOL_HEADER_SPEC: InBondRecordSpec = {
  recordId: "QP30",
  recordName: "Bill of Lading Header",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-26 to INB-28",
  direction: "Input",
  transactionId: "QP",
  length: 80,
  fields: [
    { name: "recordType",           start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 30" },
    { name: "actionCode",           start:  3, end:  3, length:  1, type: "A",  designation: "M", description: "A=Add bill data, D=Delete in-bond from bill" },
    { name: "filler1",              start:  4, end:  4, length:  1, type: "A",  designation: "M", description: "Space fill (1-char internal gap per PDF p. INB-26)" },
    { name: "sequenceNumber",       start:  5, end:  8, length:  4, type: "AN", designation: "O", description: "Position of QP30 record; returned in output for error association" },
    { name: "issuerCodeMasterBOL",  start:  9, end: 12, length:  4, type: "AN", designation: "M", description: "4-digit SCAC or Air Waybill Prefix; FIRMS code for FTZ" },
    { name: "masterBOLNumber",      start: 13, end: 24, length: 12, type: "AN", designation: "M", description: "Simple/regular/master bill number, left justified" },
    { name: "issuerCodeHouseBill",  start: 25, end: 28, length:  4, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "houseBillNumber",      start: 29, end: 40, length: 12, type: "AN", designation: "C", description: "House bill as on manifest; left justify; Air only" },
    { name: "issuerCodeSubHouse",   start: 41, end: 44, length:  4, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "subHouseBillNumber",   start: 45, end: 56, length: 12, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "prevInBondNumber",     start: 57, end: 68, length: 12, type: "AN", designation: "C", description: "Previous in-bond number for subsequent moves; blank for FTZ" },
    { name: "inBondQuantity",       start: 69, end: 78, length: 10, type: "N",  designation: "C", description: "Partial BOL quantity; space fill for Air; full BOL if omitted" },
    { name: "filler2",              start: 79, end: 80, length:  2, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── QP32 Secondary Notify Parties (Input) ───────────────────────────────────
// Source: PDF p. INB-29
const QP32_SECONDARY_NOTIFY_SPEC: InBondRecordSpec = {
  recordId: "QP32",
  recordName: "Secondary Notify Parties",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-29",
  direction: "Input",
  transactionId: "QP",
  length: 80,
  fields: [
    { name: "recordType", start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 32" },
    { name: "snpCode1",   start:  3, end: 11, length:  9, type: "AN", designation: "M", description: "First SNP code; SCAC or 9-char ABI routing code NNNNXXXNN" },
    { name: "snpCode2",   start: 12, end: 20, length:  9, type: "AN", designation: "O", description: "Second SNP code" },
    { name: "snpCode3",   start: 21, end: 29, length:  9, type: "AN", designation: "O", description: "Third SNP code" },
    { name: "snpCode4",   start: 30, end: 38, length:  9, type: "AN", designation: "O", description: "Fourth SNP code" },
    { name: "filler",     start: 39, end: 80, length: 42, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── QP33 Reference Identifier (Input) ───────────────────────────────────────
// Source: PDF pp. INB-30 to INB-31
const QP33_REFERENCE_ID_SPEC: InBondRecordSpec = {
  recordId: "QP33",
  recordName: "Reference Identifier",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-30 to INB-31",
  direction: "Input",
  transactionId: "QP",
  length: 80,
  fields: [
    { name: "recordType",          start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 33" },
    { name: "qualifier",           start:  3, end:  5, length:  3, type: "AN", designation: "M", description: "Up to 3-char qualifier; e.g. BM=BOL, FEN=Pedimento" },
    { name: "referenceIdentifier", start:  6, end: 35, length: 30, type: "AN", designation: "M", description: "Reference ID for the qualifier; Pedimento: 15-char yyppbbbbddddddd" },
    { name: "filler",              start: 36, end: 80, length: 45, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── WP10 In-bond Event Header (Input) ───────────────────────────────────────
// Source: PDF pp. INB-54 to INB-56
const WP10_EVENT_HEADER_SPEC: InBondRecordSpec = {
  recordId: "WP10",
  recordName: "In-bond Event Header",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-54 to INB-56",
  direction: "Input",
  transactionId: "WP",
  length: 80,
  fields: [
    { name: "recordType",           start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 10" },
    { name: "actionCode",           start:  3, end:  3, length:  1, type: "AN", designation: "M", description: "1=Arrive entire, 2=Arrive BOL, 3=Arrive container, 5=Export entire, 6=Export BOL, 7=Export container, A=Transfer, Z=Diversion" },
    { name: "inBondNumber",         start:  4, end: 15, length: 12, type: "AN", designation: "C", description: "9-digit or V-paperless in-bond number; mandatory for 1,3,5,7,A,Z" },
    { name: "issuerCodeMasterBOL",  start: 16, end: 19, length:  4, type: "AN", designation: "C", description: "SCAC of BOL issuer or Air Waybill Prefix; mandatory for 2,3,6,7" },
    { name: "masterBOLNumber",      start: 20, end: 31, length: 12, type: "AN", designation: "C", description: "Master bill number; mandatory for 2,3,6,7; 8-digit AWB serial for Air" },
    { name: "issuerCodeHouseBOL",   start: 32, end: 35, length:  4, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "houseBOLNumber",       start: 36, end: 47, length: 12, type: "AN", designation: "C", description: "House bill as on manifest; left justify; Air only" },
    { name: "firmsLocation",        start: 48, end: 51, length:  4, type: "AN", designation: "C", description: "FIRMS code at destination port; mandatory for Action Codes 1,2,3; not required for Air" },
    { name: "filler1",              start: 52, end: 63, length: 12, type: "AN", designation: "M", description: "Space fill (internal gap between FIRMS and Container Number)" },
    { name: "containerNumber",      start: 64, end: 77, length: 14, type: "AN", designation: "C", description: "Container number as on container; mandatory for Action Codes 3 and 7; not for Air" },
    { name: "filler2",              start: 78, end: 80, length:  3, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── WP20 In-bond Event Detail (Input) ───────────────────────────────────────
// Source: PDF pp. INB-57 to INB-58
// Date: YYMMDD (PDF p. INB-57: "A date in YYMMDD (year, month, day) format")
// Time: HHMMSS 24-hour clock (PDF p. INB-57)
const WP20_EVENT_DETAIL_SPEC: InBondRecordSpec = {
  recordId: "WP20",
  recordName: "In-bond Event Detail",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-57 to INB-58",
  direction: "Input",
  transactionId: "WP",
  length: 80,
  fields: [
    { name: "recordType",        start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 20" },
    { name: "date",              start:  3, end:  8, length:  6, type: "N",  designation: "M", description: "YYMMDD format of actual arrival/export/transfer date" },
    { name: "time",              start:  9, end: 14, length:  6, type: "N",  designation: "M", description: "HHMMSS 24-hour clock of actual arrival/export/transfer time" },
    { name: "portOfArrival",     start: 15, end: 18, length:  4, type: "N",  designation: "C", description: "Schedule D port code; mandatory for Action Codes 1,2,3,Z" },
    { name: "inBondCarrierCode", start: 19, end: 22, length:  4, type: "X",  designation: "C", description: "SCAC of carrier assuming liability; mandatory for Action Code A" },
    { name: "bondedCarrierID",   start: 23, end: 34, length: 12, type: "X",  designation: "C", description: "IRS/SSN/CBP bonded carrier ID; mandatory for Action Codes A or Z" },
    { name: "cityName",          start: 35, end: 53, length: 19, type: "AN", designation: "C", description: "City where liability transfer occurs; mandatory for Action Code A" },
    { name: "stateCode",         start: 54, end: 55, length:  2, type: "A",  designation: "C", description: "State code corresponding to city name when city is provided" },
    { name: "exportMOT",         start: 56, end: 57, length:  2, type: "N",  designation: "O", description: "MOT of exporting conveyance; only codes 10/11=Vessel; optional for 5,6,7" },
    { name: "exportConveyance",  start: 58, end: 80, length: 23, type: "AN", designation: "O", description: "Name of exporting conveyance; optional for Action Codes 5,6,7" },
  ],
};

// ── QT95 Error/Warning/Accept Message (Output) ──────────────────────────────
// Source: PDF p. INB-53
const QT95_RESPONSE_SPEC: InBondRecordSpec = {
  recordId: "QT95",
  recordName: "In-bond Transaction Response Message",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-53",
  direction: "Output",
  transactionId: "QT",
  length: 80,
  fields: [
    { name: "recordType",       start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 95" },
    { name: "narrativeMsgType", start:  3, end:  4, length:  2, type: "N",  designation: "M", description: "01=Data Rejection, 02=Data Acceptance, 03=Acceptance with Warning" },
    { name: "narrativeMsgId",   start:  5, end:  7, length:  3, type: "AN", designation: "M", description: "Code identifying the narrative message" },
    { name: "filler1",          start:  8, end:  8, length:  1, type: "AN", designation: "M", description: "Space fill (1-char internal gap before narrative)" },
    { name: "narrativeMessage", start:  9, end: 47, length: 39, type: "X",  designation: "M", description: "Acceptance or rejection narrative" },
    { name: "filler2",          start: 48, end: 80, length: 33, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── WT95 Error/Warning/Accept Message (Output) ──────────────────────────────
// Source: PDF p. INB-59
// Identical structure to QT95; different context (WP arrival/export response)
const WT95_RESPONSE_SPEC: InBondRecordSpec = {
  recordId: "WT95",
  recordName: "Arrival/Export/Transfer Response Message",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-59",
  direction: "Output",
  transactionId: "WT",
  length: 80,
  fields: [
    { name: "recordType",       start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 95" },
    { name: "narrativeMsgType", start:  3, end:  4, length:  2, type: "N",  designation: "M", description: "01=Data Rejection, 02=Data Acceptance, 03=Acceptance with Warning" },
    { name: "narrativeMsgId",   start:  5, end:  7, length:  3, type: "AN", designation: "M", description: "Code identifying the narrative message" },
    { name: "filler1",          start:  8, end:  8, length:  1, type: "AN", designation: "M", description: "Space fill (1-char internal gap before narrative)" },
    { name: "narrativeMessage", start:  9, end: 47, length: 39, type: "X",  designation: "M", description: "Acceptance or rejection narrative" },
    { name: "filler2",          start: 48, end: 80, length: 33, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── NS10 Status Notification Header In-bond Info (Output) ───────────────────
// Source: PDF p. INB-61
const NS10_STATUS_HEADER_SPEC: InBondRecordSpec = {
  recordId: "NS10",
  recordName: "Status Notification Header In-bond Information",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-61",
  direction: "Output",
  transactionId: "NS",
  length: 80,
  fields: [
    { name: "recordType",         start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 10" },
    { name: "inBondEntryType",    start:  3, end:  4, length:  2, type: "N",  designation: "M", description: "61=IT, 62=T&E, 63=IE" },
    { name: "inBondNumber",       start:  5, end: 16, length: 12, type: "AN", designation: "M", description: "Conventional 9-numeric in-bond number, left justified" },
    { name: "usPortOfDest",       start: 17, end: 20, length:  4, type: "N",  designation: "M", description: "Schedule D port code" },
    { name: "foreignDestination", start: 21, end: 25, length:  5, type: "N",  designation: "C", description: "Schedule K foreign port code (5N, all-numeric); space fill for IT 61 entries" },
    { name: "filler",             start: 26, end: 80, length: 55, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── NS30 Status Notification Detail (Output) ─────────────────────────────────
// Source: PDF pp. INB-64 to INB-65
// Date: YYMMDD (PDF p. INB-64: "A date in YYMMDD (year, month, day) format")
// Time: HHMM 24-hour clock (NOT HHMMSS — only 4 chars at pos 70-73)
const NS30_STATUS_DETAIL_SPEC: InBondRecordSpec = {
  recordId: "NS30",
  recordName: "Status Notification Detail",
  source: "CATAIR In-Bond Amendment 51 April 2026 pp. INB-64 to INB-65",
  direction: "Output",
  transactionId: "NS",
  length: 80,
  fields: [
    { name: "recordType",         start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 30" },
    { name: "dispositionCode",    start:  3, end:  4, length:  2, type: "AN", designation: "M", description: "Posting action code; see ACE Ocean Appendix D or Air Appendix A" },
    { name: "issuerMasterBill",   start:  5, end:  8, length:  4, type: "AN", designation: "M", description: "SCAC of BOL issuer; FIRMS code if FTZ/warehouse" },
    { name: "masterBillNumber",   start:  9, end: 20, length: 12, type: "AN", designation: "M", description: "Simple/regular/master bill number, left justified" },
    { name: "issuerHouseBill",    start: 21, end: 24, length:  4, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "houseBillNumber",    start: 25, end: 36, length: 12, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "issuerSubHouse",     start: 37, end: 40, length:  4, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "subHouseBillNumber", start: 41, end: 52, length: 12, type: "AN", designation: "C", description: "Reserved for future use; space fill" },
    { name: "quantity",           start: 53, end: 62, length: 10, type: "N",  designation: "M", description: "Total number of pieces affected by disposition action" },
    { name: "negativeIndicator",  start: 63, end: 63, length:  1, type: "A",  designation: "C", description: "N when negative number with disposition code 1A/1B/1C; else space" },
    { name: "actionDate",         start: 64, end: 69, length:  6, type: "N",  designation: "M", description: "YYMMDD format of CBP authorization date" },
    { name: "actionTime",         start: 70, end: 73, length:  4, type: "N",  designation: "M", description: "HHMM 24-hour clock (NOT HHMMSS — 4 chars only); Eastern time" },
    { name: "inBondCarrierCode",  start: 74, end: 77, length:  4, type: "X",  designation: "M", description: "SCAC of in-bond carrier; FIRMS code if FTZ/warehouse" },
    { name: "filler",             start: 78, end: 80, length:  3, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── NS40 Status Notification Detail Continuation (Output) ───────────────────
// Source: PDF p. INB-66
const NS40_STATUS_CONTINUATION_SPEC: InBondRecordSpec = {
  recordId: "NS40",
  recordName: "Status Notification Detail Continuation",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-66",
  direction: "Output",
  transactionId: "NS",
  length: 80,
  fields: [
    { name: "recordType",   start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 40" },
    { name: "entryType",    start:  3, end:  4, length:  2, type: "N",  designation: "C", description: "Entry category code per ACE Ocean Appendix B" },
    { name: "entryNumber",  start:  5, end: 19, length: 15, type: "AN", designation: "C", description: "USCBP entry number, form number, or regulatory provision" },
    { name: "distPortTxn",  start: 20, end: 23, length:  4, type: "N",  designation: "M", description: "Schedule D port code where action occurred" },
    { name: "firmsCode",    start: 24, end: 27, length:  4, type: "AN", designation: "C", description: "FIRMS code representing location of goods" },
    { name: "containerNum", start: 28, end: 41, length: 14, type: "AN", designation: "C", description: "Container number as on container; container-level notifications only" },
    { name: "filler",       start: 42, end: 80, length: 39, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ── NS50 Status Notification Remarks (Output) ────────────────────────────────
// Source: PDF p. INB-67
const NS50_STATUS_REMARKS_SPEC: InBondRecordSpec = {
  recordId: "NS50",
  recordName: "Status Notification Remarks",
  source: "CATAIR In-Bond Amendment 51 April 2026 p. INB-67",
  direction: "Output",
  transactionId: "NS",
  length: 80,
  fields: [
    { name: "recordType", start:  1, end:  2, length:  2, type: "N",  designation: "M", description: "Must always equal 50" },
    { name: "remarks",    start:  3, end: 47, length: 45, type: "X",  designation: "M", description: "Free-form USCBP remarks on BOL posting or conveyance status" },
    { name: "filler",     start: 48, end: 80, length: 33, type: "AN", designation: "M", description: "Space fill" },
  ],
};

// ---------------------------------------------------------------------------
// All specs for parametric tests
// ---------------------------------------------------------------------------
const ALL_IN_BOND_SPECS: InBondRecordSpec[] = [
  QP10_IN_BOND_HEADER_SPEC,
  QP20_CONVEYANCE_INFO_SPEC,
  QP30_BOL_HEADER_SPEC,
  QP32_SECONDARY_NOTIFY_SPEC,
  QP33_REFERENCE_ID_SPEC,
  WP10_EVENT_HEADER_SPEC,
  WP20_EVENT_DETAIL_SPEC,
  QT95_RESPONSE_SPEC,
  WT95_RESPONSE_SPEC,
  NS10_STATUS_HEADER_SPEC,
  NS30_STATUS_DETAIL_SPEC,
  NS40_STATUS_CONTINUATION_SPEC,
  NS50_STATUS_REMARKS_SPEC,
];

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("In-Bond (Chapter 9) Record Specs — 80-Column Layout Validation", () => {
  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: totalLength is 80",
    (_id, spec) => {
      expect(spec.length).toBe(80);
    }
  );

  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: field lengths sum to exactly 80",
    (_id, spec) => {
      const total = (spec as InBondRecordSpec).fields.reduce((sum, f) => sum + f.length, 0);
      expect(total).toBe(80);
    }
  );

  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: fields have contiguous 1-indexed positions (no gaps, no overlaps)",
    (_id, spec) => {
      let expectedStart = 1;
      for (const field of (spec as InBondRecordSpec).fields) {
        expect(field.start).toBe(expectedStart);
        expect(field.end).toBe(expectedStart + field.length - 1);
        expectedStart += field.length;
      }
      expect(expectedStart - 1).toBe(80);
    }
  );

  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: each field's end-start+1 equals stated length (position math vs stated length agreement)",
    (_id, spec) => {
      for (const field of (spec as InBondRecordSpec).fields) {
        const computedLen = field.end - field.start + 1;
        expect(computedLen).toBe(field.length);
      }
    }
  );

  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: designation values are only M, C, or O",
    (_id, spec) => {
      for (const field of (spec as InBondRecordSpec).fields) {
        expect(["M", "C", "O"]).toContain(field.designation);
      }
    }
  );

  it.each(ALL_IN_BOND_SPECS.map((s) => [s.recordId, s]))(
    "%s: every field has a non-empty name",
    (_id, spec) => {
      for (const field of (spec as InBondRecordSpec).fields) {
        expect(field.name.length).toBeGreaterThan(0);
      }
    }
  );
});

// ── QP10 In-bond Header — Individual Field Verification ─────────────────────
describe("QP10 In-bond Header — Field Positions (PDF pp. INB-19 to INB-20)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '10')", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("actionCode: pos 3, len 1, type A, designation M (A/B/D)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "actionCode")!;
    expect(f).toMatchObject({ start: 3, end: 3, length: 1, type: "A", designation: "M" });
  });
  it("inBondEntryType: pos 4-5, len 2, type N, designation C (61/62/63)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "inBondEntryType")!;
    expect(f).toMatchObject({ start: 4, end: 5, length: 2, type: "N", designation: "C" });
  });
  it("inBondNumber: pos 6-17, len 12, type AN, designation M", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "inBondNumber")!;
    expect(f).toMatchObject({ start: 6, end: 17, length: 12, type: "AN", designation: "M" });
  });
  it("inBondCarrierCode: pos 18-21, len 4, type AN, designation C", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "inBondCarrierCode")!;
    expect(f).toMatchObject({ start: 18, end: 21, length: 4, type: "AN", designation: "C" });
  });
  it("usPortOfDest: pos 22-25, len 4, type N, designation C (Schedule D DDPP)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "usPortOfDest")!;
    expect(f).toMatchObject({ start: 22, end: 25, length: 4, type: "N", designation: "C" });
  });
  it("portOfForeignDest: pos 26-30, len 5, type AN, designation C (Schedule K, T&E/IE only)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "portOfForeignDest")!;
    expect(f).toMatchObject({ start: 26, end: 30, length: 5, type: "AN", designation: "C" });
  });
  it("value: pos 31-38, len 8, type N, designation M (whole dollars, no decimals)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "value")!;
    expect(f).toMatchObject({ start: 31, end: 38, length: 8, type: "N", designation: "M" });
    expect(f.description).toMatch(/whole dollars|no decimals/i);
  });
  it("bondedCarrierID: pos 39-50, len 12, type X, designation C", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "bondedCarrierID")!;
    expect(f).toMatchObject({ start: 39, end: 50, length: 12, type: "X", designation: "C" });
  });
  it("ftzWarehouseInd: pos 51, len 1, type A, designation C (Y or blank)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "ftzWarehouseInd")!;
    expect(f).toMatchObject({ start: 51, end: 51, length: 1, type: "A", designation: "C" });
  });
  it("btaFdaIndicator: pos 52, len 1, type A, designation C (Y/N, required for T&E 62)", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "btaFdaIndicator")!;
    expect(f).toMatchObject({ start: 52, end: 52, length: 1, type: "A", designation: "C" });
  });
  it("filler: pos 53-80, len 28, type AN, designation M", () => {
    const f = QP10_IN_BOND_HEADER_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 53, end: 80, length: 28, type: "AN", designation: "M" });
  });
  it("has exactly 12 fields", () => {
    expect(QP10_IN_BOND_HEADER_SPEC.fields).toHaveLength(12);
  });
});

// ── QP20 Conveyance Information — Individual Field Verification ──────────────
describe("QP20 Conveyance Information — Field Positions (PDF pp. INB-23 to INB-25)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '20')", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("importingCarrierCode: pos 3-6, len 4, type AN, designation M", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "importingCarrierCode")!;
    expect(f).toMatchObject({ start: 3, end: 6, length: 4, type: "AN", designation: "M" });
  });
  it("importMOT: pos 7-8, len 2, type N, designation M (30/40/70)", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "importMOT")!;
    expect(f).toMatchObject({ start: 7, end: 8, length: 2, type: "N", designation: "M" });
  });
  it("countryCode: pos 9-10, len 2, type A, designation C", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "countryCode")!;
    expect(f).toMatchObject({ start: 9, end: 10, length: 2, type: "A", designation: "C" });
  });
  it("importingConveyance: pos 11-33, len 23, type X, designation C", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "importingConveyance")!;
    expect(f).toMatchObject({ start: 11, end: 33, length: 23, type: "X", designation: "C" });
  });
  it("voyageFlightTripNum: pos 34-38, len 5, type X, designation C", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "voyageFlightTripNum")!;
    expect(f).toMatchObject({ start: 34, end: 38, length: 5, type: "X", designation: "C" });
  });
  it("filler1: pos 39-45, len 7, type AN, designation M (internal gap — PDF layout gap)", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "filler1")!;
    expect(f).toMatchObject({ start: 39, end: 45, length: 7, type: "AN", designation: "M" });
  });
  it("portOfImportArrival: pos 46-49, len 4, type N, designation M", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "portOfImportArrival")!;
    expect(f).toMatchObject({ start: 46, end: 49, length: 4, type: "N", designation: "M" });
  });
  it("estDateOfArrival: pos 50-55, len 6, type N, designation C — MMDDYY (NOT YYMMDD)", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "estDateOfArrival")!;
    expect(f).toMatchObject({ start: 50, end: 55, length: 6, type: "N", designation: "C" });
    expect(f.description).toMatch(/MMDDYY/i);
    expect(f.description).not.toMatch(/YYMMDD/i);
  });
  it("ftzFirmsCode: pos 56-59, len 4, type AN, designation C", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "ftzFirmsCode")!;
    expect(f).toMatchObject({ start: 56, end: 59, length: 4, type: "AN", designation: "C" });
  });
  it("filler2: pos 60-80, len 21, type AN, designation M (trailing)", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "filler2")!;
    expect(f).toMatchObject({ start: 60, end: 80, length: 21, type: "AN", designation: "M" });
  });
  it("has exactly 11 fields (including both fillers)", () => {
    expect(QP20_CONVEYANCE_INFO_SPEC.fields).toHaveLength(11);
  });
});

// ── QP30 Bill of Lading Header — Individual Field Verification ──────────────
describe("QP30 Bill of Lading Header — Field Positions (PDF pp. INB-26 to INB-28)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '30')", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("actionCode: pos 3, len 1, type A, designation M (A=Add, D=Delete)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "actionCode")!;
    expect(f).toMatchObject({ start: 3, end: 3, length: 1, type: "A", designation: "M" });
  });
  it("filler1: pos 4, len 1, type A, designation M (1-char internal gap between action and seq)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "filler1")!;
    expect(f).toMatchObject({ start: 4, end: 4, length: 1, type: "A", designation: "M" });
  });
  it("sequenceNumber: pos 5-8, len 4, type AN, designation O", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "sequenceNumber")!;
    expect(f).toMatchObject({ start: 5, end: 8, length: 4, type: "AN", designation: "O" });
  });
  it("issuerCodeMasterBOL: pos 9-12, len 4, type AN, designation M", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "issuerCodeMasterBOL")!;
    expect(f).toMatchObject({ start: 9, end: 12, length: 4, type: "AN", designation: "M" });
  });
  it("masterBOLNumber: pos 13-24, len 12, type AN, designation M", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "masterBOLNumber")!;
    expect(f).toMatchObject({ start: 13, end: 24, length: 12, type: "AN", designation: "M" });
  });
  it("issuerCodeHouseBill: pos 25-28, len 4, type AN, designation C (reserved for future use)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "issuerCodeHouseBill")!;
    expect(f).toMatchObject({ start: 25, end: 28, length: 4, type: "AN", designation: "C" });
  });
  it("houseBillNumber: pos 29-40, len 12, type AN, designation C (Air only)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "houseBillNumber")!;
    expect(f).toMatchObject({ start: 29, end: 40, length: 12, type: "AN", designation: "C" });
  });
  it("issuerCodeSubHouse: pos 41-44, len 4, type AN, designation C (reserved for future use)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "issuerCodeSubHouse")!;
    expect(f).toMatchObject({ start: 41, end: 44, length: 4, type: "AN", designation: "C" });
  });
  it("subHouseBillNumber: pos 45-56, len 12, type AN, designation C (reserved for future use)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "subHouseBillNumber")!;
    expect(f).toMatchObject({ start: 45, end: 56, length: 12, type: "AN", designation: "C" });
  });
  it("prevInBondNumber: pos 57-68, len 12, type AN, designation C", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "prevInBondNumber")!;
    expect(f).toMatchObject({ start: 57, end: 68, length: 12, type: "AN", designation: "C" });
  });
  it("inBondQuantity: pos 69-78, len 10, type N, designation C", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "inBondQuantity")!;
    expect(f).toMatchObject({ start: 69, end: 78, length: 10, type: "N", designation: "C" });
  });
  it("filler2: pos 79-80, len 2, type AN, designation M (trailing)", () => {
    const f = QP30_BOL_HEADER_SPEC.fields.find((x) => x.name === "filler2")!;
    expect(f).toMatchObject({ start: 79, end: 80, length: 2, type: "AN", designation: "M" });
  });
  it("has exactly 13 fields", () => {
    expect(QP30_BOL_HEADER_SPEC.fields).toHaveLength(13);
  });
});

// ── QP32 Secondary Notify Parties — Field Verification ──────────────────────
describe("QP32 Secondary Notify Parties — Field Positions (PDF p. INB-29)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '32')", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("snpCode1: pos 3-11, len 9, type AN, designation M", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "snpCode1")!;
    expect(f).toMatchObject({ start: 3, end: 11, length: 9, type: "AN", designation: "M" });
  });
  it("snpCode2: pos 12-20, len 9, type AN, designation O", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "snpCode2")!;
    expect(f).toMatchObject({ start: 12, end: 20, length: 9, type: "AN", designation: "O" });
  });
  it("snpCode3: pos 21-29, len 9, type AN, designation O", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "snpCode3")!;
    expect(f).toMatchObject({ start: 21, end: 29, length: 9, type: "AN", designation: "O" });
  });
  it("snpCode4: pos 30-38, len 9, type AN, designation O", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "snpCode4")!;
    expect(f).toMatchObject({ start: 30, end: 38, length: 9, type: "AN", designation: "O" });
  });
  it("filler: pos 39-80, len 42, type AN, designation M", () => {
    const f = QP32_SECONDARY_NOTIFY_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 39, end: 80, length: 42, type: "AN", designation: "M" });
  });
  it("has exactly 6 fields", () => {
    expect(QP32_SECONDARY_NOTIFY_SPEC.fields).toHaveLength(6);
  });
});

// ── QP33 Reference Identifier — Field Verification ──────────────────────────
describe("QP33 Reference Identifier — Field Positions (PDF pp. INB-30 to INB-31)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '33')", () => {
    const f = QP33_REFERENCE_ID_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("qualifier: pos 3-5, len 3, type AN, designation M (up to 3-char code)", () => {
    const f = QP33_REFERENCE_ID_SPEC.fields.find((x) => x.name === "qualifier")!;
    expect(f).toMatchObject({ start: 3, end: 5, length: 3, type: "AN", designation: "M" });
  });
  it("referenceIdentifier: pos 6-35, len 30, type AN, designation M", () => {
    const f = QP33_REFERENCE_ID_SPEC.fields.find((x) => x.name === "referenceIdentifier")!;
    expect(f).toMatchObject({ start: 6, end: 35, length: 30, type: "AN", designation: "M" });
  });
  it("filler: pos 36-80, len 45, type AN, designation M", () => {
    const f = QP33_REFERENCE_ID_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 36, end: 80, length: 45, type: "AN", designation: "M" });
  });
  it("has exactly 4 fields", () => {
    expect(QP33_REFERENCE_ID_SPEC.fields).toHaveLength(4);
  });
});

// ── WP10 In-bond Event Header — Individual Field Verification ───────────────
describe("WP10 In-bond Event Header — Field Positions (PDF pp. INB-54 to INB-56)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '10')", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("actionCode: pos 3, len 1, type AN, designation M (1/2/3/5/6/7/A/Z)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "actionCode")!;
    expect(f).toMatchObject({ start: 3, end: 3, length: 1, type: "AN", designation: "M" });
  });
  it("inBondNumber: pos 4-15, len 12, type AN, designation C", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "inBondNumber")!;
    expect(f).toMatchObject({ start: 4, end: 15, length: 12, type: "AN", designation: "C" });
  });
  it("issuerCodeMasterBOL: pos 16-19, len 4, type AN, designation C", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "issuerCodeMasterBOL")!;
    expect(f).toMatchObject({ start: 16, end: 19, length: 4, type: "AN", designation: "C" });
  });
  it("masterBOLNumber: pos 20-31, len 12, type AN, designation C", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "masterBOLNumber")!;
    expect(f).toMatchObject({ start: 20, end: 31, length: 12, type: "AN", designation: "C" });
  });
  it("issuerCodeHouseBOL: pos 32-35, len 4, type AN, designation C (reserved for future use)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "issuerCodeHouseBOL")!;
    expect(f).toMatchObject({ start: 32, end: 35, length: 4, type: "AN", designation: "C" });
  });
  it("houseBOLNumber: pos 36-47, len 12, type AN, designation C (Air only)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "houseBOLNumber")!;
    expect(f).toMatchObject({ start: 36, end: 47, length: 12, type: "AN", designation: "C" });
  });
  it("firmsLocation: pos 48-51, len 4, type AN, designation C (mandatory for 1,2,3; not Air)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "firmsLocation")!;
    expect(f).toMatchObject({ start: 48, end: 51, length: 4, type: "AN", designation: "C" });
  });
  it("filler1: pos 52-63, len 12, type AN, designation M (internal gap between FIRMS and Container)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "filler1")!;
    expect(f).toMatchObject({ start: 52, end: 63, length: 12, type: "AN", designation: "M" });
  });
  it("containerNumber: pos 64-77, len 14, type AN, designation C (mandatory for 3 and 7; not Air)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "containerNumber")!;
    expect(f).toMatchObject({ start: 64, end: 77, length: 14, type: "AN", designation: "C" });
  });
  it("filler2: pos 78-80, len 3, type AN, designation M (trailing)", () => {
    const f = WP10_EVENT_HEADER_SPEC.fields.find((x) => x.name === "filler2")!;
    expect(f).toMatchObject({ start: 78, end: 80, length: 3, type: "AN", designation: "M" });
  });
  it("has exactly 11 fields", () => {
    expect(WP10_EVENT_HEADER_SPEC.fields).toHaveLength(11);
  });
});

// ── WP20 In-bond Event Detail — Individual Field Verification ───────────────
describe("WP20 In-bond Event Detail — Field Positions (PDF pp. INB-57 to INB-58)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '20')", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("date: pos 3-8, len 6, type N, designation M — YYMMDD format (NOT MMDDYY)", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "date")!;
    expect(f).toMatchObject({ start: 3, end: 8, length: 6, type: "N", designation: "M" });
    expect(f.description).toMatch(/YYMMDD/i);
    expect(f.description).not.toMatch(/MMDDYY/i);
  });
  it("time: pos 9-14, len 6, type N, designation M — HHMMSS 24-hour", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "time")!;
    expect(f).toMatchObject({ start: 9, end: 14, length: 6, type: "N", designation: "M" });
  });
  it("portOfArrival: pos 15-18, len 4, type N, designation C", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "portOfArrival")!;
    expect(f).toMatchObject({ start: 15, end: 18, length: 4, type: "N", designation: "C" });
  });
  it("inBondCarrierCode: pos 19-22, len 4, type X, designation C", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "inBondCarrierCode")!;
    expect(f).toMatchObject({ start: 19, end: 22, length: 4, type: "X", designation: "C" });
  });
  it("bondedCarrierID: pos 23-34, len 12, type X, designation C", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "bondedCarrierID")!;
    expect(f).toMatchObject({ start: 23, end: 34, length: 12, type: "X", designation: "C" });
  });
  it("cityName: pos 35-53, len 19, type AN, designation C", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "cityName")!;
    expect(f).toMatchObject({ start: 35, end: 53, length: 19, type: "AN", designation: "C" });
  });
  it("stateCode: pos 54-55, len 2, type A, designation C", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "stateCode")!;
    expect(f).toMatchObject({ start: 54, end: 55, length: 2, type: "A", designation: "C" });
  });
  it("exportMOT: pos 56-57, len 2, type N, designation O (Vessel only 10/11)", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "exportMOT")!;
    expect(f).toMatchObject({ start: 56, end: 57, length: 2, type: "N", designation: "O" });
  });
  it("exportConveyance: pos 58-80, len 23, type AN, designation O", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "exportConveyance")!;
    expect(f).toMatchObject({ start: 58, end: 80, length: 23, type: "AN", designation: "O" });
  });
  it("has exactly 10 fields (no trailing filler — exportConveyance runs to pos 80)", () => {
    expect(WP20_EVENT_DETAIL_SPEC.fields).toHaveLength(10);
  });
});

// ── QT95 Transaction Response — Individual Field Verification ───────────────
describe("QT95 In-bond Transaction Response — Field Positions (PDF p. INB-53)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '95')", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("narrativeMsgType: pos 3-4, len 2, type N, designation M (01/02/03)", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMsgType")!;
    expect(f).toMatchObject({ start: 3, end: 4, length: 2, type: "N", designation: "M" });
  });
  it("narrativeMsgId: pos 5-7, len 3, type AN, designation M", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMsgId")!;
    expect(f).toMatchObject({ start: 5, end: 7, length: 3, type: "AN", designation: "M" });
  });
  it("filler1: pos 8, len 1, type AN, designation M (internal single-char gap)", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "filler1")!;
    expect(f).toMatchObject({ start: 8, end: 8, length: 1, type: "AN", designation: "M" });
  });
  it("narrativeMessage: pos 9-47, len 39, type X, designation M", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMessage")!;
    expect(f).toMatchObject({ start: 9, end: 47, length: 39, type: "X", designation: "M" });
  });
  it("filler2: pos 48-80, len 33, type AN, designation M (trailing)", () => {
    const f = QT95_RESPONSE_SPEC.fields.find((x) => x.name === "filler2")!;
    expect(f).toMatchObject({ start: 48, end: 80, length: 33, type: "AN", designation: "M" });
  });
  it("has exactly 6 fields", () => {
    expect(QT95_RESPONSE_SPEC.fields).toHaveLength(6);
  });
});

// ── WT95 Arrival/Export Response — Field Verification ───────────────────────
describe("WT95 Arrival/Export Response — Field Positions (PDF p. INB-59)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '95')", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("narrativeMsgType: pos 3-4, len 2, type N, designation M (01/02/03)", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMsgType")!;
    expect(f).toMatchObject({ start: 3, end: 4, length: 2, type: "N", designation: "M" });
  });
  it("narrativeMsgId: pos 5-7, len 3, type AN, designation M", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMsgId")!;
    expect(f).toMatchObject({ start: 5, end: 7, length: 3, type: "AN", designation: "M" });
  });
  it("filler1: pos 8, len 1, type AN, designation M (internal single-char gap)", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "filler1")!;
    expect(f).toMatchObject({ start: 8, end: 8, length: 1, type: "AN", designation: "M" });
  });
  it("narrativeMessage: pos 9-47, len 39, type X, designation M", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "narrativeMessage")!;
    expect(f).toMatchObject({ start: 9, end: 47, length: 39, type: "X", designation: "M" });
  });
  it("filler2: pos 48-80, len 33, type AN, designation M (trailing)", () => {
    const f = WT95_RESPONSE_SPEC.fields.find((x) => x.name === "filler2")!;
    expect(f).toMatchObject({ start: 48, end: 80, length: 33, type: "AN", designation: "M" });
  });
  it("WT95 is structurally identical to QT95 (same positions, lengths, types)", () => {
    const qt = QT95_RESPONSE_SPEC.fields;
    const wt = WT95_RESPONSE_SPEC.fields;
    expect(wt).toHaveLength(qt.length);
    for (let i = 0; i < qt.length; i++) {
      expect(wt[i].start).toBe(qt[i].start);
      expect(wt[i].end).toBe(qt[i].end);
      expect(wt[i].length).toBe(qt[i].length);
      expect(wt[i].type).toBe(qt[i].type);
    }
  });
});

// ── NS10 Status Notification Header — Field Verification ────────────────────
describe("NS10 Status Notification Header (In-bond) — Field Positions (PDF p. INB-61)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '10')", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("inBondEntryType: pos 3-4, len 2, type N, designation M (61/62/63)", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "inBondEntryType")!;
    expect(f).toMatchObject({ start: 3, end: 4, length: 2, type: "N", designation: "M" });
  });
  it("inBondNumber: pos 5-16, len 12, type AN, designation M", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "inBondNumber")!;
    expect(f).toMatchObject({ start: 5, end: 16, length: 12, type: "AN", designation: "M" });
  });
  it("usPortOfDest: pos 17-20, len 4, type N, designation M", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "usPortOfDest")!;
    expect(f).toMatchObject({ start: 17, end: 20, length: 4, type: "N", designation: "M" });
  });
  it("foreignDestination: pos 21-25, len 5, type N, designation C (5N all-numeric for output)", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "foreignDestination")!;
    expect(f).toMatchObject({ start: 21, end: 25, length: 5, type: "N", designation: "C" });
  });
  it("filler: pos 26-80, len 55, type AN, designation M (trailing)", () => {
    const f = NS10_STATUS_HEADER_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 26, end: 80, length: 55, type: "AN", designation: "M" });
  });
  it("has exactly 6 fields", () => {
    expect(NS10_STATUS_HEADER_SPEC.fields).toHaveLength(6);
  });
});

// ── NS30 Status Notification Detail — Field Verification ────────────────────
describe("NS30 Status Notification Detail — Field Positions (PDF pp. INB-64 to INB-65)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '30')", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("dispositionCode: pos 3-4, len 2, type AN, designation M", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "dispositionCode")!;
    expect(f).toMatchObject({ start: 3, end: 4, length: 2, type: "AN", designation: "M" });
  });
  it("issuerMasterBill: pos 5-8, len 4, type AN, designation M", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "issuerMasterBill")!;
    expect(f).toMatchObject({ start: 5, end: 8, length: 4, type: "AN", designation: "M" });
  });
  it("masterBillNumber: pos 9-20, len 12, type AN, designation M", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "masterBillNumber")!;
    expect(f).toMatchObject({ start: 9, end: 20, length: 12, type: "AN", designation: "M" });
  });
  it("issuerHouseBill: pos 21-24, len 4, type AN, designation C (reserved future use — named in PDF)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "issuerHouseBill")!;
    expect(f).toMatchObject({ start: 21, end: 24, length: 4, type: "AN", designation: "C" });
  });
  it("houseBillNumber: pos 25-36, len 12, type AN, designation C (reserved future use — named in PDF)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "houseBillNumber")!;
    expect(f).toMatchObject({ start: 25, end: 36, length: 12, type: "AN", designation: "C" });
  });
  it("issuerSubHouse: pos 37-40, len 4, type AN, designation C (reserved future use — named in PDF)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "issuerSubHouse")!;
    expect(f).toMatchObject({ start: 37, end: 40, length: 4, type: "AN", designation: "C" });
  });
  it("subHouseBillNumber: pos 41-52, len 12, type AN, designation C (reserved future use — named in PDF)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "subHouseBillNumber")!;
    expect(f).toMatchObject({ start: 41, end: 52, length: 12, type: "AN", designation: "C" });
  });
  it("quantity: pos 53-62, len 10, type N, designation M", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "quantity")!;
    expect(f).toMatchObject({ start: 53, end: 62, length: 10, type: "N", designation: "M" });
  });
  it("negativeIndicator: pos 63, len 1, type A, designation C (N or space)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "negativeIndicator")!;
    expect(f).toMatchObject({ start: 63, end: 63, length: 1, type: "A", designation: "C" });
  });
  it("actionDate: pos 64-69, len 6, type N, designation M — YYMMDD format", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "actionDate")!;
    expect(f).toMatchObject({ start: 64, end: 69, length: 6, type: "N", designation: "M" });
    expect(f.description).toMatch(/YYMMDD/i);
  });
  it("actionTime: pos 70-73, len 4, type N, designation M — HHMM only (NOT 6-char HHMMSS)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "actionTime")!;
    expect(f).toMatchObject({ start: 70, end: 73, length: 4, type: "N", designation: "M" });
    expect(f.description).toMatch(/HHMM/);
    expect(f.length).toBe(4);
    expect(f.length).not.toBe(6);
  });
  it("inBondCarrierCode: pos 74-77, len 4, type X, designation M", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "inBondCarrierCode")!;
    expect(f).toMatchObject({ start: 74, end: 77, length: 4, type: "X", designation: "M" });
  });
  it("filler: pos 78-80, len 3, type AN, designation M (trailing)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 78, end: 80, length: 3, type: "AN", designation: "M" });
  });
  it("has exactly 14 fields", () => {
    expect(NS30_STATUS_DETAIL_SPEC.fields).toHaveLength(14);
  });
});

// ── NS40 Status Notification Continuation — Field Verification ───────────────
describe("NS40 Status Notification Continuation — Field Positions (PDF p. INB-66)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '40')", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("entryType: pos 3-4, len 2, type N, designation C", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "entryType")!;
    expect(f).toMatchObject({ start: 3, end: 4, length: 2, type: "N", designation: "C" });
  });
  it("entryNumber: pos 5-19, len 15, type AN, designation C", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "entryNumber")!;
    expect(f).toMatchObject({ start: 5, end: 19, length: 15, type: "AN", designation: "C" });
  });
  it("distPortTxn: pos 20-23, len 4, type N, designation M", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "distPortTxn")!;
    expect(f).toMatchObject({ start: 20, end: 23, length: 4, type: "N", designation: "M" });
  });
  it("firmsCode: pos 24-27, len 4, type AN, designation C", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "firmsCode")!;
    expect(f).toMatchObject({ start: 24, end: 27, length: 4, type: "AN", designation: "C" });
  });
  it("containerNum: pos 28-41, len 14, type AN, designation C", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "containerNum")!;
    expect(f).toMatchObject({ start: 28, end: 41, length: 14, type: "AN", designation: "C" });
  });
  it("filler: pos 42-80, len 39, type AN, designation M (trailing)", () => {
    const f = NS40_STATUS_CONTINUATION_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 42, end: 80, length: 39, type: "AN", designation: "M" });
  });
  it("has exactly 7 fields", () => {
    expect(NS40_STATUS_CONTINUATION_SPEC.fields).toHaveLength(7);
  });
});

// ── NS50 Status Notification Remarks — Field Verification ────────────────────
describe("NS50 Status Notification Remarks — Field Positions (PDF p. INB-67)", () => {
  it("recordType: pos 1-2, len 2, type N, designation M (constant '50')", () => {
    const f = NS50_STATUS_REMARKS_SPEC.fields.find((x) => x.name === "recordType")!;
    expect(f).toMatchObject({ start: 1, end: 2, length: 2, type: "N", designation: "M" });
  });
  it("remarks: pos 3-47, len 45, type X, designation M (free-form USCBP text)", () => {
    const f = NS50_STATUS_REMARKS_SPEC.fields.find((x) => x.name === "remarks")!;
    expect(f).toMatchObject({ start: 3, end: 47, length: 45, type: "X", designation: "M" });
  });
  it("filler: pos 48-80, len 33, type AN, designation M (trailing)", () => {
    const f = NS50_STATUS_REMARKS_SPEC.fields.find((x) => x.name === "filler")!;
    expect(f).toMatchObject({ start: 48, end: 80, length: 33, type: "AN", designation: "M" });
  });
  it("has exactly 3 fields", () => {
    expect(NS50_STATUS_REMARKS_SPEC.fields).toHaveLength(3);
  });
});

// ── Cross-Record Date Format Consistency Checks ──────────────────────────────
describe("Cross-Record Date Format Verification — In-Bond Chapter Mixed Date Formats", () => {
  it("QP20 estDateOfArrival uses MMDDYY (confirmed from PDF p. INB-24)", () => {
    const f = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "estDateOfArrival")!;
    expect(f.length).toBe(6);
    expect(f.type).toBe("N");
    expect(f.description).toMatch(/MMDDYY/i);
  });

  it("WP20 date uses YYMMDD (confirmed from PDF p. INB-57) — DIFFERENT format from QP20", () => {
    const f = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "date")!;
    expect(f.length).toBe(6);
    expect(f.type).toBe("N");
    expect(f.description).toMatch(/YYMMDD/i);
  });

  it("NS30 actionDate uses YYMMDD (confirmed from PDF pp. INB-64/65)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "actionDate")!;
    expect(f.length).toBe(6);
    expect(f.type).toBe("N");
    expect(f.description).toMatch(/YYMMDD/i);
  });

  it("QP20 date format (MMDDYY) differs from WP20 date format (YYMMDD) in same chapter", () => {
    const qp20Date = QP20_CONVEYANCE_INFO_SPEC.fields.find((x) => x.name === "estDateOfArrival")!;
    const wp20Date = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "date")!;
    expect(qp20Date.length).toBe(6);
    expect(wp20Date.length).toBe(6);
    expect(qp20Date.description).toMatch(/MMDDYY/i);
    expect(wp20Date.description).toMatch(/YYMMDD/i);
    expect(qp20Date.description).not.toMatch(/YYMMDD/i);
    expect(wp20Date.description).not.toMatch(/MMDDYY/i);
  });

  it("NS30 actionTime is 4-char HHMM — not 6-char HHMMSS (confirmed from PDF pp. INB-64/65)", () => {
    const f = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "actionTime")!;
    expect(f.length).toBe(4);
    expect(f.length).not.toBe(6);
  });

  it("WP20 time is 6-char HHMMSS vs NS30 actionTime which is 4-char HHMM", () => {
    const wp20Time = WP20_EVENT_DETAIL_SPEC.fields.find((x) => x.name === "time")!;
    const ns30Time = NS30_STATUS_DETAIL_SPEC.fields.find((x) => x.name === "actionTime")!;
    expect(wp20Time.length).toBe(6);
    expect(ns30Time.length).toBe(4);
    expect(wp20Time.length).not.toBe(ns30Time.length);
  });
});

// ── Transaction Identifier Metadata Tests ────────────────────────────────────
describe("In-Bond Record Metadata — Transaction IDs and Directions", () => {
  it("QP-input records have transactionId QP and direction Input", () => {
    const qpRecords = [
      QP10_IN_BOND_HEADER_SPEC,
      QP20_CONVEYANCE_INFO_SPEC,
      QP30_BOL_HEADER_SPEC,
      QP32_SECONDARY_NOTIFY_SPEC,
      QP33_REFERENCE_ID_SPEC,
    ];
    for (const spec of qpRecords) {
      expect(spec.transactionId).toBe("QP");
      expect(spec.direction).toBe("Input");
    }
  });

  it("WP-input records have transactionId WP and direction Input", () => {
    for (const spec of [WP10_EVENT_HEADER_SPEC, WP20_EVENT_DETAIL_SPEC]) {
      expect(spec.transactionId).toBe("WP");
      expect(spec.direction).toBe("Input");
    }
  });

  it("QT95 has transactionId QT and direction Output", () => {
    expect(QT95_RESPONSE_SPEC.transactionId).toBe("QT");
    expect(QT95_RESPONSE_SPEC.direction).toBe("Output");
  });

  it("WT95 has transactionId WT and direction Output", () => {
    expect(WT95_RESPONSE_SPEC.transactionId).toBe("WT");
    expect(WT95_RESPONSE_SPEC.direction).toBe("Output");
  });

  it("NS-output records have transactionId NS and direction Output", () => {
    for (const spec of [NS10_STATUS_HEADER_SPEC, NS30_STATUS_DETAIL_SPEC, NS40_STATUS_CONTINUATION_SPEC, NS50_STATUS_REMARKS_SPEC]) {
      expect(spec.transactionId).toBe("NS");
      expect(spec.direction).toBe("Output");
    }
  });

  it("scope count: 5 QP + 2 WP + 1 QT + 1 WT + 4 NS = 13 total records", () => {
    expect(ALL_IN_BOND_SPECS).toHaveLength(13);
  });
});

// ── First-field Record Type Constant Verification ────────────────────────────
describe("Record Type Constants — First Field Matches Record Identifier", () => {
  const expectations: Array<[InBondRecordSpec, string]> = [
    [QP10_IN_BOND_HEADER_SPEC,       "10"],
    [QP20_CONVEYANCE_INFO_SPEC,      "20"],
    [QP30_BOL_HEADER_SPEC,           "30"],
    [QP32_SECONDARY_NOTIFY_SPEC,     "32"],
    [QP33_REFERENCE_ID_SPEC,         "33"],
    [WP10_EVENT_HEADER_SPEC,         "10"],
    [WP20_EVENT_DETAIL_SPEC,         "20"],
    [QT95_RESPONSE_SPEC,             "95"],
    [WT95_RESPONSE_SPEC,             "95"],
    [NS10_STATUS_HEADER_SPEC,        "10"],
    [NS30_STATUS_DETAIL_SPEC,        "30"],
    [NS40_STATUS_CONTINUATION_SPEC,  "40"],
    [NS50_STATUS_REMARKS_SPEC,       "50"],
  ];

  it.each(expectations.map(([s, c]) => [s.recordId, s, c]))(
    "%s first field 'recordType' occupies pos 1-2 and description states constant '%s'",
    (_id, spec, constant) => {
      const firstField = (spec as InBondRecordSpec).fields[0];
      expect(firstField.name).toBe("recordType");
      expect(firstField.start).toBe(1);
      expect(firstField.end).toBe(2);
      expect(firstField.length).toBe(2);
      expect(firstField.description).toContain(constant as string);
    }
  );
});
