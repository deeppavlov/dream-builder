"""
Functions for emulating the DP-Agent protocol.
"""
# TODO: Use the DP-Agent library?

import hashlib, json
from datetime import datetime
from typing import List, Dict, Any, Union, Tuple
from cotypes.common import Component
from cotypes.common.message import UserType, Message

_user_profile = {
    "id": "5d9b755eb8cd280022907f25",
    "user_telegram_id": "sample_id",
    "user_type": "human",
    "device_type": "cmd",
    "persona": [],
    "profile": {
        "name": "None",
        "gender": "None",
        "birthdate": "None",
        "location": "None",
        "home_coordinates": "None",
        "work_coordinates": "None",
        "occupation": "None",
        "income_per_year": "None"
    },
    "attributes": {}
}

_bot_profile = {
    "id": "5d9b755eb8cd280022907f26",
    "user_type": "bot",
    "persona": [],
    "attributes": {}
}


# TODO: Add option to customize user and bot profiles.
def get_agent_state(message_hist: List[Message]):
    """Returns a dictionary in the agent state format.
    
    Args:
        message_hist: List of past messages in this dialog.

    Returns:
        A dictionary in the agent state format, suitable for sending to
        components. User and bot profiles are filled in with placeholder
        content.

        Reference: https://deeppavlov-agent.readthedocs.io/en/latest/_static/api.html
    """
    utterances = []
    for msg in message_hist:
        utterance: Dict[str, Any] = {
            "text": msg.text,
            "annotations": msg.annotations or [],
            "date_time": str(msg.date_time or datetime.now()),
        }

        if msg.user_type == UserType.bot:
            utterance.update({
                "orig_text": msg.text,
                "user": _bot_profile,
                "confidence": msg.confidence or 1.0,
                "active_skill": ""
            })
        else:
            utterance.update({
                "user": _user_profile,
                "hypotheses": msg.hypotheses or [],
                "attributes": {}
            })

        # Generate the utterance id from a hash, so it's stable.
        hasher = hashlib.sha1()
        json_str = json.dumps(utterance, sort_keys=True, ensure_ascii=True).encode()
        hasher.update(json_str)
        utterance['id'] = hasher.hexdigest()
        utterances.append(utterance)

    return {
        "version": "0.12.0",
        "channel_type": "cmd_client",
        "human": _user_profile,
        "bot": _bot_profile,
        "id": "5d9b755eb8cd280022907f27",
        "location": "dp-builder",
        "utterances": utterances
    }


def _parse_skill_response(response: Union[List, Dict]) -> Tuple[str, float]:
    if isinstance(response, list):
        return response[0], response[1]
    else:
        return response['text'], response['confidence']


def format_reply(comp: Component, reply: Union[List, Dict]) -> Message:
    """Format a reply from a component into our Message format

    Uses comp.group to determine the formatting style (ie. skill, annotator, etc.)
    Reference: https://deeppavlov-agent.readthedocs.io/en/latest/api/services_http_api.html#output-format

    Args:
        comp: Component which gave the reply.
        reply: JSON reply from the component.

    Returns:
        Parsed Message object.
    """
    if comp.group == 'annotators':
        msg = Message(
            user_type = UserType.user,
            annotations = { [comp.type]: reply }
        )
        msg.annotations = {}
    elif comp.group == 'skills':
        best_reply = max((_parse_skill_response(resp) for resp in reply), key=lambda r: r[1])[0]
        msg = Message(
            user_type = UserType.bot,
            text=best_reply,
            hypotheses = [reply]
        )
    else:
        raise RuntimeError(f"Couldn't format response from {comp.group} group")
    return msg



