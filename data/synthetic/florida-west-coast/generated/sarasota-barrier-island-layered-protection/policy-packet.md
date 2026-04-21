# Synthetic Policy Packet

        ## Scenario

        - ID: `sarasota-barrier-island-layered-protection`
        - Title: Sarasota barrier-island residence with flood and wind layering
        - Corridor: Barrier-island coastal
        - Risk posture: High coastal exposure with layered insurance purchases

        ## Property Context

        - Address Line 1: 420 Harbor Cay Drive
- City: Sarasota
- State: FL
- Zip Code: 34242
- County: Sarasota
- Property Type: single_family
- Occupancy Type: owner_occupied
- Year Built: 2007
- Construction: Masonry with hip roof
- Distance To Coast Miles: 0.3
- Estimated Replacement Cost: 1325000
- Flood Zone Indicator: Coastal flood sensitivity likely
- Mortgage: False


        ## Declarations Highlights

        - Carrier Name: Suncoast Residential Assurance
- Naic Like Code: SRA-51744
- Policy Number: SRA-HO3-SR-219804
- Policy Form: HO-3 Special Form
- Effective Period: 2026-07-15 to 2027-07-15
- Annual Premium: 16740
- Hurricane Portion Of Premium: 6410
- Coverage A Dwelling: 1325000
- Coverage B Other Structures: 66250
- Coverage C Personal Property: 662500
- Coverage D Loss Of Use: 265000
- Coverage E Personal Liability: 500000
- Coverage F Medical Payments: 5000
- Ordinance Or Law Percent: 25
- All Other Perils Deductible: 2500
- Hurricane Deductible Percent: 2
- Sinkhole Status: Not Included


        ## Policy Notes

        - Flood coverage is referenced in the package as a separate policy.
- Windstorm is carved out to a separate wind carrier but the combined package addresses the peril.
- Ordinance or law appears at 25% of Coverage A.


        ## Rule Engine Snapshot

        ```json
        {
  "hasHomeownersPolicy": true,
  "hasFloodPolicy": true,
  "hasSeparateWindPolicy": true,
  "coversWindstorm": true,
  "excludesWindstorm": false,
  "excludesFlood": false,
  "hasOrdinanceOrLawCoverage": true,
  "ordinanceOrLawLimitPercent": 25,
  "includesReplacementCost": true,
  "actualCashValueApplies": false,
  "includesSinkholeCoverage": false,
  "includesCatastrophicGroundCoverCollapseOnly": true,
  "allOtherPerilDeductiblePercent": 1,
  "hurricaneDeductiblePercent": 2
}
        ```

        ## Expected Findings

        - Sinkhole protection appears narrower than a homeowner may expect
