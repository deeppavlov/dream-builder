import yaml
import json

with open("/input/domain.yml") as f:
    domain_dict = yaml.load(f)
    num_ints = len(domain_dict['intents'])
print("Number of intents", num_ints)

with open("ic.json") as f:
    ic_dict = json.load(f)

pipe = ic_dict['chainer']['pipe']
for comp in pipe:
    if 'number_of_intents' in comp:
        comp['number_of_intents'] = num_ints

with open("ic.json", "w") as f:
    json.dump(ic_dict, f)
    print(json.dumps(ic_dict, indent=4))
