import json
from typing import List, cast

from adapters.registry import register
from cotypes.adapters import ComponentDataAdapter, FilesDict, Resources
from .gobot import GobotDataAdapter, IntentDict

@register(component_type="intent")
class IntentDataAdapter(ComponentDataAdapter):

    def override_configs(self, files: FilesDict) -> FilesDict:
        INTENT = 'config.json'
        if INTENT not in files:
            raise FileNotFoundError(f"{INTENT} config is required for intent catcher!")

        int_conf = json.loads(files[INTENT])
        int_conf['metadata']['variables']['DATA_PATH'] = 'data'
        int_pipe = int_conf['chainer']['pipe']
        for comp in int_pipe:
            if 'number_of_intents' in comp:
                comp['number_of_intents'] = len(self.data['intent'])

        return {
            INTENT: json.dumps(int_conf, indent=4),
        }

    @classmethod
    def from_files(cls, files: FilesDict) -> ComponentDataAdapter:
        if 'domain.yml' not in files:
            raise FileNotFoundError("Missing domain.yml")
        if 'nlu.md' not in files:
            raise FileNotFoundError("Missing nlu.md")

        adapter = cls()
        adapter.files = files
        adapter.data = cast(Resources, {
            'intent': [],
        })
        return adapter
        

    @classmethod
    def from_data(cls, res: Resources) -> ComponentDataAdapter:
        intent_dicts = cast(List[IntentDict], res.get('intent', []))
        fake_flow = {'el': [
            {
                'id': 'fakenode1',
                'type': 'utterance',
                'position': {
                    'x': 0,
                    'y': 0
                },
                'sourcePosition': 'right',
                'targetPosition': 'left',
                'data': {
                    'selectedIntent': intent_dicts[0]['name']
                }
            },
            {
                'id': 'fakenode2',
                'type': 'response',
                'position': {
                    'x': 0,
                    'y': 0
                },
                'sourcePosition': 'right',
                'targetPosition': 'left',
                'data': {
                    'respStr': 'Bye'
                }
            },
            {
                'source': 'fakenode1',
                'target': 'fakenode2',
                'sourceHandle': 'a',
                'targetHandle': 'a',
                'id': 'fakedge'
            }
        ]}

        gobot_adapter = GobotDataAdapter.from_data({
            'intent': res['intent'],
            'flow': [fake_flow]
        })

        adapter = cls()
        adapter.files = gobot_adapter.files 
        adapter.data = res
        return adapter
        
