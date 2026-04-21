# Synthetic Policy Packet

        ## Scenario

        - ID: `hernando-sinkhole-elected`
        - Title: Hernando County homeowner with elected sinkhole coverage and stronger structure
        - Corridor: North of Tampa inland west corridor
        - Risk posture: Elevated sinkhole sensitivity with lower coastal surge exposure

        ## Property Context

        - Address Line 1: 328 Blue Heron Ridge
- City: Spring Hill
- State: FL
- Zip Code: 34609
- County: Hernando
- Property Type: single_family
- Occupancy Type: owner_occupied
- Year Built: 2005
- Construction: Masonry
- Distance To Coast Miles: 12.5
- Estimated Replacement Cost: 510000
- Flood Zone Indicator: Localized flood exposure possible but not primary concern
- Mortgage: True


        ## Declarations Highlights

        - Carrier Name: Westshore Mutual Home Insurance
- Naic Like Code: WMH-31970
- Policy Number: WMH-HO3-HN-482915
- Policy Form: HO-3 Special Form
- Effective Period: 2026-09-01 to 2027-09-01
- Annual Premium: 7425
- Hurricane Portion Of Premium: 2015
- Coverage A Dwelling: 510000
- Coverage B Other Structures: 25500
- Coverage C Personal Property: 255000
- Coverage D Loss Of Use: 102000
- Coverage E Personal Liability: 300000
- Coverage F Medical Payments: 2000
- Ordinance Or Law Percent: 25
- All Other Perils Deductible: 2500
- Hurricane Deductible Percent: 2
- Sinkhole Status: Included


        ## Policy Notes

        - Flood policy is not listed in the package.
- Sinkhole coverage is affirmatively elected and should avoid the narrower CGCC-only finding.
- Replacement cost and ordinance or law appear stronger than the weaker scenarios.


        ## Rule Engine Snapshot

        ```json
        {
  "hasHomeownersPolicy": true,
  "hasFloodPolicy": false,
  "hasSeparateWindPolicy": false,
  "coversWindstorm": true,
  "excludesWindstorm": false,
  "excludesFlood": true,
  "hasOrdinanceOrLawCoverage": true,
  "ordinanceOrLawLimitPercent": 25,
  "includesReplacementCost": true,
  "actualCashValueApplies": false,
  "includesSinkholeCoverage": true,
  "includesCatastrophicGroundCoverCollapseOnly": false,
  "allOtherPerilDeductiblePercent": 1,
  "hurricaneDeductiblePercent": 2
}
        ```

        ## Expected Findings

        - Flood coverage appears to be missing
