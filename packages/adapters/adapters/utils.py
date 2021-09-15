from typing import Dict, List, Any, Optional

ResList = List[Dict[str, Any]]

## Export

# Intents & Slots
def intents_to_nlu_yml(intents: ResList, slots: Optional[ResList] = None) -> str:
    pass

def intents_to_nlu_md(intents: ResList, slots: Optional[ResList] = None) -> str:
    pass

# Stories
def flow_to_stories_yml(flow: ResList) -> str:
    pass

def flow_to_stories_md(stories_md: str) -> ResList:
    pass


## Import

# Intents
def nlu_yml_to_intents(nlu_yml: str) -> ResList:
    pass

def nlu_md_to_intents(nlu_md: str) -> ResList:
    pass

# Stories
def stories_yml_to_flow(stories_yml: str) -> ResList:
    pass

def stories_md_to_flow(stories_md: str) -> ResList:
    pass

# Slots
def nlu_yml_to_slots(nlu_yml: str) -> ResList:
    pass

def nlu_md_to_slots(nlu_md: str) -> ResList:
    pass
