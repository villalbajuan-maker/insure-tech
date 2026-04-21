import type { StandardsRule } from "@/src/domain/florida-homeowners.types";

export const floridaStandardsRegistry: StandardsRule[] = [
  {
    ruleId: "fl-627-7011-ordinance-or-law",
    title: "Inspect ordinance-or-law coverage treatment",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "statutory_expectation",
    sourceType: "statute",
    sourceCitation: "Florida Statute 627.7011",
    sourceUrl:
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699%2F0627%2FSections%2F0627.7011.html",
    effectiveDate: "2025-01-01",
    status: "active",
    category: "ordinance_or_law",
    severityGuidance: "high",
    ruleLogicSummary:
      "Check whether ordinance-or-law coverage is present and whether the available limit appears materially weak or ambiguous.",
    userFacingExplanation:
      "Florida homeowners policies must address law-and-ordinance treatment, so missing or unclear ordinance-or-law coverage can create a meaningful rebuilding gap."
  },
  {
    ruleId: "fl-dfs-windstorm-treatment",
    title: "Inspect windstorm inclusion or separate wind policy need",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "florida_market_practice",
    sourceType: "consumer_guidance",
    sourceCitation: "Florida DFS Homeowners Insurance Toolkit",
    sourceUrl:
      "https://myfloridacfo.com/docs-sf/consumer-services-libraries/consumerservices-documents/understanding-coverage/consumer-guides/english---homeowners-insurance-toolkit.pdf",
    effectiveDate: "2026-03-01",
    status: "active",
    category: "windstorm",
    severityGuidance: "critical",
    ruleLogicSummary:
      "Check whether the homeowners package includes windstorm or whether the wording suggests a separate wind policy may be required.",
    userFacingExplanation:
      "Florida homeowners often assume hurricane and windstorm damage is covered when it may be excluded or carved out into a separate policy."
  },
  {
    ruleId: "fl-dfs-flood-companion-policy",
    title: "Recommend flood coverage when excluded",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "companion_coverage_recommendation",
    sourceType: "consumer_guidance",
    sourceCitation: "Florida DFS Homeowners Insurance Toolkit",
    sourceUrl:
      "https://myfloridacfo.com/docs-sf/consumer-services-libraries/consumerservices-documents/understanding-coverage/consumer-guides/english---homeowners-insurance-toolkit.pdf",
    effectiveDate: "2026-03-01",
    status: "active",
    category: "flood",
    severityGuidance: "high",
    ruleLogicSummary:
      "If flood damage is excluded and no separate flood policy is present, raise a companion-coverage recommendation.",
    userFacingExplanation:
      "Most homeowners policies do not cover flood damage, so a separate flood policy may be needed."
  },
  {
    ruleId: "fema-flood-separate-policy",
    title: "Explain separate flood policy requirement",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "companion_coverage_recommendation",
    sourceType: "federal_program",
    sourceCitation: "FEMA NFIP Flood Insurance Guidance",
    sourceUrl: "https://www.fema.gov/flood-insurance",
    effectiveDate: "2025-07-01",
    status: "active",
    category: "flood",
    severityGuidance: "high",
    ruleLogicSummary:
      "Support flood-gap messaging with FEMA source language stating that most homeowners policies do not cover flood damage.",
    userFacingExplanation:
      "Flood coverage is usually purchased separately from a standard homeowners policy."
  },
  {
    ruleId: "fl-627-706-sinkhole-distinction",
    title: "Distinguish sinkhole coverage from catastrophic ground cover collapse",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "statutory_expectation",
    sourceType: "statute",
    sourceCitation: "Florida Statute 627.706",
    sourceUrl:
      "https://www.leg.state.fl.us/Statutes/index.cfm/Ch0465/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699%2F0627%2FSections%2F0627.706.html",
    effectiveDate: "2025-01-01",
    status: "active",
    category: "sinkhole",
    severityGuidance: "medium",
    ruleLogicSummary:
      "Detect whether the policy provides only catastrophic ground cover collapse coverage instead of broader sinkhole loss coverage.",
    userFacingExplanation:
      "Florida policies may include catastrophic ground cover collapse coverage without broader sinkhole loss coverage, which can leave a narrower response than a homeowner expects."
  },
  {
    ruleId: "fl-627-7011-replacement-cost",
    title: "Check replacement cost versus actual cash value treatment",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "statutory_expectation",
    sourceType: "statute",
    sourceCitation: "Florida Statute 627.7011",
    sourceUrl:
      "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0600-0699%2F0627%2FSections%2F0627.7011.html",
    effectiveDate: "2025-01-01",
    status: "active",
    category: "replacement_cost",
    severityGuidance: "high",
    ruleLogicSummary:
      "Inspect whether dwelling settlement appears to be replacement cost or actual cash value.",
    userFacingExplanation:
      "Actual cash value treatment can materially reduce claim recovery compared with replacement cost."
  },
  {
    ruleId: "fl-best-practice-deductible-pressure",
    title: "Flag high deductible pressure",
    jurisdiction: "FL",
    productLine: "homeowners",
    theme: "risk_management_best_practice",
    sourceType: "best_practice",
    sourceCitation: "Internal Florida homeowners risk guidance",
    sourceUrl: "https://github.com/villalbajuan-maker/insure-tech",
    effectiveDate: "2026-04-20",
    status: "active",
    category: "deductible",
    severityGuidance: "medium",
    ruleLogicSummary:
      "Flag hurricane or all-other-peril deductibles that may create affordability or claim-recovery stress.",
    userFacingExplanation:
      "A policy can technically include coverage and still leave the homeowner exposed if the deductible is too large to absorb comfortably."
  }
];
