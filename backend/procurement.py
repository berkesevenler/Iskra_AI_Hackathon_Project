"""
Procurement Agent — Built with CrewAI.
Analyzes user intent and identifies all required components.
"""

import json
import os

# CrewAI imports
from crewai import Agent, Task, Crew


def analyze_intent(intent: str) -> dict:
    """
    Use CrewAI to analyze the user's procurement intent
    and identify all required components/parts.
    """
    procurement_agent = Agent(
        role="Supply Chain Procurement Specialist",
        goal="Analyze procurement requests and identify every single component, material, and part needed to fulfill the order",
        backstory=(
            "You are a world-class procurement specialist with 25 years of experience "
            "in global supply chain management. You have deep expertise across automotive, "
            "electronics, aerospace, consumer goods, and industrial manufacturing. "
            "You know exactly what components, sub-assemblies, raw materials, and parts "
            "are needed to build any product. You are meticulous and thorough."
        ),
        verbose=False,
        allow_delegation=False,
    )

    task = Task(
        description=f"""Analyze this procurement request and identify ALL required components:

REQUEST: "{intent}"

You must return a valid JSON object (and NOTHING else) with this exact structure:
{{
  "product": "Name of the main product being assembled",
  "product_category": "Category (automotive, electronics, etc.)",
  "components": [
    {{
      "name": "Component name",
      "category": "Sub-category (engine, body, electronics, interior, etc.)",
      "specifications": "Detailed technical specifications",
      "estimated_quantity": 1,
      "priority": "critical" or "standard",
      "estimated_unit_cost_usd": 0
    }}
  ],
  "total_estimated_components": 0,
  "assembly_complexity": "low/medium/high/very_high",
  "notes": "Any important procurement notes"
}}

Be EXTREMELY thorough. For complex products like vehicles, include 15-25 major component groups.
Include realistic cost estimates. Return ONLY the JSON object, no other text.""",
        expected_output="A valid JSON object with product details and comprehensive component list",
        agent=procurement_agent,
    )

    crew = Crew(
        agents=[procurement_agent],
        tasks=[task],
        verbose=False,
    )

    result = crew.kickoff()
    raw_output = result.raw if hasattr(result, "raw") else str(result)

    # Parse JSON from the output
    try:
        # Try direct parse
        return json.loads(raw_output)
    except json.JSONDecodeError:
        # Try to extract JSON from the text
        start = raw_output.find("{")
        end = raw_output.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(raw_output[start:end])
            except json.JSONDecodeError:
                pass

    # Fallback: return a basic structure
    return {
        "product": intent,
        "product_category": "general",
        "components": [
            {
                "name": "Primary component",
                "category": "general",
                "specifications": "As specified in request",
                "estimated_quantity": 1,
                "priority": "critical",
                "estimated_unit_cost_usd": 0,
            }
        ],
        "total_estimated_components": 1,
        "assembly_complexity": "medium",
        "notes": "Fallback analysis — refine as needed",
    }
