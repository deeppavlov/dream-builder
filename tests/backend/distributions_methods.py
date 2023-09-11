import time
import pytest
import pydantic
import logging
import requests
from services.distributions_api import schemas as models
from .config import (
    assistant_dists_endpoint,
    components_endpoint,
    users_endpoint,
    api_keys_endpoint,
    dialog_sessions_endpoint,
    deployments_endpoint,
    admin_endpoint,
    lm_services_endpoint,
    openai_token,
    lm_service_id_list,
    lm_service_id_russian_list,
    auth_token_user1,
)

LOGGER = logging.getLogger(__name__)


def assert_status_code(response, status_code):
    assert response.status_code == status_code, \
        f"Expected status code is {status_code}, actual: {response.status_code}, {response.json()} " \
        f"{LOGGER.error(f'Expected status code is {status_code}, actual: {response.status_code}, {response.json()}')}"


def assert_validation(response, model):
    try:
        assert model.parse_obj(response), \
            f"Validation error, actual response: {response}"
    except pydantic.error_wrappers.ValidationError as err:
        LOGGER.error(f'Validation error, actual response: {response}')
        raise err


def assert_no_access(response):
    assert {"detail": "No access"} == response.json(), \
        f"Expected response is 'detail': 'No access',' actual: {response.json()} " \
        f"""{LOGGER.error(f"Expected response is 'detail':'No access', actual: {response.json()}")}"""


def assert_requires_admin_user(response):
    assert {'detail': 'Requires admin user'} == response.json(), \
        f"Expected response is 'detail': 'Requires admin user',' actual: {response.json()} " \
        f"""{LOGGER.error(f"Expected response is 'detail': 'Requires admin user', actual: {response.json()}")}"""


class UserMethods:
    def __init__(self, auth_token='token', auth_type='github'):
        self.auth_token = auth_token
        self.auth_type = auth_type

    # ASSISTANT_DIST

    def create_virtual_assistant(self, name, language="en"):
        response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={"display_name": name,
                  "description": "TestBot",
                  "language": language
                  },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.VirtualAssistantRead)
        assert response.json()["language"]["value"] == language
        return response.json()

    def create_virtual_assistant_bad_token(self):
        response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": "bad_token",
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={"display_name": "TestBot",
                  "description": "TestBot"
                  },
        )
        assert_status_code(response, 403)
        assert_validation(response.json(), models.VirtualAssistantRead)

    def create_virtual_assistant_invalid_data(self):
        response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={"display_name": 1,
                  "description": 1
                  },
        )
        assert_status_code(response, 403)
        assert_validation(response.json(), models.VirtualAssistantRead)

    def get_list_of_public_va(self):
        public_dist_names_list = []
        response = requests.get(assistant_dists_endpoint + "/public_templates")
        assert_status_code(response, 200)
        for public_dist in response.json():
            public_dist_names_list.append(public_dist["name"])
            assert_validation(public_dist, models.VirtualAssistantRead)
        return public_dist_names_list

    def get_list_of_private_va(self, created_va_name):
        private_dist_names_list = []
        response = requests.get(
            url=assistant_dists_endpoint + "/user_owned",
            headers={
                "accept": "*/*",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        for private_dist in response.json():
            private_dist_names_list.append(private_dist["name"])
            assert_validation(private_dist, models.VirtualAssistantRead)
        private_dist_names = [private_dist["name"] for private_dist in response.json()]
        assert created_va_name in private_dist_names, \
            f"Created_va_name: {created_va_name} not in private_dist_names {private_dist_names}" \
            f"""{LOGGER.error(f"Created_va_name: {created_va_name} not in private_dist_names {private_dist_names}")}"""

    def get_va_by_name(self, name):
        response = requests.get(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.VirtualAssistantRead)
        assert response.json()["name"] == name, \
            f"Response doesn't contain a name: name = {name}, {response.json()}" \
            f"""{LOGGER.error(f"Response doesn't contain a name: name = {name}, {response.json()}")}"""
        return response.json()

    def get_va_by_name_non_exist(self, name):
        response = requests.get(url=assistant_dists_endpoint + "/" + name,
                                headers={
                                    'accept': 'application/json',
                                    'token': self.auth_token,
                                    "auth-type": self.auth_type,
                                }
                                )
        assert_status_code(response, 404)
        assert {'detail': f"Virtual assistant '{name}' not found in database"} == response.json(), \
            f"Expected response: 'not found in database', actual: {response.status_code}, {response.json()}" \
            f"""{LOGGER.error(
                f"Expected response: 'not found in database', actual: {response.status_code}, {response.json()}")}"""

    def get_va_by_name_no_access(self, name):
        response = requests.get(assistant_dists_endpoint + "/" + name)
        assert_status_code(response, 403)
        assert_no_access(response)
        return response.json()

    def delete_va_by_name(self, name):
        response = requests.delete(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "*/*",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 204)

    def delete_va_by_name_no_access(self, name):
        response = requests.delete(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "*/*",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 500)

    def patch_va_by_name(self, name):
        response = requests.patch(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={"display_name": "Test_name", "description": "Test_description"},
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.VirtualAssistantRead)

    def patch_va_by_name_no_access(self, name):
        response = requests.patch(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={"display_name": "Test_name", "description": "Test_description"},
        )
        assert_status_code(response, 500)

    def clone_va(self, name):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/clone",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "display_name": "Test_clone_name",
                "description": "Test_clone_description"
            },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.VirtualAssistantRead)
        return response.json()

    def clone_va_no_access(self, name):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/clone",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "display_name": "Test_clone_name",
                "description": "Test_clone_description",
                "annotators": [
                    "string",
                ],
                "response_annotators": [
                    "string",
                ],
                "candidate_annotators": [
                    "string",
                ],
                "skill_selectors": [
                    "string",
                ],
                "skills": [
                    "string",
                ],
                "response_selectors": [
                    "string",
                ],
            },
        )
        assert_status_code(response, 403)
        assert_no_access(response)
        return response.json()

    def check_language_inheritance(self, init_name, clone_name):
        user = UserMethods(auth_token_user1)

        init_language = user.get_va_by_name(init_name)["language"]["value"]
        clone_language = user.get_va_by_name(clone_name)["language"]["value"]

        assert init_language == clone_language, \
            f"Expected language: {init_language}, actual language: {clone_language}" \
            f"{LOGGER.error(f'Expected language: {init_language}, actual language: {clone_language}')}"

    def get_va_components(self, name):
        response = requests.get(
            url=assistant_dists_endpoint + "/" + name + "/components",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.VirtualAssistantComponentPipelineRead)
        return response.json()

    def get_va_components_no_access(self, name):
        response = requests.get(
            url=assistant_dists_endpoint + "/" + name + "/components",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 403)
        assert_no_access(response)
        return response.json()

    def add_va_component(self, name, component_id):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/components",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },

            json={
                'component_id': component_id,
            }
        )
        assert_status_code(response, 201)
        return response.json()
        # assert models.VirtualAssistantComponentShort.parse_obj(get_dist_components_response.json()), \
        #    "Error while test_get_public_dist_components_by_name"

    def add_va_component_no_access(self, name, component_id):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/components",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },

            json={
                'component_id': component_id,
            }
        )
        assert_status_code(response, 500)
        # assert_no_access(response)

    def delete_va_component(self, name, component_id):
        response = requests.delete(
            url=assistant_dists_endpoint + "/" + name + "/components/" + str(component_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 204)

    def delete_va_component_no_access(self, name, component_id):
        response = requests.delete(
            url=assistant_dists_endpoint + "/" + name + "/components/" + str(component_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 500)
        # assert_no_access(response)

    def patch_va_component(self, name, component_id):
        response = requests.patch(
            url=assistant_dists_endpoint + "/" + name + "/components/" + str(component_id),
            headers={
                'accept': 'application/json',
            }
        )
        assert_status_code(response, 200)
        # assert models.VirtualAssistantRead.parse_obj(get_dist_components_response.json()), \
        #    "Error while patch_va_component"

    def patch_va_component_no_access(self, name, component_id):
        # display_name="Test_patch",
        # description="Test_patch",
        # prompt="Test_patch",
        # lm_service_id=1):
        response = requests.patch(
            url=assistant_dists_endpoint + "/" + name + "/components/" + str(component_id),
            headers={
                'accept': 'application/json',
            }
        )
        # json={
        #    "display_name": display_name,
        #    "description": description,
        #    "prompt": prompt,
        #    "lm_service_id": lm_service_id
        # }
        # )
        assert_status_code(response, 500)
        # assert_no_access(response)

    def publish_va(self, name, visibility):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + '/publish',
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/json',
            },
            json={
                'visibility': visibility
            }
        )
        assert_status_code(response, 204)

    def publish_va_no_access(self, name, visibility):
        response = requests.post(
            url=assistant_dists_endpoint + "/" + name + '/publish',
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/json',
            },
            json={
                'visibility': visibility
            }
        )
        assert_status_code(response, 500)
        # assert_no_access(response)

    def debug_template(self, name):
        template_file_path = "template_file_path"
        owner_address = "owner_address"
        response = requests.get(
            url=assistant_dists_endpoint + "/templates" + "/template_file_path",
            headers={
                'accept': 'application/json',
            },
            params={
                'owner_address': owner_address,
                'dist_name': name,
            }
        )
        assert_status_code(response, 200)

    # COMPONENTS

    def get_list_of_components(self):
        response = requests.get(
            url=components_endpoint,
            headers={
                'accept': 'application/json',
            }
        )
        assert_status_code(response, 200)
        for dist_components in response.json():
            assert_validation(dist_components, models.ComponentRead)
        return response.json()

    def get_component_in_component_list(self, component_list, component_id):
        skill_is_added = False
        for skill in component_list["skills"]:
            if component_id == skill["component_id"]:
                skill_is_added = True
                break

        assert skill_is_added is True, \
            f"Error, actual component {component_id} is not added to Assistant" \
            f"""{LOGGER.error(f"Error, actual component {component_id} is not added to Assistant")}"""

    def get_component_not_exist_in_component_list(self, component_list, component_id):
        skill_is_added = False
        for skill in component_list["skills"]:
            if component_id == skill["component_id"]:
                skill_is_added = True
                break

        assert skill_is_added is False, \
            f'Error, actual component {component_id} is added to Assistant' \
            f"""{LOGGER.error(f"Error, actual component {component_id} is added to Assistant")}"""

    def create_component(self,
                         display_name='Test_name',
                         description='Test_description',
                         lm_service_id=lm_service_id_list[0],
                         prompt='Test_prompt'):
        response = requests.post(
            components_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },
            json={
                'display_name': display_name,
                'description': description,
                'lm_service_id': lm_service_id,
                'prompt': prompt,
            }
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.ComponentRead)
        return response.json()

    def get_component(self, component_id):
        response = requests.get(
            url=components_endpoint + "/" + str(component_id),
            headers={
                'accept': 'application/json',
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.ComponentRead)
        return response.json()

    def delete_component(self, component_id):
        response = requests.delete(
            url=components_endpoint + "/" + str(component_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 204)

    def patch_component(self,
                        component_id,
                        display_name="string",
                        description="string",
                        prompt="Your prompt",
                        lm_service_id=lm_service_id_list[0]
                        ):
        response = requests.patch(
            url=components_endpoint + "/" + str(component_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },
            json={
                'display_name': display_name,
                'description': description,
                'prompt': prompt,
                'lm_service_id': lm_service_id,
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.ComponentRead)

    def get_list_of_group_components(self, group_name):
        response = requests.get(
            url=components_endpoint + "/group/" + group_name,
            headers={
                'accept': 'application/json',
            }
        )
        assert_status_code(response, 200)
        for dist_components in response.json():
            assert_validation(dist_components, models.ComponentRead)

    # USERS

    def get_all_users(self):
        response = requests.get(
            url=users_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        for user in response.json():
            assert_validation(user, models.UserRead)

    def get_user_self(self):
        response = requests.get(
            url=users_endpoint + "/self",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.UserRead)
        return str(response.json()["id"])

    def get_user_by_id(self, user_id):
        response = requests.get(
            url=users_endpoint + "/" + user_id,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.UserRead)

    # API TOKENS

    def get_all_api_keys(self):
        response = requests.get(
            url=api_keys_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        for token in response.json():
            assert_validation(token, models.ApiKeyRead)

    # DIALOG_SESSIONS

    def create_dialog_sessions(self, name):
        response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.DialogSessionRead)
        return response.json()

    def create_dialog_sessions_no_access(self, name):
        response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def create_dialog_sessions_not_deployed(self, name):
        response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert_status_code(response, 500)

    def get_dialog_sessions(self, dialog_session_id):
        response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id),
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.DialogSessionRead)

    def get_dialog_sessions_no_access(self, dialog_session_id):
        response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id),
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def send_dialog_session_message(self, dialog_session_id):
        response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.DialogChatMessageRead)
        assert response.json()["active_skill"]["name"] != "dummy_skill", \
            "Dummy skill answers" \
            f"{LOGGER.error(f'Dummy skill answers')}"

    def send_dialog_session_message_no_access(self, dialog_session_id):
        response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def send_dialog_session_message_various_lm(self, dialog_session_id, lm_service_id):
        response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
                "prompt": "TASK:  You are a chatbot that can only answers questions below. "
                          "FAQ: What is your name? My name is Paul.",
                "lm_service_id": lm_service_id,
                "openai_api_key": openai_token
            },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.DialogChatMessageRead)
        assert response.json()["active_skill"]["name"] != "dummy_skill", \
            "Dummy skill answers" \
            f"{LOGGER.error(f'Dummy skill answers')}"
        assert "Paul" in response.json()["text"], \
            f"Skill answers incorrectly, {response.json()['text']}, " \
            f"{response.json()['active_skill']['name']}" \
            f"{LOGGER.error(f'Dummy skill answers')}"

    def send_dialog_session_message_various_russian_lm(self, dialog_session_id, lm_service_id):
        response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
                "Content-Type": "application/json",
            },
            json={
                "text": "Что такое умный дом?",
                "prompt": '''Вы — чат-бот, который может отвечать только на часто задаваемые вопросы об ИИ. 
                ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ: 
                Что такое умный дом? Умный дом — это как личный помощник для вашего дома. Это 
                система устройств и приборов, которыми можно управлять дистанционно и запрограммировать на 
                автоматическое выполнение задач. Например, вы можете использовать свой смартфон, чтобы включить свет, 
                отрегулировать термостат или запустить кофеварку еще до того, как встанете с постели. 
                ИНСТРУКЦИЯ: 
                Человек вступает в разговор и начинает задавать вопросы. Сгенерируйте ответ на основе списка часто 
                задаваемых вопросов.''',
                "lm_service_id": lm_service_id,
                "openai_api_key": openai_token
            },
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.DialogChatMessageRead)
        assert response.json()["active_skill"]["name"] != "dummy_skill", \
            "Dummy skill answers" \
            f"{LOGGER.error(f'Dummy skill answers')}"
        assert "дом" in response.json()["text"], \
            f"Skill answers incorrectly, {response.json()['text']}, " \
            f"{response.json()['active_skill']['name']}" \
            f"{LOGGER.error(f'Dummy skill answers')}"

    def get_dialog_session_history(self, dialog_session_id):
        response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 200)
        for dialog in response.json():
            assert_validation(dialog, models.DialogUtteranceRead)

    def get_dialog_session_history_no_access(self, dialog_session_id):
        response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "auth-type": self.auth_type,
            },
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def get_all_lm_services(self):
        response = requests.get(
            url=lm_services_endpoint,
            headers={"accept": "application/json"}
        )

        assert_status_code(response, 200)
        for lm_service in response.json():
            assert_validation(lm_service, models.LmServiceRead)

    # DEPLOYMENTS

    def get_deployments(self):
        response = requests.get(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            },
            params={
                'state': 'DEPLOYED',
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.DeploymentRead)

    def create_deployment(self, va_name):
        response = requests.post(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },
            json={
                f'virtual_assistant_name': va_name,

            }
        )
        assert_status_code(response, 201)
        assert_validation(response.json(), models.DeploymentRead)
        return response.json()

    def create_deployment_no_access(self, va_name):
        response = requests.post(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'Content-Type': 'application/json',
            },
            json={
                f'virtual_assistant_name': va_name,

            }
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def get_deployment(self, deployment_id):
        response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.DeploymentRead)
        return response.json()["task_id"]

    def get_deployment_no_access(self, deployment_id):
        response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 403)
        assert_no_access(response)

    def get_deployment_non_exists(self, deployment_id):
        response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 404)
        assert {"detail": f"Deployment {str(deployment_id)} not found"} == response.json(), \
            "Validation error while get_deployment_non_exists" \
            f"{LOGGER.error(f'Expected response is Deployment not found, actual:, {response.json()}')}"

    def delete_deployment(self, deployment_id):
        response = requests.delete(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 204)

    def delete_deployment_no_access(self, deployment_id):
        response = requests.delete(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 403)
        # assert_no_access(response)

    def patch_deployment(self, deployment_id):
        response = requests.patch(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)

    def patch_deployment_no_access(self, deployment_id, task_id):
        response = requests.patch(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            },
            params={
                'task_id': task_id,
            }
        )
        assert_status_code(response, 403)
        # assert_no_access(response)

    def get_stacks(self):
        response = requests.get(
            url=deployments_endpoint + "/stacks",
            headers={
                'accept': 'application/json'}
        )
        assert_status_code(response, 200)

    def get_stack_ports(self):
        response = requests.get(
            url=deployments_endpoint + "/stack_ports",
            headers={
                'accept': 'application/json'}
        )
        assert_status_code(response, 200)

    def delete_stack(self, stack_id):
        response = requests.delete(
            url=deployments_endpoint + "/stacks/" + str(stack_id),
            headers={
                'accept': 'application/json',
            })
        assert_status_code(response, 200)


class AdminMethods:
    def __init__(self, auth_token='token', auth_type='github'):
        self.auth_token = auth_token
        self.auth_type = auth_type

    # ADMIN

    def get_all_publish_requests(self):
        response = requests.get(
            url=admin_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)
        for publish_request in response.json():
            assert_validation(publish_request, models.PublishRequestRead)
        return response.json()

    def get_all_publish_requests_no_access(self):
        response = requests.get(
            url=admin_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 403)
        assert_requires_admin_user(response)

    def get_unreviewed_publish_requests(self):
        response = requests.get(
            url=admin_endpoint + "/unreviewed",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 200)
        for publish_request in response.json():
            assert_validation(publish_request, models.PublishRequestRead)
        return response.json()

    def get_unreviewed_publish_requests_no_access(self):
        response = requests.get(
            url=admin_endpoint + "/unreviewed",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
            }
        )
        assert_status_code(response, 403)
        assert_requires_admin_user(response)

    def confirm_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/confirm",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.PublishRequestRead)

    def confirm_publish_request_no_access(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/confirm",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert_status_code(response, 403)
        assert_requires_admin_user(response)

    def decline_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/decline",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert_status_code(response, 200)
        assert_validation(response.json(), models.PublishRequestRead)

    def decline_publish_request_no_access(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/decline",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                "auth-type": self.auth_type,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert_status_code(response, 403)
        assert_requires_admin_user(response)
