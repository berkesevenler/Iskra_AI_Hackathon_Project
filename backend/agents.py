"""
Plain Python Agents — Supplier, Manufacturer, Logistics, Retailer.
Each agent uses OpenAI to generate realistic, context-aware responses
based on real partner data from the database.
"""

import json
import openai
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MAX_RETRIES = 1
RETRY_DELAY = 0.5  # seconds


def _call_openai(system_prompt: str, user_prompt: str, max_tokens: int = 8000) -> dict:
    """Helper: call OpenAI and parse JSON response with retry logic."""
    last_error = None
    for attempt in range(1, MAX_RETRIES + 2):  # 1 initial + MAX_RETRIES retries
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.4,
                max_tokens=max_tokens,
            )
            result = json.loads(response.choices[0].message.content)
            if attempt > 1:
                print(f"[INFO] OpenAI call succeeded on attempt {attempt}")
            return result
        except Exception as e:
            last_error = e
            print(f"[WARN] OpenAI call attempt {attempt}/{MAX_RETRIES + 1} failed: {str(e)[:120]}")
            if attempt <= MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
    raise last_error


# ═══════════════════════════════════════════
# SUPPLIER AGENT — Plain Python (Batched)
# ═══════════════════════════════════════════

SUPPLIER_BATCH_SIZE = 6  # Components per batch — keeps response < 8K tokens


def _supplier_batch(project_id: str, batch: list, product_context: str, supplier_info: str) -> dict:
    """Process a single batch of components through the supplier agent."""
    system_prompt = f"""You are a Supplier Agent in a supply chain AI system.
You have access to these REAL suppliers from your database:

{supplier_info}

For each component, assign it to the BEST matching supplier and generate a quote.

COST RULES:
- unit_cost_usd = realistic market price in USD (steel rod $15-50, circuit board $8-200, engine block $2000-8000, etc.)
- Multiply base market price by the supplier's cost_multiplier
- quantity = units the project needs
- total_line_cost = unit_cost_usd × quantity
- Prices MUST be realistic USD, NOT raw cost_multiplier values

Return JSON:
{{
  "quotes": [
    {{
      "component_name": "...",
      "assigned_supplier": "supplier name",
      "supplier_location": "city, country",
      "available": true,
      "description": "Product description",
      "specifications": "Specs",
      "unit_cost_usd": 0.00,
      "quantity": 0,
      "total_line_cost": 0.00,
      "lead_time_days": 0,
      "constraints": [],
      "supplier_notes": "Why this supplier"
    }}
  ]
}}"""

    user_prompt = f"""Project: {product_context}
Components ({len(batch)} items):
{json.dumps(batch, indent=2)}

Generate one quote per component. Use realistic USD pricing."""

    return _call_openai(system_prompt, user_prompt, max_tokens=6000)


def supplier_check_availability(project_id: str, components: list, product_context: str, selected_suppliers: list) -> dict:
    """
    Supplier Agent — batches components into groups and runs them in parallel
    so that each API call produces a small, completeable JSON response.
    """
    supplier_info = json.dumps([
        {
            "name": s["name"],
            "location": f"{s['city']}, {s['country']}",
            "specialization": s["specialization"],
            "lead_time_days": s["lead_time_days"],
            "cost_multiplier": s["cost_multiplier"],
            "reliability": f"{s['reliability']*100:.0f}%",
            "certifications": s["certifications"],
            "min_order_usd": s["min_order_usd"],
        }
        for s in selected_suppliers
    ], indent=2)

    # Split components into batches
    batches = [components[i:i + SUPPLIER_BATCH_SIZE] for i in range(0, len(components), SUPPLIER_BATCH_SIZE)]
    print(f"[Supplier] Splitting {len(components)} components into {len(batches)} batches of ≤{SUPPLIER_BATCH_SIZE}")

    all_quotes = []
    all_suppliers = set()
    errors = []

    # Run batches in parallel
    with ThreadPoolExecutor(max_workers=min(len(batches), 4)) as pool:
        futures = {
            pool.submit(_supplier_batch, project_id, batch, product_context, supplier_info): idx
            for idx, batch in enumerate(batches)
        }
        for future in as_completed(futures):
            batch_idx = futures[future]
            try:
                result = future.result()
                batch_quotes = result.get("quotes", [])
                all_quotes.extend(batch_quotes)
                for q in batch_quotes:
                    s = q.get("assigned_supplier")
                    if s:
                        all_suppliers.add(s)
                print(f"[Supplier] Batch {batch_idx + 1}/{len(batches)} OK — {len(batch_quotes)} quotes")
            except Exception as e:
                errors.append(str(e))
                print(f"[Supplier] Batch {batch_idx + 1}/{len(batches)} FAILED: {str(e)[:100]}")

    total_cost = sum(
        q.get("total_line_cost") or (q.get("unit_cost_usd", 0) * q.get("quantity", 1))
        for q in all_quotes
    )
    suppliers_list = sorted(all_suppliers)

    print(f"[Supplier] Done — {len(all_quotes)}/{len(components)} quotes, {len(suppliers_list)} suppliers, ${total_cost:,.2f} total")

    return {
        "agent_id": "supplier_alpha",
        "project_id": project_id,
        "status": "quotes_generated" if len(all_quotes) > 0 else "error",
        "quotes": all_quotes,
        "suppliers_used": suppliers_list,
        "total_estimated_cost": total_cost,
        "reasoning": f"Processed {len(components)} components in {len(batches)} parallel batches across {len(suppliers_list)} suppliers",
        **({"errors": errors} if errors else {}),
    }


# ═══════════════════════════════════════════
# MANUFACTURER AGENT — Plain Python
# ═══════════════════════════════════════════

def manufacturer_check_capacity(project_id: str, components: list, supplier_data: dict, product_context: str, selected_manufacturers: list) -> dict:
    """
    Manufacturer Agent uses real manufacturer data to create assembly plans.
    """
    mfg_info = json.dumps([
        {
            "name": m["name"],
            "location": f"{m['city']}, {m['country']}",
            "specialization": m["specialization"],
            "capabilities": m["capabilities"],
            "lead_time_days": m["lead_time_days"],
            "cost_per_hour": f"${m['cost_per_unit_hour']}",
            "reliability": f"{m['reliability']*100:.0f}%",
            "capacity_units_monthly": m["capacity_units_monthly"],
            "facility_size_sqm": f"{m['facility_size_sqm']:,}",
            "certifications": m["certifications"],
        }
        for m in selected_manufacturers
    ], indent=2)

    system_prompt = f"""You are a Manufacturer Agent in a supply chain AI system.
You have access to these REAL manufacturing facilities:

{mfg_info}

Choose the BEST manufacturer from the list and create an assembly plan.

Return JSON:
{{
  "agent_id": "manufacturer_prime",
  "project_id": "{project_id}",
  "status": "assembly_plan_created",
  "selected_manufacturer": "manufacturer name",
  "manufacturer_location": "city, country",
  "can_assemble": true,
  "assembly_plan": {{
    "steps": [
      {{"step": 1, "description": "...", "duration_hours": 0, "dependencies": ["..."]}}
    ],
    "total_assembly_time_days": 0,
    "facility": "facility name and location",
    "quality_checks": ["..."]
  }},
  "capacity_status": "available",
  "estimated_completion_date_offset_days": 0,
  "selection_rationale": "Why this manufacturer was chosen over others",
  "constraints": ["..."],
  "reasoning": "Full reasoning"
}}"""

    user_prompt = f"""Project ID: {project_id}
Product: {product_context}
Components: {json.dumps(components, indent=2)}
Supplier data: {json.dumps(supplier_data, indent=2) if supplier_data else 'Pending'}

Choose the best manufacturer and create a detailed assembly plan."""

    return _call_openai(system_prompt, user_prompt)


# ═══════════════════════════════════════════
# LOGISTICS AGENT — Plain Python
# ═══════════════════════════════════════════

def logistics_plan_route(project_id: str, pickup_details: dict, delivery_details: dict, product_context: str, selected_logistics: list) -> dict:
    """
    Logistics Agent uses real logistics provider data to plan routes.
    """
    log_info = json.dumps([
        {
            "name": l["name"],
            "hub": f"{l['city']}, {l['country']}",
            "modes": l["modes"],
            "coverage": l["coverage_regions"],
            "cost_per_km": f"${l['cost_per_km_usd']}",
            "base_fee": f"${l['base_fee_usd']}",
            "avg_speed_kmh": l["avg_speed_kmh"],
            "reliability": f"{l['reliability']*100:.0f}%",
            "max_weight_tons": l["max_weight_tons"],
            "customs_capable": l.get("customs_capable", False),
            "hazmat_certified": l.get("hazmat_certified", False),
            "tracking": l.get("tracking", "none"),
        }
        for l in selected_logistics
    ], indent=2)

    system_prompt = f"""You are a Logistics Provider Agent in a supply chain AI system.
You have access to these REAL logistics providers:

{log_info}

Choose the BEST provider(s) and plan optimal routes.

Return JSON:
{{
  "agent_id": "logistics_global",
  "project_id": "{project_id}",
  "status": "route_planned",
  "selected_provider": "provider name",
  "provider_hub": "city, country",
  "routes": [
    {{
      "route_id": "...",
      "provider": "provider name",
      "mode": "ground/air/sea",
      "segments": [
        {{"from": "...", "to": "...", "carrier": "...", "duration_days": 0}}
      ],
      "total_duration_days": 0,
      "cost_usd": 0.00,
      "risk_level": "low/medium/high",
      "risk_flags": ["..."],
      "insurance_cost_usd": 0.00,
      "tracking_type": "..."
    }}
  ],
  "recommended_route": "route_id",
  "selection_rationale": "Why this provider and route were chosen",
  "customs_requirements": ["..."],
  "reasoning": "Full reasoning"
}}"""

    user_prompt = f"""Project ID: {project_id}
Product: {product_context}
Pickup: {json.dumps(pickup_details, indent=2)}
Delivery: {json.dumps(delivery_details, indent=2)}

Choose the best logistics provider and plan the optimal route."""

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

Return JSON:
{
  "agent_id": "retailer_direct",
  "project_id": "<project_id>",
  "status": "delivery_planned",
  "delivery_plan": {
    "packaging": "...",
    "delivery_method": "...",
    "estimated_delivery_date_offset_days": 0,
    "tracking_number": "...",
    "notifications": ["order confirmed", "shipped", "out for delivery", "delivered"]
  },
  "customer_experience": {
    "warranty": "...",
    "return_policy": "...",
    "support_channel": "...",
    "documentation_included": ["..."]
  },
  "final_retail_price_usd": 0.00,
  "margin_percentage": 0,
  "reasoning": "Delivery plan rationale"
}"""

    user_prompt = f"""Project ID: {project_id}
Product: {product_context}
Manufacturing: {json.dumps(manufacturing_data, indent=2) if manufacturing_data else 'Pending'}
Logistics: {json.dumps(logistics_data, indent=2) if logistics_data else 'Pending'}

Create a detailed retail delivery and customer experience plan."""

    return _call_openai(system_prompt, user_prompt)
