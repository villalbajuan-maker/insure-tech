# Synthetic Policy Packet

        ## Scenario

        - ID: `naples-coastal-ho3-gap`
        - Title: Naples seasonal coastal HO-3 with flood and ordinance gaps
        - Corridor: Gulf coast
        - Risk posture: High coastal wind and flood exposure

        ## Property Context

        - Address Line 1: 1512 Gulf Shore Boulevard N
- City: Naples
- State: FL
- Zip Code: 34102
- County: Collier
- Property Type: single_family
- Occupancy Type: seasonal
- Year Built: 1998
- Construction: Masonry
- Distance To Coast Miles: 0.5
- Estimated Replacement Cost: 1850000
- Flood Zone Indicator: Coastal flood sensitivity likely
- Mortgage: True


        ## Declarations Highlights

        - Carrier Name: Gulf Harbor Indemnity Insurance Company
- Naic Like Code: FGH-41291
- Policy Number: GHI-HO3-CL-774152
- Policy Form: HO-3 Special Form
- Effective Period: 2026-06-01 to 2027-06-01
- Annual Premium: 19480
- Hurricane Portion Of Premium: 8240
- Coverage A Dwelling: 1850000
- Coverage B Other Structures: 92500
- Coverage C Personal Property: 1110000
- Coverage D Loss Of Use: 370000
- Coverage E Personal Liability: 500000
- Coverage F Medical Payments: 5000
- Ordinance Or Law Percent: 10
- All Other Perils Deductible: 5000
- Hurricane Deductible Percent: 5
- Sinkhole Status: Not Included


        ## Policy Notes

        - Flood insurance not scheduled in the uploaded package.
- No separate wind-only policy listed.
- Ordinance or law shown at 10% of Coverage A.
- Replacement cost indicated for dwelling, subject to Florida special provisions.


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
  "ordinanceOrLawLimitPercent": 10,
  "includesReplacementCost": true,
  "actualCashValueApplies": false,
  "includesSinkholeCoverage": false,
  "includesCatastrophicGroundCoverCollapseOnly": true,
  "allOtherPerilDeductiblePercent": 2,
  "hurricaneDeductiblePercent": 5
}
        ```

        ## Expected Findings

        - Flood coverage appears to be missing
- Ordinance-or-law coverage appears missing or weak
- Sinkhole protection appears narrower than a homeowner may expect
- Deductible pressure may create a practical coverage gap
