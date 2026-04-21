# Synthetic Policy Packet

        ## Scenario

        - ID: `tampa-bay-inland-acv-stress`
        - Title: Tampa Bay inland homeowner with ACV pressure and no flood companion policy
        - Corridor: Urban inland west coast
        - Risk posture: Moderate surge distance but meaningful rainfall and wind exposure

        ## Property Context

        - Address Line 1: 9814 Laurel Creek Court
- City: Tampa
- State: FL
- Zip Code: 33647
- County: Hillsborough
- Property Type: single_family
- Occupancy Type: owner_occupied
- Year Built: 1989
- Construction: Frame
- Distance To Coast Miles: 16.0
- Estimated Replacement Cost: 415000
- Flood Zone Indicator: Rainfall and drainage risk present
- Mortgage: True


        ## Declarations Highlights

        - Carrier Name: Bay Shield Home Insurance Company
- Naic Like Code: BSH-22176
- Policy Number: BSH-HO8-TB-603912
- Policy Form: Modified Homeowners HO-8
- Effective Period: 2026-08-01 to 2027-08-01
- Annual Premium: 6845
- Hurricane Portion Of Premium: 2380
- Coverage A Dwelling: 415000
- Coverage B Other Structures: 20750
- Coverage C Personal Property: 207500
- Coverage D Loss Of Use: 41500
- Coverage E Personal Liability: 300000
- Coverage F Medical Payments: 2000
- Ordinance Or Law Percent: 10
- All Other Perils Deductible: 2500
- Hurricane Deductible Percent: 2
- Sinkhole Status: Not Included


        ## Policy Notes

        - No separate flood policy is listed.
- Loss settlement wording is materially more restrictive than a standard replacement-cost dwelling form.
- Ordinance or law is present but low.


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
  "includesReplacementCost": false,
  "actualCashValueApplies": true,
  "includesSinkholeCoverage": false,
  "includesCatastrophicGroundCoverCollapseOnly": true,
  "allOtherPerilDeductiblePercent": 1,
  "hurricaneDeductiblePercent": 2
}
        ```

        ## Expected Findings

        - Flood coverage appears to be missing
- Ordinance-or-law coverage appears missing or weak
- Sinkhole protection appears narrower than a homeowner may expect
- Loss settlement may be actual cash value instead of replacement cost
