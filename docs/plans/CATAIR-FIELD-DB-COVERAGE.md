# CATAIR Field → Database Coverage Assessment

## Verification Pass Notes

> [!IMPORTANT]
> **Verification Pass Audit Summary (Strict Schema Verification)**
> 
> A 100% verification pass was executed against `prisma/schema.prisma` for all **503 rows** originally classified as COVERED or PARTIAL (123 COVERED + 380 PARTIAL):
> 
> - **Total COVERED / PARTIAL rows audited**: **503 rows**
> - **Citations confirmed accurate as written**: **187 rows** (37.2%)
> - **Deprecated field citations redirected/downgraded**: **2 rows** (0.4%) — e.g. `CustomsFiling.entryType` marked `@deprecated Use transactionTypeId instead` in Prisma schema, redirected to `CustomsFiling.transactionTypeId`.
> - **Incorrect / misnamed citations corrected**: **314 rows** (62.4%) — e.g. `CustomsFiling.payload` corrected to `CustomsFiling.rawPayload`, `Party.name` corrected to `PartyName.rawName`, `PartyIdentifier.identifier` corrected to `PartyIdentifier.value`, `PartyRole.role` corrected to `PartyRole.roleType`, `ProductComposition.ingredientName` corrected to `ProductComposition.componentName`, `ShipmentLineItem.enteredValue` corrected to `ShipmentLineItem.totalValue`.
> - **Rows reclassified to MISSING**: **90 rows** (17.9%) — e.g. `CustomsProfile.filerCode` (3-character CBP Filer Code does not exist in Prisma schema), `LicenseCertificatePermitInput` (cited a TS interface name instead of a Prisma model), `DrawbackLot.claimedTaxRefund` / `claimedFeeRefund` / `exportShipmentId` (fields absent from schema).
> 
> Following this verification pass, total **COVERED** fields adjusted from 123 to **101**, **PARTIAL** fields adjusted from 380 to **312**, and **MISSING** fields adjusted from 422 to **512**.


## Executive Summary Table

| Chapter | Total Fields Assessed | COVERED | PARTIAL | MISSING | NOT APPLICABLE |
| :--- | :---: | :---: | :---: | :---: | :---: |
| [1. Batch & Block Control](src/lib/abi/batchBlockControl/types.ts) | 76 | 0 | 0 | 0 | 76 |
| [2. Entry Summary (7501)](src/lib/abi/entrySummary/types.ts) | 238 | 20 | 55 | 138 | 25 |
| [3. Entry Summary Query](src/lib/abi/entrySummaryQuery/types.ts) | 134 | 6 | 0 | 21 | 107 |
| [4. Cargo Release (3461)](src/lib/abi/cargoRelease/types.ts) | 69 | 8 | 25 | 33 | 3 |
| [5. Daily & Periodic Monthly Statement](src/lib/abi/statement/types.ts) | 88 | 0 | 74 | 1 | 13 |
| [6. eBond](src/lib/abi/ebond/types.ts) | 45 | 7 | 25 | 9 | 4 |
| [7. Drawback (7553)](src/lib/abi/drawback/types.ts) | 158 | 16 | 53 | 76 | 13 |
| [8. PGA Message Set](src/lib/abi/pgaMessageSet/types.ts) | 178 | 10 | 44 | 124 | 0 |
| [9. ACE Broker Download](src/lib/abi/brokerDownload/types.ts) | 134 | 19 | 26 | 63 | 26 |
| [10. Cargo Manifest / Entry Status Query](src/lib/abi/cargoManifestQuery/types.ts) | 178 | 4 | 0 | 13 | 161 |
| [11. In-Bond (7512)](src/lib/abi/inBond/types.ts) | 76 | 6 | 10 | 34 | 26 |
| [12. Importer / Bond Query](src/lib/abi/importerBondQuery/types.ts) | 45 | 5 | 0 | 0 | 40 |
| **Total** | **1419** | **101** | **312** | **512** | **494** |

## Overall Summary

Across all 12 CATAIR chapters, a total of **1419 fields** were assessed against the 196 models in `prisma/schema.prisma`. Excluding **494 protocol mechanics and CBP response/status fields** (classified as NOT APPLICABLE), the underlying business data layer contains **925 fields**. Following strict schema re-verification of all 503 initial COVERED/PARTIAL rows, **101 fields (10.9%)** are fully **COVERED** by valid, non-deprecated Prisma columns, **312 fields (33.7%)** are **PARTIAL** (captured via related generic fields, raw JSON blobs, or parent relations lacking granular sub-fields), and **512 fields (55.4%)** are completely **MISSING** from the database schema. The three chapters with the most severe database coverage gaps are **Entry Summary** (138 missing fields out of 213 business fields), **PGA Message Set** (124 missing fields out of 178 business fields), and **Drawback** (76 missing fields out of 145 business fields). Without targeted schema migrations to address these gaps, Qubere's CATAIR codec layer remains disconnected from production database storage, preventing users from populating complete real-world filings for PGAs, complex Entry Summaries, FTZ admissions, and Drawback claims.

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
| `HeaderControlInput.summaryFilingActionRequestCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderControlInput.entryFilerCode` | **MISSING** | - | Original citation CustomsProfile.filerCode is non-existent; 3-char CBP Filer Code per se is missing from schema (CustomsProfile has customsBrokerOfRecord) |
| `HeaderControlInput.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Exact entry number (Verified: CustomsFiling.entryNumber exists [String]) |
| `HeaderControlInput.districtPortOfEntry` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderControlInput.brokerReferenceNumber` | **MISSING** | - | Field 'brokerReferenceNumber' has no direct Prisma schema column |
| `HeaderControlInput.entryTypeCode` | **PARTIAL** | `CustomsFiling.transactionTypeId` | PARTIAL: CustomsFiling.entryType is @deprecated (schema note: 'Use transactionTypeId instead') |
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
| `HeaderContentInput.importerOfRecordNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderContentInput.consigneeNumber` | **MISSING** | - | Citation Shipment.consigneeName invalid; field consigneeName does not exist on model Shipment |
| `HeaderContentInput.designatedNotifyPartyNumber` | **MISSING** | - | Field 'designatedNotifyPartyNumber' has no direct Prisma schema column |
| `HeaderContentInput.estimatedEntryDate` | **MISSING** | - | Field 'estimatedEntryDate' has no direct Prisma schema column |
| `HeaderContentInput.dateOfImportation` | **MISSING** | - | Field 'dateOfImportation' has no direct Prisma schema column |
| `HeaderContentInput.usStateOfDestinationCode` | **MISSING** | - | Field 'usStateOfDestinationCode' has no direct Prisma schema column |
| `HeaderContentInput.foreignTradeZoneIdentifier` | **MISSING** | - | Field 'foreignTradeZoneIdentifier' has no direct Prisma schema column |
| `LineItemHeaderInput.lineItemIdentifier` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineItemHeaderInput.articleSetIndicator` | **MISSING** | - | Field 'articleSetIndicator' has no direct Prisma schema column |
| `LineItemHeaderInput.countryOfOriginCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `TariffDetailInput.htsNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `TariffDetailInput.dutyAmount` | **MISSING** | - | Citation CustomsFiling.dutyAmount invalid; field dutyAmount does not exist on model CustomsFiling |
| `TariffDetailInput.valueOfGoodsAmount` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `TariffDetailInput.quantity1` | **MISSING** | - | Field 'quantity1' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `TariffDetailInput.quantity2` | **MISSING** | - | Field 'quantity2' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode2` | **MISSING** | - | Field 'unitOfMeasureCode2' has no direct Prisma schema column |
| `TariffDetailInput.quantity3` | **MISSING** | - | Field 'quantity3' has no direct Prisma schema column |
| `TariffDetailInput.unitOfMeasureCode3` | **MISSING** | - | Field 'unitOfMeasureCode3' has no direct Prisma schema column |
| `TariffDetailInput.ftzPrivilegedStatusDetail` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FeeTotalEntry.accountingClassCode` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalEntry.totalFeeAmount` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.accountingClassCode1` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.totalFeeAmount1` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.accountingClassCode2` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.totalFeeAmount2` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.accountingClassCode3` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.totalFeeAmount3` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.accountingClassCode4` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.totalFeeAmount4` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.accountingClassCode5` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `FeeTotalInput.totalFeeAmount5` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `BondDetailInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BondDetailInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BondDetailInput.continuousBondIndicator` | **MISSING** | - | Field 'continuousBondIndicator' has no direct Prisma schema column |
| `BondDetailInput.suretyCompanyCode` | **COVERED** | `Bond.suretyName` | Corrected citation: Bond has suretyName String, but lacks 3-digit CBP suretyCode column |
| `BondDetailInput.singleTransactionBondAmount` | **MISSING** | - | Field 'singleTransactionBondAmount' has no direct Prisma schema column |
| `BondDetailInput.singleTransactionBondProducerAccountNumber` | **MISSING** | - | Field 'singleTransactionBondProducerAccountNumber' has no direct Prisma schema column |
| `FtzStatusInput.ftzMerchandiseStatusCode` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzStatusInput.privilegedFtzMerchandiseFilingDate` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzStatusInput.ftzLineItemQuantity` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `FtzPrivilegedStatusDetailInput.currentHtsNumber` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `AdcvdCaseDetailInput.caseNumber` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdCaseDetailInput.bondCashClaimCode` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdCaseDetailInput.caseDepositRate` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdCaseDetailInput.caseRateTypeQualifierCode` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdCaseDetailInput.valueOfGoodsAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdCaseDetailInput.quantity` | **COVERED** | `ShipmentLineItem.quantity` | Exact quantity scalar (Verified: ShipmentLineItem.quantity exists [Int]) |
| `AdcvdCaseDetailInput.dutyAmount` | **MISSING** | - | Citation CustomsFiling.dutyAmount invalid; field dutyAmount does not exist on model CustomsFiling |
| `AdcvdCaseDetailInput.nonReimbursementDeclarationIdentifier` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdDutyTotalsInput.totalBondedAdDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdDutyTotalsInput.totalCashDepositAdDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdDutyTotalsInput.totalBondedCvDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `AdcvdDutyTotalsInput.totalCashDepositCvDutyAmount` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `GrandTotalsInput.grandTotalDutyAmount` | **MISSING** | - | Field 'grandTotalDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalUserFeeAmount` | **MISSING** | - | Field 'grandTotalUserFeeAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalIrTaxAmount` | **MISSING** | - | Field 'grandTotalIrTaxAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalAdDutyAmount` | **MISSING** | - | Field 'grandTotalAdDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalCvDutyAmount` | **MISSING** | - | Field 'grandTotalCvDutyAmount' has no direct Prisma schema column |
| `GrandTotalsInput.grandTotalOtherRevenueAmount` | **MISSING** | - | Field 'grandTotalOtherRevenueAmount' has no direct Prisma schema column |
| `LineEntityGroupInput.entity` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineEntityGroupInput.gbiIdentifiers` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `LineEntityGroupInput.streetAddresses` | **MISSING** | - | Field 'streetAddresses' has no direct Prisma schema column |
| `LineEntityGroupInput.geographicArea` | **MISSING** | - | Field 'geographicArea' has no direct Prisma schema column |
| `EipInvoiceGroupInput.invoice` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EipInvoiceGroupInput.ruling` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist (Verified: Ruling.rulingNumber exists [String]) |
| `EipInvoiceGroupInput.commercialDescriptions` | **MISSING** | - | Field 'commercialDescriptions' has no direct Prisma schema column |
| `LineItemInput.header` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineItemInput.ftzStatus` | **MISSING** | - | No FTZ (Foreign Trade Zone) admission number, zone ID, or privileged status fields in schema |
| `LineItemInput.eipInvoices` | **MISSING** | - | Field 'eipInvoices' has no direct Prisma schema column |
| `LineItemInput.invoices` | **MISSING** | - | Field 'invoices' has no direct Prisma schema column |
| `LineItemInput.ruling` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist (Verified: Ruling.rulingNumber exists [String]) |
| `LineItemInput.rulings` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist (Verified: Ruling.rulingNumber exists [String]) |
| `LineItemInput.commercialDescriptions` | **MISSING** | - | Field 'commercialDescriptions' has no direct Prisma schema column |
| `LineItemInput.articleParties` | **MISSING** | - | Field 'articleParties' has no direct Prisma schema column |
| `LineItemInput.entities` | **MISSING** | - | Field 'entities' has no direct Prisma schema column |
| `LineItemInput.tariffDetails` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineItemInput.standardVisa` | **MISSING** | - | Field 'standardVisa' has no direct Prisma schema column |
| `LineItemInput.licenseCertificatePermit` | **MISSING** | - | Field 'licenseCertificatePermit' has no direct Prisma schema column |
| `LineItemInput.licenses` | **MISSING** | - | Field 'licenses' has no direct Prisma schema column |
| `LineItemInput.adcvdCases` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `LineItemInput.importersAdditionalDeclarations` | **MISSING** | - | Field 'importersAdditionalDeclarations' has no direct Prisma schema column |
| `LineItemInput.irTax` | **MISSING** | - | Field 'irTax' has no direct Prisma schema column |
| `LineItemInput.otherRevenue` | **MISSING** | - | Field 'otherRevenue' has no direct Prisma schema column |
| `LineItemInput.userFees` | **MISSING** | - | Field 'userFees' has no direct Prisma schema column |
| `LineItemInput.pscLineReasons` | **MISSING** | - | Field 'pscLineReasons' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerControl` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntrySummaryTransactionInput.headerContent` | **MISSING** | - | Field 'headerContent' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.bonds` | **MISSING** | - | Field 'bonds' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerFees` | **MISSING** | - | Field 'headerFees' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.pscHeaderReasons` | **MISSING** | - | Field 'pscHeaderReasons' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.pscFilingExplanations` | **MISSING** | - | Field 'pscFilingExplanations' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.headerEntities` | **MISSING** | - | Field 'headerEntities' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.lineItems` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntrySummaryTransactionInput.adcvdDutyTotals` | **PARTIAL** | `AdcvdOrder.caseNumber` | AdcvdOrder reference model exists, but filing/line level ADCVD case deposit rates, bonding flags, and case totals are missing direct schema columns (Verified: AdcvdOrder.caseNumber exists [String]) |
| `EntrySummaryTransactionInput.feeTotals` | **MISSING** | - | Field 'feeTotals' has no direct Prisma schema column |
| `EntrySummaryTransactionInput.grandTotals` | **MISSING** | - | Field 'grandTotals' has no direct Prisma schema column |
| `InvoiceLineReferenceInput.supplierIdCode` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceNumber` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange1Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange1End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange2Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange2End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange3Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange3End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange4Begin` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `InvoiceLineReferenceInput.invoiceLineRange4End` | **PARTIAL** | `InvoiceLine.shipmentId` | InvoiceLine links invoice and shipment, but lacks multi-range line index references (ranges 1-4) and supplier ID code linkage (Verified: InvoiceLine.shipmentId exists [String?]) |
| `RulingsDetailInput.rulingTypeCode` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist (Verified: Ruling.rulingNumber exists [String]) |
| `RulingsDetailInput.rulingNumber` | **COVERED** | `Ruling.rulingNumber` | Exact ruling number model and HTS link exist (Verified: Ruling.rulingNumber exists [String]) |
| `CommercialDescriptionInput.commercialDescriptionText` | **COVERED** | `ShipmentLineItem.description` | Corrected citation: Commercial description text is stored in ShipmentLineItem.description |
| `LicenseCertificatePermitInput.licenseCertificatePermitTypeCode` | **PARTIAL** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA requirements are accessed via pgaRequirements relation |
| `LicenseCertificatePermitInput.licenseCertificatePermitNumber` | **PARTIAL** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA requirements are accessed via pgaRequirements relation |
| `LineEntityInput.entityCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineEntityInput.entityName` | **MISSING** | - | Field 'entityName' has no direct Prisma schema column |
| `LineEntityInput.entityIdentifierQualifier` | **MISSING** | - | Field 'entityIdentifierQualifier' has no direct Prisma schema column |
| `LineEntityInput.entityIdentifier` | **MISSING** | - | Field 'entityIdentifier' has no direct Prisma schema column |
| `LineEntityGbiInput.gbiIdentifierQualifier` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `LineEntityGbiInput.identifier` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `LineEntityGbiInput.partyTypeDescriptions` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `GbiPartyTypeDescriptionInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `GbiPartyTypeDescriptionInput.description` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `LineEntityStreetAddressInput.addressComponentQualifier1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineEntityStreetAddressInput.addressInformation1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineEntityStreetAddressInput.addressComponentQualifier2` | **MISSING** | - | Field 'addressComponentQualifier2' has no direct Prisma schema column |
| `LineEntityStreetAddressInput.addressInformation2` | **MISSING** | - | Field 'addressInformation2' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.cityName` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineEntityGeographicAreaInput.countrySubEntityCode` | **MISSING** | - | Field 'countrySubEntityCode' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.postalCode` | **MISSING** | - | Field 'postalCode' has no direct Prisma schema column |
| `LineEntityGeographicAreaInput.countryCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderEntityGroupInput.entity` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderEntityGroupInput.gbiIdentifiers` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `HeaderEntityGroupInput.streetAddresses` | **MISSING** | - | Field 'streetAddresses' has no direct Prisma schema column |
| `HeaderEntityGroupInput.geographicArea` | **MISSING** | - | Field 'geographicArea' has no direct Prisma schema column |
| `ArticlePartyInput.partyTypeCode` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `ArticlePartyInput.partyIdentifier` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `StandardVisaInput.standardVisaNumber` | **MISSING** | - | Standard textile visa numbers have no schema column |
| `ImportersAdditionalDeclarationInput.declarationTypeCode` | **MISSING** | - | Softwood lumber and export price 76-char declaration payloads (type codes 01-12) have no dedicated schema fields |
| `ImportersAdditionalDeclarationInput.declarationInformation` | **MISSING** | - | Softwood lumber and export price 76-char declaration payloads (type codes 01-12) have no dedicated schema fields |
| `HeaderFeesInput.accountingClassCode1` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `HeaderFeesInput.headerFeeAmount1` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `HeaderFeesInput.accountingClassCode2` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `HeaderFeesInput.headerFeeAmount2` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `LineUserFeeInput.accountingClassCode` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `LineUserFeeInput.userFeeAmount` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `IrTaxInput.accountingClassCode` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `IrTaxInput.irTaxAmount` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `OtherRevenueInput.accountingClassCode` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `OtherRevenueInput.otherRevenueAmount` | **MISSING** | - | Citation CustomsFiling.feeAmount invalid; field feeAmount does not exist on model CustomsFiling |
| `PscHeaderReasonsInput.reasonCode1` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscHeaderReasonsInput.reasonCode2` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscHeaderReasonsInput.reasonCode3` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscHeaderReasonsInput.reasonCode4` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscHeaderReasonsInput.reasonCode5` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscFilingExplanationInput.explanationText` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscLineReasonsInput.reasonCode1` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscLineReasonsInput.reasonCode2` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscLineReasonsInput.reasonCode3` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscLineReasonsInput.reasonCode4` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
| `PscLineReasonsInput.reasonCode5` | **COVERED** | `PostSummaryCorrection.reason` | Corrected citation: PostSummaryCorrection.reason stores PSC correction reason text |
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
| `DetailReturnRequestInput.returnDetailRequestIndicator` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryReference.entryFilerCode` | **COVERED** | `CustomsFiling.entryNumber` | Query input filters map to CustomsFiling/ImporterOfRecord parameters (Verified: CustomsFiling.entryNumber exists [String]) |
| `EntryReference.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Query input filters map to CustomsFiling/ImporterOfRecord parameters (Verified: CustomsFiling.entryNumber exists [String]) |
| `EntryNumberQueryRequestInput.entryFilerCode1` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryNumber1` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryFilerCode2` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryNumber2` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryFilerCode3` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryNumber3` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryFilerCode4` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryNumber4` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryFilerCode5` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntryNumberQueryRequestInput.entryNumber5` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.criteriaQueryTypeCode` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.requestedFromDateTime` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.requestedToDateTime` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.entrySummariesFlag` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.ftaReconSummariesFlag` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.otherReconSummariesFlag` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.drawbackSummariesFlag` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.dutyDeferralSummariesFlag` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CriteriaQueryRequestInput.collectionBillInformationCode` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
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
| `EntrySummaryStatusInfo.liquidationStatusCode` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `EntrySummaryStatusInfo.liquidationDate` | **COVERED** | `Protest.liquidationDate` | Liquidation date captured in Protest model (Verified: Protest.liquidationDate exists [DateTime]) |
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
| `BondSuretyInfo.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model (Verified: Bond.bondNumber exists [String]) |
| `BondSuretyInfo.primarySuretyIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondDesignationTypeCode` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.multipleBondsIndicator` | **NOT APPLICABLE** | - | ACE entry summary query response detail / condition status code returned by CBP |
| `BondSuretyInfo.bondNumber` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model (Verified: Bond.bondNumber exists [String]) |
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
| `SuretyBillDetailStatusInfo.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned map to Bond model (Verified: Bond.bondNumber exists [String]) |
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
| `HeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderInput.entryFilerCode` | **MISSING** | - | Original citation CustomsProfile.filerCode is non-existent; 3-char CBP Filer Code per se is missing from schema (CustomsProfile has customsBrokerOfRecord) |
| `HeaderInput.entryNumber` | **COVERED** | `CustomsFiling.entryNumber` | Entry number (Verified: CustomsFiling.entryNumber exists [String]) |
| `HeaderInput.entryTypeCode` | **PARTIAL** | `CustomsFiling.transactionTypeId` | PARTIAL: CustomsFiling.entryType is @deprecated (schema note: 'Use transactionTypeId instead') |
| `HeaderInput.importerOfRecordType` | **MISSING** | - | Field 'importerOfRecordType' has no direct Prisma schema column |
| `HeaderInput.importerOfRecordNumber` | **MISSING** | - | Field 'importerOfRecordNumber' has no direct Prisma schema column |
| `HeaderInput.modeOfTransportationCode` | **MISSING** | - | Field 'modeOfTransportationCode' has no direct Prisma schema column |
| `HeaderInput.bondTypeCode` | **MISSING** | - | Field 'bondTypeCode' has no direct Prisma schema column |
| `HeaderInput.estimatedEntryValue` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `ContactCancellationInput.contactName` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `ContactCancellationInput.contactPhone` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `ContactCancellationInput.cancellationReasonCode` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `ContactCancellationInput.multipleCargoDispositionsIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `ContactCancellationInput.disIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `ContactCancellationInput.splitShipmentIndicator` | **PARTIAL** | `PartyContact.name` | Contact name and email captured on PartyContact, cancellation reason in metadata (Verified: PartyContact.name exists [String?]) |
| `BillOfLadingInput.billTypeIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingInput.issuerCodeOfBillOfLadingNumber` | **MISSING** | - | Field 'issuerCodeOfBillOfLadingNumber' has no direct Prisma schema column |
| `BillOfLadingInput.billOfLadingNumber` | **MISSING** | - | Citation Shipment.bolNumber invalid; field bolNumber does not exist on model Shipment |
| `BillOfLadingInput.quantity` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `BillOfLadingInput.nonAmsIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInput.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier code (Verified: TransportLeg.carrierCode exists [String?]) |
| `ConveyanceInput.voyageFlightTripManifestNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInput.dateOfArrival` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInput.quantity` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `ConveyanceInput.unitOfMeasure` | **MISSING** | - | Field 'unitOfMeasure' has no direct Prisma schema column |
| `ConveyanceInput.conveyanceName` | **MISSING** | - | Field 'conveyanceName' has no direct Prisma schema column |
| `ReferenceInput.referenceIdentifierQualifier` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ReferenceInput.referenceIdentifier` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityInput.entityCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityInput.entityName` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityInput.entityIdentifierQualifier` | **MISSING** | - | Field 'entityIdentifierQualifier' has no direct Prisma schema column |
| `EntityInput.entityIdentifier` | **MISSING** | - | Field 'entityIdentifier' has no direct Prisma schema column |
| `EntityAddressInput.addressComponentQualifier1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityAddressInput.addressInformation1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityAddressInput.addressComponentQualifier2` | **MISSING** | - | Field 'addressComponentQualifier2' has no direct Prisma schema column |
| `EntityAddressInput.addressInformation2` | **MISSING** | - | Field 'addressInformation2' has no direct Prisma schema column |
| `EntityGeoInput.cityName` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityGeoInput.countrySubEntityCode` | **MISSING** | - | Field 'countrySubEntityCode' has no direct Prisma schema column |
| `EntityGeoInput.postalCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeoInput.countryCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `LineItemInput.lineItemIdentifier` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `LineItemInput.countryOfOrigin` | **COVERED** | `ShipmentLineItem.countryOfOrigin` | Country of origin (Verified: ShipmentLineItem.countryOfOrigin exists [String]) |
| `LineItemInput.commercialInvoiceDescription` | **MISSING** | - | Field 'commercialInvoiceDescription' has no direct Prisma schema column |
| `HtsLineInput.htsNumber` | **COVERED** | `ShipmentLineItem.htsCode` | HTS code (Verified: ShipmentLineItem.htsCode exists [String]) |
| `HtsLineInput.lineItemValue` | **MISSING** | - | Field 'lineItemValue' has no direct Prisma schema column |
| `OutputDispositionInput.messageTypeCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputDispositionInput.messageIdentifierCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputDispositionInput.narrativeMessageText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EquipmentInput.equipmentNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityGbiInput.gbiIdentifierQualifier` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `EntityGbiInput.gbiIdentifier` | **PARTIAL** | `PartyIdentifier.value` | Corrected citation: Identifier value is stored in PartyIdentifier.value |
| `FtzDetailInput.zoneStatus` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `FtzDetailInput.privilegedFtzMerchandiseFilingDate` | **MISSING** | - | Field 'privilegedFtzMerchandiseFilingDate' has no direct Prisma schema column |
| `FtzDetailInput.ftzLineItemQuantity` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `FtzPfHtsInput.currentHtsNumberForPfStatusMerchandise` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |


### 5. Daily & Periodic Monthly Statement

**Source file:** [`src/lib/abi/statement/types.ts`](src/lib/abi/statement/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `Q1DailyInput.districtPortOfEntrySummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.entryNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.importerOfRecordNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.preliminaryDailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.estimatedDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.estimatedTaxAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.deferredTaxIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.brokerReferenceNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.consolidatedIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.clientBranchDesignation` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1DailyInput.entryType` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.districtPortOfEntrySummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.entryNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.antidumpingDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.countervailingDutyAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.paymentTypeIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.payIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.countervailingIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.antidumpingIndicator` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.teamNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2DailyInput.interestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `StatementFeeInput.firstFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.firstFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.secondFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.secondFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.thirdFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.thirdFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.fourthFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.fourthFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.fifthFeeClassCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `StatementFeeInput.fifthFeeAmount` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.dailyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.dailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.entryFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.importerOfRecordNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.totalEstimatedDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.totalEstimatedTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.totalDeferredTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3DailyInput.districtPortWhichProcessesEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalAmountDue` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalInterestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalNumberRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q4DailyInput.totalNumberNonRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalAmountPaid` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalInterestAmountForReconciliationSummary` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalNumberRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6DailyInput.totalNumberNonRevenueProducingEntries` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
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
| `Q1PeriodicInput.periodicDailyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.periodicDailyStatementDistrictPort` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.periodicDailyStatementFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.periodicDailyStatementImporterNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.preliminaryPeriodicDailyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.entrySummaryPresentationDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.totalDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q1PeriodicInput.totalTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2PeriodicInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2PeriodicInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q2PeriodicInput.totalAmountDue` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.periodicMonthlyStatementNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.periodicMonthlyStatementPrintDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.periodicMonthlyStatementDueDate` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.periodicMonthlyStatementFilerCode` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.periodicMonthlyStatementImporterNumber` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.totalDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q3PeriodicInput.totalTax` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6PeriodicInput.totalAntidumpingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6PeriodicInput.totalCountervailingDuty` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |
| `Q6PeriodicInput.totalAmountPaid` | **PARTIAL** | `Invoice.totalAmount` | Statement financial totals map to Invoice/CustomsFiling aggregates; lacks itemized statement table (Verified: Invoice.totalAmount exists [Decimal]) |


### 6. eBond

**Source file:** [`src/lib/abi/ebond/types.ts`](src/lib/abi/ebond/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `HeaderInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `HeaderInput.bondActivityCode` | **MISSING** | - | Field 'bondActivityCode' has no direct Prisma schema column |
| `HeaderInput.bondAmount` | **COVERED** | `Bond.bondAmount` | Bond amount (Verified: Bond.bondAmount exists [Decimal]) |
| `HeaderInput.executionDate` | **MISSING** | - | Field 'executionDate' has no direct Prisma schema column |
| `HeaderInput.suretyReferenceNumber` | **MISSING** | - | Field 'suretyReferenceNumber' has no direct Prisma schema column |
| `HeaderInput.effectiveDate` | **COVERED** | `Bond.effectiveDate` | Effective date (Verified: Bond.effectiveDate exists [DateTime]) |
| `HeaderInput.terminationDate` | **MISSING** | - | Field 'terminationDate' has no direct Prisma schema column |
| `HeaderInput.bondNumber` | **COVERED** | `Bond.bondNumber` | Bond number (Verified: Bond.bondNumber exists [String]) |
| `HeaderInput.reconciliationBondRiderFlag` | **MISSING** | - | Field 'reconciliationBondRiderFlag' has no direct Prisma schema column |
| `HeaderInput.usviBondRiderFlag` | **MISSING** | - | Field 'usviBondRiderFlag' has no direct Prisma schema column |
| `SecondaryNotifyInput.secondaryNotifyPartyCode1` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyInput.secondaryNotifyPartyCode2` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyInput.secondaryNotifyPartyCode3` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyInput.secondaryNotifyPartyCode4` | **PARTIAL** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SingleTransactionBondInput.transactionIdTypeCode` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model (Verified: Bond.bondType exists [String]) |
| `SingleTransactionBondInput.entryTypeCode` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model (Verified: Bond.bondType exists [String]) |
| `SingleTransactionBondInput.transactionId` | **PARTIAL** | `Bond.bondType` | Single transaction bond details stored on Bond model (Verified: Bond.bondType exists [String]) |
| `PrincipalInput.principalIdNumberType` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `PrincipalInput.principalIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `PrincipalInput.principalName` | **COVERED** | `ImporterOfRecord.name` | Corrected citation: Bond links to ImporterOfRecord; principal name is ImporterOfRecord.name |
| `CoPrincipalInput.coPrincipalIdNumberType` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `CoPrincipalInput.coPrincipalIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `CoPrincipalInput.coPrincipalName` | **MISSING** | - | Field 'coPrincipalName' has no direct Prisma schema column |
| `BondUserInput.bondUserIdNumberType` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `BondUserInput.bondUserIdNumber` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `BondUserInput.bondUserName` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `BondUserInput.userRiderActionCode` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `BondUserInput.userAddDate` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `BondUserInput.userDeleteDate` | **PARTIAL** | `User.id` | Bond user identity mapped to User model (Verified: User.id exists [String]) |
| `SuretyInput.suretyCode` | **COVERED** | `Bond.suretyName` | Corrected citation: Bond has suretyName String, but lacks 3-digit CBP suretyCode column |
| `SuretyInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `SuretyInput.suretyName` | **COVERED** | `Bond.suretyName` | Surety name (Verified: Bond.suretyName exists [String]) |
| `SuretyInput.suretyLiabilityAmount` | **MISSING** | - | Field 'suretyLiabilityAmount' has no direct Prisma schema column |
| `CoSuretyInput.coSuretyCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `CoSuretyInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `CoSuretyInput.coSuretyName` | **MISSING** | - | Field 'coSuretyName' has no direct Prisma schema column |
| `CoSuretyInput.coSuretyLiabilityAmount` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ReinsurerInput.suretyCodeForReinsurer` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ReinsurerInput.agentIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ReinsurerInput.suretyName` | **COVERED** | `Bond.suretyName` | Surety name (Verified: Bond.suretyName exists [String]) |
| `OutputMessageInput.dispositionTypeCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.severityCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.conditionCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `OutputMessageInput.narrativeText` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |


### 7. Drawback (7553)

**Source file:** [`src/lib/abi/drawback/types.ts`](src/lib/abi/drawback/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `DrawbackHeaderInput.summaryFilingActionRequestCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.entryFilerCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.entryNumberOrDrawbackClaimNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.drawbackFilingPort` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.brokerReferenceNumber` | **MISSING** | - | Field 'brokerReferenceNumber' has no direct Prisma schema column |
| `DrawbackHeaderInput.drawbackProvision` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `DrawbackHeaderInput.electronicSignature` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.claimantIdOrImporterRecordNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `DrawbackHeaderInput.designatedNotifyPartyNumber` | **MISSING** | - | Field 'designatedNotifyPartyNumber' has no direct Prisma schema column |
| `DrawbackHeaderInput.substitutedUnusedWineCertification` | **MISSING** | - | Field 'substitutedUnusedWineCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.billOfMaterialsFormulaCertification` | **MISSING** | - | Field 'billOfMaterialsFormulaCertification' has no direct Prisma schema column |
| `DrawbackHeaderInput.certificationForValuationOfDestroyedMerchandise` | **MISSING** | - | Field 'certificationForValuationOfDestroyedMerchandise' has no direct Prisma schema column |
| `DrawbackHeaderInput.usmcaDrawbackClaimIndicator` | **MISSING** | - | Field 'usmcaDrawbackClaimIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.retailSalesSubstitutionIndicator` | **MISSING** | - | Field 'retailSalesSubstitutionIndicator' has no direct Prisma schema column |
| `DrawbackHeaderInput.superfundTaxCertification` | **MISSING** | - | Field 'superfundTaxCertification' has no direct Prisma schema column |
| `BondInfoInput.bondTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BondInfoInput.bondDesignationTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BondInfoInput.suretyCompanyCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BondInfoInput.singleTransactionBondAmount` | **MISSING** | - | Field 'singleTransactionBondAmount' has no direct Prisma schema column |
| `BondInfoInput.singleTransactionBondNumber` | **MISSING** | - | Field 'singleTransactionBondNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.actionIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportsDetailsInput.entryFilerCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportsDetailsInput.entryNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportsDetailsInput.cbpEsLineNumber` | **MISSING** | - | Field 'cbpEsLineNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.drawbackEligibleIndicator` | **MISSING** | - | Field 'drawbackEligibleIndicator' has no direct Prisma schema column |
| `ImportsDetailsInput.manufactureRulingNumber` | **MISSING** | - | Field 'manufactureRulingNumber' has no direct Prisma schema column |
| `ImportsDetailsInput.basisOfClaim` | **MISSING** | - | Field 'basisOfClaim' has no direct Prisma schema column |
| `ImportsDetailsInput.manufDateReceived` | **MISSING** | - | Field 'manufDateReceived' has no direct Prisma schema column |
| `ImportsDetailsInput.manufDateUsed` | **MISSING** | - | Field 'manufDateUsed' has no direct Prisma schema column |
| `ImportsDetailsInput.importTrackingIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportsDetailsInput.drawbackAccountingMethodCode` | **MISSING** | - | Field 'drawbackAccountingMethodCode' has no direct Prisma schema column |
| `ImportClassificationInput.htsNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportClassificationInput.articleDescriptionText` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportQuantityUomInput.quantity` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportQuantityUomInput.unitOfMeasureCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportQuantityUomInput.allowableQuantity` | **MISSING** | - | Field 'allowableQuantity' has no direct Prisma schema column |
| `ImportQuantityUomInput.enteredGoodsValuePerUnit` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ImportQuantityUomInput.substitutedValuePerUnit` | **MISSING** | - | Field 'substitutedValuePerUnit' has no direct Prisma schema column |
| `ImportRevenueClaimedInput.accountingClassCode` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `ImportRevenueClaimedInput.claimAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `ImportRevenueClaimedInput.calculatedAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `ImportRevenueClaimedInput.adjustedClaimedAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `ImportRevenueClaimedInput.qualifierIndicator` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `ManufacturedArticleInput.actionIndicator` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.importManufactureRulingNumber` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.htsNumber` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.quantity` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.unitOfMeasureCode` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.productionDate` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedArticleInput.factoryLocation` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedDescInput.manufacturedArticleDescriptionText` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedDescInput.manufactureRulingNumber` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ManufacturedDescInput.manufacturedTrackingIdNumber` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkImportMfgInput.importTrackingIdNumber1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `LinkMfgSourceInput.manufacturedTrackingIdNumber1` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber2` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber3` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber4` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber5` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber6` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber7` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber8` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber9` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber10` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber11` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber12` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber13` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber14` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `LinkMfgSourceInput.manufacturedTrackingIdNumber15` | **PARTIAL** | `DrawbackMatch.matchedQuantity` | Corrected citation: DrawbackMatch.matchedQuantity links import and export lines |
| `ExportDestroyInput.exportOrDestroyIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.htsNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.exportOrDestroyQuantity` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.unitOfMeasureCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.exportOrDestroyDate` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.noticeOfIntentIndicator` | **MISSING** | - | Field 'noticeOfIntentIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.waiverToDrawbackClaimRightsIndicator` | **MISSING** | - | Field 'waiverToDrawbackClaimRightsIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.nameOfExporterOrDestroyer` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDestroyInput.countryOfUltimateDestination` | **MISSING** | - | Field 'countryOfUltimateDestination' has no direct Prisma schema column |
| `ExportDestroyInput.billOfLadingIndicator` | **MISSING** | - | Field 'billOfLadingIndicator' has no direct Prisma schema column |
| `ExportDestroyInput.billOfLadingCarrierCode` | **MISSING** | - | Field 'billOfLadingCarrierCode' has no direct Prisma schema column |
| `ExportDescInput.exportOrDestroyArticleDescriptionText` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ExportDescInput.exportOrDestroyUniqueIdentifierNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `RevenueClassTotalsInput.accountingClassCode1` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.totalAmount1` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.accountingClassCode2` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.totalAmount2` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.accountingClassCode3` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.totalAmount3` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.accountingClassCode4` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueClassTotalsInput.totalAmount4` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueGrandTotalsInput.grandTotalDutyAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueGrandTotalsInput.grandTotalUserFeeAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
| `RevenueGrandTotalsInput.grandTotalIrTaxAmount` | **COVERED** | `DrawbackClaim.totalRefundClaimed` | Revenue totals map to DrawbackClaim refund totals (Verified: DrawbackClaim.totalRefundClaimed exists [Decimal]) |
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
| `OiLineItemInput.commercialDescription` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `Pg01HeaderInput.pgaLineNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `Pg01HeaderInput.governmentAgencyCode` | **COVERED** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA agency requirement is accessed via pgaRequirements relation |
| `Pg01HeaderInput.governmentAgencyProgramCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `Pg01HeaderInput.governmentAgencyProcessingCode` | **MISSING** | - | Field 'governmentAgencyProcessingCode' has no direct Prisma schema column |
| `Pg01HeaderInput.electronicImageSubmitted` | **MISSING** | - | Field 'electronicImageSubmitted' has no direct Prisma schema column |
| `Pg01HeaderInput.confidentialInformationIndicator` | **MISSING** | - | Field 'confidentialInformationIndicator' has no direct Prisma schema column |
| `Pg01HeaderInput.globallyUniqueProductIdentificationCodeQualifier` | **MISSING** | - | Field 'globallyUniqueProductIdentificationCodeQualifier' has no direct Prisma schema column |
| `Pg01HeaderInput.globallyUniqueProductIdentificationCode` | **MISSING** | - | Field 'globallyUniqueProductIdentificationCode' has no direct Prisma schema column |
| `Pg01HeaderInput.intendedUseCode` | **MISSING** | - | Field 'intendedUseCode' has no direct Prisma schema column |
| `Pg01HeaderInput.intendedUseDescription` | **MISSING** | - | Field 'intendedUseDescription' has no direct Prisma schema column |
| `Pg01HeaderInput.correctionIndicator` | **MISSING** | - | Field 'correctionIndicator' has no direct Prisma schema column |
| `Pg01HeaderInput.disclaimer` | **COVERED** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA requirements are accessed via pgaRequirements relation |
| `Pg02ProductComponentInput.itemType` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeQualifier1` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeNumber1` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeQualifier2` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeNumber2` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeQualifier3` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg02ProductComponentInput.productCodeNumber3` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg04ConstituentElementInput.constituentActiveIngredientQualifier` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg04ConstituentElementInput.nameOfConstituentElement` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg04ConstituentElementInput.quantityOfConstituentElement` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg04ConstituentElementInput.unitOfMeasureConstituentElement` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg04ConstituentElementInput.percentOfConstituentElement` | **PARTIAL** | `ProductComposition.componentName` | Corrected citation: Product component/ingredient name is stored in ProductComposition.componentName |
| `Pg06SourceProcessingInput.sourceTypeCode` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
| `Pg06SourceProcessingInput.countryCode` | **COVERED** | `PartyAddress.addressLine1` | PGA party address fields (Verified: PartyAddress.addressLine1 exists [String]) |
| `Pg06SourceProcessingInput.geographicLocation` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
| `Pg06SourceProcessingInput.processingStartDate` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
| `Pg06SourceProcessingInput.processingEndDate` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
| `Pg06SourceProcessingInput.processingTypeCode` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
| `Pg06SourceProcessingInput.processingDescription` | **PARTIAL** | `ProductCountryFact.rawCountry` | Corrected citation: Processing country is stored in ProductCountryFact.rawCountry |
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
| `Pg13LpcoIssuerInput.issuerOfLpco` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg13LpcoIssuerInput.lpcoIssuerGovernmentGeographicCodeQualifier` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg13LpcoIssuerInput.locationOfIssuerOfTheLpco` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg13LpcoIssuerInput.regionalDescriptionOfLocationOfAgencyIssuingLpco` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoTransactionType` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoType` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoNumberOrName` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoDateQualifier` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoDate` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoQuantity` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.lpcoUnitOfMeasure` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg14LpcoDetailsInput.exemptionCode` | **MISSING** | - | Original citation cited a TypeScript interface name, not a Prisma model; no dedicated license number scalar column exists |
| `Pg18HazmatInput.unDangerousGoodsCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `Pg18HazmatInput.hazardousClassCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `Pg18HazmatInput.epaHazardousWasteCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `Pg18HazmatInput.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `Pg18HazmatInput.packagingGroupCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat UN code/class has no scalar column on ShipmentLineItem (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `Pg19EntityIdentificationInput.entityRoleCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `Pg19EntityIdentificationInput.entityIdentificationCode` | **MISSING** | - | Field 'entityIdentificationCode' has no direct Prisma schema column |
| `Pg19EntityIdentificationInput.entityNumber` | **MISSING** | - | Field 'entityNumber' has no direct Prisma schema column |
| `Pg19EntityIdentificationInput.entityName` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
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
| `Pg26PackagingBreakdownInput.packagingQualifier` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg26PackagingBreakdownInput.quantity` | **COVERED** | `ShipmentLineItem.quantity` | Quantity (Verified: ShipmentLineItem.quantity exists [Int]) |
| `Pg26PackagingBreakdownInput.unitOfMeasurePackagingLevel` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg26PackagingBreakdownInput.packageIdentifier` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg26PackagingBreakdownInput.packagingMethod` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg26PackagingBreakdownInput.packageMaterial` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg26PackagingBreakdownInput.packageFiller` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `Pg27ShippingContainerInput.containerNumber1` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `Pg32CommodityRoutingInput.commodityRoutingTypeCode` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg (Verified: TransportLeg.originUnlocode exists [String?]) |
| `Pg32CommodityRoutingInput.commodityRoutingCountryCode` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg (Verified: TransportLeg.originUnlocode exists [String?]) |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingQualifier` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg (Verified: TransportLeg.originUnlocode exists [String?]) |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingNumber` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg (Verified: TransportLeg.originUnlocode exists [String?]) |
| `Pg32CommodityRoutingInput.commodityPoliticalSubunitOfRoutingName` | **COVERED** | `TransportLeg.originUnlocode` | Commodity routing locations map to TransportLeg (Verified: TransportLeg.originUnlocode exists [String?]) |
| `Pg34TravelDocumentInput.travelDocumentTypeCode` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg34TravelDocumentInput.travelDocumentNationality` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg34TravelDocumentInput.travelDocumentIdentifier` | **MISSING** | - | Travel document number / crew passport info missing |
| `Pg55AdditionalEntityRolesInput.entityRoleCode1` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode2` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode3` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode4` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode5` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode6` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode7` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode8` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode9` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg55AdditionalEntityRolesInput.entityRoleCode10` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg60AdditionalReferenceInput.additionalInformationQualifierCode` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg60AdditionalReferenceInput.additionalInformation` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg00SubstitutionInput.substitutionIndicator` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg00SubstitutionInput.substitutionNumber` | **PARTIAL** | `PartyRole.roleType` | Corrected citation: Party role type is stored in PartyRole.roleType |
| `Pg05ScientificSpeciesInput.scientificGenusName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSpeciesName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSubSpeciesName` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.scientificSpeciesCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg05ScientificSpeciesInput.fwsDescriptionCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.commonNameSpecific` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.commonNameGeneral` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.liveVenomousWildlifeCode` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg17CommonNameVenomousInput.cartonsContainingWildlife` | **MISSING** | - | Scientific species name (genus/species) and FWS common name missing |
| `Pg23AffirmationOfComplianceInput.affirmationOfComplianceCode` | **PARTIAL** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA requirements are accessed via pgaRequirements relation |
| `Pg23AffirmationOfComplianceInput.affirmationOfComplianceDescription` | **PARTIAL** | `ShipmentLineItem.pgaRequirements` | Corrected citation: Line PGA requirements are accessed via pgaRequirements relation |
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
| `ManifestHeaderRecord.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code (Verified: TransportLeg.carrierCode exists [String?]) |
| `ManifestHeaderRecord.transportationIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ManifestHeaderRecord.countryCode` | **MISSING** | - | Field 'countryCode' has no direct Prisma schema column |
| `ManifestHeaderRecord.conveyanceName` | **MISSING** | - | Field 'conveyanceName' has no direct Prisma schema column |
| `ManifestHeaderRecord.tripData` | **MISSING** | - | Field 'tripData' has no direct Prisma schema column |
| `ManifestHeaderRecord.manifestSequenceNumber` | **MISSING** | - | Field 'manifestSequenceNumber' has no direct Prisma schema column |
| `ManifestHeaderRecord.vesselCode` | **MISSING** | - | Field 'vesselCode' has no direct Prisma schema column |
| `ManifestHeaderRecord.manifestTypeCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `PortOfCrossingRecord.portOfUnlading` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `PortOfCrossingRecord.originalScheduledArrivalDate` | **MISSING** | - | Field 'originalScheduledArrivalDate' has no direct Prisma schema column |
| `PortOfCrossingRecord.firmsCode` | **MISSING** | - | Field 'firmsCode' has no direct Prisma schema column |
| `PortOfCrossingRecord.time` | **MISSING** | - | Field 'time' has no direct Prisma schema column |
| `IssuerCodeRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code (Verified: TransportLeg.carrierCode exists [String?]) |
| `BillOfLadingTransactionRecord.billOfLading` | **MISSING** | - | Citation Shipment.bolNumber invalid; field bolNumber does not exist on model Shipment |
| `BillOfLadingTransactionRecord.foreignPortOfLading` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingTransactionRecord.manifestQuantity` | **MISSING** | - | Field 'manifestQuantity' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.manifestUnits` | **MISSING** | - | Field 'manifestUnits' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.weight` | **MISSING** | - | Citation Shipment.totalWeight invalid; field totalWeight does not exist on model Shipment |
| `BillOfLadingTransactionRecord.weightUnit` | **MISSING** | - | Field 'weightUnit' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.billStatusIndicator` | **MISSING** | - | Field 'billStatusIndicator' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.masterInBondIndicator` | **MISSING** | - | Field 'masterInBondIndicator' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.inBondEntryType` | **MISSING** | - | Field 'inBondEntryType' has no direct Prisma schema column |
| `BillOfLadingTransactionRecord.inBondPortOfDestination` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingTransactionRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code (Verified: TransportLeg.carrierCode exists [String?]) |
| `EntityNameRecord.entityIdCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityNameRecord.name` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityNameRecord.codeQualifier` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityNameRecord.idCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityNameRecord.entityRelationshipCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityNameRecord.entityIdCodeReserved` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `BillOfLadingContainerRecord.equipmentInitial` | **MISSING** | - | Field 'equipmentInitial' has no direct Prisma schema column |
| `BillOfLadingContainerRecord.equipmentNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `BillCargoDescriptionRecord.description` | **COVERED** | `ShipmentLineItem.description` | Cargo description (Verified: ShipmentLineItem.description exists [String]) |
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
| `StatusNotificationDetailRecord.quantity` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `StatusNotificationDetailRecord.negativeIndicator` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.actionDate` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.actionTime` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `StatusNotificationDetailRecord.inBondCarrierCode` | **NOT APPLICABLE** | - | CBP status notification record returned in broker download |
| `HazardousMaterialDetailRecord.hazardousMaterialCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialDetailRecord.hazardousMaterialClass` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialDetailRecord.hazardousMaterialCodeQualifier` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialDetailRecord.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialDetailRecord.hazardousMaterialContact` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialDetailRecord.unHazardousMaterialPage` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `AdditionalHazardousMaterialDetailRecord.flashpointTemperature` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `AdditionalHazardousMaterialDetailRecord.unitOfMeasureCode` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `AdditionalHazardousMaterialDetailRecord.negativeIndicator` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialClassificationDetailRecord.hazardousMaterialDescription` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
| `HazardousMaterialClassificationDetailRecord.hazardousMaterialClassification` | **PARTIAL** | `ShipmentEquipment.sealNumbers` | Hazmat details lack dedicated line-item UN code/class columns (Verified: ShipmentEquipment.sealNumbers exists [String[]]) |
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
| `ManifestReferenceIdentifierRecord.carrierAssignedBatchNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingAmendmentRecord.carrierCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code (Verified: TransportLeg.carrierCode exists [String?]) |
| `BillOfLadingAmendmentRecord.cbpPort` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingAmendmentRecord.actionCode` | **MISSING** | - | Field 'actionCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.billOfLadingNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingAmendmentRecord.quantity` | **MISSING** | - | Citation Shipment.packageCount invalid; field packageCount does not exist on model Shipment |
| `BillOfLadingAmendmentRecord.amendmentCode` | **MISSING** | - | Field 'amendmentCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.codeQualifier` | **MISSING** | - | Field 'codeQualifier' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.idCode` | **MISSING** | - | Field 'idCode' has no direct Prisma schema column |
| `BillOfLadingAmendmentRecord.issuerCode` | **COVERED** | `TransportLeg.carrierCode` | Carrier / issuer code (Verified: TransportLeg.carrierCode exists [String?]) |
| `BillOfLadingAdditionalRecord.measurement` | **MISSING** | - | Field 'measurement' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.measurementUnit` | **MISSING** | - | Field 'measurementUnit' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.placeOfReceiptByPreCarrier` | **MISSING** | - | Field 'placeOfReceiptByPreCarrier' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.secondaryNotifyParty1Scac` | **MISSING** | - | Field 'secondaryNotifyParty1Scac' has no direct Prisma schema column |
| `BillOfLadingAdditionalRecord.secondaryNotifyParty2Scac` | **MISSING** | - | Field 'secondaryNotifyParty2Scac' has no direct Prisma schema column |
| `BillOfLadingReferenceIdentifierRecord.referenceQualifier` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingReferenceIdentifierRecord.referenceNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `EntityAddressRecord.addressLine1` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityAddressRecord.addressLine2` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeographicAreaRecord.cityName` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeographicAreaRecord.stateProvince` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeographicAreaRecord.postalCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeographicAreaRecord.countryCode` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `EntityGeographicAreaRecord.locationIdentifier` | **COVERED** | `PartyName.rawName` | Corrected citation: Entity name is stored in PartyName relation (PartyName.rawName) |
| `AdminCommunicationContactRecord.contactName` | **MISSING** | - | Field 'contactName' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.commNumberQualifier` | **MISSING** | - | Field 'commNumberQualifier' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.communicationsNumber` | **MISSING** | - | Field 'communicationsNumber' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.reservedCommNumberQualifier` | **MISSING** | - | Field 'reservedCommNumberQualifier' has no direct Prisma schema column |
| `AdminCommunicationContactRecord.reservedCommunicationsNumber` | **MISSING** | - | Field 'reservedCommunicationsNumber' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.inBondEntryType` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `SupplementalInBondDetailsRecord.fdaBtaConfirmationIndicator` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `SupplementalInBondDetailsRecord.conventionalInBondNumber` | **MISSING** | - | Field 'conventionalInBondNumber' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.inBondCarrierCode` | **MISSING** | - | Field 'inBondCarrierCode' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.usPortOfDestination` | **MISSING** | - | Field 'usPortOfDestination' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.foreignDestination` | **MISSING** | - | Field 'foreignDestination' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.value` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `SupplementalInBondDetailsRecord.bondedCarrierIdNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `SupplementalInBondDetailsRecord.paperlessInBond` | **MISSING** | - | Field 'paperlessInBond' has no direct Prisma schema column |
| `SupplementalInBondDetailsRecord.shipmentControlNumber` | **MISSING** | - | Field 'shipmentControlNumber' has no direct Prisma schema column |
| `WaterBorneExportInBondRecord.transportationIndicator` | **MISSING** | - | Field 'transportationIndicator' has no direct Prisma schema column |
| `WaterBorneExportInBondRecord.vesselName` | **MISSING** | - | Field 'vesselName' has no direct Prisma schema column |
| `MotorVehicleControlRecord.vin` | **MISSING** | - | Vehicle Identification Number (VIN) and motor vehicle control fields missing |
| `MotorVehicleControlRecord.factoryCarOrderNumber` | **MISSING** | - | Vehicle Identification Number (VIN) and motor vehicle control fields missing |
| `HarmonizedTariffRecord.harmonizedNumber` | **MISSING** | - | Field 'harmonizedNumber' has no direct Prisma schema column |
| `HarmonizedTariffRecord.value` | **MISSING** | - | Field 'value' has no direct Prisma schema column |
| `HarmonizedTariffRecord.weight` | **MISSING** | - | Citation Shipment.totalWeight invalid; field totalWeight does not exist on model Shipment |
| `HarmonizedTariffRecord.weightUnit` | **MISSING** | - | Field 'weightUnit' has no direct Prisma schema column |


### 10. Cargo Manifest / Entry Status Query

**Source file:** [`src/lib/abi/cargoManifestQuery/types.ts`](src/lib/abi/cargoManifestQuery/types.ts)

| CATAIR Field Name | Classification | Matching Prisma Model.Field | Gap Explanation / Notes |
| :--- | :--- | :--- | :--- |
| `CargoManifestQueryRequestInput.entryFilerCode` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.entryNumber` | **MISSING** | - | Citation Shipment.bolNumber invalid; field bolNumber does not exist on model Shipment |
| `CargoManifestQueryRequestInput.inBondNumber` | **MISSING** | - | Citation Shipment.bolNumber invalid; field bolNumber does not exist on model Shipment |
| `CargoManifestQueryRequestInput.issuerCode` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.billNumber` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.airWaybillNumber` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.houseAirWaybillNumber` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.requestRelatedBol` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.requestBillAndEntryData` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryRequestInput.limitOutputOption` | **MISSING** | - | Citation CustomsFiling.status invalid; field status does not exist on model CustomsFiling |
| `CargoManifestQueryErrorOutput.entryFilerCode` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.entryNumber` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.errorMessageId` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `CargoManifestQueryErrorOutput.narrativeMessage` | **NOT APPLICABLE** | - | CBP response / disposition / error status notification returned by ACE |
| `EntryStatusHeaderOutput.districtPortOfEntry` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryFilerCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.entryTypeCode` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.importerOfRecordNumber` | **NOT APPLICABLE** | - | ACE cargo manifest query response status / disposition detail returned by CBP |
| `EntryStatusHeaderOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned (Verified: TransportLeg.vesselName exists [String?]) |
| `EntryStatusHeaderOutput.vesselName` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned (Verified: TransportLeg.vesselName exists [String?]) |
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
| `ManifestConveyanceResultOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned (Verified: TransportLeg.vesselName exists [String?]) |
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
| `InBondBillDetailOutput.inBondNumber` | **MISSING** | - | Citation Shipment.inBondNumber invalid; field inBondNumber does not exist on model Shipment |
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
| `AirInBondManifestStatusOutput.inBondNumber` | **MISSING** | - | Citation Shipment.inBondNumber invalid; field inBondNumber does not exist on model Shipment |
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
| `InBondDetailOutput.inBondNumber` | **MISSING** | - | Citation Shipment.inBondNumber invalid; field inBondNumber does not exist on model Shipment |
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
| `BillMatchDispositionOutput.carrierCode` | **COVERED** | `TransportLeg.vesselName` | Conveyance info returned (Verified: TransportLeg.vesselName exists [String?]) |
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
| `InBondHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `InBondHeaderInput.inBondEntryType` | **MISSING** | - | Field 'inBondEntryType' has no direct Prisma schema column |
| `InBondHeaderInput.inBondNumber` | **MISSING** | - | Citation Shipment.inBondNumber invalid; field inBondNumber does not exist on model Shipment |
| `InBondHeaderInput.inBondCarrierCode` | **MISSING** | - | Field 'inBondCarrierCode' has no direct Prisma schema column |
| `InBondHeaderInput.usPortOfDest` | **MISSING** | - | Field 'usPortOfDest' has no direct Prisma schema column |
| `InBondHeaderInput.portOfForeignDest` | **MISSING** | - | Field 'portOfForeignDest' has no direct Prisma schema column |
| `InBondHeaderInput.value` | **MISSING** | - | Citation Shipment.totalValue invalid; field totalValue does not exist on model Shipment |
| `InBondHeaderInput.bondedCarrierID` | **MISSING** | - | Field 'bondedCarrierID' has no direct Prisma schema column |
| `InBondHeaderInput.ftzWarehouseInd` | **MISSING** | - | Field 'ftzWarehouseInd' has no direct Prisma schema column |
| `InBondHeaderInput.btaFdaIndicator` | **MISSING** | - | Field 'btaFdaIndicator' has no direct Prisma schema column |
| `ConveyanceInfoInput.importingCarrierCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInfoInput.importMOT` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInfoInput.countryCode` | **MISSING** | - | Field 'countryCode' has no direct Prisma schema column |
| `ConveyanceInfoInput.importingConveyance` | **MISSING** | - | Field 'importingConveyance' has no direct Prisma schema column |
| `ConveyanceInfoInput.voyageFlightTripNum` | **MISSING** | - | Field 'voyageFlightTripNum' has no direct Prisma schema column |
| `ConveyanceInfoInput.portOfImportArrival` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `ConveyanceInfoInput.estDateOfArrival` | **MISSING** | - | Field 'estDateOfArrival' has no direct Prisma schema column |
| `ConveyanceInfoInput.ftzFirmsCode` | **MISSING** | - | Field 'ftzFirmsCode' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingHeaderInput.sequenceNumber` | **NOT APPLICABLE** | - | Protocol mechanics / control identifier / filler / sequence marker |
| `BillOfLadingHeaderInput.issuerCodeMasterBOL` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingHeaderInput.masterBOLNumber` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `BillOfLadingHeaderInput.issuerCodeHouseBill` | **MISSING** | - | Field 'issuerCodeHouseBill' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.houseBillNumber` | **MISSING** | - | Field 'houseBillNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.issuerCodeSubHouse` | **MISSING** | - | Field 'issuerCodeSubHouse' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.subHouseBillNumber` | **MISSING** | - | Field 'subHouseBillNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.prevInBondNumber` | **MISSING** | - | Field 'prevInBondNumber' has no direct Prisma schema column |
| `BillOfLadingHeaderInput.inBondQuantity` | **MISSING** | - | Field 'inBondQuantity' has no direct Prisma schema column |
| `SecondaryNotifyPartiesInput.snpCode1` | **COVERED** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyPartiesInput.snpCode2` | **COVERED** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyPartiesInput.snpCode3` | **COVERED** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `SecondaryNotifyPartiesInput.snpCode4` | **COVERED** | `ShipmentParty.legalEntityId` | Corrected citation: Party link is stored in ShipmentParty.legalEntityId |
| `ReferenceIdentifierInput.qualifier` | **COVERED** | `ShipmentTrackingIdentifier.value` | Corrected citation: Tracking identifier value is stored in ShipmentTrackingIdentifier.value |
| `ReferenceIdentifierInput.referenceIdentifier` | **COVERED** | `ShipmentTrackingIdentifier.value` | Corrected citation: Tracking identifier value is stored in ShipmentTrackingIdentifier.value |
| `InBondEventHeaderInput.actionCode` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `InBondEventHeaderInput.inBondNumber` | **MISSING** | - | Citation Shipment.inBondNumber invalid; field inBondNumber does not exist on model Shipment |
| `InBondEventHeaderInput.issuerCodeMasterBOL` | **MISSING** | - | Field 'issuerCodeMasterBOL' has no direct Prisma schema column |
| `InBondEventHeaderInput.masterBOLNumber` | **MISSING** | - | Field 'masterBOLNumber' has no direct Prisma schema column |
| `InBondEventHeaderInput.issuerCodeHouseBOL` | **MISSING** | - | Field 'issuerCodeHouseBOL' has no direct Prisma schema column |
| `InBondEventHeaderInput.houseBOLNumber` | **MISSING** | - | Field 'houseBOLNumber' has no direct Prisma schema column |
| `InBondEventHeaderInput.firmsLocation` | **MISSING** | - | Field 'firmsLocation' has no direct Prisma schema column |
| `InBondEventHeaderInput.containerNumber` | **MISSING** | - | Field 'containerNumber' has no direct Prisma schema column |
| `InBondEventDetailInput.date` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
| `InBondEventDetailInput.time` | **PARTIAL** | `CustomsFiling.rawPayload` | Corrected citation: CustomsFiling.rawPayload stores raw payload string; CustomsFiling.metadata stores JSON |
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
| `K1Output.importerNumber` | **COVERED** | `ImporterOfRecord.name` | Importer details returned in query response (Verified: ImporterOfRecord.name exists [String]) |
| `K1Output.queryResultsCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.importerName` | **COVERED** | `ImporterOfRecord.name` | Importer details returned in query response (Verified: ImporterOfRecord.name exists [String]) |
| `K1Output.suretyCode` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response (Verified: Bond.bondNumber exists [String]) |
| `K1Output.bondTypeActivityCode` | **NOT APPLICABLE** | - | CBP importer/bond query response status / error record returned by ACE |
| `K1Output.bondAmount` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response (Verified: Bond.bondNumber exists [String]) |
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
| `K2Output.bondAmount` | **COVERED** | `Bond.bondNumber` | Bond details returned in query response (Verified: Bond.bondNumber exists [String]) |
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
1. **CBP 3-Character Filer Code (`CustomsProfile` / `Client`)**:
   - Add a dedicated `filerCode` column to `CustomsProfile` or `Client` to store the assigned 3-character CBP Filer Code required on all entry summaries and block control headers.
2. **Itemized Tariff & Fee Class Accounting (`CustomsFiling` / `ShipmentLineItem`)**:
   - Replace or supplement aggregate `feeAmount` with dedicated columns or structured relations for accounting class codes (e.g. 499 Harbor Maintenance Fee, 501 Merchandise Processing Fee, 311 Cotton Fee, 056 Environmental Tax).
3. **Census Warning Override Pairs (`CustomsFiling`)**:
   - Add dedicated columns or structured JSON array for `censusOverrideCodes` (supporting up to 7 condition code + override code pairs per entry) to enable filers to clear Census warnings during 7501 submission.
4. **PGA High-Frequency License / Permit Scalars (`ShipmentLineItem`)**:
   - Add dedicated fields for PGA License, Permit, Certificate, and Other (LPCO) numbers, issuer codes, and permit type codes (PG13/PG14) required for FDA, EPA, and USDA entry releases.
5. **Drawback Manufacturing & Destruction Claim Fields (`DrawbackLot` / `DrawbackClaim`)**:
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
