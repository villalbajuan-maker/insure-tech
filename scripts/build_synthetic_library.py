from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
LIBRARY_PATH = ROOT / "data" / "synthetic" / "florida-west-coast" / "library.json"
OUTPUT_ROOT = ROOT / "data" / "synthetic" / "florida-west-coast" / "generated"

STYLES = getSampleStyleSheet()
TITLE_STYLE = ParagraphStyle(
    "SyntheticTitle",
    parent=STYLES["Title"],
    fontName="Helvetica-Bold",
    fontSize=18,
    leading=22,
    textColor=colors.HexColor("#102033"),
    alignment=TA_CENTER,
)
SUBTITLE_STYLE = ParagraphStyle(
    "SyntheticSubtitle",
    parent=STYLES["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#6b7280"),
    alignment=TA_CENTER,
)
SECTION_STYLE = ParagraphStyle(
    "SyntheticSection",
    parent=STYLES["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=14,
    textColor=colors.white,
    backColor=colors.HexColor("#102033"),
    spaceBefore=8,
    spaceAfter=6,
    leftIndent=6,
)
BODY_STYLE = ParagraphStyle(
    "SyntheticBody",
    parent=STYLES["BodyText"],
    fontName="Helvetica",
    fontSize=9,
    leading=12,
    textColor=colors.HexColor("#1f2937"),
)
FOOTER_STYLE = ParagraphStyle(
    "SyntheticFooter",
    parent=STYLES["Normal"],
    fontName="Helvetica-Oblique",
    fontSize=8,
    leading=10,
    textColor=colors.HexColor("#b91c1c"),
    alignment=TA_CENTER,
)


def money(value: int) -> str:
    return f"${value:,.0f}"


def build_declarations(case: dict) -> str:
    declarations = case["declarations"]
    property_profile = case["property_profile"]
    optional_coverages = "".join(f"- {item}\n" for item in declarations["optional_coverages"])
    endorsements = "".join(f"- {item}\n" for item in declarations["endorsements"])
    return dedent(
        f"""
        # Synthetic Declarations Page

        ## Insured Property

        - Scenario ID: `{case["id"]}`
        - Address: {property_profile["address_line_1"]}, {property_profile["city"]}, FL {property_profile["zip_code"]}
        - County: {property_profile["county"]}
        - Property type: {property_profile["property_type"].replace("_", " ")}
        - Occupancy: {property_profile["occupancy_type"].replace("_", " ")}
        - Year built: {property_profile["year_built"]}
        - Construction: {property_profile["construction"]}

        ## Policy Header

        - Carrier: {declarations["carrier_name"]}
        - Policy number: {declarations["policy_number"]}
        - Policy form: {declarations["policy_form"]}
        - Effective period: {declarations["effective_period"]}
        - Annual premium: {money(declarations["annual_premium"])}
        - Hurricane portion of premium: {money(declarations["hurricane_portion_of_premium"])}

        ## Section I - Property Coverages

        - Coverage A - Dwelling: {money(declarations["coverage_a_dwelling"])}
        - Coverage B - Other Structures: {money(declarations["coverage_b_other_structures"])}
        - Coverage C - Personal Property: {money(declarations["coverage_c_personal_property"])}
        - Coverage D - Loss of Use: {money(declarations["coverage_d_loss_of_use"])}
        - Ordinance or Law: {declarations["ordinance_or_law_percent"]}% of Coverage A

        ## Deductibles

        - All Other Perils: {money(declarations["all_other_perils_deductible"])}
        - Hurricane: {declarations["hurricane_deductible_percent"]}% of Coverage A
        - Sinkhole: {declarations["sinkhole_status"]}

        ## Section II - Liability

        - Coverage E - Personal Liability: {money(declarations["coverage_e_personal_liability"])}
        - Coverage F - Medical Payments: {money(declarations["coverage_f_medical_payments"])}

        ## Optional Coverages

        {optional_coverages}

        ## Forms And Endorsements

        {endorsements}
        """
    ).strip() + "\n"


def build_policy_packet(case: dict) -> str:
    property_lines = "".join(
        f"- {key.replace('_', ' ').title()}: {value}\n"
        for key, value in case["property_profile"].items()
    )
    declaration_lines = "".join(
        f"- {key.replace('_', ' ').title()}: {value}\n"
        for key, value in case["declarations"].items()
        if not isinstance(value, list)
    )
    policy_notes = "".join(f"- {item}\n" for item in case["policy_notes"])
    expected_findings = "".join(f"- {item}\n" for item in case["expected_findings"])
    return dedent(
        f"""
        # Synthetic Policy Packet

        ## Scenario

        - ID: `{case["id"]}`
        - Title: {case["title"]}
        - Corridor: {case["corridor"]}
        - Risk posture: {case["risk_posture"]}

        ## Property Context

        {property_lines}

        ## Declarations Highlights

        {declaration_lines}

        ## Policy Notes

        {policy_notes}

        ## Rule Engine Snapshot

        ```json
        {json.dumps(case["analysis_snapshot"], indent=2)}
        ```

        ## Expected Findings

        {expected_findings}
        """
    ).strip() + "\n"


def build_expected_findings(case: dict) -> dict:
    return {
        "scenario_id": case["id"],
        "title": case["title"],
        "expected_findings": case["expected_findings"],
    }


def build_key_value_table(rows: list[tuple[str, str]], column_widths: list[float]) -> Table:
    table = Table(rows, colWidths=column_widths, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef3f8")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#102033")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("LEADING", (0, 0), (-1, -1), 11),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def render_declarations_pdf(case: dict, path: Path) -> None:
    declarations = case["declarations"]
    property_profile = case["property_profile"]

    story = [
        Paragraph(declarations["carrier_name"], TITLE_STYLE),
        Paragraph(
            "SYNTHETIC HOMEOWNERS POLICY DECLARATIONS - DEMONSTRATION USE ONLY",
            SUBTITLE_STYLE,
        ),
        Spacer(1, 0.18 * inch),
        Paragraph("Policy Header", SECTION_STYLE),
    ]

    header_rows = [
        ["Field", "Value"],
        ["Policy Number", declarations["policy_number"]],
        ["Policy Form", declarations["policy_form"]],
        ["Effective Period", declarations["effective_period"]],
        ["Annual Premium", money(declarations["annual_premium"])],
        ["Hurricane Portion Of Premium", money(declarations["hurricane_portion_of_premium"])],
    ]
    story.append(build_key_value_table(header_rows, [2.2 * inch, 3.8 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Insured Property", SECTION_STYLE)])

    property_rows = [
        ["Field", "Value"],
        ["Address", f'{property_profile["address_line_1"]}, {property_profile["city"]}, FL {property_profile["zip_code"]}'],
        ["County", property_profile["county"]],
        ["Occupancy", property_profile["occupancy_type"].replace("_", " ").title()],
        ["Construction", property_profile["construction"]],
        ["Year Built", str(property_profile["year_built"])],
        ["Estimated Replacement Cost", money(property_profile["estimated_replacement_cost"])],
    ]
    story.append(build_key_value_table(property_rows, [2.2 * inch, 3.8 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Section I - Property Coverages", SECTION_STYLE)])

    coverage_rows = [
        ["Coverage", "Limit / Value"],
        ["Coverage A - Dwelling", money(declarations["coverage_a_dwelling"])],
        ["Coverage B - Other Structures", money(declarations["coverage_b_other_structures"])],
        ["Coverage C - Personal Property", money(declarations["coverage_c_personal_property"])],
        ["Coverage D - Loss of Use", money(declarations["coverage_d_loss_of_use"])],
        ["Ordinance Or Law", f'{declarations["ordinance_or_law_percent"]}% of Coverage A'],
    ]
    story.append(build_key_value_table(coverage_rows, [2.6 * inch, 3.4 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Deductibles And Liability", SECTION_STYLE)])

    deductible_rows = [
        ["Coverage / Deductible", "Value"],
        ["All Other Perils Deductible", money(declarations["all_other_perils_deductible"])],
        ["Hurricane Deductible", f'{declarations["hurricane_deductible_percent"]}% of Coverage A'],
        ["Sinkhole", declarations["sinkhole_status"]],
        ["Coverage E - Personal Liability", money(declarations["coverage_e_personal_liability"])],
        ["Coverage F - Medical Payments", money(declarations["coverage_f_medical_payments"])],
    ]
    story.append(build_key_value_table(deductible_rows, [2.6 * inch, 3.4 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Optional Coverages And Forms", SECTION_STYLE)])

    story.append(
        Paragraph(
            "<br/>".join(
                [f"Optional Coverage: {item}" for item in declarations["optional_coverages"]]
                + [f"Form / Endorsement: {item}" for item in declarations["endorsements"]]
            ),
            BODY_STYLE,
        )
    )
    story.extend(
        [
            Spacer(1, 0.18 * inch),
            Paragraph(
                f"Synthetic scenario ID: {case['id']} | West-coast Florida demo library",
                FOOTER_STYLE,
            ),
        ]
    )

    doc = SimpleDocTemplate(
        str(path),
        pagesize=LETTER,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
    )
    doc.build(story)


def render_policy_packet_pdf(case: dict, path: Path) -> None:
    declarations = case["declarations"]
    property_profile = case["property_profile"]

    story = [
        Paragraph("Synthetic Florida Residential Policy Packet", TITLE_STYLE),
        Paragraph(case["title"], SUBTITLE_STYLE),
        Spacer(1, 0.18 * inch),
        Paragraph("Scenario Profile", SECTION_STYLE),
    ]

    scenario_rows = [
        ["Field", "Value"],
        ["Scenario ID", case["id"]],
        ["County / City", f'{case["county"]} / {case["city"]}'],
        ["Corridor", case["corridor"]],
        ["Risk Posture", case["risk_posture"]],
        ["Flood Indicator", property_profile["flood_zone_indicator"]],
        ["Distance To Coast", f'{property_profile["distance_to_coast_miles"]} miles'],
    ]
    story.append(build_key_value_table(scenario_rows, [2.2 * inch, 3.8 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Declarations Highlights", SECTION_STYLE)])

    declarations_rows = [
        ["Field", "Value"],
        ["Carrier", declarations["carrier_name"]],
        ["Policy Form", declarations["policy_form"]],
        ["Coverage A", money(declarations["coverage_a_dwelling"])],
        ["Ordinance Or Law", f'{declarations["ordinance_or_law_percent"]}% of Coverage A'],
        ["Hurricane Deductible", f'{declarations["hurricane_deductible_percent"]}% of Coverage A'],
        ["Sinkhole", declarations["sinkhole_status"]],
    ]
    story.append(build_key_value_table(declarations_rows, [2.2 * inch, 3.8 * inch]))
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Policy Notes", SECTION_STYLE)])

    story.append(
        Paragraph("<br/>".join([f"- {item}" for item in case["policy_notes"]]), BODY_STYLE)
    )
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Expected Gap Signals", SECTION_STYLE)])
    story.append(
        Paragraph(
            "<br/>".join([f"- {item}" for item in case["expected_findings"]]),
            BODY_STYLE,
        )
    )
    story.extend([Spacer(1, 0.14 * inch), Paragraph("Rule Snapshot", SECTION_STYLE)])
    snapshot_lines = [f"{key}: {value}" for key, value in case["analysis_snapshot"].items()]
    story.append(Paragraph("<br/>".join(snapshot_lines), BODY_STYLE))
    story.extend(
        [
            Spacer(1, 0.18 * inch),
            Paragraph(
                "Synthetic demonstration packet. Not a real insurance contract or declarations page.",
                FOOTER_STYLE,
            ),
        ]
    )

    doc = SimpleDocTemplate(
        str(path),
        pagesize=LETTER,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
    )
    doc.build(story)


def main() -> None:
    library = json.loads(LIBRARY_PATH.read_text())
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    manifest = {
        "library_id": library["library_id"],
        "version": library["version"],
        "scenario_count": len(library["cases"]),
        "generated_paths": [],
    }

    for case in library["cases"]:
        case_dir = OUTPUT_ROOT / case["id"]
        case_dir.mkdir(parents=True, exist_ok=True)

        declarations_path = case_dir / "declarations-page.md"
        packet_path = case_dir / "policy-packet.md"
        findings_path = case_dir / "expected-findings.json"
        declarations_pdf_path = case_dir / "declarations-page.pdf"
        packet_pdf_path = case_dir / "policy-packet.pdf"

        declarations_path.write_text(build_declarations(case))
        packet_path.write_text(build_policy_packet(case))
        findings_path.write_text(json.dumps(build_expected_findings(case), indent=2) + "\n")
        render_declarations_pdf(case, declarations_pdf_path)
        render_policy_packet_pdf(case, packet_pdf_path)

        manifest["generated_paths"].append(
            {
                "scenario_id": case["id"],
                "declarations_page": str(declarations_path.relative_to(ROOT)),
                "policy_packet": str(packet_path.relative_to(ROOT)),
                "expected_findings": str(findings_path.relative_to(ROOT)),
                "declarations_page_pdf": str(declarations_pdf_path.relative_to(ROOT)),
                "policy_packet_pdf": str(packet_pdf_path.relative_to(ROOT)),
            }
        )

    (OUTPUT_ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated {len(library['cases'])} synthetic scenarios in {OUTPUT_ROOT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
