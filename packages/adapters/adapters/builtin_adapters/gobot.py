import re, json, yaml
from dataclasses import dataclass
from collections import defaultdict
from typing import Dict, List, Any, Tuple, TypedDict, Union, Optional, cast

from adapters.registry import register
from adapters.adapter import ComponentDataAdapter, FilesDict, Resources

class IntentDict(TypedDict):
    name: str
    examples: List[str]
SlotsDict = IntentDict
SlotNamesDict = Dict[str, List[str]]

@dataclass
class NLUIntent:
    name: str
    examples: List[str]

class Intent:
    name: str
    examples: List[str]
    slots: SlotNamesDict
    variations_with_slot_values: List[Tuple[str, Dict[str, str]]]

    @classmethod
    def from_intent(cls, intent: IntentDict, slots: SlotNamesDict):
        int = Intent()
        int.name = intent['name']
        int.examples = intent['examples']
        int.slots = slots

        int.variations_with_slot_values = []
        for ex in int.examples:
            slot_names = set(re.findall(r"(?<=\$)\w+", ex))
            if len(slot_names) == 0:
                int.variations_with_slot_values.append((ex, {}))
            else:
                max_len = max([len(int.slots[slot]) for slot in slot_names])
                for i in range(max_len):
                    slot_vals = {}
                    for slot in slot_names:
                        slot_val_idx = i % len(int.slots[slot])
                        slot_vals[slot] = int.slots[slot][slot_val_idx]
                    int.variations_with_slot_values.append((ex, slot_vals))
        return int

    @staticmethod
    def from_nlu_intents(nlu_intents: List[NLUIntent]):
        slot_pat = r"\[([\w ]+)\]\(([\w ]+)\)"
        slot_names_dict: SlotNamesDict = defaultdict(list)
        intent_dicts: List[IntentDict] = []
        for nlu_int in nlu_intents:
            int_dict: IntentDict = { 'name': nlu_int.name, 'examples': [] }
            for ex in nlu_int.examples:
                ex_slots = re.findall(slot_pat, ex)
                for slot_val, slot_name in ex_slots:
                    slot_names_dict[slot_name].append(slot_val)
                ex_without_vals = re.sub(slot_pat, r"$\g<2>", ex)
                int_dict['examples'].append(ex_without_vals)
            intent_dicts.append(int_dict)
        slots = [ { 'name': name, 'examples': examples } for name, examples in slot_names_dict.items() ]
        return intent_dicts, slots

    def get_nlu_intent_variations(self):
        for ex, slot_vals in self.variations_with_slot_values:
            ex_with_vals = ex
            for s in slot_vals.keys():
                ex_with_vals = ex_with_vals.replace(f"${s}", f"[{slot_vals[s]}]({s})")
            yield ex_with_vals
IntentNamesDict = Dict[str, Intent]

class StoryPath:
    def __init__(self, steps: List[Union[str, Intent]]):
        self.steps = steps

    def get_variations(self):
        max_len = max([len(int.variations_with_slot_values) for int in self.steps if isinstance(int, Intent)])
        for i in range(max_len):
            story: List[str] = []
            for step in self.steps:
                if isinstance(step, str):
                    story.append(step)
                else:
                    variation_idx = i % len(step.variations_with_slot_values)
                    _, slot_vals = step.variations_with_slot_values[variation_idx]
                    story.append(f"{step.name}{json.dumps(slot_vals)}")
            yield story

@dataclass
class Story:
    name: str
    steps: List[str]

class Stories:
    flow: List[Dict[str, Any]]
    intents: IntentNamesDict
    story_paths: List[StoryPath]
    responses: Dict[str, str]

    @classmethod
    def from_stories(cls, stories: List[Story], responses: Dict[str, str]):
        stories_inst = Stories()
        stories_inst.responses = responses
        unique_paths = set()
        for story in stories:
            stripped = tuple(step.split("{")[0] for step in story.steps)
            unique_paths.add(stripped)
        stories_inst.story_paths = [ StoryPath(steps) for steps in unique_paths ]
        stories_inst.flow = stories_inst._get_flow()
        return stories_inst

    @classmethod
    def from_flow(cls, flow: List[Dict[str, Any]], intents: IntentNamesDict):
        stories_inst = Stories()
        stories_inst.flow = flow
        stories_inst.intents = intents
        paths_node_ids = stories_inst._get_all_paths()
        stories_inst.story_paths, stories_inst.responses = stories_inst._parse_steps(paths_node_ids)
        return stories_inst

    def _find_starts(self):
        all_nodes = set()
        for el in self.flow:
            if 'type' in el:
                all_nodes.add(el['id'])
        for el in self.flow:
            if 'target' in el and el['target'] in all_nodes:
                all_nodes.remove(el['target'])
        return all_nodes

    def _recurse_path(self, source_id: str, steps: List[str]):
        paths = []
        steps = [*steps, source_id]
        is_last = True
        for el in self.flow:
            if 'source' in el and el['source'] == source_id:
                paths += self._recurse_path(el['target'], steps)
                is_last = False
        if is_last:
            return [steps]
        return paths

    def _get_all_paths(self):
        starts = self._find_starts()
        paths_node_ids = []
        for start in starts:
            paths_node_ids += self._recurse_path(start, [])
        return paths_node_ids

    def _parse_steps(self, paths_node_ids: List[List[str]]):
        next_resp_idx = 0
        response_names = {}
        story_paths = []
        nodes = { n['id']: n for n in self.flow if 'type' in n }
        for path in paths_node_ids:
            path_steps = []
            for step_node_id in path:
                node = nodes[step_node_id]
                node_type = node['type']
                if node_type == 'utterance':
                    intent_name = node['data']['selectedIntent']
                    intent = self.intents[intent_name]
                    path_steps.append(intent)
                elif node_type == 'response':
                    resp = node['data']['respStr']
                    if resp not in response_names:
                        response_names[resp] = f"system_{next_resp_idx}"
                        next_resp_idx += 1
                    path_steps.append(response_names[resp])
            story_paths.append(StoryPath(path_steps))
        responses = { resp_name: resp for resp, resp_name in response_names.items() }
        return story_paths, responses

    def _get_flow(self):
        COL_WIDTH = 500
        NODE_HEIGHT = 200
        nodes = []
        node_ids = set()
        columns = defaultdict(list)
        def _add_node(id: int, step_name: str, col_idx: int):
            if id in node_ids: return id
            node_ids.add(id)
            type = 'response' if step_name.startswith('system_') else 'utterance'
            data = {}
            if type == 'response':
                data['respStr'] = self.responses[step_name]
            elif type == 'utterance':
                data['selectedIntent'] = step_name
            for neighbor in columns[col_idx]:
                if neighbor['type'] == type and neighbor['data'] == data:
                    return neighbor['id']
            idx_in_col = len(columns[col_idx])
            node = {
                'id': str(id),
                'type': type,
                'position': {
                    'x': COL_WIDTH * col_idx,
                    'y': idx_in_col * NODE_HEIGHT
                },
                'sourcePosition': 'right',
                'targetPosition': 'left',
                'data': data
            }

            columns[col_idx].append(node)
            nodes.append(node)
            return id

        edges = []
        edge_ids = set()
        def _add_edge(source: int, target: int):
            id = f"reactflow__edge-{source}a-{target}a"
            if id in edge_ids: return
            edge_ids.add(id)
            edges.append({
                'source': str(source),
                'target': str(target),
                'sourceHandle': 'a',
                'targetHandle': 'a',
                'id': id
            })

        max_len = max([ len(path.steps) for path in self.story_paths ])
        unique_first_nodes = set(str(path.steps[0]) for path in self.story_paths)
        for node_type in unique_first_nodes:
            _add_node(hash((node_type,)), node_type, 0)
        for i in range(1, max_len):
            unique_paths = set(tuple(path.steps[:i + 1]) for path in self.story_paths)
            for path in unique_paths:
                node_id = hash(path)
                id_to_connect_to = _add_node(node_id, str(path[-1]), i)
                _add_edge(hash(path[:-1]), id_to_connect_to)
        return nodes + edges


    def get_all_stories(self):
        story_idx = 0
        for story_path in self.story_paths:
            for variation in story_path.get_variations():
                story_name = f"story_{story_idx}"
                story_idx += 1
                yield Story(name=story_name, steps=variation)


@register(component_type="gobot", format="md")
class GobotDataAdapter(ComponentDataAdapter):
    @staticmethod
    def _parse_md(md_file: str):
        block_name: Optional[str] = None
        block_lines: List[str] = []
        for line in md_file.split('\n'):
            line = line.strip()
            if line.startswith('##'):
                if block_name is not None:
                    yield (block_name, block_lines)
                    block_lines = []
                block_name = line.lstrip('##').strip()
            elif line.startswith('-'):
                bline = line.lstrip('-').strip()
                block_lines.append(bline)
            elif line.startswith('*'):
                bline = line.lstrip('*').strip()
                block_lines.append(bline)
        if len(block_lines) != 0:
            yield (cast(str, block_name), block_lines)

    @classmethod
    def import_data(cls, files: FilesDict) -> Resources:
        if 'domain.yml' not in files:
            raise FileNotFoundError("Missing domain.yml")
        if 'nlu.md' not in files:
            raise FileNotFoundError("Missing nlu.md")
        if 'stories-trn.md' not in files:
            raise FileNotFoundError("Missing stories-trn.md")

        nlu_intents: List[NLUIntent] = []
        for block_name, examples in cls._parse_md(files['nlu.md']):
            int_name = block_name.lstrip("intent:")
            nlu_intents.append(NLUIntent(int_name, examples))
        intents, slots = Intent.from_nlu_intents(nlu_intents)
        md_stories: List[Story] = []
        for story_name, steps in cls._parse_md(files['stories-trn.md']):
            md_stories.append(Story(story_name, steps))
        domain = yaml.load(files['domain.yml'], Loader=yaml.SafeLoader)
        responses = { resp_name: resp['text'] for resp_name, resp in domain['responses'].items() }
        flow = Stories.from_stories(md_stories, responses).flow

        return cast(Resources, {
            'flow': [{ 'el': flow }],
            'intent': intents,
            'slot': slots
        })
        

    @staticmethod
    def export_data(res: Resources) -> FilesDict:
        if 'flow' not in res or len(res['flow']) != 1:
            raise RuntimeError("Exactly one flow is required to export a gobot")
        flow = res['flow'][0]['el']
        slot_dicts = res.get("slot", [])
        slot_names_dict: SlotNamesDict = { slot['name']: slot['examples'] for slot in slot_dicts }
        intent_dicts = cast(List[IntentDict], res.get('intent', []))
        intents: IntentNamesDict = { int['name']: Intent.from_intent(int, slot_names_dict) for int in intent_dicts }
        stories = Stories.from_flow(flow, intents)

        domain_dict = {
            'actions': list(stories.responses.keys()),
            'intents': list(intents.keys()),
            'responses': { resp_name: { 'text': resp } for resp_name, resp in stories.responses.items() }
        }

        nlu_md_lines = []
        for int in intents.values():
            nlu_md_lines.append(f"## intent:{int.name}")
            for ex in int.get_nlu_intent_variations():
                nlu_md_lines.append(f" - {ex}")
            nlu_md_lines.append("")

        stories_lines = []
        for story in stories.get_all_stories():
            stories_lines.append(f"## {story.name}")
            for step in story.steps:
                stories_lines.append(f" - {step}")
            stories_lines.append("")
        stories_md = "\n".join(stories_lines)

        files = {
            'domain.yml': yaml.dump(domain_dict),
            'nlu.md': "\n".join(nlu_md_lines),
            'stories-trn.md': stories_md,
            'stories-tst.md': stories_md,
            'stories-val.md': stories_md
        }

        return files


        
