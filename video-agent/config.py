"""
Brand persona configurations for video ad generation.
Each brand has voice, avatar, tone, and messaging settings.
"""

BRANDS = {
    "astra": {
        "name": "Astra Removals",
        "tagline": "Moving families since 1986",
        "voice_id": "SJybVYNKbV5QKpeuh75j",
        "avatar_id": "Bryan_Casual_Front_public",
        "tone": "Warm, trustworthy, local family business. Like talking to a friend who happens to run a removal company.",
        "target_audience": "Homeowners in Bournemouth/Dorset moving house, 30-55 age range",
        "key_messages": [
            "Family run since 1986",
            "Fully insured",
            "Free quotes",
            "Local and long distance",
        ],
        "website": "astraremovals.co.uk",
        "phone": "01202 113 255",
        "cta": "Call us on 01202 113 255 or visit astraremovals.co.uk for a free quote",
    },
    "magna": {
        "name": "Magna Park Self Storage",
        "tagline": "Foam insulated container storage from \u00a355/week",
        "voice_id": "SJybVYNKbV5QKpeuh75j",
        "avatar_id": "Colin_Business_Front2_public",
        "tone": "Friendly, straightforward, no-nonsense. Emphasise value for money vs big chains.",
        "target_audience": "People in Bournemouth needing storage \u2014 moving house, business overflow, students",
        "key_messages": [
            "\u00a355/week no VAT",
            "Foam insulated",
            "24/7 access",
            "Cheaper than Big Yellow",
        ],
        "website": "magnaparkselfstore.co.uk",
        "phone": "01202 113252",
        "cta": "Call 01202 113252 or visit magnaparkselfstore.co.uk",
    },
    "coachmentor": {
        "name": "CoachMentor",
        "tagline": "AI-powered coaching education",
        "voice_id": "SJybVYNKbV5QKpeuh75j",
        "avatar_id": "Bradley_Blue_Polo_Front",
        "tone": "Encouraging, knowledgeable, passionate about grassroots football coaching. Like a mentor talking to a fellow coach.",
        "target_audience": "Grassroots football coaches, FA coaching qualification students, youth team managers",
        "key_messages": [
            "AI coaching assistant",
            "Session planning",
            "Development tracking",
            "FA qualification prep",
        ],
        "website": "coachmentor.co.uk",
        "phone": "",
        "cta": "Try CoachMentor free at coachmentor.co.uk",
    },
    "primehaul": {
        "name": "PrimeHaul",
        "tagline": "Smart tools for removal companies",
        "voice_id": "SJybVYNKbV5QKpeuh75j",
        "avatar_id": "Alex_in_Black_Suit_public",
        "tone": "Professional, efficient, B2B. Speaks to removal company owners about growing their business.",
        "target_audience": "UK removal company owners and managers",
        "key_messages": [
            "AI survey tool",
            "Automated quoting",
            "Lead generation",
            "Grow your business",
        ],
        "website": "primehaul.co.uk",
        "phone": "",
        "cta": "Visit primehaul.co.uk to get started",
    },
    "rickai": {
        "name": "Rick.AI",
        "tagline": "AI development studio",
        "voice_id": "SJybVYNKbV5QKpeuh75j",
        "avatar_id": "Adrian_public_3_20240312",
        "tone": "Tech-savvy, modern, confident but approachable. Shows capability without being arrogant.",
        "target_audience": "Small business owners who need AI/tech solutions",
        "key_messages": [
            "Custom AI solutions",
            "Web apps",
            "Automation",
            "From idea to launch",
        ],
        "website": "rick-ai.co.uk",
        "phone": "",
        "cta": "Visit rick-ai.co.uk to see what we can build for you",
    },
}


def get_brand(key: str) -> dict:
    """Get brand config by key. Raises KeyError if not found."""
    if key not in BRANDS:
        available = ", ".join(BRANDS.keys())
        raise KeyError(f"Unknown brand '{key}'. Available: {available}")
    return BRANDS[key]


def list_brands() -> list[str]:
    """Return list of available brand keys."""
    return list(BRANDS.keys())
