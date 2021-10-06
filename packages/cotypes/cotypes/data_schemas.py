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
    "flow": {
        "definitions": {
            "xyposition": {
                "type": "object",
                "required": ["x", "y"],
                "properties": {"x": {"type": "number"}, "y": {"type": "number"}},
            },
            "position": {"type": "string", "enum": ["left", "top", "right", "bottom"]},
        },
        "type": "object",
        "required": ["el"],
        "properties": {
            "el": {
                "type": "array",
                "items": {
                    "anyOf": [
                        {
                            "type": "object",
                            "required": ["id", "position"],
                            "properties": {
                                "id": {"type": "string"},
                                "position": {"$ref": "#/definitions/xyposition"},
                                "targetPosition": {"$ref": "#/definitions/position"},
                                "sourcePosition": {"$ref": "#/definitions/position"},
                                "data": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "required": ["selectedIntent"],
                                            "properties": {
                                                "selectedIntent": {"type": "string"}
                                            },
                                        },
                                        {
                                            "type": "object",
                                            "required": ["respStr"],
                                            "properties": {
                                                "respStr": {"type": "string"}
                                            },
                                        },
                                        {
                                            "type": "object",
                                            "required": ["endpoint"],
                                            "properties": {
                                                "endpoint": {"type": "string"},
                                                "method": {"type": "string"},
                                                "payload": {"type": "string"},
                                            },
                                        },
                                    ]
                                },
                            },
                        },
                        {
                            "type": "object",
                            "required": ["id", "source", "target"],
                            "properties": {
                                "id": {"type": "string"},
                                "source": {"type": "string"},
                                "target": {"type": "string"},
                                "sourceHandle": {"type": "string"},
                                "targetHandle": {"type": "string"},
                            },
                        },
                    ]
                },
            }
        },
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "Flow",
        "title": "Flow",
    },
}
