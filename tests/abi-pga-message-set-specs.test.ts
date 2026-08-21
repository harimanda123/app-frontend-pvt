/**
 * CATAIR Participating Government Agencies (PGA) Message Set (Chapter 8) Scope Note & Record Specification Tests
 * Source PDF: docs/plans/catair-source-docs/08-pga-message-set-2026-07.pdf (July 1, 2026 - Pub # 0875-0419)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CATAIR PGA MESSAGE SET (CHAPTER 8) SCOPE NOTE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Scoped IN (28 Generic / Cross-Agency Backbone Records):
 *   1. Record OI (Input, Mandatory, Page 16): Commercial Line Item Description Record.
 *      [Pos 1-80: 2(OI) + 8(filler) + 70(commercialDescription) = 80]
 *   2. Record PG01 (Input, Mandatory, Pages 17-19): PGA Line Number, Agency & Program Header Record.
 *      [Pos 1-80: 2(PG) + 2(01) + 3(pgaLineNumber) + 3(govtAgencyCode) + 3(govtAgencyProgramCode) + 3(govtAgencyProcessingCode) + 1(electronicImageSubmitted) + 1(confidentialInfoIndicator) + 4(gtinQualifier) + 19(gtinCode) + 16(intendedUseCode) + 21(intendedUseDescription) + 1(correctionIndicator) + 1(disclaimer) = 80]
 *   3. Record PG02 (Input, Conditional, Pages 21-22): Product or Component Identifier Record.
 *      [Pos 1-80: 2(PG) + 2(02) + 1(itemType) + 4(productCodeQualifier1) + 19(productCodeNumber1) + 4(productCodeQualifier2) + 19(productCodeNumber2) + 4(productCodeQualifier3) + 19(productCodeNumber3) + 6(filler) = 80]
 *   4. Record PG04 (Input, Conditional, Page 23): Constituent Active Ingredient / Element Record.
 *      [Pos 1-80: 2(PG) + 2(04) + 1(activeIngredientQualifier) + 51(constituentName) + 12(constituentQuantity) + 5(constituentUom) + 7(constituentPercent) = 80]
 *   5. Record PG06 (Input, Conditional, Pages 26-27): Source / Processing / Origin Record.
 *      [Pos 1-80: 2(PG) + 2(06) + 3(sourceTypeCode) + 2(countryCode) + 20(geographicLocation) + 8(processingStartDate) + 8(processingEndDate) + 5(processingTypeCode) + 30(processingDescription) = 80]
 *   6. Record PG07 (Input, Conditional, Page 28): Trade/Brand Name, Model & Item Identity Header Record.
 *      [Pos 1-80: 2(PG) + 2(07) + 35(tradeBrandName) + 15(model) + 6(manufactureMonthYear) + 3(itemIdentityQualifier) + 17(itemIdentityNumber) = 80]
 *   7. Record PG08 (Input, Conditional, Page 29): Multiple Item Identity Numbers (Serial / VIN overflow) Record.
 *      [Pos 1-80: 2(PG) + 2(08) + 17(itemIdentityNumber1) + 17(itemIdentityNumber2) + 17(itemIdentityNumber3) + 17(itemIdentityNumber4) + 8(filler) = 80]
 *   8. Record PG10 (Input, Conditional, Page 30): Commodity Category & Characteristic Record.
 *      [Pos 1-80: 2(PG) + 2(10) + 6(categoryTypeCode) + 5(categoryCode) + 4(commodityQualifierCode) + 4(commodityCharacteristicQualifier) + 57(commodityCharacteristicDescription) = 80]
 *   9. Record PG13 (Input, Conditional, Page 31): LPCO Issuer & Geographic Location Record.
 *      [Pos 1-80: 2(PG) + 2(13) + 35(issuerOfLpco) + 3(lpcoIssuerGeoQualifier) + 3(locationOfIssuer) + 25(regionalDescription) + 10(filler) = 80]
 *  10. Record PG14 (Input, Conditional, Page 32): LPCO Details & Quantity Record.
 *      [Pos 1-80: 2(PG) + 2(14) + 1(lpcoTransactionType) + 3(lpcoType) + 33(lpcoNumber) + 1(lpcoDateQualifier) + 8(lpcoDate) + 16(lpcoQuantity) + 5(lpcoUom) + 9(exemptionCode) = 80]
 *  11. Record PG18 (Input, Conditional, Page 34): Hazardous Material & Dangerous Goods Record.
 *      [Pos 1-80: 2(PG) + 2(18) + 10(unDangerousGoodsCode) + 4(hazardousClassCode) + 4(epaHazardousWasteCode) + 50(hazardousMaterialDescription) + 1(packagingGroupCode) + 7(filler) = 80]
 *  12. Record PG19 (Input, Conditional, Page 35): Entity Identification Record.
 *      [Pos 1-80: 2(PG) + 2(19) + 3(entityRoleCode) + 3(entityIdCode) + 15(entityNumber) + 32(entityName) + 23(entityAddress1) = 80]
 *  13. Record PG20 (Input, Conditional, Page 36): Entity Address Line 2 & City/State/Zip Record.
 *      [Pos 1-80: 2(PG) + 2(20) + 32(entityAddress2) + 5(entityAptSuiteNumber) + 21(entityCity) + 3(entityStateProvince) + 2(entityCountry) + 9(entityZipPostalCode) + 4(filler) = 80]
 *  14. Record PG21 (Input, Conditional, Page 37): Individual Contact Information Record.
 *      [Pos 1-80: 2(PG) + 2(21) + 3(individualQualifier) + 23(individualName) + 15(telephoneNumber) + 35(emailOrFaxNumber) = 80]
 *  15. Record PG22 (Input, Conditional, Page 38): Importer Declaration / Substantiating Document Record.
 *      [Pos 1-80: 2(PG) + 2(22) + 1(substantiatingDocIndicator) + 7(documentIdentifier) + 5(conformanceDeclaration) + 3(entityRoleCode) + 4(declarationCode) + 1(declarationCertification) + 8(dateOfSignature) + 17(invoiceNumber) + 30(complianceDescription) = 80]
 *  16. Record PG24 (Input, Optional, Page 40): Remarks Record.
 *      [Pos 1-80: 2(PG) + 2(24) + 3(remarksTypeCode) + 5(remarksCode) + 68(remarksText) = 80]
 *  17. Record PG25 (Input, Conditional, Page 41): Temperature, Lot & PGA Values Record.
 *      [Pos 1-80: 2(PG) + 2(25) + 1(temperatureQualifier) + 1(degreeType) + 1(negativeNumber) + 6(actualTemperature) + 1(locationOfTempRecording) + 1(lotNumberQualifier) + 25(lotNumber) + 8(productionStartDate) + 8(productionEndDate) + 12(pgaLineValue) + 12(pgaUnitValue) = 80]
 *  18. Record PG26 (Input, Conditional, Page 42): Packaging Level Breakdown & Quantity Record.
 *      [Pos 1-80: 2(PG) + 2(26) + 1(packagingQualifier) + 12(quantity) + 5(unitOfMeasure) + 25(packageIdentifier) + 3(packagingMethod) + 15(packageMaterial) + 15(packageFiller) = 80]
 *  19. Record PG27 (Input, Conditional, Page 43): Shipping Container Information Record.
 *      [Pos 1-80: 2(PG) + 2(27) + 20(containerNumber1) + 1(typeOfContainer1) + 2(containerLength1) + 20(containerNumber2) + 1(typeOfContainer2) + 2(containerLength2) + 20(containerNumber3) + 1(typeOfContainer3) + 2(containerLength3) + 7(filler) = 80]
 *  20. Record PG29 (Input, Conditional, Pages 45-47): Commodity Quantities & UOM Record.
 *      [Pos 1-80: 2(PG) + 2(29) + 3(uomPgaLineNet) + 12(qtyPgaLineNet) + 3(uomPgaLineGross) + 12(qtyPgaLineGross) + 3(uomIndividualUnitNet) + 12(qtyIndividualUnitNet) + 3(uomIndividualUnitGross) + 12(qtyIndividualUnitGross) + 16(filler) = 80]
 *  21. Record PG30 (Input, Conditional, Pages 48-49): Inspection / Lab Test / Arrival Location Record.
 *      [Pos 1-80: 2(PG) + 2(30) + 1(inspectionStatus) + 8(requestedDate) + 4(requestedTime) + 4(locationCode) + 50(location) + 9(filler) = 80]
 *  22. Record PG32 (Input, Conditional, Page 51): Commodity Routing Record.
 *      [Pos 1-80: 2(PG) + 2(32) + 3(routingTypeCode) + 2(routingCountryCode) + 3(politicalSubunitQualifier) + 9(politicalSubunitNumber) + 55(politicalSubunitName) + 4(filler) = 80]
 *  23. Record PG34 (Input, Conditional, Page 53): Travel Document Record.
 *      [Pos 1-80: 2(PG) + 2(34) + 3(travelDocumentTypeCode) + 2(travelDocumentNationality) + 35(travelDocumentIdentifier) + 36(filler) = 80]
 *  24. Record PG50 (Input, Conditional, Page 55): Start of Grouping Record.
 *      [Pos 1-80: 2(PG) + 2(50) + 76(filler) = 80]
 *  25. Record PG51 (Input, Conditional, Page 56): End of Grouping Record.
 *      [Pos 1-80: 2(PG) + 2(51) + 76(filler) = 80]
 *  26. Record PG55 (Input, Optional, Page 57): Additional Entity Roles Record.
 *      [Pos 1-80: 2(PG) + 2(55) + 3(role1) + 3(role2) + 3(role3) + 3(role4) + 3(role5) + 3(role6) + 3(role7) + 3(role8) + 3(role9) + 3(role10) + 46(filler) = 80]
 *  27. Record PG60 (Input, Optional, Page 58): Additional Reference / Overflow Information Record.
 *      [Pos 1-80: 2(PG) + 2(60) + 3(additionalInfoQualifierCode) + 73(additionalInformation) = 80]
 *  28. Record PG00 (Input, Optional, Page 59): Substitution Grouping Record.
 *      [Pos 1-80: 2(PG) + 2(00) + 1(substitutionIndicator) + 4(substitutionNumber) + 71(filler) = 80]
 *
 * Explicitly Deferred (7 Agency-Specific Record Variants):
 *   1. Record PG05 (Input, Page 25): Scientific Genus Name, Scientific Species Name, Scientific Sub Species Name,
 *      Scientific Species Code (FWS Category Code), FWS Description Code.
 *      Reason: Agency-specific to Fish & Wildlife Service (FWS) and USDA-APHIS Lacey Act species declarations.
 *   2. Record PG17 (Input, Page 33): Specific Common Name, General Common Name, Live Venomous Wildlife Code, Cartons Containing Wildlife.
 *      Reason: Positions 65-70 contain agency-specific fields for Fish & Wildlife Service (FWS) live venomous wildlife & carton counts.
 *   3. Record PG23 (Input, Page 39): Food and Drug Administration (FDA) Affirmation of Compliance Criteria.
 *      Reason: Agency-specific to FDA (BTA, FCE, SID, etc. Affirmation of Compliance codes & descriptions).
 *   4. Record PG28 (Input, Page 44): Can Dimensions (Acidified/Low-Acid Foods) & Package Tracking Numbers.
 *      Reason: Positions 5-16 contain FDA-specific Can Dimensions (#1, #2, #3) for acidified food regulation.
 *   5. Record PG31 (Input, Page 50): Commodity Harvesting Vessel Characteristic, UOM & Net Weight.
 *      Reason: Agency-specific to NOAA National Marine Fisheries Service (NMFS) harvesting vessel declarations.
 *   6. Record PG33 (Input, Page 52): Commodity Geographic Area Code & Name.
 *      Reason: Agency-specific to NOAA National Marine Fisheries Service (NMFS) ocean geographic area declarations.
 *   7. Record PG35 (Input, Page 54): DOT Surety Code, Serial Number, Bond Qualifier & Amount.
 *      Reason: Agency-specific to Department of Transportation (DOT) National Highway Traffic Safety Administration (NHTSA) conformance bonds.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DISCREPANCIES, CONFLICTS, AND PDF ANOMALIES
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. PG27 Status Cell Omission (Page 43):
 *    In the PG27 specification table, the Status cell for 'Container length 1' (positions 26-27, 2N) is blank.
 *    Container Number 1 status is M, Type of Container 1 status is C. Position math shows positions 26-27 are contiguous and conditional (C).
 * 2. PG01 Disclaimer Code Scope (Pages 19-20):
 *    Page 19 lists Disclaimer codes A-G. Page 20 Note 1 clarifies that codes E (FWS), F (FDA Entry Type 21), and G (USDA APHIS Lacey)
 *    are agency-specific, while A-D (A=Not Regulated, B=Data Not Required, C=Filed Other Means, D=Filed Paper) are generic.
 * 3. PG25 Money vs Quantity Implied Decimals (Page 41):
 *    PGA Line Value (pos 57-68, 12N) explicitly states "in whole dollars" (0 implied decimals).
 *    PGA Unit Value (pos 69-80, 12N) explicitly states "Two decimal places are implied" (2 implied decimals).
 * 4. Record Length Consistency:
 *    All 28 generic backbone input records are 80 characters long, matching standard CATAIR fixed-width transmission frames.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";

export interface PgaFieldSpec {
  name: string;
  start: number;
  end: number;
  length: number;
  type: "A" | "N" | "AN" | "X";
  status: "M" | "C" | "O";
  impliedDecimals?: number;
}

export interface PgaRecordSpec {
  recordType: string;
  name: string;
  length: number;
  fields: PgaFieldSpec[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIFICATION DEFINITIONS FOR ALL 28 GENERIC BACKBONE RECORDS
// ─────────────────────────────────────────────────────────────────────────────

export const OI_LINE_ITEM_SPEC: PgaRecordSpec = {
  recordType: "OI",
  name: "Commercial Line Item Description",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "filler", start: 3, end: 10, length: 8, type: "AN", status: "M" },
    { name: "commercialDescription", start: 11, end: 80, length: 70, type: "X", status: "M" },
  ],
};

export const PG01_HEADER_SPEC: PgaRecordSpec = {
  recordType: "PG01",
  name: "PGA Line Header & Agency Code",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "pgaLineNumber", start: 5, end: 7, length: 3, type: "N", status: "M" },
    { name: "governmentAgencyCode", start: 8, end: 10, length: 3, type: "AN", status: "M" },
    { name: "governmentAgencyProgramCode", start: 11, end: 13, length: 3, type: "X", status: "M" },
    { name: "governmentAgencyProcessingCode", start: 14, end: 16, length: 3, type: "AN", status: "C" },
    { name: "electronicImageSubmitted", start: 17, end: 17, length: 1, type: "A", status: "C" },
    { name: "confidentialInformationIndicator", start: 18, end: 18, length: 1, type: "A", status: "C" },
    { name: "globallyUniqueProductIdentificationCodeQualifier", start: 19, end: 22, length: 4, type: "AN", status: "C" },
    { name: "globallyUniqueProductIdentificationCode", start: 23, end: 41, length: 19, type: "X", status: "C" },
    { name: "intendedUseCode", start: 42, end: 57, length: 16, type: "X", status: "C" },
    { name: "intendedUseDescription", start: 58, end: 78, length: 21, type: "X", status: "C" },
    { name: "correctionIndicator", start: 79, end: 79, length: 1, type: "X", status: "C" },
    { name: "disclaimer", start: 80, end: 80, length: 1, type: "A", status: "C" },
  ],
};

export const PG02_PRODUCT_COMPONENT_SPEC: PgaRecordSpec = {
  recordType: "PG02",
  name: "Product or Component Identifier",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "itemType", start: 5, end: 5, length: 1, type: "A", status: "M" },
    { name: "productCodeQualifier1", start: 6, end: 9, length: 4, type: "AN", status: "C" },
    { name: "productCodeNumber1", start: 10, end: 28, length: 19, type: "X", status: "C" },
    { name: "productCodeQualifier2", start: 29, end: 32, length: 4, type: "AN", status: "C" },
    { name: "productCodeNumber2", start: 33, end: 51, length: 19, type: "X", status: "C" },
    { name: "productCodeQualifier3", start: 52, end: 55, length: 4, type: "AN", status: "C" },
    { name: "productCodeNumber3", start: 56, end: 74, length: 19, type: "X", status: "C" },
    { name: "filler", start: 75, end: 80, length: 6, type: "X", status: "M" },
  ],
};

export const PG04_CONSTITUENT_ELEMENT_SPEC: PgaRecordSpec = {
  recordType: "PG04",
  name: "Constituent Active Ingredient / Element",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "constituentActiveIngredientQualifier", start: 5, end: 5, length: 1, type: "A", status: "C" },
    { name: "nameOfConstituentElement", start: 6, end: 56, length: 51, type: "X", status: "C" },
    { name: "quantityOfConstituentElement", start: 57, end: 68, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "unitOfMeasureConstituentElement", start: 69, end: 73, length: 5, type: "AN", status: "C" },
    { name: "percentOfConstituentElement", start: 74, end: 80, length: 7, type: "N", status: "C", impliedDecimals: 4 },
  ],
};

export const PG06_SOURCE_PROCESSING_SPEC: PgaRecordSpec = {
  recordType: "PG06",
  name: "Source / Processing / Origin",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "sourceTypeCode", start: 5, end: 7, length: 3, type: "AN", status: "M" },
    { name: "countryCode", start: 8, end: 9, length: 2, type: "X", status: "C" },
    { name: "geographicLocation", start: 10, end: 29, length: 20, type: "X", status: "C" },
    { name: "processingStartDate", start: 30, end: 37, length: 8, type: "N", status: "C" },
    { name: "processingEndDate", start: 38, end: 45, length: 8, type: "N", status: "C" },
    { name: "processingTypeCode", start: 46, end: 50, length: 5, type: "AN", status: "C" },
    { name: "processingDescription", start: 51, end: 80, length: 30, type: "X", status: "C" },
  ],
};

export const PG07_TRADE_NAME_MODEL_SPEC: PgaRecordSpec = {
  recordType: "PG07",
  name: "Trade Name / Brand Name / Model / Item Identity Header",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "tradeNameBrandName", start: 5, end: 39, length: 35, type: "X", status: "C" },
    { name: "model", start: 40, end: 54, length: 15, type: "X", status: "C" },
    { name: "manufactureMonthAndYear", start: 55, end: 60, length: 6, type: "N", status: "C" },
    { name: "itemIdentityNumberQualifier", start: 61, end: 63, length: 3, type: "AN", status: "C" },
    { name: "itemIdentityNumber", start: 64, end: 80, length: 17, type: "X", status: "C" },
  ],
};

export const PG08_ITEM_IDENTITY_OVERFLOW_SPEC: PgaRecordSpec = {
  recordType: "PG08",
  name: "Multiple Item Identity Numbers",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "itemIdentityNumber1", start: 5, end: 21, length: 17, type: "X", status: "C" },
    { name: "itemIdentityNumber2", start: 22, end: 38, length: 17, type: "X", status: "C" },
    { name: "itemIdentityNumber3", start: 39, end: 55, length: 17, type: "X", status: "C" },
    { name: "itemIdentityNumber4", start: 56, end: 72, length: 17, type: "X", status: "C" },
    { name: "filler", start: 73, end: 80, length: 8, type: "X", status: "M" },
  ],
};

export const PG10_CATEGORY_CHARACTERISTIC_SPEC: PgaRecordSpec = {
  recordType: "PG10",
  name: "Commodity Category & Characteristic",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "categoryTypeCode", start: 5, end: 10, length: 6, type: "AN", status: "C" },
    { name: "categoryCode", start: 11, end: 15, length: 5, type: "AN", status: "C" },
    { name: "commodityQualifierCode", start: 16, end: 19, length: 4, type: "X", status: "C" },
    { name: "commodityCharacteristicQualifier", start: 20, end: 23, length: 4, type: "AN", status: "C" },
    { name: "commodityCharacteristicDescription", start: 24, end: 80, length: 57, type: "X", status: "C" },
  ],
};

export const PG13_LPCO_ISSUER_SPEC: PgaRecordSpec = {
  recordType: "PG13",
  name: "LPCO Issuer & Geographic Location",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "issuerOfLpco", start: 5, end: 39, length: 35, type: "X", status: "C" },
    { name: "lpcoIssuerGovernmentGeographicCodeQualifier", start: 40, end: 42, length: 3, type: "A", status: "C" },
    { name: "locationOfIssuerOfTheLpco", start: 43, end: 45, length: 3, type: "A", status: "C" },
    { name: "regionalDescriptionOfLocationOfAgencyIssuingLpco", start: 46, end: 70, length: 25, type: "X", status: "C" },
    { name: "filler", start: 71, end: 80, length: 10, type: "X", status: "M" },
  ],
};

export const PG14_LPCO_DETAILS_SPEC: PgaRecordSpec = {
  recordType: "PG14",
  name: "LPCO Details & Quantity",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "lpcoTransactionType", start: 5, end: 5, length: 1, type: "N", status: "C" },
    { name: "lpcoType", start: 6, end: 8, length: 3, type: "AN", status: "C" },
    { name: "lpcoNumberOrName", start: 9, end: 41, length: 33, type: "X", status: "C" },
    { name: "lpcoDateQualifier", start: 42, end: 42, length: 1, type: "N", status: "C" },
    { name: "lpcoDate", start: 43, end: 50, length: 8, type: "N", status: "C" },
    { name: "lpcoQuantity", start: 51, end: 66, length: 16, type: "N", status: "C", impliedDecimals: 4 },
    { name: "lpcoUnitOfMeasure", start: 67, end: 71, length: 5, type: "AN", status: "C" },
    { name: "exemptionCode", start: 72, end: 80, length: 9, type: "X", status: "C" },
  ],
};

export const PG18_HAZMAT_SPEC: PgaRecordSpec = {
  recordType: "PG18",
  name: "Hazardous Material & Dangerous Goods",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "unDangerousGoodsCode", start: 5, end: 14, length: 10, type: "AN", status: "C" },
    { name: "hazardousClassCode", start: 15, end: 18, length: 4, type: "X", status: "C" },
    { name: "epaHazardousWasteCode", start: 19, end: 22, length: 4, type: "AN", status: "C" },
    { name: "hazardousMaterialDescription", start: 23, end: 72, length: 50, type: "X", status: "C" },
    { name: "packagingGroupCode", start: 73, end: 73, length: 1, type: "N", status: "C" },
    { name: "filler", start: 74, end: 80, length: 7, type: "X", status: "M" },
  ],
};

export const PG19_ENTITY_IDENTIFICATION_SPEC: PgaRecordSpec = {
  recordType: "PG19",
  name: "Entity Identification",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "entityRoleCode", start: 5, end: 7, length: 3, type: "AN", status: "M" },
    { name: "entityIdentificationCode", start: 8, end: 10, length: 3, type: "AN", status: "C" },
    { name: "entityNumber", start: 11, end: 25, length: 15, type: "X", status: "C" },
    { name: "entityName", start: 26, end: 57, length: 32, type: "X", status: "C" },
    { name: "entityAddress1", start: 58, end: 80, length: 23, type: "X", status: "C" },
  ],
};

export const PG20_ENTITY_ADDRESS_SPEC: PgaRecordSpec = {
  recordType: "PG20",
  name: "Entity Address Line 2 & City/State/Zip",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "entityAddress2", start: 5, end: 36, length: 32, type: "X", status: "C" },
    { name: "entityApartmentSuiteNumber", start: 37, end: 41, length: 5, type: "X", status: "C" },
    { name: "entityCity", start: 42, end: 62, length: 21, type: "X", status: "C" },
    { name: "entityStateProvince", start: 63, end: 65, length: 3, type: "AN", status: "C" },
    { name: "entityCountry", start: 66, end: 67, length: 2, type: "A", status: "C" },
    { name: "entityZipPostalCode", start: 68, end: 76, length: 9, type: "X", status: "C" },
    { name: "filler", start: 77, end: 80, length: 4, type: "X", status: "M" },
  ],
};

export const PG21_INDIVIDUAL_CONTACT_SPEC: PgaRecordSpec = {
  recordType: "PG21",
  name: "Individual Contact Information",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "individualQualifier", start: 5, end: 7, length: 3, type: "AN", status: "C" },
    { name: "individualName", start: 8, end: 30, length: 23, type: "X", status: "C" },
    { name: "telephoneNumberOfTheIndividual", start: 31, end: 45, length: 15, type: "X", status: "C" },
    { name: "emailAddressOrFaxNumberForTheIndividual", start: 46, end: 80, length: 35, type: "X", status: "C" },
  ],
};

export const PG22_IMPORTER_DECLARATION_SPEC: PgaRecordSpec = {
  recordType: "PG22",
  name: "Importer Declaration / Substantiating Document",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "importersSubstantiatingSignedDocument", start: 5, end: 5, length: 1, type: "A", status: "C" },
    { name: "documentIdentifier", start: 6, end: 12, length: 7, type: "AN", status: "C" },
    { name: "conformanceDeclaration", start: 13, end: 17, length: 5, type: "X", status: "C" },
    { name: "entityRoleCode", start: 18, end: 20, length: 3, type: "AN", status: "C" },
    { name: "declarationCode", start: 21, end: 24, length: 4, type: "AN", status: "C" },
    { name: "declarationCertification", start: 25, end: 25, length: 1, type: "A", status: "C" },
    { name: "dateOfSignature", start: 26, end: 33, length: 8, type: "N", status: "C" },
    { name: "invoiceNumber", start: 34, end: 50, length: 17, type: "X", status: "C" },
    { name: "complianceDescription", start: 51, end: 80, length: 30, type: "X", status: "C" },
  ],
};

export const PG24_REMARKS_SPEC: PgaRecordSpec = {
  recordType: "PG24",
  name: "Remarks",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "remarksTypeCode", start: 5, end: 7, length: 3, type: "AN", status: "C" },
    { name: "remarksCode", start: 8, end: 12, length: 5, type: "AN", status: "C" },
    { name: "remarksText", start: 13, end: 80, length: 68, type: "X", status: "C" },
  ],
};

export const PG25_TEMPERATURE_LOT_VALUES_SPEC: PgaRecordSpec = {
  recordType: "PG25",
  name: "Temperature, Lot & PGA Values",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "temperatureQualifier", start: 5, end: 5, length: 1, type: "A", status: "C" },
    { name: "degreeType", start: 6, end: 6, length: 1, type: "A", status: "C" },
    { name: "negativeNumber", start: 7, end: 7, length: 1, type: "A", status: "C" },
    { name: "actualTemperature", start: 8, end: 13, length: 6, type: "N", status: "C", impliedDecimals: 2 },
    { name: "locationOfTemperatureRecording", start: 14, end: 14, length: 1, type: "A", status: "C" },
    { name: "lotNumberQualifier", start: 15, end: 15, length: 1, type: "AN", status: "C" },
    { name: "lotNumber", start: 16, end: 40, length: 25, type: "X", status: "C" },
    { name: "productionStartDateOfTheLot", start: 41, end: 48, length: 8, type: "N", status: "C" },
    { name: "productionEndDateOfTheLot", start: 49, end: 56, length: 8, type: "N", status: "C" },
    { name: "pgaLineValue", start: 57, end: 68, length: 12, type: "N", status: "C", impliedDecimals: 0 },
    { name: "pgaUnitValue", start: 69, end: 80, length: 12, type: "N", status: "C", impliedDecimals: 2 },
  ],
};

export const PG26_PACKAGING_BREAKDOWN_SPEC: PgaRecordSpec = {
  recordType: "PG26",
  name: "Packaging Level Breakdown & Quantity",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "packagingQualifier", start: 5, end: 5, length: 1, type: "N", status: "M" },
    { name: "quantity", start: 6, end: 17, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "unitOfMeasurePackagingLevel", start: 18, end: 22, length: 5, type: "X", status: "C" },
    { name: "packageIdentifier", start: 23, end: 47, length: 25, type: "X", status: "C" },
    { name: "packagingMethod", start: 48, end: 50, length: 3, type: "AN", status: "C" },
    { name: "packageMaterial", start: 51, end: 65, length: 15, type: "X", status: "C" },
    { name: "packageFiller", start: 66, end: 80, length: 15, type: "X", status: "C" },
  ],
};

export const PG27_SHIPPING_CONTAINER_SPEC: PgaRecordSpec = {
  recordType: "PG27",
  name: "Shipping Container Information",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "containerNumber1", start: 5, end: 24, length: 20, type: "AN", status: "M" },
    { name: "typeOfContainer1", start: 25, end: 25, length: 1, type: "N", status: "C" },
    { name: "containerLength1", start: 26, end: 27, length: 2, type: "N", status: "C" },
    { name: "containerNumber2", start: 28, end: 47, length: 20, type: "AN", status: "C" },
    { name: "typeOfContainer2", start: 48, end: 48, length: 1, type: "N", status: "C" },
    { name: "containerLength2", start: 49, end: 50, length: 2, type: "N", status: "C" },
    { name: "containerNumber3", start: 51, end: 70, length: 20, type: "AN", status: "C" },
    { name: "typeOfContainer3", start: 71, end: 71, length: 1, type: "N", status: "C" },
    { name: "containerLength3", start: 72, end: 73, length: 2, type: "N", status: "C" },
    { name: "filler", start: 74, end: 80, length: 7, type: "X", status: "C" },
  ],
};

export const PG29_COMMODITY_QUANTITIES_SPEC: PgaRecordSpec = {
  recordType: "PG29",
  name: "Commodity Quantities & Unit of Measure",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "unitOfMeasurePgaLineNet", start: 5, end: 7, length: 3, type: "AN", status: "C" },
    { name: "commodityNetQuantityPgaLineNet", start: 8, end: 19, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "unitOfMeasurePgaLineGross", start: 20, end: 22, length: 3, type: "AN", status: "C" },
    { name: "commodityGrossQuantityPgaLineGross", start: 23, end: 34, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "unitOfMeasureIndividualUnitNet", start: 35, end: 37, length: 3, type: "AN", status: "C" },
    { name: "commodityNetQuantityIndividualUnitNet", start: 38, end: 49, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "unitOfMeasureIndividualUnitGross", start: 50, end: 52, length: 3, type: "AN", status: "C" },
    { name: "commodityGrossQuantityIndividualUnitGross", start: 53, end: 64, length: 12, type: "N", status: "C", impliedDecimals: 2 },
    { name: "filler", start: 65, end: 80, length: 16, type: "X", status: "M" },
  ],
};

export const PG30_INSPECTION_LOCATION_SPEC: PgaRecordSpec = {
  recordType: "PG30",
  name: "Inspection / Lab Test / Arrival Location",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "inspectionLaboratoryTestingStatus", start: 5, end: 5, length: 1, type: "A", status: "M" },
    { name: "requestedOrScheduledDateOfInspection", start: 6, end: 13, length: 8, type: "N", status: "C" },
    { name: "requestedOrScheduledTimeOfInspection", start: 14, end: 17, length: 4, type: "N", status: "C" },
    { name: "inspectionOrArrivalLocationCode", start: 18, end: 21, length: 4, type: "AN", status: "C" },
    { name: "inspectionOrArrivalLocation", start: 22, end: 71, length: 50, type: "X", status: "C" },
    { name: "filler", start: 72, end: 80, length: 9, type: "X", status: "M" },
  ],
};

export const PG32_COMMODITY_ROUTING_SPEC: PgaRecordSpec = {
  recordType: "PG32",
  name: "Commodity Routing",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "commodityRoutingTypeCode", start: 5, end: 7, length: 3, type: "AN", status: "M" },
    { name: "commodityRoutingCountryCode", start: 8, end: 9, length: 2, type: "A", status: "C" },
    { name: "commodityPoliticalSubunitOfRoutingQualifier", start: 10, end: 12, length: 3, type: "AN", status: "C" },
    { name: "commodityPoliticalSubunitOfRoutingNumber", start: 13, end: 21, length: 9, type: "X", status: "C" },
    { name: "commodityPoliticalSubunitOfRoutingName", start: 22, end: 76, length: 55, type: "X", status: "C" },
    { name: "filler", start: 77, end: 80, length: 4, type: "X", status: "M" },
  ],
};

export const PG34_TRAVEL_DOCUMENT_SPEC: PgaRecordSpec = {
  recordType: "PG34",
  name: "Travel Document",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "travelDocumentTypeCode", start: 5, end: 7, length: 3, type: "AN", status: "M" },
    { name: "travelDocumentNationality", start: 8, end: 9, length: 2, type: "A", status: "C" },
    { name: "travelDocumentIdentifier", start: 10, end: 44, length: 35, type: "X", status: "C" },
    { name: "filler", start: 45, end: 80, length: 36, type: "X", status: "M" },
  ],
};

export const PG50_GROUP_START_SPEC: PgaRecordSpec = {
  recordType: "PG50",
  name: "Start of Grouping",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "filler", start: 5, end: 80, length: 76, type: "X", status: "M" },
  ],
};

export const PG51_GROUP_END_SPEC: PgaRecordSpec = {
  recordType: "PG51",
  name: "End of Grouping",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "filler", start: 5, end: 80, length: 76, type: "X", status: "M" },
  ],
};

export const PG55_ADDITIONAL_ENTITY_ROLES_SPEC: PgaRecordSpec = {
  recordType: "PG55",
  name: "Additional Entity Roles",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "entityRoleCode1", start: 5, end: 7, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode2", start: 8, end: 10, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode3", start: 11, end: 13, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode4", start: 14, end: 16, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode5", start: 17, end: 19, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode6", start: 20, end: 22, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode7", start: 23, end: 25, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode8", start: 26, end: 28, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode9", start: 29, end: 31, length: 3, type: "AN", status: "C" },
    { name: "entityRoleCode10", start: 32, end: 34, length: 3, type: "AN", status: "C" },
    { name: "filler", start: 35, end: 80, length: 46, type: "X", status: "M" },
  ],
};

export const PG60_ADDITIONAL_REFERENCE_SPEC: PgaRecordSpec = {
  recordType: "PG60",
  name: "Additional Reference Information",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "additionalInformationQualifierCode", start: 5, end: 7, length: 3, type: "AN", status: "M" },
    { name: "additionalInformation", start: 8, end: 80, length: 73, type: "X", status: "M" },
  ],
};

export const PG00_SUBSTITUTION_SPEC: PgaRecordSpec = {
  recordType: "PG00",
  name: "Substitution Grouping",
  length: 80,
  fields: [
    { name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" },
    { name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" },
    { name: "substitutionIndicator", start: 5, end: 5, length: 1, type: "X", status: "M" },
    { name: "substitutionNumber", start: 6, end: 9, length: 4, type: "AN", status: "M" },
    { name: "filler", start: 10, end: 80, length: 71, type: "X", status: "M" },
  ],
};

export const ALL_GENERIC_PGA_SPECS: PgaRecordSpec[] = [
  OI_LINE_ITEM_SPEC,
  PG01_HEADER_SPEC,
  PG02_PRODUCT_COMPONENT_SPEC,
  PG04_CONSTITUENT_ELEMENT_SPEC,
  PG06_SOURCE_PROCESSING_SPEC,
  PG07_TRADE_NAME_MODEL_SPEC,
  PG08_ITEM_IDENTITY_OVERFLOW_SPEC,
  PG10_CATEGORY_CHARACTERISTIC_SPEC,
  PG13_LPCO_ISSUER_SPEC,
  PG14_LPCO_DETAILS_SPEC,
  PG18_HAZMAT_SPEC,
  PG19_ENTITY_IDENTIFICATION_SPEC,
  PG20_ENTITY_ADDRESS_SPEC,
  PG21_INDIVIDUAL_CONTACT_SPEC,
  PG22_IMPORTER_DECLARATION_SPEC,
  PG24_REMARKS_SPEC,
  PG25_TEMPERATURE_LOT_VALUES_SPEC,
  PG26_PACKAGING_BREAKDOWN_SPEC,
  PG27_SHIPPING_CONTAINER_SPEC,
  PG29_COMMODITY_QUANTITIES_SPEC,
  PG30_INSPECTION_LOCATION_SPEC,
  PG32_COMMODITY_ROUTING_SPEC,
  PG34_TRAVEL_DOCUMENT_SPEC,
  PG50_GROUP_START_SPEC,
  PG51_GROUP_END_SPEC,
  PG55_ADDITIONAL_ENTITY_ROLES_SPEC,
  PG60_ADDITIONAL_REFERENCE_SPEC,
  PG00_SUBSTITUTION_SPEC,
];

// ─────────────────────────────────────────────────────────────────────────────
// VITEST SUITE: 80-COLUMN LAYOUT & POSITION MATH VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

describe("PGA Message Set Generic Backbone Records — 80-Column Spec Validation", () => {
  it("covers exactly 28 generic cross-agency backbone records", () => {
    expect(ALL_GENERIC_PGA_SPECS.length).toBe(28);
  });

  it.each(ALL_GENERIC_PGA_SPECS.map((spec) => [spec.recordType, spec] as const))(
    "%s has length 80 and field lengths sum to exactly 80",
    (_recordType, spec) => {
      expect(spec.length).toBe(80);
      const totalFieldLength = spec.fields.reduce((sum, f) => sum + f.length, 0);
      expect(totalFieldLength).toBe(80);
    }
  );

  it.each(ALL_GENERIC_PGA_SPECS.map((spec) => [spec.recordType, spec] as const))(
    "%s fields have contiguous, non-overlapping positions covering 1 to 80",
    (_recordType, spec) => {
      let expectedStart = 1;
      for (const field of spec.fields) {
        expect(field.start).toBe(expectedStart);
        expect(field.end - field.start + 1).toBe(field.length);
        expectedStart = field.end + 1;
      }
      expect(expectedStart - 1).toBe(80);
    }
  );

  describe("Specific Field Layout Assertions against PDF Chapter 8", () => {
    it("OI Commercial Line Item Description positions match PDF p. 16", () => {
      const spec = OI_LINE_ITEM_SPEC;
      expect(spec.fields[0]).toEqual({ name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" });
      expect(spec.fields[1]).toEqual({ name: "filler", start: 3, end: 10, length: 8, type: "AN", status: "M" });
      expect(spec.fields[2]).toEqual({ name: "commercialDescription", start: 11, end: 80, length: 70, type: "X", status: "M" });
    });

    it("PG01 Header positions match PDF pp. 17-19", () => {
      const spec = PG01_HEADER_SPEC;
      expect(spec.fields[0]).toEqual({ name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" });
      expect(spec.fields[1]).toEqual({ name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" });
      expect(spec.fields[2]).toEqual({ name: "pgaLineNumber", start: 5, end: 7, length: 3, type: "N", status: "M" });
      expect(spec.fields[3]).toEqual({ name: "governmentAgencyCode", start: 8, end: 10, length: 3, type: "AN", status: "M" });
      expect(spec.fields[4]).toEqual({ name: "governmentAgencyProgramCode", start: 11, end: 13, length: 3, type: "X", status: "M" });
      expect(spec.fields[12]).toEqual({ name: "correctionIndicator", start: 79, end: 79, length: 1, type: "X", status: "C" });
      expect(spec.fields[13]).toEqual({ name: "disclaimer", start: 80, end: 80, length: 1, type: "A", status: "C" });
    });

    it("PG04 Constituent Element implied decimals match PDF p. 23", () => {
      const spec = PG04_CONSTITUENT_ELEMENT_SPEC;
      const qtyField = spec.fields.find((f) => f.name === "quantityOfConstituentElement");
      const pctField = spec.fields.find((f) => f.name === "percentOfConstituentElement");
      expect(qtyField?.impliedDecimals).toBe(2);
      expect(pctField?.impliedDecimals).toBe(4);
    });

    it("PG14 LPCO Quantity implied decimals match PDF p. 32", () => {
      const spec = PG14_LPCO_DETAILS_SPEC;
      const qtyField = spec.fields.find((f) => f.name === "lpcoQuantity");
      expect(qtyField?.impliedDecimals).toBe(4);
    });

    it("PG25 Temperature & Value implied decimals match PDF p. 41", () => {
      const spec = PG25_TEMPERATURE_LOT_VALUES_SPEC;
      const tempField = spec.fields.find((f) => f.name === "actualTemperature");
      const lineValField = spec.fields.find((f) => f.name === "pgaLineValue");
      const unitValField = spec.fields.find((f) => f.name === "pgaUnitValue");
      expect(tempField?.impliedDecimals).toBe(2);
      expect(lineValField?.impliedDecimals).toBe(0);
      expect(unitValField?.impliedDecimals).toBe(2);
    });

    it("PG27 Shipping Container positions match PDF p. 43 (including status cell omission noted)", () => {
      const spec = PG27_SHIPPING_CONTAINER_SPEC;
      expect(spec.fields[4]).toEqual({ name: "containerLength1", start: 26, end: 27, length: 2, type: "N", status: "C" });
      expect(spec.fields[spec.fields.length - 1]).toEqual({ name: "filler", start: 74, end: 80, length: 7, type: "X", status: "C" });
    });

    it("PG00 Substitution Grouping positions match PDF p. 59", () => {
      const spec = PG00_SUBSTITUTION_SPEC;
      expect(spec.fields[0]).toEqual({ name: "controlIdentifier", start: 1, end: 2, length: 2, type: "A", status: "M" });
      expect(spec.fields[1]).toEqual({ name: "recordType", start: 3, end: 4, length: 2, type: "N", status: "M" });
      expect(spec.fields[2]).toEqual({ name: "substitutionIndicator", start: 5, end: 5, length: 1, type: "X", status: "M" });
      expect(spec.fields[3]).toEqual({ name: "substitutionNumber", start: 6, end: 9, length: 4, type: "AN", status: "M" });
      expect(spec.fields[4]).toEqual({ name: "filler", start: 10, end: 80, length: 71, type: "X", status: "M" });
    });
  });
});
