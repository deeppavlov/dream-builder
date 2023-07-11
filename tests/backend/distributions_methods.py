import time
import pytest
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
    lm_service_id_list
)


class UserMethods:
    def __init__(self, auth_token='token'):
        self.auth_token = auth_token

    # ASSISTANT_DIST

    def create_virtual_assistant(self, name):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": name,
                  "description": "TestBot"
                  },
        )
        assert dist_response.status_code == 201, \
            f'Actual response is: {dist_response.json()}, {dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(dist_response.json()), \
            "Validation error while create_virtual_assistant"
        return dist_response.json()

    def create_virtual_assistant_bad_token(self):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": "bad_token",
                "Content-Type": "application/json",
            },
            json={"display_name": "TestBot",
                  "description": "TestBot"
                  },
        )
        assert dist_response.status_code == 201, \
            f'Actual response is: {dist_response.json()}, {dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(dist_response.json()), \
            "Validation error while create_virtual_assistant_bad_token"

    def create_virtual_assistant_invalid_data(self, auth_token):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": 1,
                  "description": 1
                  },
        )
        assert dist_response.status_code == 201, \
            f'Actual response is: {dist_response.json()}, {dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(dist_response.json()), \
            "Validation error while create_virtual_assistant_invalid_data"

    def get_list_of_public_va(self):
        public_dist_names_list = []
        public_dist_list = requests.get(assistant_dists_endpoint + "/public_templates")
        assert public_dist_list.status_code == 200, \
            f'Actual response is: {public_dist_list.json()}, {public_dist_list.status_code}'
        for public_dist in public_dist_list.json():
            public_dist_names_list.append(public_dist["name"])
            assert models.VirtualAssistantRead.parse_obj(public_dist), \
                "Validation error while test_get_list_of_public_dist"
        return public_dist_names_list

    def get_list_of_private_va(self, created_va_name):
        private_dist_list = requests.get(
            url=assistant_dists_endpoint + "/user_owned",
            headers={
                "accept": "*/*",
                "token": self.auth_token,
            },
        )
        assert private_dist_list.status_code == 200, \
            f'Actual response is: {private_dist_list.json()}, {private_dist_list.status_code}'
        for private_dist in private_dist_list.json():
            assert models.VirtualAssistantRead.parse_obj(private_dist), \
                "Validation error while test_get_list_of_private_dist"
        private_dist_names = [private_dist["name"] for private_dist in private_dist_list.json()]
        assert created_va_name in private_dist_names

    def get_va_by_name(self, name):
        get_dist_response = requests.get(url=assistant_dists_endpoint + "/" + name,
                                         headers={
                                             'accept': 'application/json',
                                             'token': self.auth_token,
                                         }
                                         )
        assert get_dist_response.status_code == 200, \
            f'Actual response is: {get_dist_response.json()}, {get_dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(get_dist_response.json()), get_dist_response.json()
        assert get_dist_response.json()["name"] == name, \
            "Validation error while test_get_va_by_name"
        return get_dist_response.json()

    def get_va_by_name_non_exist(self, name):
        get_dist_response = requests.get(url=assistant_dists_endpoint + "/" + name,
                                         headers={
                                             'accept': 'application/json',
                                             'token': self.auth_token,
                                         }
                                         )
        assert get_dist_response.status_code == 404, \
            f'Actual response is: {get_dist_response.json()}, {get_dist_response.status_code}'
        assert {'detail': f"Virtual assistant '{name}' not found in database"} == get_dist_response.json(), \
            f'validation error, {get_dist_response.json()}, {get_dist_response.status_code}'

    def get_va_by_name_no_access(self, name):
        get_dist_response = requests.get(assistant_dists_endpoint + "/" + name)
        assert get_dist_response.status_code == 403, \
            f'Actual response is: {get_dist_response.json()}, {get_dist_response.status_code}'
        assert {"detail": "No access"} == get_dist_response.json(), get_dist_response.json()
        return get_dist_response.json()

    def delete_va_by_name(self, name):
        delete_response = requests.delete(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "*/*",
                "token": self.auth_token,
            },
        )
        assert delete_response.status_code == 204, \
            f'Actual response is: {delete_response.json()}, {delete_response.status_code}'

    def delete_va_by_name_no_access(self, name):
        delete_response = requests.delete(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "*/*",
                "token": self.auth_token,
            },
        )
        assert delete_response.status_code == 500, \
            f'Actual response is: {delete_response.json()}, {delete_response.status_code}'

    def patch_va_by_name(self, name):
        patch_dist_response = requests.patch(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": "Test_name", "description": "Test_description"},
        )
        assert patch_dist_response.status_code == 200, \
            f'Actual response is: {patch_dist_response.json()}, {patch_dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(patch_dist_response.json()), \
            "Validation error while test_clone_public_dist"

    def patch_va_by_name_no_access(self, name):
        patch_dist_response = requests.patch(
            url=assistant_dists_endpoint + "/" + name,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": "Test_name", "description": "Test_description"},
        )
        assert patch_dist_response.status_code == 500, \
            f'Actual response is: {patch_dist_response.json()}, {patch_dist_response.status_code}'
        # assert {"detail": "No access"} == patch_dist_response.json(), \
        #    "Validation error while test_clone_public_dist"

    def clone_va(self, name):
        clone_dist_response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/clone",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
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
        assert clone_dist_response.status_code == 201, \
            f'Actual response is: {clone_dist_response.json()}, {clone_dist_response.status_code}'
        assert models.VirtualAssistantRead.parse_obj(clone_dist_response.json()), \
            "Validation error while test_clone_va"
        return clone_dist_response.json()

    def clone_va_no_access(self, name):
        clone_dist_response = requests.post(
            url=assistant_dists_endpoint + "/" + name + "/clone",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
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
        assert clone_dist_response.status_code == 403, \
            f'Actual response is: {clone_dist_response.json()}, {clone_dist_response.status_code}'
        assert {"detail": "No access"} == clone_dist_response.json(), \
            "Validation error while test_clone_va"
        return clone_dist_response.json()

    def get_va_components(self, name):
        get_dist_components_response = requests.get(url=assistant_dists_endpoint + "/" + name + "/components",
                                                    headers={
                                                        'accept': 'application/json',
                                                        'token': self.auth_token,
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        assert models.VirtualAssistantComponentPipelineRead.parse_obj(get_dist_components_response.json()), \
            "Error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()

    def get_va_components_no_access(self, name):
        get_dist_components_response = requests.get(url=assistant_dists_endpoint + "/" + name + "/components",
                                                    headers={
                                                        'accept': 'application/json',
                                                        'token': self.auth_token,
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 403, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        assert {"detail": "No access"} == get_dist_components_response.json(), \
            "Error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()

    def add_va_component(self, name, component_id):
        get_dist_components_response = requests.post(url=assistant_dists_endpoint + "/" + name + "/components",
                                                     headers={
                                                         'accept': 'application/json',
                                                         'token': self.auth_token,
                                                         'Content-Type': 'application/json',
                                                     },

                                                     json={
                                                         'component_id': component_id,
                                                     }
                                                     )
        assert get_dist_components_response.status_code == 201, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        return get_dist_components_response.json()
        # assert models.VirtualAssistantComponentShort.parse_obj(get_dist_components_response.json()), \
        #    "Error while test_get_public_dist_components_by_name"

    def add_va_component_no_access(self, name, component_id):
        get_dist_components_response = requests.post(url=assistant_dists_endpoint + "/" + name + "/components",
                                                     headers={
                                                         'accept': 'application/json',
                                                         'token': self.auth_token,
                                                         'Content-Type': 'application/json',
                                                     },

                                                     json={
                                                         'component_id': component_id,
                                                     }
                                                     )
        assert get_dist_components_response.status_code == 422, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        # assert models.VirtualAssistantComponentShort.parse_obj(get_dist_components_response.json()), \
        #    "Error while test_get_public_dist_components_by_name"

    def delete_va_component(self, name, component_id):
        delete_va_component_response = requests.delete(url=assistant_dists_endpoint + "/" + name + "/components/" +
                                                           str(component_id),
                                                       headers={
                                                           'accept': '*/*',
                                                           'token': self.auth_token,
                                                       }
                                                       )
        assert delete_va_component_response.status_code == 204, \
            f'Actual response is: {delete_va_component_response.json()}, {delete_va_component_response.status_code}'

    def delete_va_component_no_access(self, name, component_id):
        delete_va_component_response = requests.delete(url=assistant_dists_endpoint + "/" + name + "/components/" +
                                                           str(component_id),
                                                       headers={
                                                           'accept': '*/*',
                                                           'token': self.auth_token,
                                                       }
                                                       )
        assert delete_va_component_response.status_code == 422, \
            f'Actual response is: {delete_va_component_response.json()}, {delete_va_component_response.status_code}'

    def patch_va_component(self,
                           name,
                           component_id):
        patch_dist_components_response = requests.patch(url=assistant_dists_endpoint + "/" + name + "/components/" +
                                                            str(component_id),
                                                        headers={
                                                            'accept': 'application/json',
                                                        })

        assert patch_dist_components_response.status_code == 200, \
            f'Actual response is: {patch_dist_components_response.json()}, {patch_dist_components_response.status_code}'
        # assert models.VirtualAssistantRead.parse_obj(get_dist_components_response.json()), \
        #    "Error while patch_va_component"

    def patch_va_component_no_access(self,
                                     name,
                                     component_id):
        # display_name="Test_patch",
        # description="Test_patch",
        # prompt="Test_patch",
        # lm_service_id=1):
        patch_components_response = requests.patch(url=assistant_dists_endpoint + "/" + name + "/components/" +
                                                       str(component_id),
                                                   headers={
                                                       'accept': 'application/json',
                                                   })
        # json={
        #    "display_name": display_name,
        #    "description": description,
        #    "prompt": prompt,
        #    "lm_service_id": lm_service_id
        # }
        # )
        assert patch_components_response.status_code == 200, \
            f'Actual response is: {patch_components_response.json()}, {patch_components_response.status_code}'
        # assert models.VirtualAssistantRead.parse_obj(get_dist_components_response.json()), \
        #    "Error while patch_va_component"

    def publish_va(self, name, visibility):
        response = requests.post(url=assistant_dists_endpoint + "/" + name + '/publish',
                                 headers={
                                     'accept': '*/*',
                                     'token': self.auth_token,
                                     'content-type': 'application/json',
                                 },
                                 json={
                                     'visibility': visibility
                                 }
                                 )
        assert response.status_code == 204, \
            f'Actual response is: {response.json()}, {response.status_code}'

    def publish_va_no_access(self, name, visibility):
        response = requests.post(url=assistant_dists_endpoint + "/" + name + '/publish',
                                 headers={
                                     'accept': '*/*',
                                     'token': self.auth_token,
                                     'content-type': 'application/json',
                                 },
                                 json={
                                     'visibility': visibility
                                 }
                                 )
        assert response.status_code == 403, \
            f'Actual response is: {response.json()}, {response.status_code}'

    def debug_template(self, name):
        template_file_path = "template_file_path"
        owner_address = "owner_address"
        get_debug_template_response = requests.get(
            url=assistant_dists_endpoint + "/templates" + "/template_file_path",
            headers={
                'accept': 'application/json',
            },
            params={
                'owner_address': owner_address,
                'dist_name': name,
            }
        )
        assert get_debug_template_response.status_code == 200, get_debug_template_response.json()

    # components

    def get_list_of_components(self):
        get_list_of_components_response = requests.get(url=components_endpoint,
                                                       headers={
                                                           'accept': 'application/json',
                                                       }
                                                       )
        assert get_list_of_components_response.status_code == 200, \
            f'Actual response is: {get_list_of_components_response.json()}, ' \
            f'{get_list_of_components_response.status_code}'
        for dist_components in get_list_of_components_response.json():
            assert models.ComponentRead.parse_obj(dist_components), \
                "Validation error while test_get_public_dist_components_by_name"
        return get_list_of_components_response.json()

    def get_component_in_component_list(self, component_list, component_id):
        skill_is_added = False
        for skill in component_list["skills"]:
            if component_id == skill["component_id"]:
                skill_is_added = True
                break

        assert skill_is_added is True, \
            f'Error, actual component {component_id} is not added to Assistant'

    def get_component_not_exist_in_component_list(self, component_list, component_id):
        skill_is_added = False
        for skill in component_list["skills"]:
            if component_id == skill["component_id"]:
                skill_is_added = True
                break

        assert skill_is_added is False, \
            f'Error, actual component {component_id} is added to Assistant'

    def create_component(self,
                         display_name='Test_name',
                         description='Test_description',
                         lm_service_id=lm_service_id_list[0],
                         prompt='Test_prompt'):
        get_dist_components_response = requests.post(components_endpoint,
                                                     headers={
                                                         'accept': 'application/json',
                                                         'token': self.auth_token,
                                                         'Content-Type': 'application/json',
                                                     },
                                                     json={
                                                         'display_name': display_name,
                                                         'description': description,
                                                         'lm_service_id': lm_service_id,
                                                         'prompt': prompt,
                                                     }
                                                     )
        assert get_dist_components_response.status_code == 201, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        assert models.ComponentRead.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()

    def get_component(self, component_id):
        get_dist_components_response = requests.get(url=components_endpoint + "/" + str(component_id),
                                                    headers={
                                                        'accept': 'application/json',
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        assert models.ComponentRead.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()

    def delete_component(self, component_id):
        get_dist_components_response = requests.delete(url=components_endpoint + "/" + str(component_id),
                                                       headers={
                                                           'accept': '*/*',
                                                           'token': self.auth_token,
                                                       }
                                                       )
        assert get_dist_components_response.status_code == 204, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'

    def patch_component(self,
                        component_id,
                        display_name="string",
                        description="string",
                        prompt="Your ",
                        lm_service_id=lm_service_id_list[0]
                        ):
        get_dist_components_response = requests.patch(url=components_endpoint + "/" + str(component_id),
                                                      headers={
                                                          'accept': 'application/json',
                                                          'token': self.auth_token,
                                                          'Content-Type': 'application/json',
                                                      },
                                                      json={
                                                          'display_name': display_name,
                                                          'description': description,
                                                          'prompt': prompt,
                                                          'lm_service_id': lm_service_id,
                                                      }
                                                      )
        assert get_dist_components_response.status_code == 200, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        assert models.ComponentRead.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"

    def get_list_of_group_components(self, group_name):
        get_dist_components_response = requests.get(url=components_endpoint + "/group/" + group_name,
                                                    headers={
                                                        'accept': 'application/json',
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, \
            f'Actual response is: {get_dist_components_response.json()}, {get_dist_components_response.status_code}'
        for dist_components in get_dist_components_response.json():
            assert models.ComponentRead.parse_obj(dist_components), \
                "Validation error while test_get_public_dist_components_by_name"

    # USERS

    def get_all_users(self):
        get_all_users_response = requests.get(
            url=users_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_all_users_response.status_code == 200, \
            f'Actual response is: {get_all_users_response.json()}, {get_all_users_response.status_code}'
        for user in get_all_users_response.json():
            assert models.UserRead.parse_obj(user), "Validation error while get_all_users"

    def get_user_self(self):
        get_user_response = requests.get(
            url=users_endpoint + "/self",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_user_response.status_code == 200, \
            f'Actual response is: {get_user_response.json()}, {get_user_response.status_code}'
        assert models.UserRead.parse_obj(get_user_response.json()), "Validation error while get_user_self"
        return str(get_user_response.json()["id"])

    def get_user_by_id(self, user_id):
        get_user_by_id_response = requests.get(
            url=users_endpoint + "/" + user_id,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_user_by_id_response.status_code == 200, \
            f'Actual response is: {get_user_by_id_response.json()}, {get_user_by_id_response.status_code}'
        assert models.UserRead.parse_obj(get_user_by_id_response.json()), "Validation error while get_user_by_id"

    # api_tokens
    def get_all_api_keys(self):
        get_all_api_tokens_response = requests.get(
            url=api_keys_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_all_api_tokens_response.status_code == 200, \
            f'Actual response is: {get_all_api_tokens_response.json()}, {get_all_api_tokens_response.status_code}'
        for token in get_all_api_tokens_response.json():
            assert models.ApiKeyRead.parse_obj(token), "Validation error while test_get_all_api_tokens"

    # DIALOG_SESSIONS

    def create_dialog_sessions(self, name):
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert create_dialog_response.status_code == 201, \
            f'Actual response is: {create_dialog_response.json()}, {create_dialog_response.status_code}'
        assert models.DialogSessionRead.parse_obj(create_dialog_response.json()), \
            f"Validation error while create_dialog_sessions with {name} assistant "
        return create_dialog_response.json()

    def create_dialog_sessions_no_access(self, name):
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert create_dialog_response.status_code == 403, \
            f'Actual response is: {create_dialog_response.json()}, {create_dialog_response.status_code}'
        assert {"detail": "No access"} == create_dialog_response.json(), \
            f"Validation error while create_dialog_sessions with {name} assistant "

    def create_dialog_sessions_not_deployed(self, name):
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert create_dialog_response.status_code == 500, \
            f'Actual response is: {create_dialog_response.json()}, {create_dialog_response.status_code}'

    def get_dialog_sessions(self, dialog_session_id):
        get_dialog_response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id),
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_dialog_response.status_code == 200, \
            f'Actual response is: {get_dialog_response.json()}, {get_dialog_response.status_code}'
        assert models.DialogSessionRead.parse_obj(get_dialog_response.json()), \
            "Validation error while get_dialog_sessions"

    def get_dialog_sessions_no_access(self, dialog_session_id):
        get_dialog_response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id),
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_dialog_response.status_code == 403, \
            f'Actual response is: {get_dialog_response.json()}, {get_dialog_response.status_code}'
        assert {"detail": "No access"} == get_dialog_response.json(), \
            "Validation error while get_dialog_sessions_no_access"

    def send_dialog_session_message(self, dialog_session_id):
        send_message_response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )
        assert send_message_response.status_code == 201, \
            f'Actual response is: {send_message_response.json()}, {send_message_response.status_code}'
        assert models.DialogChatMessageRead.parse_obj(send_message_response.json()), \
            "Validation error while test_send_dialog_session_message"
        assert send_message_response.json()["active_skill"]["name"] != "dummy_skill", \
            "Dummy skill answers"

    def send_dialog_session_message_no_access(self, dialog_session_id):
        send_message_response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )
        assert send_message_response.status_code == 403, \
            f'Actual response is: {send_message_response.json()}, {send_message_response.status_code}'
        assert {"detail": "No access"} == send_message_response.json(), \
            "Validation error while test_send_dialog_session_message"

    def send_dialog_session_message_various_lm(self, dialog_session_id, lm_service_id):
        send_message_response = requests.post(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
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
        print(f'send_message_response.json() = {send_message_response.json()} \n')
        assert send_message_response.status_code == 201, \
            f'Actual response is: {send_message_response.json()}, {send_message_response.status_code}'
        assert models.DialogChatMessageRead.parse_obj(send_message_response.json()), \
            "Validation error while test_send_dialog_session_message"
        assert send_message_response.json()["active_skill"]["name"] != "dummy_skill", \
            "Dummy skill answers"
        assert "Paul" in send_message_response.json()["text"], \
            f"Skill answers incorrectly, {send_message_response.json()['text']}, " \
            f"{send_message_response.json()['active_skill']['name']}"

    def get_dialog_session_history(self, dialog_session_id):
        get_dialog_history_response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_dialog_history_response.status_code == 200, \
            f'Actual response is: {get_dialog_history_response.json()}, {get_dialog_history_response.status_code}'
        for dialog in get_dialog_history_response.json():
            assert models.DialogUtteranceRead.parse_obj(dialog), "Validation error while " \
                                                                 "test_get_dialog_session_history "

    def get_dialog_session_history_no_access(self, dialog_session_id):
        get_dialog_history_response = requests.get(
            url=dialog_sessions_endpoint + "/" + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": self.auth_token,
            },
        )
        assert get_dialog_history_response.status_code == 403, \
            f'Actual response is: {get_dialog_history_response.json()}, {get_dialog_history_response.status_code}'
        assert {"detail": "No access"} == get_dialog_history_response.json(), \
            "Validation error while test_get_dialog_session_history "

    def get_all_lm_services(self):
        lm_services_list_response = requests.get(
            url=lm_services_endpoint,
            headers={"accept": "application/json"}
        )
        assert lm_services_list_response.status_code == 200, \
            f'Actual response is: {lm_services_list_response.json()}, {lm_services_list_response.status_code}'
        for lm_service in lm_services_list_response.json():
            assert models.LmServiceRead.parse_obj(lm_service), "Validation error while get_all_lm_services"

    # DEPLOYMENTS

    def get_deployments(self):
        deployment_response = requests.get(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token},
            params={
                'state': 'DEPLOYED',
            }
        )
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'
        for deployment in deployment_response.json():
            assert models.DeploymentRead.parse_obj(deployment), "Validation error while get_deployments"

    def create_deployment(self, va_name):
        deployment_response = requests.post(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                'Content-Type': 'application/json',
            },
            json={
                f'virtual_assistant_name': va_name,

            }

        )
        assert deployment_response.status_code == 201, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'
        assert models.DeploymentRead.parse_obj(deployment_response.json()), "Validation error while create_deployment"
        return deployment_response.json()

    def get_stacks(self):
        deployment_response = requests.get(
            url=deployments_endpoint + "/stacks",
            headers={
                'accept': 'application/json'})
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def get_stack_ports(self):
        deployment_response = requests.get(
            url=deployments_endpoint + "/stack_ports",
            headers={
                'accept': 'application/json'})
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def get_deployment(self, deployment_id):
        deployment_response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token})
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'
        assert models.DeploymentRead.parse_obj(deployment_response.json()), "Validation error while get_deployment"
        return deployment_response.json()["task_id"]

    def get_deployment_no_access(self, deployment_id):
        deployment_response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token})
        assert deployment_response.status_code == 403, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'
        assert {"detail": "No access"} == deployment_response.json(), "Validation error while get_deployment"

    def get_deployment_non_exists(self, deployment_id):
        deployment_response = requests.get(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token})
        assert deployment_response.status_code == 404, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'
        assert {"detail": f"Deployment {str(deployment_id)} not found"} == deployment_response.json(), \
            "Validation error while get_deployment"

    def delete_deployment(self, deployment_id):
        deployment_response = requests.delete(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
            })
        assert deployment_response.status_code == 204, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def delete_deployment_no_access(self, deployment_id):
        deployment_response = requests.delete(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': '*/*',
                'token': self.auth_token,
            })
        assert deployment_response.status_code == 403, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def patch_deployment(self, deployment_id):
        deployment_response = requests.patch(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
            })
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def patch_deployment_no_access(self, deployment_id, task_id):
        deployment_response = requests.patch(
            url=deployments_endpoint + "/" + str(deployment_id),
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
            },
            params={
                'task_id': task_id,
            })
        assert deployment_response.status_code == 403, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'

    def delete_stack(self, stack_id):
        deployment_response = requests.delete(
            url=deployments_endpoint + "/stacks/" + str(stack_id),
            headers={
                'accept': 'application/json',
            })
        assert deployment_response.status_code == 200, \
            f'Actual response is: {deployment_response.json()}, {deployment_response.status_code}'


class AdminMethods:
    def __init__(self, auth_token):
        self.auth_token = auth_token

    # admin

    def get_all_publish_requests(self):
        response = requests.get(
            url=admin_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
            }
        )
        assert response.status_code == 200, response.json()
        for publish_request in response.json():
            assert models.PublishRequestRead.parse_obj(publish_request)
        return response.json()

    def get_all_publish_requests_no_access(self):
        response = requests.get(
            url=admin_endpoint,
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
            }
        )
        assert response.status_code == 403, response.json()
        for publish_request in response.json():
            assert models.PublishRequestRead.parse_obj(publish_request)
        return response.json()

    def get_unreviewed_publish_requests(self):
        response = requests.get(
            url=admin_endpoint + "/unreviewed",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
            }
        )
        assert response.status_code == 200, response.json()
        for publish_request in response.json():
            assert models.PublishRequestRead.parse_obj(publish_request)
        return response.json()

    def confirm_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/confirm",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert response.status_code == 200, response.json()
        assert models.PublishRequestRead.parse_obj(response.json())

    def decline_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + "/" + str(publish_request_id) + "/decline",
            headers={
                'accept': 'application/json',
                'token': self.auth_token,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert response.status_code == 200, response.json()
        assert models.PublishRequestRead.parse_obj(response.json())
