"""
Agent Registry — AgentFacts metadata for all supply chain agents.
Supports discovery, search by role/capability/jurisdiction.
"""

AGENT_REGISTRY = [
    {
        "agent_id": "procurement_main",
        "name": "Procurement Agent",
        "role": "Procurement",
        "capabilities": ["intent_analysis", "vendor_selection", "cost_optimization", "multi_source_coordination"],
        "endpoint": "/agents/procurement",
        "policy": {
            "max_budget": None,
            "preferred_regions": ["Global"],
            "optimization": "cost_and_time",
        },
        "jurisdiction": "Global",
        "framework": "CrewAI",
        "description": "Orchestrates the full procurement pipeline. Analyzes user intent, identifies required components, coordinates with all other agents, and produces the final execution plan.",
    },
    {
        "agent_id": "supplier_alpha",
        "name": "Supplier Agent",
        "role": "Supplier",
        "capabilities": ["raw_materials", "components", "electronics", "mechanical_parts", "specialty_items"],
        "endpoint": "/agents/supplier",
        "policy": {
            "min_order_value": 100,
            "payment_terms": "net_30",
            "bulk_discount_threshold": 50,
            "quality_certifications": ["ISO_9001", "CE"],
        },
        "jurisdiction": "EU",
        "framework": "Plain Python",
        "description": "Provides detailed quotes for raw materials and components. Validates availability, lead times, and pricing for requested items.",
    },
    {
        "agent_id": "manufacturer_prime",
        "name": "Manufacturer Agent",
        "role": "Manufacturer",
        "capabilities": ["assembly", "quality_testing", "custom_fabrication", "precision_engineering"],
        "endpoint": "/agents/manufacturer",
        "policy": {
            "min_lead_time_days": 3,
            "quality_standard": "ISO_9001",
            "max_concurrent_orders": 10,
            "accepts_custom_specs": True,
        },
        "jurisdiction": "EU",
        "framework": "Plain Python",
        "description": "Handles product assembly and manufacturing. Evaluates capacity, assembly requirements, timeline, and facility allocation.",
    },
    {
        "agent_id": "logistics_global",
        "name": "Logistics Provider Agent",
        "role": "Logistics",
        "capabilities": ["ground_transport", "air_freight", "sea_freight", "warehousing", "last_mile"],
        "endpoint": "/agents/logistics",
        "policy": {
            "insurance_included": True,
            "tracking": "real_time",
            "hazmat_certified": True,
            "customs_handling": True,
        },
        "jurisdiction": "Global",
        "framework": "Plain Python",
        "description": "Plans shipping routes, calculates costs, and manages logistics across transport modes. Handles customs and risk assessment.",
    },
    {
        "agent_id": "retailer_direct",
        "name": "Retailer Agent",
        "role": "Retailer",
        "capabilities": ["direct_to_consumer", "b2b_fulfillment", "marketplace_listing", "order_tracking"],
        "endpoint": "/agents/retailer",
        "policy": {
            "return_policy_days": 30,
            "warranty_years": 1,
            "packaging": "branded",
            "customer_notification": True,
        },
        "jurisdiction": "Global",
        "framework": "Plain Python",
        "description": "Manages final delivery to customer, handles retail operations, order packaging, tracking notifications, and post-sale support.",
    },
]


def list_agents():
    """Return all registered agents."""
    return AGENT_REGISTRY


def search_agents(role=None, capability=None, jurisdiction=None):
    """Search agents by role, capability, or jurisdiction."""
    results = AGENT_REGISTRY
    if role:
        results = [a for a in results if a["role"].lower() == role.lower()]
    if capability:
        results = [
            a for a in results
            if any(cap in a["capabilities"] for cap in (capability if isinstance(capability, list) else [capability]))
        ]
    if jurisdiction:
        results = [
            a for a in results
            if a["jurisdiction"].lower() in [jurisdiction.lower(), "global"]
        ]
    return results


def get_agent(agent_id):
    """Get a specific agent by ID."""
    for a in AGENT_REGISTRY:
        if a["agent_id"] == agent_id:
            return a
    return None
