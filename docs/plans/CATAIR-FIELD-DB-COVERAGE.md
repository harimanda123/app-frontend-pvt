# CATAIR Field → Database Coverage Assessment

## Executive Summary Table

| Chapter | Total Fields Assessed | COVERED | PARTIAL | MISSING | NOT APPLICABLE |
| :--- | :---: | :---: | :---: | :---: | :---: |
| [1. Batch & Block Control](src/lib/abi/batchBlockControl/types.ts) | 76 | 0 | 0 | 0 | 76 |
| [2. Entry Summary (7501)](src/lib/abi/entrySummary/types.ts) | 238 | 24 | 77 | 112 | 25 |
| [3. Entry Summary Query](src/lib/abi/entrySummaryQuery/types.ts) | 134 | 6 | 21 | 0 | 107 |
| [4. Cargo Release (3461)](src/lib/abi/cargoRelease/types.ts) | 69 | 13 | 24 | 29 | 3 |
| [5. Daily & Periodic Monthly Statement](src/lib/abi/statement/types.ts) | 88 | 0 | 74 | 1 | 13 |
| [6. eBond](src/lib/abi/ebond/types.ts) | 45 | 7 | 25 | 9 | 4 |
| [7. Drawback (7553)](src/lib/abi/drawback/types.ts) | 158 | 16 | 53 | 76 | 13 |
| [8. PGA Message Set](src/lib/abi/pgaMessageSet/types.ts) | 178 | 10 | 62 | 106 | 0 |
| [9. ACE Broker Download](src/lib/abi/brokerDownload/types.ts) | 134 | 24 | 26 | 58 | 26 |
| [10. Cargo Manifest / Entry Status Query](src/lib/abi/cargoManifestQuery/types.ts) | 178 | 9 | 8 | 0 | 161 |
| [11. In-Bond (7512)](src/lib/abi/inBond/types.ts) | 76 | 9 | 10 | 31 | 26 |
| [12. Importer / Bond Query](src/lib/abi/importerBondQuery/types.ts) | 45 | 5 | 0 | 0 | 40 |
| **Total** | **1419** | **123** | **380** | **422** | **494** |

## Overall Summary

Across all 12 CATAIR chapters, a total of **1419 fields** were assessed against the 196 models in `prisma/schema.prisma`. Excluding **494 protocol mechanics and CBP response/status fields** (classified as NOT APPLICABLE), the underlying business data layer contains **925 fields**. Of these active business fields, **123 fields (13.3%)** are fully **COVERED** by dedicated Prisma columns, **380 fields (41.1%)** are **PARTIAL** (captured via related generic fields, JSON blobs, or parent relations lacking granular sub-fields), and **422 fields (45.6%)** are completely **MISSING** from the database schema. The three chapters with the most severe database coverage gaps are **PGA Message Set** (106 missing fields out of 178 business fields), **Entry Summary** (112 missing fields out of 213 business fields), and **Drawback** (76 missing fields out of 145 business fields). Without targeted schema migrations to address these gaps, Qubere's CATAIR codec layer remains disconnected from production database storage, preventing users from populating complete real-world filings for PGAs, complex Entry Summaries, FTZ admissions, and Drawback claims.

## Chapter Assessment Details

### 1. Batch & Block Control

**Source file:** [`src/lib/abi/batchBlockControl/types.ts`](src/lib/abi/batchBlockControl/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `ARecordInput.senderReceiverSiteCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.senderReceiverIdCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.communicationPassword` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.transmissionDate` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.senderReceiverOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ARecordInput.transmitterUserDataText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ZRecordInput.senderReceiverSiteCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ZRecordInput.senderReceiverIdCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ZRecordInput.transmissionDate` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ZRecordInput.senderReceiverOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.processingDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.processingFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.processingFilerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.preparerDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.preparerFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.preparerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.preparerIndicator` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `BRecordInput.filerPreparerUserDataText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `YRecordInput.processingDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `YRecordInput.processingFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `YRecordInput.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `YRecordInput.processingFilerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.senderReceiverSiteCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.senderReceiverIdCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.transmissionDate` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.senderReceiverOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputARecord.transmitterUserDataText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputZRecord.senderReceiverSiteCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputZRecord.senderReceiverIdCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputZRecord.transmissionDate` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputZRecord.senderReceiverOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.processingDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.processingFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.processingFilerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.preparerDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.preparerFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.preparerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.preparerIndicator` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputBRecord.filerPreparerUserDataText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputYRecord.processingDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputYRecord.processingFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputYRecord.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputYRecord.outputTransactionImageCount` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `OutputYRecord.processingFilerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `AceGeneratedBRecord.recordIndicator` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `AceGeneratedYRecord.recordIndicator` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `AceGeneratedYRecord.outputTransactionImageCount` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `AceGeneratedZRecord.recordIndicator` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0BlockReference.referenceDataTypeCode` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0BlockReference.occurrencePosition` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0BlockReference.processingDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.processingFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.processingFilerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.applicationIdentifierCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.filerPreparerUserDataText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.preparerDistrictPortCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.preparerFilerCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.preparerOfficeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0BlockReference.preparerIndicator` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X0TransactionReference.referenceDataTypeCode` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0TransactionReference.occurrencePosition` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0TransactionReference.recordPositionInBatch` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X0TransactionReference.positionOfProblemInRecord` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `X1Record.dispositionTypeCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X1Record.severityCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X1Record.conditionCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X1Record.reasonCode` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X1Record.narrativeText` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `X1Record.isFinalDisposition` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ParsedBlock.header` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ParsedBlock.trailer` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |
| `ParsedBlock.transactionRecords` | **NOT APPLICABLE** | - | EDI batch envelope header/trailer protocol control mechanics |


### 2. Entry Summary (7501)

**Source file:** [`src/lib/abi/entrySummary/types.ts`](src/lib/abi/entrySummary/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `HeaderControlInput.summaryFilingActionRequestCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderControlInput.entryFilerCode` | **COVERED** | `CustomsProfile.filerCode` | Exact 3-char CBP Filer Code |
| `HeaderControlInput.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Exact entry number |
| `HeaderControlInput.districtPortOfEntry` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderControlInput.brokerReferenceNumber` | **MISSING** | - | Field 'brokerReferenceNumber' has no direct Prisma schema column |
| `HeaderControlInput.entryTypeCode` | **COVERED** | `CustomsFiling.entryType` | Exact entry type code |
| `HeaderControlInput.modeOfTransportationCode` | **MISSING** | - | Field 'modeOfTransportationCode' has no direct Prisma schema column |
| `HeaderControlInput.bondWaiverIndicator` | **MISSING** | - | Field 'bondWaiverIndicator' has no direct Prisma schema column |
| `HeaderControlInput.electronicSignature` | **MISSING** | - | Field 'electronicSignature' has no direct Prisma schema column |
| `HeaderControlInput.cargoReleaseCertificationRequestIndicator` | **MISSING** | - | Field 'cargoReleaseCertificationRequestIndicator' has no direct Prisma schema column |
| `HeaderControlInput.electronicInvoiceIndicator` | **MISSING** | - | Field 'electronicInvoiceIndicator' has no direct Prisma schema column |
| `HeaderControlInput.consolidatedSummaryIndicator` | **MISSING** | - | Field 'consolidatedSummaryIndicator' has no direct Prisma schema column |
| `HeaderControlInput.shipmentUsageTypeCode` | **MISSING** | - | Field 'shipmentUsageTypeCode' has no direct Prisma schema column |
| `HeaderControlInput.liveEntryIndicator` | **MISSING** | - | Field 'liveEntryIndicator' has no direct Prisma schema column |
| `HeaderControlInput.deferredTaxPaymentCode` | **MISSING** | - | Field 'deferredTaxPaymentCode' has no direct Prisma schema column |
| `HeaderControlInput.tradeAgreementReconciliationIndicator` | **MISSING** | - | Field 'tradeAgreementReconciliationIndicator' has no direct Prisma schema column |
| `HeaderControlInput.reconciliationIssueCode` | **MISSING** | - | Field 'reconciliationIssueCode' has no direct Prisma schema column |
| `HeaderControlInput.paymentTypeCode` | **MISSING** | - | Field 'paymentTypeCode' has no direct Prisma schema column |
| `HeaderControlInput.preliminaryStatementPrintDate` | **MISSING** | - | Field 'preliminaryStatementPrintDate' has no direct Prisma schema column |
| `HeaderControlInput.periodicStatementMonth` | **MISSING** | - | Field 'periodicStatementMonth' has no direct Prisma schema column |
| `HeaderControlInput.statementClientBranchIdentifier` | **MISSING** | - | Field 'statementClientBranchIdentifier' has no direct Prisma schema column |
| `HeaderControlInput.bondWaiverReasonCode` | **MISSING** | - | Field 'bondWaiverReasonCode' has no direct Prisma schema column |
| `HeaderControlInput.postSummaryCorrectionIndicator` | **MISSING** | - | Field 'postSummaryCorrectionIndicator' has no direct Prisma schema column |
| `HeaderControlInput.acceleratedLiquidationRequestIndicator` | **MISSING** | - | Field 'acceleratedLiquidationRequestIndicator' has no direct Prisma schema column |
| `HeaderControlInput.knownImporterIndicator` | **MISSING** | - | Field 'knownImporterIndicator' has no direct Prisma schema column |
| `HeaderControlInput.pgaDataIncludedIndicator` | **MISSING** | - | Field 'pgaDataIncludedIndicator' has no direct Prisma schema column |
| `HeaderControlInput.tibDeclarationIndicator` | **MISSING** | - | Field 'tibDeclarationIndicator' has no direct Prisma schema column |
| `HeaderControlInput.consolidatedExpressInformalIndicator` | **MISSING** | - | Field 'consolidatedExpressInformalIndicator' has no direct Prisma schema column |
| `HeaderContentInput.importerOfRecordNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderContentInput.consigneeNumber` | **PARTIAL** | `Shipment.consigneeName` | Consignee party exists on Shipment/Party, but lacks explicit CBP EIN/IRS qualifier on Shipment model |
| `HeaderContentInput.designatedNotifyPartyNumber` | **MISSING** | - | Field 'designatedNotifyPartyNumber' has no direct Prisma schema column |
| `HeaderContentInput.estimatedEntryDate` | **MISSING** | - | Field 'estimatedEntryDate' has no direct Prisma schema column |
| `HeaderContentInput.dateOfImportation` | **MISSING** | - | Field 'dateOfImportation' has no direct Prisma schema column |
| `HeaderContentInput.usStateOfDestinationCode` | **MISSING** | - | Field 'usStateOfDestinationCode' has no direct Prisma schema column |
| `HeaderContentInput.foreignTradeZoneIdentifier` | **MISSING** | - | Field 'foreignTradeZoneIdentifier' has no direct Prisma schema column |
| `LineItemHeaderInput.lineItemIdentifier` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineItemHeaderInput.articleSetIndicator` | **MISSING** | - | Field 'articleSetIndicator' has no direct Prisma schema column |
| `LineItemHeaderInput.countryOfOriginCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineItemHeaderInput.countryOfExportCode` | **MISSING** | - | Field 'countryOfExportCode' has no direct Prisma schema column |
| `LineItemHeaderInput.dateOfExportation` | **MISSING** | - | Field 'dateOfExportation' has no direct Prisma schema column |
| `LineItemHeaderInput.dateOfExportationForTextiles` | **MISSING** | - | Field 'dateOfExportationForTextiles' has no direct Prisma schema column |
| `LineItemHeaderInput.tradeAgreementSpecialProgramClaimCode` | **MISSING** | - | Field 'tradeAgreementSpecialProgramClaimCode' has no direct Prisma schema column |
| `LineItemHeaderInput.chargesAmount` | **MISSING** | - | Field 'chargesAmount' has no direct Prisma schema column |
| `LineItemHeaderInput.foreignPortOfLadingCode` | **MISSING** | - | Field 'foreignPortOfLadingCode' has no direct Prisma schema column |
| `LineItemHeaderInput.grossShippingWeight` | **MISSING** | - | Field 'grossShippingWeight' has no direct Prisma schema column |
| `LineItemHeaderInput.categoryCodeForTextiles` | **MISSING** | - | Field 'categoryCodeForTextiles' has no direct Prisma schema column |
| `LineItemHeaderInput.productClaimCode` | **MISSING** | - | Field 'productClaimCode' has no direct Prisma schema column |
| `LineItemHeaderInput.relatedPartyIndicator` | **MISSING** | - | Field 'relatedPartyIndicator' has no direct Prisma schema column |
| `LineItemHeaderInput.naftaNetCostIndicator` | **MISSING** | - | Field 'naftaNetCostIndicator' has no direct Prisma schema column |
| `LineItemHeaderInput.feeExemptionCode` | **MISSING** | - | Field 'feeExemptionCode' has no direct Prisma schema column |
| `LineItemHeaderInput.adCaseNonReimbursementStatement` | **MISSING** | - | Field 'adCaseNonReimbursementStatement' has no direct Prisma schema column |
| `TariffDetailInput.htsNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `TariffDetailInput.dutyAmount` | **COVERED** | `CustomsFiling.dutyAmount` | Exact duty amount scalar |
| `TariffDetailInput.valueOfGoodsAmount` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `TariffDetailInput.quantity1` | **MISSING** | - | Field 'quantity1' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `TariffDetailInput.quantity2` | **MISSING** | - | Field 'quantity2' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode2` | **MISSING** | - | Field 'unitOfMeasureCode2' has no direct Prisma schema column |
| `TariffDetailInput.quantity3` | **MISSING** | - | Field 'quantity3' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode3` | **MISSING** | - | Field 'unitOfMeasureCode3' has no direct Prisma schema column |
| `TariffDetailInput.ftzPrivilegedStatusDetail` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FeeTotalEntry.accountingClassCode` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalEntry.totalFeeAmount` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.accountingClassCode1` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.totalFeeAmount1` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.accountingClassCode2` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.totalFeeAmount2` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.accountingClassCode3` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.totalFeeAmount3` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.accountingClassCode4` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.totalFeeAmount4` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.accountingClassCode5` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `FeeTotalInput.totalFeeAmount5` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `BondDetailInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BondDetailInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BondDetailInput.continuousBondIndicator` | **MISSING** | - | Field 'continuousBondIndicator' has no direct Prisma schema column |
| `BondDetailInput.suretyCompanyCode` | **COVERED** | `Bond.suretyCode` | Exact surety code on Bond |
| `BondDetailInput.singleTransactionBondAmount` | **MISSING** | - | Field 'singleTransactionBondAmount' has no direct Prisma schema column |
| `BondDetailInput.singleTransactionBondProducerAccountNumber` | **MISSING** | - | Field 'singleTransactionBondProducerAccountNumber' has no direct Prisma schema column |
| `FtzStatusInput.ftzMerchandiseStatusCode` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzStatusInput.privilegedFtzMerchandiseFilingDate` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzStatusInput.ftzLineItemQuantity` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzPrivilegedStatusDetailInput.currentHtsNumber` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `AdcvdCaseDetailInput.caseNumber` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdCaseDetailInput.bondCashClaimCode` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdCaseDetailInput.caseDepositRate` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdCaseDetailInput.caseRateTypeQualifierCode` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdCaseDetailInput.valueOfGoodsAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdCaseDetailInput.quantity` | **COVERED** | `ShipmentLineItem.quantity` | Exact quantity scalar |
| `AdcvdCaseDetailInput.dutyAmount` | **COVERED** | `CustomsFiling.dutyAmount` | Exact duty amount scalar |
| `AdcvdCaseDetailInput.nonReimbursementDeclarationIdentifier` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdDutyTotalsInput.totalBondedAdDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdDutyTotalsInput.totalCashDepositAdDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdDutyTotalsInput.totalBondedCvDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `AdcvdDutyTotalsInput.totalCashDepositCvDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `GrandTotalsInput.grandTotalDutyAmount` | **MISSING** | - | Field 'grandTotalDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalUserFeeAmount` | **MISSING** | - | Field 'grandTotalUserFeeAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalIrTaxAmount` | **MISSING** | - | Field 'grandTotalIrTaxAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalAdDutyAmount` | **MISSING** | - | Field 'grandTotalAdDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalCvDutyAmount` | **MISSING** | - | Field 'grandTotalCvDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalOtherRevenueAmount` | **MISSING** | - | Field 'grandTotalOtherRevenueAmount' has no direct Prisma schema column |
| `LineEntityGroupInput.entity` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineEntityGroupInput.gbiIdentifiers` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `LineEntityGroupInput.streetAddresses` | **MISSING** | - | Field 'streetAddresses' has no direct Prisma schema column |
| `LineEntityGroupInput.geographicArea` | **MISSING** | - | Field 'geographicArea' has no direct Prisma schema column |
| `EipInvoiceGroupInput.invoice` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EipInvoiceGroupInput.ruling` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist |
| `EipInvoiceGroupInput.commercialDescriptions` | **MISSING** | - | Field 'commercialDescriptions' has no direct Prisma schema column |
| `LineItemInput.header` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineItemInput.ftzStatus` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `LineItemInput.eipInvoices` | **MISSING** | - | Field 'eipInvoices' has no direct Prisma schema column |
| `LineItemInput.invoices` | **MISSING** | - | Field 'invoices' has no direct Prisma schema column |
| `LineItemInput.ruling` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist |
| `LineItemInput.rulings` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist |
| `LineItemInput.commercialDescriptions` | **MISSING** | - | Field 'commercialDescriptions' has no direct Prisma schema column |
| `LineItemInput.articleParties` | **MISSING** | - | Field 'articleParties' has no direct Prisma schema column |
| `LineItemInput.entities` | **MISSING** | - | Field 'entities' has no direct Prisma schema column |
| `LineItemInput.tariffDetails` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineItemInput.standardVisa` | **MISSING** | - | Field 'standardVisa' has no direct Prisma schema column |
| `LineItemInput.licenseCertificatePermit` | **MISSING** | - | Field 'licenseCertificatePermit' has no direct Prisma schema column |
| `LineItemInput.licenses` | **MISSING** | - | Field 'licenses' has no direct Prisma schema column |
| `LineItemInput.adcvdCases` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `LineItemInput.importersAdditionalDeclarations` | **MISSING** | - | Field 'importersAdditionalDeclarations' has no direct Prisma schema column |
| `LineItemInput.irTax` | **MISSING** | - | Field 'irTax' has no direct Prisma schema column |
| `LineItemInput.otherRevenue` | **MISSING** | - | Field 'otherRevenue' has no direct Prisma schema column |
| `LineItemInput.userFees` | **MISSING** | - | Field 'userFees' has no direct Prisma schema column |
| `LineItemInput.pscLineReasons` | **MISSING** | - | Field 'pscLineReasons' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerControl` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntrySummaryTransactionInput.headerContent` | **MISSING** | - | Field 'headerContent' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.bonds` | **MISSING** | - | Field 'bonds' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerFees` | **MISSING** | - | Field 'headerFees' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.pscHeaderReasons` | **MISSING** | - | Field 'pscHeaderReasons' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.pscFilingExplanations` | **MISSING** | - | Field 'pscFilingExplanations' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerEntities` | **MISSING** | - | Field 'headerEntities' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.lineItems` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntrySummaryTransactionInput.adcvdDutyTotals` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns |
| `EntrySummaryTransactionInput.feeTotals` | **MISSING** | - | Field 'feeTotals' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.grandTotals` | **MISSING** | - | Field 'grandTotals' has no direct Prisma schema column |
| `InvoiceLineReferenceInput.supplierIdCode` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceNumber` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange1Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange1End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange2Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange2End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange3Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange3End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange4Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `InvoiceLineReferenceInput.invoiceLineRange4End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage |
| `RulingsDetailInput.rulingTypeCode` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist |
| `RulingsDetailInput.rulingNumber` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist |
| `CommercialDescriptionInput.commercialDescriptionText` | **COVERED** | `ShipmentLineItem.commercialDescription` | Commercial description text |
| `LicenseCertificatePermitInput.licenseCertificatePermitTypeCode` | **PARTIAL** | `ShipmentLineItem.isPgaRequired` | PGA indicator exists, but specific Steel/Aluminum import license numbers (type codes 01, 28) lack line item schema fields |
| `LicenseCertificatePermitInput.licenseCertificatePermitNumber` | **PARTIAL** | `ShipmentLineItem.isPgaRequired` | PGA indicator exists, but specific Steel/Aluminum import license numbers (type codes 01, 28) lack line item schema fields |
| `LineEntityInput.entityCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineEntityInput.entityName` | **MISSING** | - | Field 'entityName' has no direct Prisma schema column |
| `LineEntityInput.entityIdentifierQualifier` | **MISSING** | - | Field 'entityIdentifierQualifier' has no direct Prisma schema column |
| `LineEntityInput.entityIdentifier` | **MISSING** | - | Field 'entityIdentifier' has no direct Prisma schema column |
| `LineEntityGbiInput.gbiIdentifierQualifier` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `LineEntityGbiInput.identifier` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `LineEntityGbiInput.partyTypeDescriptions` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `GbiPartyTypeDescriptionInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `GbiPartyTypeDescriptionInput.description` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `LineEntityStreetAddressInput.addressComponentQualifier1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineEntityStreetAddressInput.addressInformation1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineEntityStreetAddressInput.addressComponentQualifier2` | **MISSING** | - | Field 'addressComponentQualifier2' has no direct Prisma schema column |
| `LineEntityStreetAddressInput.addressInformation2` | **MISSING** | - | Field 'addressInformation2' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.cityName` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineEntityGeographicAreaInput.countrySubEntityCode` | **MISSING** | - | Field 'countrySubEntityCode' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.postalCode` | **MISSING** | - | Field 'postalCode' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.countryCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderEntityGroupInput.entity` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderEntityGroupInput.gbiIdentifiers` | **PARTIAL** | `PartyIdentifier.identifier` | Global Business Identifier (LEI/GLN/DUNS) supported via PartyIdentifier, but line-level GBI party type description array is missing |
| `HeaderEntityGroupInput.streetAddresses` | **MISSING** | - | Field 'streetAddresses' has no direct Prisma schema column |
| `HeaderEntityGroupInput.geographicArea` | **MISSING** | - | Field 'geographicArea' has no direct Prisma schema column |
| `ArticlePartyInput.partyTypeCode` | **PARTIAL** | `ShipmentParty.partyId` | ShipmentParty relation exists, but article-level party type codes (M/C/S/E) require enum mapping |
| `ArticlePartyInput.partyIdentifier` | **PARTIAL** | `ShipmentParty.partyId` | ShipmentParty relation exists, but article-level party type codes (M/C/S/E) require enum mapping |
| `StandardVisaInput.standardVisaNumber` | **MISSING** | - | Standard textile visa numbers have no schema column |
| `ImportersAdditionalDeclarationInput.declarationTypeCode` | **MISSING** | - | Softwood lumber and export price 76-char declaration payloads (type codes 01-12) have no dedicated schema fields |
| `ImportersAdditionalDeclarationInput.declarationInformation` | **MISSING** | - | Softwood lumber and export price 76-char declaration payloads (type codes 01-12) have no dedicated schema fields |
| `HeaderFeesInput.accountingClassCode1` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `HeaderFeesInput.headerFeeAmount1` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `HeaderFeesInput.accountingClassCode2` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `HeaderFeesInput.headerFeeAmount2` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `LineUserFeeInput.accountingClassCode` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `LineUserFeeInput.userFeeAmount` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `IrTaxInput.accountingClassCode` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `IrTaxInput.irTaxAmount` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `OtherRevenueInput.accountingClassCode` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `OtherRevenueInput.otherRevenueAmount` | **PARTIAL** | `CustomsFiling.feeAmount` | Prisma has single aggregate feeAmount/taxAmount scalar; lacks itemized accounting class codes (e.g. 499 HMF, 501 MPF, 311 Cotton) |
| `PscHeaderReasonsInput.reasonCode1` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscHeaderReasonsInput.reasonCode2` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscHeaderReasonsInput.reasonCode3` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscHeaderReasonsInput.reasonCode4` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscHeaderReasonsInput.reasonCode5` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscFilingExplanationInput.explanationText` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscLineReasonsInput.reasonCode1` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscLineReasonsInput.reasonCode2` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscLineReasonsInput.reasonCode3` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscLineReasonsInput.reasonCode4` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `PscLineReasonsInput.reasonCode5` | **COVERED** | `PostSummaryCorrection.headerReasons` | PostSummaryCorrection model captures PSC header/line reasons and explanation |
| `CensusWarningOverrideInput.conditionCode1` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode1` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode2` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode2` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode3` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode3` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode4` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode4` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode5` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode5` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode6` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode6` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.conditionCode7` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `CensusWarningOverrideInput.overrideCode7` | **MISSING** | - | Census warning condition and override code pairs (up to 7 per entry) are missing from CustomsFiling |
| `E0SummaryReference.referenceDataTypeCode` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `E0SummaryReference.occurrencePosition` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `E0SummaryReference.entryFilerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E0SummaryReference.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E0SummaryReference.brokerReferenceNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E0SummaryReference.cbpTeamNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E0OtherReference.referenceDataTypeCode` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `E0OtherReference.occurrencePosition` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `E0OtherReference.referenceDataText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.dispositionTypeCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.severityCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.conditionCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.reasonCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.narrativeText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.entryFilerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.versionNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.brokerReferenceNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `E1Record.isFinalDisposition` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EntrySummaryCondition.references` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EntrySummaryCondition.condition` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `ParsedEntrySummaryResponse.scenario` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `ParsedEntrySummaryResponse.conditions` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `ParsedEntrySummaryResponse.finalDisposition` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |


### 3. Entry Summary Query

**Source file:** [`src/lib/abi/entrySummaryQuery/types.ts`](src/lib/abi/entrySummaryQuery/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `DetailReturnRequestInput.returnDetailRequestIndicator` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryReference.entryFilerCode` | **COVERED** | `CustomsFiling.entryNumber` | Query input filters map to CustomsFiling/ImporterOfRecord parameters |
| `EntryReference.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Query input filters map to CustomsFiling/ImporterOfRecord parameters |
| `EntryNumberQueryRequestInput.entryFilerCode1` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryNumber1` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryFilerCode2` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryNumber2` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryFilerCode3` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryNumber3` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryFilerCode4` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryNumber4` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryFilerCode5` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `EntryNumberQueryRequestInput.entryNumber5` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.criteriaQueryTypeCode` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.requestedFromDateTime` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.requestedToDateTime` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.entrySummariesFlag` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.ftaReconSummariesFlag` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.otherReconSummariesFlag` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.drawbackSummariesFlag` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.dutyDeferralSummariesFlag` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryRequestInput.collectionBillInformationCode` | **PARTIAL** | `CustomsFiling.status` | Query filter parameters map to filing state criteria |
| `CriteriaQueryResponseHeader.criteriaQueryTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CriteriaQueryResponseHeader.requestedFromDateTime` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CriteriaQueryResponseHeader.requestedToDateTime` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.entryFilerCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.entryNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.versionNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.acceptDateTime` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.pscIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.pscAcceptDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.ownershipDataReturnedIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusInfo.liquidationStatusCode` | **PARTIAL** | `CustomsFiling.status` | Liquidation status mapped to filing state |
| `EntrySummaryStatusInfo.liquidationDate` | **COVERED** | `Protest.liquidationDate` | Liquidation date captured in Protest model |
| `EntrySummaryStatusInfo.centerId` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `QueryReturnedCondition.conditionCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `QueryReturnedCondition.reasonCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `QueryReturnedCondition.narrativeText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `QueryReturnedCondition.entryFilerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `QueryReturnedCondition.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `QueryReturnedCondition.districtPortOfEntry` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EntrySummaryStatusDetail.entrySummaryControlStatus` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.entrySummaryStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.entrySummaryStatusDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.lateFilingStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.releaseStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.releaseDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.collectionStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.collectionDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionNoticeDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.censusHeaderStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.invoiceStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.protestStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.quotaStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.tradeAgreementReconciliationFilerCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.tradeAgreementReconciliationEntryNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.otherReconciliationFilerCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.otherReconciliationEntryNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionStatusCode1` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionStatusCode2` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionStatusCode3` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryStatusDetail.extensionSuspensionStatusCode4` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.cbpReviewIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.entryDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidatedDuty` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidatedTax` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidatedFees` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidatedInterest` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidatedAdCvd` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidationReasonCode1` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidationReasonCode2` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.liquidationReasonCode3` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `LiquidationInfo.immediateDeliveryIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EstimatedRevenueInfo.estimatedDuty` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EstimatedRevenueInfo.estimatedTax` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EstimatedRevenueInfo.estimatedFees` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EstimatedRevenueInfo.estimatedInterest` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EstimatedRevenueInfo.estimatedAdCvd` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.importerOfRecordNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.entryTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.rejectDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.acceleratedDrawbackIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.electronicInvoiceIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.districtPortOfEntry` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryFilingInfo.entrySummaryFilingDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `WarehouseAndLineInfo.numberOfWithdrawals` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `WarehouseAndLineInfo.warehouseFinalWithdrawalIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `WarehouseAndLineInfo.importSpecialistTeam` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `WarehouseAndLineInfo.centerId` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `WarehouseAndLineInfo.numberOfLineItems` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `FormReferenceInfo.cbpForm4811ReferenceNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `FormReferenceInfo.preliminaryStatementPrintDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `FormReferenceInfo.brokerReferenceNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model |
| `BondSuretyInfo.primarySuretyIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondDesignationTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.multipleBondsIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondNumber` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model |
| `BondSuretyInfo.singleEntryBondAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.suretyLiabilityAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.billNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.billDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.billTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.billCollectionStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.totalBillAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.paidAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.principalAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BillDetailStatusInfo.interestAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CollectionDetailStatusInfo.collectionDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CollectionDetailStatusInfo.totalAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CollectionClassCodeDetailInfo.classCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CollectionClassCodeDetailInfo.classCodeAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model |
| `SuretyBillDetailStatusInfo.primarySuretyIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.report612Date` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.billNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.billDate` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.billTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.billCollectionStatusCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.totalBillAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.paidAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.principalAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `SuretyBillDetailStatusInfo.interestAmount` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `CbpLineNumberInfo.cbpLineNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsLineItem.cbpLineNumber` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsLineItem.header` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsLineItem.tariffDetails` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsGrouping.headerControl` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsGrouping.headerContent` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsGrouping.lineItems` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsGrouping.feeTotals` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `EntrySummaryDetailsGrouping.grandTotals` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |


### 4. Cargo Release (3461)

**Source file:** [`src/lib/abi/cargoRelease/types.ts`](src/lib/abi/cargoRelease/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `HeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderInput.entryFilerCode` | **COVERED** | `CustomsProfile.filerCode` | Filer code on CustomsProfile |
| `HeaderInput.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Entry number |
| `HeaderInput.entryTypeCode` | **COVERED** | `CustomsFiling.entryType` | Entry type code |
| `HeaderInput.importerOfRecordType` | **MISSING** | - | Field 'importerOfRecordType' has no direct Prisma schema column |
| `HeaderInput.importerOfRecordNumber` | **MISSING** | - | Field 'importerOfRecordNumber' has no direct Prisma schema column |
| `HeaderInput.modeOfTransportationCode` | **MISSING** | - | Field 'modeOfTransportationCode' has no direct Prisma schema column |
| `HeaderInput.bondTypeCode` | **MISSING** | - | Field 'bondTypeCode' has no direct Prisma schema column |
| `HeaderInput.estimatedEntryValue` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderInput.plannedPortOfEntry` | **MISSING** | - | Field 'plannedPortOfEntry' has no direct Prisma schema column |
| `HeaderInput.splitShipmentReleaseCode` | **MISSING** | - | Field 'splitShipmentReleaseCode' has no direct Prisma schema column |
| `HeaderInput.portOfUnlading` | **MISSING** | - | Field 'portOfUnlading' has no direct Prisma schema column |
| `AdditionalHeaderInput.entryDateElectionCode` | **MISSING** | - | Field 'entryDateElectionCode' has no direct Prisma schema column |
| `AdditionalHeaderInput.electedEntryDate` | **MISSING** | - | Field 'electedEntryDate' has no direct Prisma schema column |
| `AdditionalHeaderInput.locationOfGoodsFirms` | **MISSING** | - | Field 'locationOfGoodsFirms' has no direct Prisma schema column |
| `AdditionalHeaderInput.electedExamSiteFirms` | **MISSING** | - | Field 'electedExamSiteFirms' has no direct Prisma schema column |
| `AdditionalHeaderInput.conveyanceNameOrFtzId` | **MISSING** | - | Field 'conveyanceNameOrFtzId' has no direct Prisma schema column |
| `AdditionalHeaderInput.voyageFlightTripManifestNumber` | **MISSING** | - | Field 'voyageFlightTripManifestNumber' has no direct Prisma schema column |
| `AdditionalHeaderInput.generalOrderNumber` | **MISSING** | - | Field 'generalOrderNumber' has no direct Prisma schema column |
| `AdditionalHeaderInput.cbpBondedWarehouseFirms` | **MISSING** | - | Field 'cbpBondedWarehouseFirms' has no direct Prisma schema column |
| `AdditionalHeaderInput.originatingWarehouseEntryFilerCode` | **MISSING** | - | Field 'originatingWarehouseEntryFilerCode' has no direct Prisma schema column |
| `AdditionalHeaderInput.originatingWarehouseEntryNumber` | **MISSING** | - | Field 'originatingWarehouseEntryNumber' has no direct Prisma schema column |
| `AdditionalHeaderInput.immediateDeliveryIndicator` | **MISSING** | - | Field 'immediateDeliveryIndicator' has no direct Prisma schema column |
| `ContactCancellationInput.contactName` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `ContactCancellationInput.contactPhone` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `ContactCancellationInput.cancellationReasonCode` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `ContactCancellationInput.multipleCargoDispositionsIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `ContactCancellationInput.disIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `ContactCancellationInput.splitShipmentIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata |
| `BillOfLadingInput.billTypeIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingInput.issuerCodeOfBillOfLadingNumber` | **MISSING** | - | Field 'issuerCodeOfBillOfLadingNumber' has no direct Prisma schema column |
| `BillOfLadingInput.billOfLadingNumber` | **COVERED** | `Shipment.bolNumber` | Bill of lading number |
| `BillOfLadingInput.quantity` | **COVERED** | `Shipment.packageCount` | Package count quantity |
| `BillOfLadingInput.nonAmsIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInput.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier code |
| `ConveyanceInput.voyageFlightTripManifestNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInput.dateOfArrival` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInput.quantity` | **COVERED** | `Shipment.packageCount` | Package count quantity |
| `ConveyanceInput.unitOfMeasure` | **MISSING** | - | Field 'unitOfMeasure' has no direct Prisma schema column |
| `ConveyanceInput.conveyanceName` | **MISSING** | - | Field 'conveyanceName' has no direct Prisma schema column |
| `ReferenceInput.referenceIdentifierQualifier` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ReferenceInput.referenceIdentifier` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityInput.entityCode` | **COVERED** | `Party.name` | Party and PartyAddress models capture entity identity and location |
| `EntityInput.entityName` | **COVERED** | `Party.name` | Party and PartyAddress models capture entity identity and location |
| `EntityInput.entityIdentifierQualifier` | **MISSING** | - | Field 'entityIdentifierQualifier' has no direct Prisma schema column |
| `EntityInput.entityIdentifier` | **MISSING** | - | Field 'entityIdentifier' has no direct Prisma schema column |
| `EntityAddressInput.addressComponentQualifier1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityAddressInput.addressInformation1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityAddressInput.addressComponentQualifier2` | **MISSING** | - | Field 'addressComponentQualifier2' has no direct Prisma schema column |
| `EntityAddressInput.addressInformation2` | **MISSING** | - | Field 'addressInformation2' has no direct Prisma schema column |
| `EntityGeoInput.cityName` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityGeoInput.countrySubEntityCode` | **MISSING** | - | Field 'countrySubEntityCode' has no direct Prisma schema column |
| `EntityGeoInput.postalCode` | **COVERED** | `Party.name` | Party and PartyAddress models capture entity identity and location |
| `EntityGeoInput.countryCode` | **COVERED** | `Party.name` | Party and PartyAddress models capture entity identity and location |
| `LineItemInput.lineItemIdentifier` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LineItemInput.countryOfOrigin` | **COVERED** | `ShipmentLineItem.countryOfOrigin` | Country of origin |
| `LineItemInput.commercialInvoiceDescription` | **MISSING** | - | Field 'commercialInvoiceDescription' has no direct Prisma schema column |
| `HtsLineInput.htsNumber` | **COVERED** | `ShipmentLineItem.htsCode` | HTS code |
| `HtsLineInput.lineItemValue` | **MISSING** | - | Field 'lineItemValue' has no direct Prisma schema column |
| `OutputDispositionInput.messageTypeCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputDispositionInput.messageIdentifierCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputDispositionInput.narrativeMessageText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EquipmentInput.equipmentNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityGbiInput.gbiIdentifierQualifier` | **PARTIAL** | `PartyIdentifier.identifier` | PartyIdentifier supports GBI codes |
| `EntityGbiInput.gbiIdentifier` | **PARTIAL** | `PartyIdentifier.identifier` | PartyIdentifier supports GBI codes |
| `FtzDetailInput.zoneStatus` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `FtzDetailInput.privilegedFtzMerchandiseFilingDate` | **MISSING** | - | Field 'privilegedFtzMerchandiseFilingDate' has no direct Prisma schema column |
| `FtzDetailInput.ftzLineItemQuantity` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `FtzPfHtsInput.currentHtsNumberForPfStatusMerchandise` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |


### 5. Daily & Periodic Monthly Statement

**Source file:** [`src/lib/abi/statement/types.ts`](src/lib/abi/statement/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `Q1DailyInput.districtPortOfEntrySummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.entryNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.importerOfRecordNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.preliminaryDailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.estimatedDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.estimatedTaxAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.deferredTaxIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.brokerReferenceNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.consolidatedIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.clientBranchDesignation` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1DailyInput.entryType` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.districtPortOfEntrySummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.entryNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.antidumpingDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.countervailingDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.paymentTypeIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.payIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.countervailingIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.antidumpingIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.teamNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2DailyInput.interestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `StatementFeeInput.firstFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.firstFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.secondFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.secondFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.thirdFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.thirdFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.fourthFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.fourthFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.fifthFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `StatementFeeInput.fifthFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.dailyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.dailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.importerOfRecordNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.totalEstimatedDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.totalEstimatedTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.totalDeferredTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3DailyInput.districtPortWhichProcessesEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalAmountDue` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalInterestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalNumberRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q4DailyInput.totalNumberNonRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalAmountPaid` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalInterestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalNumberRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6DailyInput.totalNumberNonRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q7DeletedInput.statementNumber` | **MISSING** | - | No dedicated Statement model or statementNumber column in schema |
| `Q7DeletedInput.entryFilerCode1` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryNumber1` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.deleteSource1` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryFilerCode2` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryNumber2` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.deleteSource2` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryFilerCode3` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryNumber3` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.deleteSource3` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryFilerCode4` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.entryNumber4` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q7DeletedInput.deleteSource4` | **NOT APPLICABLE** | - | CBP deleted statement notification record |
| `Q1PeriodicInput.periodicDailyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.periodicDailyStatementDistrictPort` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.periodicDailyStatementFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.periodicDailyStatementImporterNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.preliminaryPeriodicDailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.entrySummaryPresentationDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.totalDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q1PeriodicInput.totalTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2PeriodicInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2PeriodicInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q2PeriodicInput.totalAmountDue` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.periodicMonthlyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.periodicMonthlyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.periodicMonthlyStatementDueDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.periodicMonthlyStatementFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.periodicMonthlyStatementImporterNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.totalDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q3PeriodicInput.totalTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6PeriodicInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6PeriodicInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |
| `Q6PeriodicInput.totalAmountPaid` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table |


### 6. eBond

**Source file:** [`src/lib/abi/ebond/types.ts`](src/lib/abi/ebond/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `HeaderInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `HeaderInput.bondActivityCode` | **MISSING** | - | Field 'bondActivityCode' has no direct Prisma schema column |
| `HeaderInput.bondAmount` | **COVERED** | `Bond.bondAmount` | Bond amount |
| `HeaderInput.executionDate` | **MISSING** | - | Field 'executionDate' has no direct Prisma schema column |
| `HeaderInput.suretyReferenceNumber` | **MISSING** | - | Field 'suretyReferenceNumber' has no direct Prisma schema column |
| `HeaderInput.effectiveDate` | **COVERED** | `Bond.effectiveDate` | Effective date |
| `HeaderInput.terminationDate` | **MISSING** | - | Field 'terminationDate' has no direct Prisma schema column |
| `HeaderInput.bondNumber` | **COVERED** | `Bond.bondNumber` | Bond number |
| `HeaderInput.reconciliationBondRiderFlag` | **MISSING** | - | Field 'reconciliationBondRiderFlag' has no direct Prisma schema column |
| `HeaderInput.usviBondRiderFlag` | **MISSING** | - | Field 'usviBondRiderFlag' has no direct Prisma schema column |
| `SecondaryNotifyInput.secondaryNotifyPartyCode1` | **PARTIAL** | `ShipmentParty.partyId` | Secondary notify party supported via ShipmentParty |
| `SecondaryNotifyInput.secondaryNotifyPartyCode2` | **PARTIAL** | `ShipmentParty.partyId` | Secondary notify party supported via ShipmentParty |
| `SecondaryNotifyInput.secondaryNotifyPartyCode3` | **PARTIAL** | `ShipmentParty.partyId` | Secondary notify party supported via ShipmentParty |
| `SecondaryNotifyInput.secondaryNotifyPartyCode4` | **PARTIAL** | `ShipmentParty.partyId` | Secondary notify party supported via ShipmentParty |
| `SingleTransactionBondInput.transactionIdTypeCode` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model |
| `SingleTransactionBondInput.entryTypeCode` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model |
| `SingleTransactionBondInput.transactionId` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model |
| `PrincipalInput.principalIdNumberType` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `PrincipalInput.principalIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `PrincipalInput.principalName` | **COVERED** | `Bond.principalName` | Principal name |
| `CoPrincipalInput.coPrincipalIdNumberType` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `CoPrincipalInput.coPrincipalIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `CoPrincipalInput.coPrincipalName` | **MISSING** | - | Field 'coPrincipalName' has no direct Prisma schema column |
| `BondUserInput.bondUserIdNumberType` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `BondUserInput.bondUserIdNumber` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `BondUserInput.bondUserName` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `BondUserInput.userRiderActionCode` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `BondUserInput.userAddDate` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `BondUserInput.userDeleteDate` | **PARTIAL** | `User.id` | Bond user identity mapped to User model |
| `SuretyInput.suretyCode` | **COVERED** | `Bond.suretyCode` | Surety code |
| `SuretyInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `SuretyInput.suretyName` | **COVERED** | `Bond.suretyName` | Surety name |
| `SuretyInput.suretyLiabilityAmount` | **MISSING** | - | Field 'suretyLiabilityAmount' has no direct Prisma schema column |
| `CoSuretyInput.coSuretyCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `CoSuretyInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `CoSuretyInput.coSuretyName` | **MISSING** | - | Field 'coSuretyName' has no direct Prisma schema column |
| `CoSuretyInput.coSuretyLiabilityAmount` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ReinsurerInput.suretyCodeForReinsurer` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ReinsurerInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ReinsurerInput.suretyName` | **COVERED** | `Bond.suretyName` | Surety name |
| `OutputMessageInput.dispositionTypeCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.severityCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.conditionCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.narrativeText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |


### 7. Drawback (7553)

**Source file:** [`src/lib/abi/drawback/types.ts`](src/lib/abi/drawback/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `DrawbackHeaderInput.summaryFilingActionRequestCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.entryFilerCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.entryNumberOrDrawbackClaimNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.drawbackFilingPort` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.brokerReferenceNumber` | **MISSING** | - | Field 'brokerReferenceNumber' has no direct Prisma schema column |
| `DrawbackHeaderInput.drawbackProvision` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.bondWaiverIndicator` | **MISSING** | - | Field 'bondWaiverIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.bondWaiverReasonCode` | **MISSING** | - | Field 'bondWaiverReasonCode' has no direct Prisma schema column |
| `DrawbackHeaderInput.acceleratedPaymentRequestIndicator` | **MISSING** | - | Field 'acceleratedPaymentRequestIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.oneTimeWaiverIndicator` | **MISSING** | - | Field 'oneTimeWaiverIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.waiverPriorNotice` | **MISSING** | - | Field 'waiverPriorNotice' has no direct Prisma schema column |
| `DrawbackHeaderInput.commercialInterchangeability` | **MISSING** | - | Field 'commercialInterchangeability' has no direct Prisma schema column |
| `DrawbackHeaderInput.electronicPetroleumCertification` | **MISSING** | - | Field 'electronicPetroleumCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.electronicManufacturingPetroleumCertification` | **MISSING** | - | Field 'electronicManufacturingPetroleumCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.oilSpillTaxCertification` | **MISSING** | - | Field 'oilSpillTaxCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.naftaDrawbackClaimIndicator` | **MISSING** | - | Field 'naftaDrawbackClaimIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.electronicSignature` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.claimantIdOrImporterRecordNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `DrawbackHeaderInput.designatedNotifyPartyNumber` | **MISSING** | - | Field 'designatedNotifyPartyNumber' has no direct Prisma schema column |
| `DrawbackHeaderInput.substitutedUnusedWineCertification` | **MISSING** | - | Field 'substitutedUnusedWineCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.billOfMaterialsFormulaCertification` | **MISSING** | - | Field 'billOfMaterialsFormulaCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.certificationForValuationOfDestroyedMerchandise` | **MISSING** | - | Field 'certificationForValuationOfDestroyedMerchandise' has no direct Prisma schema column |
| `DrawbackHeaderInput.usmcaDrawbackClaimIndicator` | **MISSING** | - | Field 'usmcaDrawbackClaimIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.retailSalesSubstitutionIndicator` | **MISSING** | - | Field 'retailSalesSubstitutionIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.superfundTaxCertification` | **MISSING** | - | Field 'superfundTaxCertification' has no direct Prisma schema column |
| `BondInfoInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BondInfoInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BondInfoInput.suretyCompanyCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BondInfoInput.singleTransactionBondAmount` | **MISSING** | - | Field 'singleTransactionBondAmount' has no direct Prisma schema column |
| `BondInfoInput.singleTransactionBondNumber` | **MISSING** | - | Field 'singleTransactionBondNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.actionIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportsDetailsInput.entryFilerCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportsDetailsInput.entryNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportsDetailsInput.cbpEsLineNumber` | **MISSING** | - | Field 'cbpEsLineNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.drawbackEligibleIndicator` | **MISSING** | - | Field 'drawbackEligibleIndicator' has no direct Prisma schema column |
| `ImportsDetailsInput.manufactureRulingNumber` | **MISSING** | - | Field 'manufactureRulingNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.basisOfClaim` | **MISSING** | - | Field 'basisOfClaim' has no direct Prisma schema column |
| `ImportsDetailsInput.manufDateReceived` | **MISSING** | - | Field 'manufDateReceived' has no direct Prisma schema column |
| `ImportsDetailsInput.manufDateUsed` | **MISSING** | - | Field 'manufDateUsed' has no direct Prisma schema column |
| `ImportsDetailsInput.importTrackingIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportsDetailsInput.drawbackAccountingMethodCode` | **MISSING** | - | Field 'drawbackAccountingMethodCode' has no direct Prisma schema column |
| `ImportClassificationInput.htsNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportClassificationInput.articleDescriptionText` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportQuantityUomInput.quantity` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportQuantityUomInput.unitOfMeasureCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportQuantityUomInput.allowableQuantity` | **MISSING** | - | Field 'allowableQuantity' has no direct Prisma schema column |
| `ImportQuantityUomInput.enteredGoodsValuePerUnit` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ImportQuantityUomInput.substitutedValuePerUnit` | **MISSING** | - | Field 'substitutedValuePerUnit' has no direct Prisma schema column |
| `ImportRevenueClaimedInput.accountingClassCode` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `ImportRevenueClaimedInput.claimAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `ImportRevenueClaimedInput.calculatedAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `ImportRevenueClaimedInput.adjustedClaimedAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `ImportRevenueClaimedInput.qualifierIndicator` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `ManufacturedArticleInput.actionIndicator` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.importManufactureRulingNumber` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.htsNumber` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.quantity` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.unitOfMeasureCode` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.productionDate` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedArticleInput.factoryLocation` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedDescInput.manufacturedArticleDescriptionText` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedDescInput.manufactureRulingNumber` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ManufacturedDescInput.manufacturedTrackingIdNumber` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkImportMfgInput.importTrackingIdNumber1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `LinkImportMfgInput.importTrackingIdNumber2` | **MISSING** | - | Field 'importTrackingIdNumber2' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber3` | **MISSING** | - | Field 'importTrackingIdNumber3' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber4` | **MISSING** | - | Field 'importTrackingIdNumber4' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber5` | **MISSING** | - | Field 'importTrackingIdNumber5' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber6` | **MISSING** | - | Field 'importTrackingIdNumber6' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber7` | **MISSING** | - | Field 'importTrackingIdNumber7' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber8` | **MISSING** | - | Field 'importTrackingIdNumber8' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber9` | **MISSING** | - | Field 'importTrackingIdNumber9' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber10` | **MISSING** | - | Field 'importTrackingIdNumber10' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber11` | **MISSING** | - | Field 'importTrackingIdNumber11' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber12` | **MISSING** | - | Field 'importTrackingIdNumber12' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber13` | **MISSING** | - | Field 'importTrackingIdNumber13' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber14` | **MISSING** | - | Field 'importTrackingIdNumber14' has no direct Prisma schema column |
| `LinkImportMfgInput.importTrackingIdNumber15` | **MISSING** | - | Field 'importTrackingIdNumber15' has no direct Prisma schema column |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber1` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber2` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber3` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber4` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber5` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber6` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber7` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber8` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber9` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber10` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber11` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber12` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber13` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber14` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber15` | **PARTIAL** | `DrawbackMatch.id` | DrawbackMatch links claims, but manufacturing drawback specific fields (mfg date, mfg location, factory ID) are missing direct schema columns |
| `ExportDestroyInput.exportOrDestroyIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.htsNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.exportOrDestroyQuantity` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.unitOfMeasureCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.exportOrDestroyDate` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.noticeOfIntentIndicator` | **MISSING** | - | Field 'noticeOfIntentIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.waiverToDrawbackClaimRightsIndicator` | **MISSING** | - | Field 'waiverToDrawbackClaimRightsIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.nameOfExporterOrDestroyer` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDestroyInput.countryOfUltimateDestination` | **MISSING** | - | Field 'countryOfUltimateDestination' has no direct Prisma schema column |
| `ExportDestroyInput.billOfLadingIndicator` | **MISSING** | - | Field 'billOfLadingIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.billOfLadingCarrierCode` | **MISSING** | - | Field 'billOfLadingCarrierCode' has no direct Prisma schema column |
| `ExportDescInput.exportOrDestroyArticleDescriptionText` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ExportDescInput.exportOrDestroyUniqueIdentifierNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `NoticeOfIntentInput.intendedPortOfExport` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `NoticeOfIntentInput.examinationWitnessIndicator` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `NoticeOfIntentInput.locationOfDestruction` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `NoticeOfIntentInput.resultsOfExaminationOrWitnessOfDestruction` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `ExamWitnessInput.recordIndicator` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `ExamWitnessInput.nameOfCbpPersonnel` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `ExamWitnessInput.cbpPersonnelBadgeNumber` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `ExamWitnessInput.cbpPersonnelPhoneNumber` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `ExamWitnessInput.processingExaminationDate` | **MISSING** | - | Notice of intent to export/destroy date and exam witness location fields are missing |
| `NaftaUsmcaInput.entryNumber` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.entryDate` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.dutyPaidToForeignGovtLocalCurrency` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.exchangeRate` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.tariffNumber1` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.tariffNumber2` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.tariffNumber3` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `NaftaUsmcaInput.countryOfExport` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.exportOrDestroyIndicator` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.htsNumber` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.exportOrDestroyQuantity` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.unitOfMeasureCode` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.exportOrDestroyDate` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.noticeOfIntentIndicator` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.waiverToDrawbackClaimRightsIndicator` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.nameOfExporterOrDestroyer` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.countryOfUltimateDestination` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.billOfLadingIndicator` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.billOfLadingCarrierCode` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `TfteaExportDestroyInput.scheduleBCode` | **MISSING** | - | TFTEA and USMCA non-originating drawback calculation fields are missing |
| `RevenueClassTotalsInput.accountingClassCode1` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.totalAmount1` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.accountingClassCode2` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.totalAmount2` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.accountingClassCode3` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.totalAmount3` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.accountingClassCode4` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueClassTotalsInput.totalAmount4` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueGrandTotalsInput.grandTotalDutyAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueGrandTotalsInput.grandTotalUserFeeAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `RevenueGrandTotalsInput.grandTotalIrTaxAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals |
| `DrawbackE0Input.referenceDataTypeCode` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `DrawbackE0Input.occurrencePosition` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `DrawbackE0Input.referenceDataText` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.dispositionTypeCode` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.severityCode` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.conditionCode` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.reasonCode` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.narrativeText` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.entryFilerCode` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.entryNumber` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.versionNumber` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |
| `DrawbackE1Input.brokerReferenceNumber` | **NOT APPLICABLE** | - | Drawback CBP output response condition / rejection record |


### 8. PGA Message Set

**Source file:** [`src/lib/abi/pgaMessageSet/types.ts`](src/lib/abi/pgaMessageSet/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `OiLineItemInput.commercialDescription` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `Pg01HeaderInput.pgaLineNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `Pg01HeaderInput.governmentAgencyCode` | **COVERED** | `ShipmentLineItem.pgaAgency` | Government agency code |
| `Pg01HeaderInput.governmentAgencyProgramCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `Pg01HeaderInput.governmentAgencyProcessingCode` | **MISSING** | - | Field 'governmentAgencyProcessingCode' has no direct Prisma schema column |
| `Pg01HeaderInput.electronicImageSubmitted` | **MISSING** | - | Field 'electronicImageSubmitted' has no direct Prisma schema column |
| `Pg01HeaderInput.confidentialInformationIndicator` | **MISSING** | - | Field 'confidentialInformationIndicator' has no direct Prisma schema column |
| `Pg01HeaderInput.globallyUniqueProductIdentificationCodeQualifier` | **MISSING** | - | Field 'globallyUniqueProductIdentificationCodeQualifier' has no direct Prisma schema column |
| `Pg01HeaderInput.globallyUniqueProductIdentificationCode` | **MISSING** | - | Field 'globallyUniqueProductIdentificationCode' has no direct Prisma schema column |
| `Pg01HeaderInput.intendedUseCode` | **MISSING** | - | Field 'intendedUseCode' has no direct Prisma schema column |
| `Pg01HeaderInput.intendedUseDescription` | **MISSING** | - | Field 'intendedUseDescription' has no direct Prisma schema column |
| `Pg01HeaderInput.correctionIndicator` | **MISSING** | - | Field 'correctionIndicator' has no direct Prisma schema column |
| `Pg01HeaderInput.disclaimer` | **COVERED** | `ShipmentLineItem.isPgaRequired` | PGA disclaimer / requirement flag |
| `Pg02ProductComponentInput.itemType` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeQualifier1` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeNumber1` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeQualifier2` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeNumber2` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeQualifier3` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg02ProductComponentInput.productCodeNumber3` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg04ConstituentElementInput.constituentActiveIngredientQualifier` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg04ConstituentElementInput.nameOfConstituentElement` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg04ConstituentElementInput.quantityOfConstituentElement` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg04ConstituentElementInput.unitOfMeasureConstituentElement` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg04ConstituentElementInput.percentOfConstituentElement` | **PARTIAL** | `ProductComposition.ingredientName` | Product composition model exists, lacking PGA specific component sequence fields |
| `Pg06SourceProcessingInput.sourceTypeCode` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg06SourceProcessingInput.countryCode` | **COVERED** | `PartyAddress.addressLine1` | PGA party address fields |
| `Pg06SourceProcessingInput.geographicLocation` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg06SourceProcessingInput.processingStartDate` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg06SourceProcessingInput.processingEndDate` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg06SourceProcessingInput.processingTypeCode` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg06SourceProcessingInput.processingDescription` | **PARTIAL** | `ProductCountryFact.processingCountry` | Processing country fact model exists |
| `Pg07TradeNameModelInput.tradeNameBrandName` | **MISSING** | - | Field 'tradeNameBrandName' has no direct Prisma schema column |
| `Pg07TradeNameModelInput.model` | **MISSING** | - | Field 'model' has no direct Prisma schema column |
| `Pg07TradeNameModelInput.manufactureMonthAndYear` | **MISSING** | - | Field 'manufactureMonthAndYear' has no direct Prisma schema column |
| `Pg07TradeNameModelInput.itemIdentityNumberQualifier` | **MISSING** | - | Field 'itemIdentityNumberQualifier' has no direct Prisma schema column |
| `Pg07TradeNameModelInput.itemIdentityNumber` | **MISSING** | - | Field 'itemIdentityNumber' has no direct Prisma schema column |
| `Pg08ItemIdentityOverflowInput.itemIdentityNumber1` | **MISSING** | - | Field 'itemIdentityNumber1' has no direct Prisma schema column |
| `Pg08ItemIdentityOverflowInput.itemIdentityNumber2` | **MISSING** | - | Field 'itemIdentityNumber2' has no direct Prisma schema column |
| `Pg08ItemIdentityOverflowInput.itemIdentityNumber3` | **MISSING** | - | Field 'itemIdentityNumber3' has no direct Prisma schema column |
| `Pg08ItemIdentityOverflowInput.itemIdentityNumber4` | **MISSING** | - | Field 'itemIdentityNumber4' has no direct Prisma schema column |
| `Pg10CategoryCharacteristicInput.categoryTypeCode` | **MISSING** | - | Field 'categoryTypeCode' has no direct Prisma schema column |
| `Pg10CategoryCharacteristicInput.categoryCode` | **MISSING** | - | Field 'categoryCode' has no direct Prisma schema column |
| `Pg10CategoryCharacteristicInput.commodityQualifierCode` | **MISSING** | - | Field 'commodityQualifierCode' has no direct Prisma schema column |
| `Pg10CategoryCharacteristicInput.commodityCharacteristicQualifier` | **MISSING** | - | Field 'commodityCharacteristicQualifier' has no direct Prisma schema column |
| `Pg10CategoryCharacteristicInput.commodityCharacteristicDescription` | **MISSING** | - | Field 'commodityCharacteristicDescription' has no direct Prisma schema column |
| `Pg13LpcoIssuerInput.issuerOfLpco` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg13LpcoIssuerInput.lpcoIssuerGovernmentGeographicCodeQualifier` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg13LpcoIssuerInput.locationOfIssuerOfTheLpco` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg13LpcoIssuerInput.regionalDescriptionOfLocationOfAgencyIssuingLpco` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoTransactionType` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoType` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoNumberOrName` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoDateQualifier` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoDate` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoQuantity` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.lpcoUnitOfMeasure` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg14LpcoDetailsInput.exemptionCode` | **PARTIAL** | `LicenseCertificatePermitInput` | PGA LPCO (License, Permit, Certificate, Other) numbers lack dedicated line item scalar fields |
| `Pg18HazmatInput.unDangerousGoodsCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem |
| `Pg18HazmatInput.hazardousClassCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem |
| `Pg18HazmatInput.epaHazardousWasteCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem |
| `Pg18HazmatInput.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem |
| `Pg18HazmatInput.packagingGroupCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem |
| `Pg19EntityIdentificationInput.entityRoleCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `Pg19EntityIdentificationInput.entityIdentificationCode` | **MISSING** | - | Field 'entityIdentificationCode' has no direct Prisma schema column |
| `Pg19EntityIdentificationInput.entityNumber` | **MISSING** | - | Field 'entityNumber' has no direct Prisma schema column |
| `Pg19EntityIdentificationInput.entityName` | **COVERED** | `Party.name` | PGA party entity name |
| `Pg19EntityIdentificationInput.entityAddress1` | **MISSING** | - | Field 'entityAddress1' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityAddress2` | **MISSING** | - | Field 'entityAddress2' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityApartmentSuiteNumber` | **MISSING** | - | Field 'entityApartmentSuiteNumber' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityCity` | **MISSING** | - | Field 'entityCity' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityStateProvince` | **MISSING** | - | Field 'entityStateProvince' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityCountry` | **MISSING** | - | Field 'entityCountry' has no direct Prisma schema column |
| `Pg20EntityAddressInput.entityZipPostalCode` | **MISSING** | - | Field 'entityZipPostalCode' has no direct Prisma schema column |
| `Pg21IndividualContactInput.individualQualifier` | **MISSING** | - | Field 'individualQualifier' has no direct Prisma schema column |
| `Pg21IndividualContactInput.individualName` | **MISSING** | - | Field 'individualName' has no direct Prisma schema column |
| `Pg21IndividualContactInput.telephoneNumberOfTheIndividual` | **MISSING** | - | Field 'telephoneNumberOfTheIndividual' has no direct Prisma schema column |
| `Pg21IndividualContactInput.emailAddressOrFaxNumberForTheIndividual` | **MISSING** | - | Field 'emailAddressOrFaxNumberForTheIndividual' has no direct Prisma schema column |
| `Pg22ImporterDeclarationInput.importersSubstantiatingSignedDocument` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.documentIdentifier` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.conformanceDeclaration` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.entityRoleCode` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.declarationCode` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.declarationCertification` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.dateOfSignature` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.invoiceNumber` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg22ImporterDeclarationInput.complianceDescription` | **MISSING** | - | PGA importer declarations (FDA prior notice, EPA vehicle declaration) are missing |
| `Pg24RemarksInput.remarksTypeCode` | **MISSING** | - | Field 'remarksTypeCode' has no direct Prisma schema column |
| `Pg24RemarksInput.remarksCode` | **MISSING** | - | Field 'remarksCode' has no direct Prisma schema column |
| `Pg24RemarksInput.remarksText` | **MISSING** | - | Field 'remarksText' has no direct Prisma schema column |
| `Pg25TemperatureLotValuesInput.temperatureQualifier` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.degreeType` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.negativeNumber` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.actualTemperature` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.locationOfTemperatureRecording` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.lotNumberQualifier` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.lotNumber` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.productionStartDateOfTheLot` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.productionEndDateOfTheLot` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.pgaLineValue` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg25TemperatureLotValuesInput.pgaUnitValue` | **MISSING** | - | Temperature lot values, lot numbers, and expiration dates missing on line items |
| `Pg26PackagingBreakdownInput.packagingQualifier` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg26PackagingBreakdownInput.quantity` | **COVERED** | `ShipmentLineItem.quantity` | Quantity |
| `Pg26PackagingBreakdownInput.unitOfMeasurePackagingLevel` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg26PackagingBreakdownInput.packageIdentifier` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg26PackagingBreakdownInput.packagingMethod` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg26PackagingBreakdownInput.packageMaterial` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg26PackagingBreakdownInput.packageFiller` | **PARTIAL** | `Shipment.packageCount` | Package count present, multi-level packaging breakdown 1..6 missing |
| `Pg27ShippingContainerInput.containerNumber1` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `Pg27ShippingContainerInput.typeOfContainer1` | **MISSING** | - | Field 'typeOfContainer1' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.containerLength1` | **MISSING** | - | Field 'containerLength1' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.containerNumber2` | **MISSING** | - | Field 'containerNumber2' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.typeOfContainer2` | **MISSING** | - | Field 'typeOfContainer2' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.containerLength2` | **MISSING** | - | Field 'containerLength2' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.containerNumber3` | **MISSING** | - | Field 'containerNumber3' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.typeOfContainer3` | **MISSING** | - | Field 'typeOfContainer3' has no direct Prisma schema column |
| `Pg27ShippingContainerInput.containerLength3` | **MISSING** | - | Field 'containerLength3' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.unitOfMeasurePgaLineNet` | **MISSING** | - | Field 'unitOfMeasurePgaLineNet' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.commodityNetQuantityPgaLineNet` | **MISSING** | - | Field 'commodityNetQuantityPgaLineNet' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.unitOfMeasurePgaLineGross` | **MISSING** | - | Field 'unitOfMeasurePgaLineGross' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.commodityGrossQuantityPgaLineGross` | **MISSING** | - | Field 'commodityGrossQuantityPgaLineGross' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.unitOfMeasureIndividualUnitNet` | **MISSING** | - | Field 'unitOfMeasureIndividualUnitNet' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.commodityNetQuantityIndividualUnitNet` | **MISSING** | - | Field 'commodityNetQuantityIndividualUnitNet' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.unitOfMeasureIndividualUnitGross` | **MISSING** | - | Field 'unitOfMeasureIndividualUnitGross' has no direct Prisma schema column |
| `Pg29CommodityQuantitiesInput.commodityGrossQuantityIndividualUnitGross` | **MISSING** | - | Field 'commodityGrossQuantityIndividualUnitGross' has no direct Prisma schema column |
| `Pg30InspectionLocationInput.inspectionLaboratoryTestingStatus` | **MISSING** | - | Inspection location and FIRMS code missing |
| `Pg30InspectionLocationInput.requestedOrScheduledDateOfInspection` | **MISSING** | - | Inspection location and FIRMS code missing |
| `Pg30InspectionLocationInput.requestedOrScheduledTimeOfInspection` | **MISSING** | - | Inspection location and FIRMS code missing |
| `Pg30InspectionLocationInput.inspectionOrArrivalLocationCode` | **MISSING** | - | Inspection location and FIRMS code missing |
| `Pg30InspectionLocationInput.inspectionOrArrivalLocation` | **MISSING** | - | Inspection location and FIRMS code missing |
| `Pg32CommodityRoutingInput.commodityRoutingTypeCode` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg |
| `Pg32CommodityRoutingInput.commodityRoutingCountryCode` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingQualifier` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingNumber` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingName` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg |
| `Pg34TravelDocumentInput.travelDocumentTypeCode` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg34TravelDocumentInput.travelDocumentNationality` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg34TravelDocumentInput.travelDocumentIdentifier` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg55AdditionalEntityRolesInput.entityRoleCode1` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode2` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode3` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode4` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode5` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode6` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode7` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode8` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode9` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg55AdditionalEntityRolesInput.entityRoleCode10` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg60AdditionalReferenceInput.additionalInformationQualifierCode` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg60AdditionalReferenceInput.additionalInformation` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg00SubstitutionInput.substitutionIndicator` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg00SubstitutionInput.substitutionNumber` | **PARTIAL** | `PartyRole.role` | Additional entity roles and reference codes supported via PartyRole |
| `Pg05ScientificSpeciesInput.scientificGenusName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSpeciesName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSubSpeciesName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSpeciesCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.fwsDescriptionCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.commonNameSpecific` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.commonNameGeneral` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.liveVenomousWildlifeCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.cartonsContainingWildlife` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg23AffirmationOfComplianceInput.affirmationOfComplianceCode` | **PARTIAL** | `ShipmentLineItem.isPgaRequired` | Affirmation of Compliance (AOC) code/qualifier missing dedicated column |
| `Pg23AffirmationOfComplianceInput.affirmationOfComplianceDescription` | **PARTIAL** | `ShipmentLineItem.isPgaRequired` | Affirmation of Compliance (AOC) code/qualifier missing dedicated column |
| `Pg28CanDimensionsTrackingInput.canDimensions1` | **MISSING** | - | Can dimensions tracking missing |
| `Pg28CanDimensionsTrackingInput.canDimensions2` | **MISSING** | - | Can dimensions tracking missing |
| `Pg28CanDimensionsTrackingInput.canDimensions3` | **MISSING** | - | Can dimensions tracking missing |
| `Pg28CanDimensionsTrackingInput.packageTrackingNumberCode` | **MISSING** | - | Can dimensions tracking missing |
| `Pg28CanDimensionsTrackingInput.packageTrackingNumber` | **MISSING** | - | Can dimensions tracking missing |
| `Pg31HarvestingVesselInput.commodityHarvestingVesselCharacteristicTypeCode` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg31HarvestingVesselInput.commodityHarvestingVesselCharacteristic` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg31HarvestingVesselInput.unitOfMeasureConveyance` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg31HarvestingVesselInput.harvestedCommodityNetWeight` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg33GeographicAreaInput.commodityGeographicAreaCode` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg33GeographicAreaInput.commodityGeographicAreaName` | **MISSING** | - | Harvesting vessel name, flag, gear code, and geographic harvest area missing |
| `Pg35ConformanceBondInput.dotSuretyCode` | **MISSING** | - | Field 'dotSuretyCode' has no direct Prisma schema column |
| `Pg35ConformanceBondInput.dotBondSerialNumber` | **MISSING** | - | Field 'dotBondSerialNumber' has no direct Prisma schema column |
| `Pg35ConformanceBondInput.dotBondQualifier` | **MISSING** | - | Field 'dotBondQualifier' has no direct Prisma schema column |
| `Pg35ConformanceBondInput.dotBondAmount` | **MISSING** | - | Field 'dotBondAmount' has no direct Prisma schema column |


### 9. ACE Broker Download

**Source file:** [`src/lib/abi/brokerDownload/types.ts`](src/lib/abi/brokerDownload/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `ManifestHeaderRecord.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code |
| `ManifestHeaderRecord.transportationIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ManifestHeaderRecord.countryCode` | **MISSING** | - | Field 'countryCode' has no direct Prisma schema column |
| `ManifestHeaderRecord.conveyanceName` | **MISSING** | - | Field 'conveyanceName' has no direct Prisma schema column |
| `ManifestHeaderRecord.tripData` | **MISSING** | - | Field 'tripData' has no direct Prisma schema column |
| `ManifestHeaderRecord.manifestSequenceNumber` | **MISSING** | - | Field 'manifestSequenceNumber' has no direct Prisma schema column |
| `ManifestHeaderRecord.vesselCode` | **MISSING** | - | Field 'vesselCode' has no direct Prisma schema column |
| `ManifestHeaderRecord.manifestTypeCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `PortOfCrossingRecord.portOfUnlading` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `PortOfCrossingRecord.originalScheduledArrivalDate` | **MISSING** | - | Field 'originalScheduledArrivalDate' has no direct Prisma schema column |
| `PortOfCrossingRecord.firmsCode` | **MISSING** | - | Field 'firmsCode' has no direct Prisma schema column |
| `PortOfCrossingRecord.time` | **MISSING** | - | Field 'time' has no direct Prisma schema column |
| `IssuerCodeRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code |
| `BillOfLadingTransactionRecord.billOfLading` | **COVERED** | `Shipment.bolNumber` | Bill of lading |
| `BillOfLadingTransactionRecord.foreignPortOfLading` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingTransactionRecord.manifestQuantity` | **MISSING** | - | Field 'manifestQuantity' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.manifestUnits` | **MISSING** | - | Field 'manifestUnits' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.weight` | **COVERED** | `Shipment.totalWeight` | Total weight |
| `BillOfLadingTransactionRecord.weightUnit` | **MISSING** | - | Field 'weightUnit' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.billStatusIndicator` | **MISSING** | - | Field 'billStatusIndicator' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.masterInBondIndicator` | **MISSING** | - | Field 'masterInBondIndicator' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.inBondEntryType` | **MISSING** | - | Field 'inBondEntryType' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.inBondPortOfDestination` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingTransactionRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code |
| `EntityNameRecord.entityIdCode` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityNameRecord.name` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityNameRecord.codeQualifier` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityNameRecord.idCode` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityNameRecord.entityRelationshipCode` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityNameRecord.entityIdCodeReserved` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `BillOfLadingContainerRecord.equipmentInitial` | **MISSING** | - | Field 'equipmentInitial' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.equipmentNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingContainerRecord.sealNumber1` | **MISSING** | - | Field 'sealNumber1' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.sealNumber2` | **MISSING** | - | Field 'sealNumber2' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.containerDescriptionCode` | **MISSING** | - | Field 'containerDescriptionCode' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.containerLength` | **MISSING** | - | Field 'containerLength' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.height` | **MISSING** | - | Field 'height' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.width` | **MISSING** | - | Field 'width' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.containerType` | **MISSING** | - | Field 'containerType' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.loadEmptyStatus` | **MISSING** | - | Field 'loadEmptyStatus' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.typeOfService` | **MISSING** | - | Field 'typeOfService' has no direct Prisma schema column |
| `BillCargoDescriptionRecord.pieceCount` | **MISSING** | - | Field 'pieceCount' has no direct Prisma schema column |
| `BillCargoDescriptionRecord.description` | **COVERED** | `ShipmentLineItem.description` | Cargo description |
| `BillCargoDescriptionRecord.c4Number` | **MISSING** | - | Field 'c4Number' has no direct Prisma schema column |
| `BillCargoDescriptionRecord.manifestUnitCode` | **MISSING** | - | Field 'manifestUnitCode' has no direct Prisma schema column |
| `BillCargoDescriptionRecord.countryCode` | **MISSING** | - | Field 'countryCode' has no direct Prisma schema column |
| `MarksAndNumbersRecord.marksAndNumbers` | **MISSING** | - | Field 'marksAndNumbers' has no direct Prisma schema column |
| `StatusNotificationHeaderRecord.importingConveyanceName` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationHeaderRecord.tripNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationHeaderRecord.port` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationHeaderRecord.estimatedArrivalDate` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationHeaderRecord.estimatedArrivalTime` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.dispositionCode` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.issuerCodeMasterBill` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.masterBillNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.issuerCodeHouseBill` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.houseBillNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.issuerCodeSubHouseBill` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.subHouseBillNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.quantity` | **COVERED** | `Shipment.packageCount` | Package count |
| `StatusNotificationDetailRecord.negativeIndicator` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.actionDate` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.actionTime` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.inBondCarrierCode` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `HazardousMaterialDetailRecord.hazardousMaterialCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialDetailRecord.hazardousMaterialClass` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialDetailRecord.hazardousMaterialCodeQualifier` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialDetailRecord.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialDetailRecord.hazardousMaterialContact` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialDetailRecord.unHazardousMaterialPage` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `AdditionalHazardousMaterialDetailRecord.flashpointTemperature` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `AdditionalHazardousMaterialDetailRecord.unitOfMeasureCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `AdditionalHazardousMaterialDetailRecord.negativeIndicator` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialClassificationDetailRecord.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `HazardousMaterialClassificationDetailRecord.hazardousMaterialClassification` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns |
| `StatusNotificationContinuationRecord.entryType` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContinuationRecord.entryNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContinuationRecord.portOfTransaction` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContinuationRecord.firmsCode` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContinuationRecord.containerNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationRemarksRecord.remarks` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContainerDetailRecord.actionIndicator` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContainerDetailRecord.containerNumber` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContainerDetailRecord.sealNumber1` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationContainerDetailRecord.sealNumber2` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `ManifestReferenceIdentifierRecord.carrierAssignedBatchNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingAmendmentRecord.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code |
| `BillOfLadingAmendmentRecord.cbpPort` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingAmendmentRecord.actionCode` | **MISSING** | - | Field 'actionCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.billOfLadingNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingAmendmentRecord.quantity` | **COVERED** | `Shipment.packageCount` | Package count |
| `BillOfLadingAmendmentRecord.amendmentCode` | **MISSING** | - | Field 'amendmentCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.codeQualifier` | **MISSING** | - | Field 'codeQualifier' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.idCode` | **MISSING** | - | Field 'idCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code |
| `BillOfLadingAdditionalRecord.measurement` | **MISSING** | - | Field 'measurement' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.measurementUnit` | **MISSING** | - | Field 'measurementUnit' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.placeOfReceiptByPreCarrier` | **MISSING** | - | Field 'placeOfReceiptByPreCarrier' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.secondaryNotifyParty1Scac` | **MISSING** | - | Field 'secondaryNotifyParty1Scac' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.secondaryNotifyParty2Scac` | **MISSING** | - | Field 'secondaryNotifyParty2Scac' has no direct Prisma schema column |
| `BillOfLadingReferenceIdentifierRecord.referenceQualifier` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingReferenceIdentifierRecord.referenceNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `EntityAddressRecord.addressLine1` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityAddressRecord.addressLine2` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityGeographicAreaRecord.cityName` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityGeographicAreaRecord.stateProvince` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityGeographicAreaRecord.postalCode` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityGeographicAreaRecord.countryCode` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `EntityGeographicAreaRecord.locationIdentifier` | **COVERED** | `Party.name` | Entity name and address details map to Party/PartyAddress |
| `AdminCommunicationContactRecord.contactName` | **MISSING** | - | Field 'contactName' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.commNumberQualifier` | **MISSING** | - | Field 'commNumberQualifier' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.communicationsNumber` | **MISSING** | - | Field 'communicationsNumber' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.reservedCommNumberQualifier` | **MISSING** | - | Field 'reservedCommNumberQualifier' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.reservedCommunicationsNumber` | **MISSING** | - | Field 'reservedCommunicationsNumber' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.inBondEntryType` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `SupplementalInBondDetailsRecord.fdaBtaConfirmationIndicator` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `SupplementalInBondDetailsRecord.conventionalInBondNumber` | **MISSING** | - | Field 'conventionalInBondNumber' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.inBondCarrierCode` | **MISSING** | - | Field 'inBondCarrierCode' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.usPortOfDestination` | **MISSING** | - | Field 'usPortOfDestination' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.foreignDestination` | **MISSING** | - | Field 'foreignDestination' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.value` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `SupplementalInBondDetailsRecord.bondedCarrierIdNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `SupplementalInBondDetailsRecord.paperlessInBond` | **MISSING** | - | Field 'paperlessInBond' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.shipmentControlNumber` | **MISSING** | - | Field 'shipmentControlNumber' has no direct Prisma schema column |
| `WaterBorneExportInBondRecord.transportationIndicator` | **MISSING** | - | Field 'transportationIndicator' has no direct Prisma schema column |
| `WaterBorneExportInBondRecord.vesselName` | **MISSING** | - | Field 'vesselName' has no direct Prisma schema column |
| `MotorVehicleControlRecord.vin` | **MISSING** | - | Vehicle Identification Number (VIN) and motor vehicle control fields missing |
| `MotorVehicleControlRecord.factoryCarOrderNumber` | **MISSING** | - | Vehicle Identification Number (VIN) and motor vehicle control fields missing |
| `HarmonizedTariffRecord.harmonizedNumber` | **MISSING** | - | Field 'harmonizedNumber' has no direct Prisma schema column |
| `HarmonizedTariffRecord.value` | **MISSING** | - | Field 'value' has no direct Prisma schema column |
| `HarmonizedTariffRecord.weight` | **COVERED** | `Shipment.totalWeight` | Total weight |
| `HarmonizedTariffRecord.weightUnit` | **MISSING** | - | Field 'weightUnit' has no direct Prisma schema column |


### 10. Cargo Manifest / Entry Status Query

**Source file:** [`src/lib/abi/cargoManifestQuery/types.ts`](src/lib/abi/cargoManifestQuery/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `CargoManifestQueryRequestInput.entryFilerCode` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.entryNumber` | **COVERED** | `Shipment.bolNumber` | Query request parameters map to Shipment/CustomsFiling fields |
| `CargoManifestQueryRequestInput.inBondNumber` | **COVERED** | `Shipment.bolNumber` | Query request parameters map to Shipment/CustomsFiling fields |
| `CargoManifestQueryRequestInput.issuerCode` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.billNumber` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.airWaybillNumber` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.houseAirWaybillNumber` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.requestRelatedBol` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.requestBillAndEntryData` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryRequestInput.limitOutputOption` | **PARTIAL** | `CustomsFiling.status` | Query request criteria |
| `CargoManifestQueryErrorOutput.entryFilerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.errorMessageId` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.narrativeMessage` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EntryStatusHeaderOutput.districtPortOfEntry` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryFilerCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryTypeCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.importerOfRecordNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned |
| `EntryStatusHeaderOutput.vesselName` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned |
| `EntryStatusHeaderOutput.voyageFlightTripNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.estimatedDateOfArrival` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.splitShipmentReleaseCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.correctionResponseIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.dispositionActionDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.dispositionActionTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.dispositionActionCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.narrativeMessage` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.releaseDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.releaseOriginCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryDispositionResultOutput.documentType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.districtPortOfEntry` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.entryFilerCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.entryNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.entryTypeCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.importerOfRecordNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.brokerReferenceNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned |
| `ManifestConveyanceResultOutput.importingVesselCodeOrConveyanceName` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.voyageFlightTripNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ManifestConveyanceResultOutput.dateOfArrival` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `TripFirmsLocationOutput.tripNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `TripFirmsLocationOutput.firmsCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillQueryErrorOutput.inBondNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondBillQueryErrorOutput.issuerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondBillQueryErrorOutput.billNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondBillQueryErrorOutput.errorMessageId` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondBillQueryErrorOutput.narrativeMessage` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `AirWaybillQueryErrorOutput.airWaybillNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `AirWaybillQueryErrorOutput.houseAirWaybillNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `AirWaybillQueryErrorOutput.errorMessageId` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `AirWaybillQueryErrorOutput.narrativeMessage` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CountryOriginTariffResultOutput.recordControlNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `CountryOriginTariffResultOutput.countryOfOrigin` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `CountryOriginTariffResultOutput.tariffNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusUpdateOutput.inBondStatus` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusUpdateOutput.inBondArrivalDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusUpdateOutput.inBondExportDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusUpdateOutput.inBondEntryType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.inBondNumber` | **COVERED** | `Shipment.inBondNumber` | In-bond number returned |
| `InBondBillDetailOutput.masterBillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.houseBillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.subHouseBillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.manifestQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.unit` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.issuerCodeOfMasterBillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.issuerCodeOfHouseBillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.billOfLadingType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.importerSecurityFilingIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDetailOutput.modeOfTransportationCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusDetailOutput.inBondStatus` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusDetailOutput.inBondArrivalDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusDetailOutput.inBondExportDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondStatusDetailOutput.inBondEntryType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.importingCarrierCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.flightNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.scheduledArrivalDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.airWaybillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.partIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.manifestQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.boardedQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.houseAirWaybillNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.housePartIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.houseManifestQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.houseBoardedQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.inBondNumber` | **COVERED** | `Shipment.inBondNumber` | In-bond number returned |
| `AirInBondManifestStatusOutput.inBondStatus` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.inBondEntryType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirInBondManifestStatusOutput.wscRecordVersion` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirWaybillDispositionResultOutput.dispositionActionDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirWaybillDispositionResultOutput.dispositionActionTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirWaybillDispositionResultOutput.dispositionCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirWaybillDispositionResultOutput.narrativeMessage` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AirWaybillDispositionResultOutput.inBondOrEntryNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.dispositionActionDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.dispositionActionTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.dispositionActionCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.narrativeMessage` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.releaseDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.releaseOriginCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.quantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondBillDispositionResultOutput.sequence` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AmendedBillQuantitiesOutput.masterBillAmendedQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `AmendedBillQuantitiesOutput.houseBillAmendedQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.inBondEntryNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.manifestedPortOfUnladingImport` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.actualPortOfUnladingImport` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.actualPortOfUnladingImportOceanVesselDiversion` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.inBondOriginatingPort` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.manifestedInBondDestinationPort` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.actualInBondDestinationManualDiversion` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.actualInBondDestinationEdiDiversion` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.vesselDeparturePort` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.vesselDepartureDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.containerLoadPort` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PortDateDetailOutput.containerLoadDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ReferenceDataOutput.referenceIdentifierQualifier` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `ReferenceDataOutput.referenceIdentifier` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `CountryOriginTariffLineOutput.lineItemIdentifier` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `CountryOriginTariffLineOutput.countryOfOrigin` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `CountryOriginTariffLineOutput.tariffNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.billTypeIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.issuerCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.billNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.quantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.unitOfMeasure` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillDetailOutput.manifestedQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.inBondNumber` | **COVERED** | `Shipment.inBondNumber` | In-bond number returned |
| `InBondDetailOutput.inBondEntryType` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.usPortOfInBondDeparture` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.usPortOfInBondArrival` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.inBondCreateDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.inBondArrivalDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `InBondDetailOutput.inBondQuantity` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.dispositionDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.dispositionTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.dispositionCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.narrativeMessage` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.splitIndicator` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned |
| `BillMatchDispositionOutput.voyageFlightTripNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.dateOfArrival` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `BillMatchDispositionOutput.districtPortOfArrival` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.governmentAgencyCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.governmentAgencyProgramCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.statusActionDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.statusActionTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.pgaEntryLevelStatusCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.pgaEntryLevelStatusMessage` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.entryLineLevelStatusCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.pgaLineLevelStatusCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.statusReasonCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.beginningCbpLine` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.beginningTariffPosition` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.beginningPgaLine` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.endingCbpLine` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.endingTariffPosition` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.endingPgaLine` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.documentTypeCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaStatusActionDetailOutput.pgaEntryHold` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumberQualifier` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumberReceiptDate` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumberReceiptTime` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode1` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode2` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode3` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode4` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode5` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode6` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode7` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode8` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode9` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaLineSubReasonCode10` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumberQualifier2` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaReferenceIdentificationDetailOutput.pgaReferenceIdentificationNumber2` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `PgaNarrativeCommentsOutput.commentsToTradeFromPga` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |


### 11. In-Bond (7512)

**Source file:** [`src/lib/abi/inBond/types.ts`](src/lib/abi/inBond/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `InBondHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `InBondHeaderInput.inBondEntryType` | **MISSING** | - | Field 'inBondEntryType' has no direct Prisma schema column |
| `InBondHeaderInput.inBondNumber` | **COVERED** | `Shipment.inBondNumber` | In-bond number |
| `InBondHeaderInput.inBondCarrierCode` | **MISSING** | - | Field 'inBondCarrierCode' has no direct Prisma schema column |
| `InBondHeaderInput.usPortOfDest` | **MISSING** | - | Field 'usPortOfDest' has no direct Prisma schema column |
| `InBondHeaderInput.portOfForeignDest` | **MISSING** | - | Field 'portOfForeignDest' has no direct Prisma schema column |
| `InBondHeaderInput.value` | **COVERED** | `Shipment.totalValue` | Total value |
| `InBondHeaderInput.bondedCarrierID` | **MISSING** | - | Field 'bondedCarrierID' has no direct Prisma schema column |
| `InBondHeaderInput.ftzWarehouseInd` | **MISSING** | - | Field 'ftzWarehouseInd' has no direct Prisma schema column |
| `InBondHeaderInput.btaFdaIndicator` | **MISSING** | - | Field 'btaFdaIndicator' has no direct Prisma schema column |
| `ConveyanceInfoInput.importingCarrierCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInfoInput.importMOT` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInfoInput.countryCode` | **MISSING** | - | Field 'countryCode' has no direct Prisma schema column |
| `ConveyanceInfoInput.importingConveyance` | **MISSING** | - | Field 'importingConveyance' has no direct Prisma schema column |
| `ConveyanceInfoInput.voyageFlightTripNum` | **MISSING** | - | Field 'voyageFlightTripNum' has no direct Prisma schema column |
| `ConveyanceInfoInput.portOfImportArrival` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `ConveyanceInfoInput.estDateOfArrival` | **MISSING** | - | Field 'estDateOfArrival' has no direct Prisma schema column |
| `ConveyanceInfoInput.ftzFirmsCode` | **MISSING** | - | Field 'ftzFirmsCode' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingHeaderInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `BillOfLadingHeaderInput.issuerCodeMasterBOL` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingHeaderInput.masterBOLNumber` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `BillOfLadingHeaderInput.issuerCodeHouseBill` | **MISSING** | - | Field 'issuerCodeHouseBill' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.issuerCodeSubHouse` | **MISSING** | - | Field 'issuerCodeSubHouse' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.subHouseBillNumber` | **MISSING** | - | Field 'subHouseBillNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.prevInBondNumber` | **MISSING** | - | Field 'prevInBondNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.inBondQuantity` | **MISSING** | - | Field 'inBondQuantity' has no direct Prisma schema column |
| `SecondaryNotifyPartiesInput.snpCode1` | **COVERED** | `ShipmentParty.partyId` | Secondary notify party |
| `SecondaryNotifyPartiesInput.snpCode2` | **COVERED** | `ShipmentParty.partyId` | Secondary notify party |
| `SecondaryNotifyPartiesInput.snpCode3` | **COVERED** | `ShipmentParty.partyId` | Secondary notify party |
| `SecondaryNotifyPartiesInput.snpCode4` | **COVERED** | `ShipmentParty.partyId` | Secondary notify party |
| `ReferenceIdentifierInput.qualifier` | **COVERED** | `ShipmentTrackingIdentifier.identifier` | Reference identifier |
| `ReferenceIdentifierInput.referenceIdentifier` | **COVERED** | `ShipmentTrackingIdentifier.identifier` | Reference identifier |
| `InBondEventHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `InBondEventHeaderInput.inBondNumber` | **COVERED** | `Shipment.inBondNumber` | In-bond number |
| `InBondEventHeaderInput.issuerCodeMasterBOL` | **MISSING** | - | Field 'issuerCodeMasterBOL' has no direct Prisma schema column |
| `InBondEventHeaderInput.masterBOLNumber` | **MISSING** | - | Field 'masterBOLNumber' has no direct Prisma schema column |
| `InBondEventHeaderInput.issuerCodeHouseBOL` | **MISSING** | - | Field 'issuerCodeHouseBOL' has no direct Prisma schema column |
| `InBondEventHeaderInput.houseBOLNumber` | **MISSING** | - | Field 'houseBOLNumber' has no direct Prisma schema column |
| `InBondEventHeaderInput.firmsLocation` | **MISSING** | - | Field 'firmsLocation' has no direct Prisma schema column |
| `InBondEventHeaderInput.containerNumber` | **MISSING** | - | Field 'containerNumber' has no direct Prisma schema column |
| `InBondEventDetailInput.date` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `InBondEventDetailInput.time` | **PARTIAL** | `CustomsFiling.payload` | Field captured inside raw JSON payload |
| `InBondEventDetailInput.portOfArrival` | **MISSING** | - | Field 'portOfArrival' has no direct Prisma schema column |
| `InBondEventDetailInput.inBondCarrierCode` | **MISSING** | - | Field 'inBondCarrierCode' has no direct Prisma schema column |
| `InBondEventDetailInput.bondedCarrierID` | **MISSING** | - | Field 'bondedCarrierID' has no direct Prisma schema column |
| `InBondEventDetailInput.cityName` | **MISSING** | - | Field 'cityName' has no direct Prisma schema column |
| `InBondEventDetailInput.stateCode` | **MISSING** | - | Field 'stateCode' has no direct Prisma schema column |
| `InBondEventDetailInput.exportMOT` | **MISSING** | - | Field 'exportMOT' has no direct Prisma schema column |
| `InBondEventDetailInput.exportConveyance` | **MISSING** | - | Field 'exportConveyance' has no direct Prisma schema column |
| `InBondResponseMessageOutput.narrativeMsgType` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondResponseMessageOutput.narrativeMsgId` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `InBondResponseMessageOutput.narrativeMessage` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationHeaderOutput.inBondEntryType` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationHeaderOutput.inBondNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationHeaderOutput.usPortOfDest` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationHeaderOutput.foreignDestination` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.dispositionCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.issuerMasterBill` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.masterBillNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.issuerHouseBill` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.houseBillNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.issuerSubHouse` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.subHouseBillNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.quantity` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.negativeIndicator` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.actionDate` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.actionTime` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationDetailOutput.inBondCarrierCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationContinuationOutput.entryType` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationContinuationOutput.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationContinuationOutput.distPortTxn` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationContinuationOutput.firmsCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationContinuationOutput.containerNum` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `StatusNotificationRemarksOutput.remarks` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |


### 12. Importer / Bond Query

**Source file:** [`src/lib/abi/importerBondQuery/types.ts`](src/lib/abi/importerBondQuery/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `ImporterBondQueryInput.importerNumber1` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode1` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.importerNumber2` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode2` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.importerNumber3` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode3` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.importerNumber4` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode4` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.importerNumber5` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode5` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.importerNumber6` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `ImporterBondQueryInput.addressRequestCode6` | **NOT APPLICABLE** | - | Query request control / query type criteria |
| `K1Output.importerNumber` | **COVERED** | `ImporterOfRecord.name` | Importer details returned in query response |
| `K1Output.queryResultsCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.importerName` | **COVERED** | `ImporterOfRecord.name` | Importer details returned in query response |
| `K1Output.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response |
| `K1Output.bondTypeActivityCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.bondAmount` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response |
| `K1Output.districtPortWhereBondFiled` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.bondEffectiveDate` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.bondNumber` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.bondAmountRecordLocationIndicator` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.nameQualifier` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.importerNameLine2` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.bondTerminationDate` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.periodicMonthlyStatementStatus` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.bondSufficiencyIndicator` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.bondUserStatusIndicator` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.bondUserTerminationDate` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K2Output.bondAmount` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response |
| `K3Output.addressLine1` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K3Output.addressLine2` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K4Output.city` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K4Output.stateCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K4Output.postalCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K5Output.addressLine1` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K5Output.addressLine2` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K6Output.city` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K6Output.stateCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K6Output.postalCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K7Output.fullLegalImporterName` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K7Output.centerIdentifier` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K7Output.centerIdDescription` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K8Output.additionalInformationQualifierCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K8Output.additionalInformation` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |


## Recommended Next Steps

To transform the standalone CATAIR codec into a fully operational customs filing system connected to production storage, schema migrations should be executed in prioritized phases:

### Phase 1: High-Priority Business Critical Data (Immediate Focus)
1. **Itemized Tariff & Fee Class Accounting (`CustomsFiling` / `ShipmentLineItem`)**:
   - Replace or supplement aggregate `feeAmount` with dedicated columns or structured relations for accounting class codes (e.g. 499 Harbor Maintenance Fee, 501 Merchandise Processing Fee, 311 Cotton Fee, 056 Environmental Tax).
2. **Census Warning Override Pairs (`CustomsFiling`)**:
   - Add dedicated columns or structured JSON array for `censusOverrideCodes` (supporting up to 7 condition code + override code pairs per entry) to enable filers to clear Census warnings during 7501 submission.
3. **PGA High-Frequency License / Permit Scalars (`ShipmentLineItem`)**:
   - Add dedicated fields for PGA License, Permit, Certificate, and Other (LPCO) numbers, issuer codes, and permit type codes (PG13/PG14) required for FDA, EPA, and USDA entry releases.
4. **Drawback Manufacturing & Destruction Claim Fields (`DrawbackLot` / `DrawbackClaim`)**:
   - Add explicit columns for manufacturing date, factory location, notice of intent to export/destroy date, and exam witness location to enable manufacturing drawback filings.

### Phase 2: Medium-Priority Specialized Regulatory Data
1. **Foreign Trade Zone (FTZ) Admission Metadata (`Shipment` / `CustomsFiling`)**:
   - Add fields for FTZ Admission Number, FTZ Zone Identifier, Privileged Status Date, and FTZ Merchandise Status Code.
2. **ADCVD Case Level Accounting (`ShipmentLineItem`)**:
   - Add line-level fields for ADCVD Case Number, Case Deposit Rate, and Bonding Flag to support Antidumping/Countervailing duty calculations alongside the existing `AdcvdOrder` reference model.
3. **PGA Commodity Specific Identifiers (`CanonicalProduct` / `ShipmentLineItem`)**:
   - Add fields for FDA Prior Notice confirmation numbers, EPA vehicle engine classification, and Affirmation of Compliance (AOC) codes.

### Phase 3: Low-Priority & Narrow Edge-Case Data
1. **Standard Textile Visa Numbers & Importer 76-Char Special Declarations**:
   - Add columns for softwood lumber export prices and textile visa numbers as demand warrants.
2. **Biological & Harvest Vessel Details (FWS / NOAA PG05 / PG31)**:
   - Add genus/species scientific names and harvest vessel flag/gear codes for specialized wildlife and fisheries entry filings.
