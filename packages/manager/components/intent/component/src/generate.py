import json

with open("/input/input.json") as f:
    inputs = json.load(f)
    inputs = [ { "name": int['content']['name'].strip(), "examples": int['content']['examples'] } for int in inputs ]

icdata = {
    "intent_phrases": {
        int['name']: {
            "phrases": int['examples'],
            "reg_phrases": [],
            "punctuation": [".", "!", "?"]
        } for int in inputs
    },
    "random_phrases": {
        "phrases": [],
        "punctuation": [".", "!", "?"]
    }
}

with open("data/intent_phrases.json", 'w') as f:
    json.dump(icdata, f)

# intents = [ { "intent": int['name'], "examples": '\n'.join(int['examples']) } for int in inputs ]
# icdata = {
#     'version': "2.0",
#     "nlu": intents
# }
# domain = {
#     'version': '2.0',
#     'intents': [int['name'] for int in inputs]
# }
# fake_stories = {
#     'stories': [ { 'story': int['name'], 'steps': [ { "intent": int['name'] }, { "action": "system_bye" } ] } for int in inputs ]
# }

# with open('nlu.yml', 'w') as f:
#     yaml.dump(icdata, f)
# with open('domain.yml', 'w') as f:
#     yaml.dump(domain, f)
# with open('stories-trn.yml', 'w') as f:
#     yaml.dump(fake_stories, f)
# with open('stories-tst.yml', 'w') as f:
#     yaml.dump(fake_stories, f)
# with open('stories-val.yml', 'w') as f:
#     yaml.dump(fake_stories, f)

