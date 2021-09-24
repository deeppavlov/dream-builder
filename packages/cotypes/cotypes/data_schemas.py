schemas = {
    "intent": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "Intent",
        "title": "Intent",
        "type": "object",
        "required": ["name", "examples"],
        "properties": {
            "name": {"type": "string"},
            "examples": {"type": "array", "items": {"type": "string"}},
        },
    },
    "slot": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "Slot",
        "title": "Slot",
        "type": "object",
        "required": ["name", "examples"],
        "properties": {
            "name": {"type": "string"},
            "examples": {"type": "array", "items": {"type": "string"}},
        },
    },
}
