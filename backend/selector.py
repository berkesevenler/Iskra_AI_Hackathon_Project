"""
Smart Selector — Chooses optimal suppliers, manufacturers, and logistics
based on distance, cost, lead time, reliability, and capability match.
"""

import math
from data.suppliers import SUPPLIERS
from data.manufacturers import MANUFACTURERS
from data.logistics_providers import LOGISTICS_PROVIDERS


def haversine(x1, y1, x2, y2):
    """Calculate distance between two lat/lon points in km."""
    R = 6371
    dx = math.radians(x2 - x1)
    dy = math.radians(y2 - y1)
    a = (
        math.sin(dx / 2) ** 2
        + math.cos(math.radians(x1)) * math.cos(math.radians(x2)) * math.sin(dy / 2) ** 2
    )
    return R * 2 * math.asin(math.sqrt(a))


# ═══════════════════════════════════════════
# SUPPLIER SELECTION
# ═══════════════════════════════════════════

def score_supplier(supplier, required_specs, ref_x=None, ref_y=None):
    """
    Score a supplier (0-100) based on:
    - Capability match (40%)
    - Reliability (20%)
    - Cost efficiency (20%)
    - Proximity (20%)
    """
    score = 0.0

    # Capability match (0-40)
    all_specs = supplier["specialization"]
    if not required_specs:
        matched = len(all_specs)
        total = max(len(all_specs), 1)
    else:
        matched = sum(
            1 for spec in required_specs
            if any(spec.lower() in s.lower() or s.lower() in spec.lower() for s in all_specs)
        )
        total = max(len(required_specs), 1)

    if matched == 0:
        return 0.0  # No capability match at all

    score += (matched / total) * 40

    # Reliability (0-20)
    score += supplier["reliability"] * 20

    # Cost efficiency (0-20): lower multiplier = better
    cost_m = supplier["cost_multiplier"]
    score += max(0, (2.0 - cost_m) / 2.0) * 20

    # Proximity (0-20)
    if ref_x is not None and ref_y is not None:
        dist = haversine(ref_x, ref_y, supplier["x"], supplier["y"])
        score += max(0, (10000 - dist) / 10000) * 20
    else:
        score += 10  # Neutral if no reference

    return round(score, 2)


def select_suppliers(required_specs, ref_x=None, ref_y=None, top_n=5):
    """Select the best suppliers for given requirements."""
    scored = []
    for sup in SUPPLIERS:
        s = score_supplier(sup, required_specs, ref_x, ref_y)
        if s > 0:
            scored.append({**sup, "_score": s, "_distance_km": round(haversine(ref_x or 0, ref_y or 0, sup["x"], sup["y"]), 1) if ref_x else None})
    scored.sort(key=lambda x: x["_score"], reverse=True)
    return scored[:top_n]


# ═══════════════════════════════════════════
# MANUFACTURER SELECTION
# ═══════════════════════════════════════════

def score_manufacturer(mfg, required_capabilities, ref_x=None, ref_y=None):
    """Score a manufacturer (0-100)."""
    score = 0.0

    # Capability match (40%)
    all_caps = mfg["capabilities"]
    if not required_capabilities:
        matched = len(all_caps)
        total = max(len(all_caps), 1)
    else:
        matched = sum(
            1 for cap in required_capabilities
            if any(cap.lower() in c.lower() or c.lower() in cap.lower() for c in all_caps)
        )
        total = max(len(required_capabilities), 1)

    if matched == 0:
        # Check specialization as fallback
        spec = mfg.get("specialization", "").lower()
        if any(cap.lower() in spec for cap in required_capabilities):
            matched = 1
            total = max(len(required_capabilities), 1)
        else:
            return 0.0

    score += (matched / total) * 40

    # Reliability (0-20)
    score += mfg["reliability"] * 20

    # Cost efficiency (0-20): lower cost_per_unit_hour = better
    max_cost = 150
    score += max(0, (max_cost - mfg["cost_per_unit_hour"]) / max_cost) * 20

    # Proximity (0-20)
    if ref_x is not None and ref_y is not None:
        dist = haversine(ref_x, ref_y, mfg["x"], mfg["y"])
        score += max(0, (10000 - dist) / 10000) * 20
    else:
        score += 10

    return round(score, 2)


def select_manufacturers(required_capabilities, ref_x=None, ref_y=None, top_n=5):
    """Select the best manufacturers for given requirements."""
    scored = []
    for mfg in MANUFACTURERS:
        s = score_manufacturer(mfg, required_capabilities, ref_x, ref_y)
        if s > 0:
            scored.append({**mfg, "_score": s, "_distance_km": round(haversine(ref_x or 0, ref_y or 0, mfg["x"], mfg["y"]), 1) if ref_x else None})
    scored.sort(key=lambda x: x["_score"], reverse=True)
    return scored[:top_n]


# ═══════════════════════════════════════════
# LOGISTICS SELECTION
# ═══════════════════════════════════════════

def score_logistics(provider, pickup_x, pickup_y, delivery_x, delivery_y, required_mode=None):
    """Score a logistics provider (0-100)."""
    score = 0.0

    # Mode match (25%)
    if required_mode:
        if required_mode.lower() in [m.lower() for m in provider["modes"]]:
            score += 25
        else:
            return 0.0
    else:
        score += 15  # Any mode

    # Proximity to pickup (25%)
    dist_to_pickup = haversine(pickup_x, pickup_y, provider["x"], provider["y"])
    score += max(0, (10000 - dist_to_pickup) / 10000) * 25

    # Reliability (20%)
    score += provider["reliability"] * 20

    # Cost efficiency (15%)
    max_cost_per_km = 5.0
    score += max(0, (max_cost_per_km - provider["cost_per_km_usd"]) / max_cost_per_km) * 15

    # Customs capability bonus (5%)
    if provider.get("customs_capable"):
        score += 5

    # Hazmat bonus (5%)
    if provider.get("hazmat_certified"):
        score += 5

    # Real-time tracking bonus (5%)
    if provider.get("tracking") == "real_time_GPS":
        score += 5

    return round(score, 2)


def select_logistics(pickup_x, pickup_y, delivery_x, delivery_y, required_mode=None, top_n=5):
    """Select the best logistics providers for the route."""
    scored = []
    for prov in LOGISTICS_PROVIDERS:
        s = score_logistics(prov, pickup_x, pickup_y, delivery_x, delivery_y, required_mode)
        if s > 0:
            dist = haversine(pickup_x, pickup_y, prov["x"], prov["y"])
            scored.append({**prov, "_score": s, "_distance_to_pickup_km": round(dist, 1)})
    scored.sort(key=lambda x: x["_score"], reverse=True)
    return scored[:top_n]


# ═══════════════════════════════════════════
# Summary helpers
# ═══════════════════════════════════════════

def format_supplier_summary(supplier):
    """Human-readable summary of a selected supplier."""
    return {
        "id": supplier["id"],
        "name": supplier["name"],
        "location": f"{supplier['city']}, {supplier['country']}",
        "coordinates": {"x": supplier["x"], "y": supplier["y"]},
        "specialization": supplier["specialization"],
        "lead_time_days": supplier["lead_time_days"],
        "cost_multiplier": supplier["cost_multiplier"],
        "reliability": f"{supplier['reliability'] * 100:.0f}%",
        "certifications": supplier["certifications"],
        "selection_score": supplier.get("_score", 0),
        "distance_km": supplier.get("_distance_km"),
    }


def format_manufacturer_summary(mfg):
    """Human-readable summary of a selected manufacturer."""
    return {
        "id": mfg["id"],
        "name": mfg["name"],
        "location": f"{mfg['city']}, {mfg['country']}",
        "coordinates": {"x": mfg["x"], "y": mfg["y"]},
        "specialization": mfg["specialization"],
        "capabilities": mfg["capabilities"],
        "lead_time_days": mfg["lead_time_days"],
        "cost_per_hour": f"${mfg['cost_per_unit_hour']}",
        "reliability": f"{mfg['reliability'] * 100:.0f}%",
        "facility_size": f"{mfg['facility_size_sqm']:,} sqm",
        "certifications": mfg["certifications"],
        "selection_score": mfg.get("_score", 0),
        "distance_km": mfg.get("_distance_km"),
    }


def format_logistics_summary(prov):
    """Human-readable summary of a selected logistics provider."""
    return {
        "id": prov["id"],
        "name": prov["name"],
        "hub": f"{prov['city']}, {prov['country']}",
        "coordinates": {"x": prov["x"], "y": prov["y"]},
        "modes": prov["modes"],
        "coverage": prov["coverage_regions"],
        "cost_per_km": f"${prov['cost_per_km_usd']}",
        "base_fee": f"${prov['base_fee_usd']}",
        "avg_speed": f"{prov['avg_speed_kmh']} km/h",
        "reliability": f"{prov['reliability'] * 100:.0f}%",
        "customs": prov.get("customs_capable", False),
        "hazmat": prov.get("hazmat_certified", False),
        "tracking": prov.get("tracking", "none"),
        "selection_score": prov.get("_score", 0),
        "distance_to_pickup_km": prov.get("_distance_to_pickup_km"),
    }
