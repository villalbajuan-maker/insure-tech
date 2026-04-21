# Synthetic Policy Packet

        ## Scenario

        - ID: `fort-myers-vacancy-wind-gap`
        - Title: Fort Myers vacant coastal property with wind carve-out and high retention
        - Corridor: Coastal barrier exposure
        - Risk posture: High storm vulnerability with occupancy-related underwriting stress

        ## Property Context

        - Address Line 1: 75 Seabreeze Passage
- City: Fort Myers Beach
- State: FL
- Zip Code: 33931
- County: Lee
- Property Type: single_family
- Occupancy Type: vacant
- Year Built: 1978
- Construction: Frame elevated structure
- Distance To Coast Miles: 0.2
- Estimated Replacement Cost: 925000
- Flood Zone Indicator: Coastal flood sensitivity likely
- Mortgage: False


        ## Declarations Highlights

        - Carrier Name: Peninsula Property Underwriters
- Naic Like Code: PPU-88210
- Policy Number: PPU-DP3-LC-110542
- Policy Form: Dwelling Property Special Form DP-3
- Effective Period: 2026-05-15 to 2027-05-15
- Annual Premium: 22120
- Hurricane Portion Of Premium: 10450
- Coverage A Dwelling: 925000
- Coverage B Other Structures: 46250
- Coverage C Personal Property: 92500
- Coverage D Loss Of Use: 0
- Coverage E Personal Liability: 0
- Coverage F Medical Payments: 0
- Ordinance Or Law Percent: 10
- All Other Perils Deductible: 15000
- Hurricane Deductible Percent: 5
- Sinkhole Status: Not Included


        ## Policy Notes

        - No companion wind policy is included in the package.
- No flood policy is listed.
- Vacancy and ACV treatment materially weaken practical claim recovery.


        ## Rule Engine Snapshot

        ```json
        {
  "hasHomeownersPolicy": true,
  "hasFloodPolicy": false,
  "hasSeparateWindPolicy": false,
  "coversWindstorm": false,
  "excludesWindstorm": true,
  "excludesFlood": true,
  "hasOrdinanceOrLawCoverage": true,
  "ordinanceOrLawLimitPercent": 10,
  "includesReplacementCost": false,
  "actualCashValueApplies": true,
  "includesSinkholeCoverage": false,
  "includesCatastrophicGroundCoverCollapseOnly": true,
  "allOtherPerilDeductiblePercent": 3,
  "hurricaneDeductiblePercent": 5
}
        ```

        ## Expected Findings

        - Flood coverage appears to be missing
- Windstorm treatment appears incomplete or excluded
- Ordinance-or-law coverage appears missing or weak
- Sinkhole protection appears narrower than a homeowner may expect
- Loss settlement may be actual cash value instead of replacement cost
- Deductible pressure may create a practical coverage gap
