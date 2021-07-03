import json
from flask import Flask, request

app = Flask(__name__)

@app.route("/api/res", methods=["POST"])
def update():
    content = request.json
    dataset = { v['content']['name']: v['content']['examples'] for _, v in content['resources'].items() if v['type'] == 'intent' }
    with open("data.json", 'w') as f:
        json.dump(dataset, f)
    # dataset = [ { "intent": v['content']['name'], "examples": v['content']['examples'] } for _, v in content['resources'].items() if v['type'] == 'intent' ]
    print(dataset)
    return ""

# @app.route("/api/train", methods=["POST"])
# def train():
#     return ""

# @app.route("/api/test", methods=["POST"])
# def test():
#     content = request.get_data()
#     return ""
