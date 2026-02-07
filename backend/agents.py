"""
Plain Python Agents — Supplier, Manufacturer, Logistics, Retailer.
Each agent uses OpenAI to generate realistic, context-aware responses.
"""

import json
import openai
import os

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _call_openai(system_prompt: str, user_prompt: str) -> dict:
    """Helper: call OpenAI and parse JSON response."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )
    return json.loads(response.choices[0].message.content)


# ═══════════════════════════════════════════
# SUPPLIER AGENT — Plain Python
# ═══════════════════════════════════════════

def supplier_check_availability(project_id: str, components: list, product_context: str) -> dict:
    """
    Supplier Agent receives a list of components and returns detailed
    availability quotes with pricing, lead times, and specifications.
    """
    system_prompt = """You are a Supplier Agent in a supply chain AI system.
You have access to a vast inventory of parts, materials, and components.

When given a list of required components for a product, you must:
1. Check availability for each component
2. Provide detailed product descriptions and specifications
3. Generate realistic pricing (in USD)
4. Estimate lead times in days
5. Note any constraints or minimum order quantities

Return a JSON object with this structure:
{
  "agent_id": "supplier_alpha",
  "project_id": "<project_id>",
  "status": "quotes_generated",
  "quotes": [
    {
      "component_name": "...",
      "available": true/false,
      "description": "Detailed product description with specs",
      "specifications": "Technical specifications",
      "unit_cost_usd": 0.00,
      "quantity_available": 0,
      "lead_time_days": 0,
      "constraints": ["..."],
      "supplier_notes": "..."
    }
  ],
  "total_estimated_cost": 0.00,
  "reasoning": "Why these quotes were generated"
}

Be VERY detailed and realistic with descriptions and pricing."""

    user_prompt = f"""Project ID: {project_id}
Product being assembled: {product_context}
Required components: {json.dumps(components, indent=2)}

Generate detailed availability quotes for ALL components listed above.
Include realistic pricing, detailed descriptions, and technical specifications."""

    return _call_openai(system_prompt, user_prompt)


# ═══════════════════════════════════════════
# MANUFACTURER AGENT — Plain Python
# ═══════════════════════════════════════════

def manufacturer_check_capacity(project_id: str, components: list, supplier_data: dict, product_context: str) -> dict:
    """
    Manufacturer Agent evaluates assembly capacity and creates a production plan.
    """
    system_prompt = """You are a Manufacturer Agent in a supply chain AI system.
You operate a manufacturing facility capable of assembling complex products.

When given component availability data from suppliers, you must:
1. Evaluate if all dependencies are satisfied
2. Check your capacity and queue
3. Create an assembly plan with steps
4. Estimate assembly time
5. Identify any risks

Return a JSON object with this structure:
{
  "agent_id": "manufacturer_prime",
  "project_id": "<project_id>",
  "status": "assembly_plan_created",
  "can_assemble": true/false,
  "assembly_plan": {
    "steps": [
      {"step": 1, "description": "...", "duration_hours": 0, "dependencies": ["..."]}
    ],
    "total_assembly_time_days": 0,
    "facility": "...",
    "quality_checks": ["..."]
  },
  "capacity_status": "available/limited/full",
  "estimated_completion_date_offset_days": 0,
  "constraints": ["..."],
  "reasoning": "Why this plan was created"
}

Be realistic and detailed about the assembly process."""

    user_prompt = f"""Project ID: {project_id}
Product to assemble: {product_context}
Available components: {json.dumps(components, indent=2)}
Supplier data summary: {json.dumps(supplier_data, indent=2) if supplier_data else 'Pending'}

Create a detailed assembly/manufacturing plan."""

    return _call_openai(system_prompt, user_prompt)


# ═══════════════════════════════════════════
# LOGISTICS AGENT — Plain Python
# ═══════════════════════════════════════════

def logistics_plan_route(project_id: str, pickup_details: dict, delivery_details: dict, product_context: str) -> dict:
    """
    Logistics Agent plans shipping routes, estimates costs, and assesses risks.
    """
    system_prompt = """You are a Logistics Provider Agent in a supply chain AI system.
You manage global shipping and transportation.

When given pickup and delivery requirements, you must:
1. Plan optimal shipping routes
2. Calculate costs for different transport modes
3. Estimate delivery times
4. Assess risks (weather, customs, etc.)
5. Recommend the best option

Return a JSON object with this structure:
{
  "agent_id": "logistics_global",
  "project_id": "<project_id>",
  "status": "route_planned",
  "routes": [
    {
      "route_id": "...",
      "mode": "ground/air/sea",
      "segments": [
        {"from": "...", "to": "...", "carrier": "...", "duration_days": 0}
      ],
      "total_duration_days": 0,
      "cost_usd": 0.00,
      "risk_level": "low/medium/high",
      "risk_flags": ["..."],
      "insurance_cost_usd": 0.00
    }
  ],
  "recommended_route": "...",
  "customs_requirements": ["..."],
  "tracking_enabled": true,
  "reasoning": "Why this route was recommended"
}

Be detailed and realistic with routes and pricing."""

    user_prompt = f"""Project ID: {project_id}
Product: {product_context}
Pickup details: {json.dumps(pickup_details, indent=2)}
Delivery requirements: {json.dumps(delivery_details, indent=2)}

Plan the optimal shipping route and provide alternatives."""

    return _call_openai(system_prompt, user_prompt)


# ═══════════════════════════════════════════
# RETAILER AGENT — Plain Python
# ═══════════════════════════════════════════

def retailer_plan_delivery(project_id: str, product_context: str, manufacturing_data: dict, logistics_data: dict) -> dict:
    """
    Retailer Agent handles final delivery, customer communication, and post-sale.
    """
    system_prompt = """You are a Retailer Agent in a supply chain AI system.
You manage the final delivery to the customer and post-sale experience.

When given manufacturing and logistics data, you must:
1. Create a customer delivery plan
2. Set up order tracking and notifications
3. Plan packaging and presentation
4. Outline warranty and support
5. Generate a customer-facing timeline

Return a JSON object with this structure:
{
  "agent_id": "retailer_direct",
  "project_id": "<project_id>",
  "status": "delivery_planned",
  "delivery_plan": {
    "packaging": "...",
    "delivery_method": "...",
    "estimated_delivery_date_offset_days": 0,
    "tracking_number": "...",
    "notifications": ["..."]
  },
  "customer_experience": {
    "warranty": "...",
    "return_policy": "...",
    "support_channel": "...",
    "documentation_included": ["..."]
  },
  "final_retail_price_usd": 0.00,
  "margin_percentage": 0,
  "reasoning": "Why this delivery plan was created"
}

Be detailed about the customer experience."""

    user_prompt = f"""Project ID: {project_id}
Product: {product_context}
Manufacturing data: {json.dumps(manufacturing_data, indent=2) if manufacturing_data else 'Pending'}
Logistics data: {json.dumps(logistics_data, indent=2) if logistics_data else 'Pending'}

Create a detailed retail delivery and customer experience plan."""

    return _call_openai(system_prompt, user_prompt)
