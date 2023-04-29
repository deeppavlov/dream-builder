import requests
from services.distributions_api import schemas as models
from .config import (
    assistant_dists_endpoint,
    components_endpoint,
    users_endpoint,
    api_tokens_endpoint,
    dialog_sessions_endpoint,
    deployments_endpoint,
    admin_endpoint,
    auth_token,
)


class UserMethods:

    # assistant_dists

    def create_virtual_assistant(self, name):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": name,
                  "description": "TestBot"
                  },
        )
        assert dist_response.status_code == 201, dist_response.json()
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
        assert dist_response.status_code == 201, dist_response.json()
        assert models.AssistantDistModelShort.parse_obj(dist_response.json()), \
            "Validation error while create_virtual_assistant_bad_token"

    def create_virtual_assistant_invalid_data(self):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": 1,
                  "description": 1
                  },
        )
        assert dist_response.status_code == 201, dist_response.json()
        assert models.AssistantDistModelShort.parse_obj(dist_response.json()), \
            "Validation error while create_virtual_assistant_invalid_data"

    def get_list_of_public_va(self):
        public_dist_names_list = []
        public_dist_list = requests.get(assistant_dists_endpoint + "public_templates")
        assert public_dist_list.status_code == 200, public_dist_list.json()
        for public_dist in public_dist_list.json():
            public_dist_names_list.append(public_dist["name"])
            assert models.VirtualAssistantRead.parse_obj(public_dist), \
                "Validation error while test_get_list_of_public_dist"
        return public_dist_names_list

    def get_list_of_private_va(self, created_va):
        private_dist_list = requests.get(
            url=assistant_dists_endpoint + "user_owned",
            headers={
                "accept": "*/*",
                "token": auth_token,
            },
        )
        assert private_dist_list.status_code == 200, private_dist_list.json()
        for private_dist in private_dist_list.json():
            assert models.VirtualAssistantRead.parse_obj(private_dist), \
                "Validation error while test_get_list_of_private_dist"
        private_dist_names = [private_dist["name"] for private_dist in private_dist_list.json()]
        assert created_va["name"] in private_dist_names

    def get_va_by_name(self, name):
        get_dist_response = requests.get(assistant_dists_endpoint + name)
        assert get_dist_response.status_code == 200, get_dist_response.json()
        assert models.VirtualAssistantRead.parse_obj(get_dist_response.json()), get_dist_response.json()
        assert get_dist_response.json()["name"] == name, \
            "Validation error while test_get_va_by_name"
        return get_dist_response.json()["id"]

    # def get_(чужой)_va_by_name(self, name):
    #    get_dist_response = requests.get(assistant_dists_endpoint + name)
    #    assert get_dist_response.status_code == 200, get_dist_response.json()
    #    assert models.AssistantDistModelShort.parse_obj(get_dist_response.json())
    #    assert get_dist_response.json()["display_name"] == name, get_dist_response.json()

    def delete_va_by_name(self, name):
        delete_response = requests.delete(
            url=assistant_dists_endpoint + name,
            headers={
                "accept": "*/*",
                "token": auth_token,
            },
        )
        assert delete_response.status_code == 204, \
            f"Validation error while test_get_va_by_name {delete_response.json()}"

    def patch_va_by_name(self, name):
        patch_dist_response = requests.patch(
            url=assistant_dists_endpoint + name,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": "New_test_name", "description": "string"},
        )
        assert patch_dist_response.status_code == 200, patch_dist_response.json()
        assert models.VirtualAssistantRead.parse_obj(patch_dist_response.json()), \
            "Validation error while test_clone_public_dist"

    def clone_va(self, name):
        clone_dist_response = requests.post(
            url=assistant_dists_endpoint + name + "/clone",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "display_name": "string",
                "description": "string",
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
        assert clone_dist_response.status_code == 201, clone_dist_response.json()
        assert models.VirtualAssistantRead.parse_obj(clone_dist_response.json()), \
            "Validation error while test_clone_va"
        return clone_dist_response.json()

    def get_va_components(self, name):
        get_dist_components_response = requests.get(url=assistant_dists_endpoint + name + "/components/",
                                                    headers={
                                                        'accept': 'application/json',
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, get_dist_components_response.json()
        assert models.DistComponentsResponse.parse_obj(get_dist_components_response.json()), \
            "Error while test_get_public_dist_components_by_name"

    def add_va_component(self, name, component_id):
        get_dist_components_response = requests.post(url=assistant_dists_endpoint + name + "/components/",
                                                     headers={
                                                         'accept': 'application/json',
                                                         'Content-Type': 'application/json',
                                                     },

                                                     json={
                                                         'component_id': component_id,
                                                     }
                                                     )
        assert get_dist_components_response.status_code == 201, get_dist_components_response.json()
        assert models.VirtualAssistantComponentShort.parse_obj(get_dist_components_response.json()), \
            "Error while test_get_public_dist_components_by_name"

    def delete_va_component(self, name, component_id):
        get_dist_components_response = requests.delete(url=assistant_dists_endpoint + name + "/components/" +
                                                           str(component_id),
                                                       headers={
                                                           'accept': '*/*',
                                                       }
                                                       )
        assert get_dist_components_response.status_code == 204, get_dist_components_response.json()

    def patch_va_component(self, name, component_id):
        get_dist_components_response = requests.patch(url=assistant_dists_endpoint + name + "/components/" +
                                                          str(component_id),
                                                      headers={
                                                          'accept': 'application/json',
                                                      }
                                                      )
        assert get_dist_components_response.status_code == 200, get_dist_components_response.json()
        # assert models.VirtualAssistantRead.parse_obj(get_dist_components_response.json()), \
        #    "Error while patch_va_component"

    def publish_va(self, name, visibility):
        response = requests.post(url=assistant_dists_endpoint + name + '/publish/',
                                 headers={
                                     'accept': '*/*',
                                     'token': auth_token,
                                     'content-type': 'application/json',
                                 },
                                 json={
                                     'visibility': visibility
                                 }
                                 )
        assert response.status_code == 204, response.json()

    def get_dist_prompt(self, name):
        get_prompt_response = requests.get(
            url=assistant_dists_endpoint + name + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_prompt_response.status_code == 200, get_prompt_response.json()
        assert models.Prompt.parse_obj(get_prompt_response.json()), \
            "Validation error while get_dist_prompt"

    def set_dist_prompt(self, name):
        prompt = "new_prompt_string"
        set_prompt_response = requests.post(
            url=assistant_dists_endpoint + name + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": prompt,
            },
        )
        assert set_prompt_response.status_code == 200, set_prompt_response.json()
        assert models.Deployment.parse_obj(set_prompt_response.json()), \
            "Validation error while set_dist_prompt"
        assert set_prompt_response.json()["prompt"] == prompt

    def get_dist_lm_service(self, name):
        get_lm_service_response = requests.get(
            url=assistant_dists_endpoint + name + "/lm_service/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_lm_service_response.status_code == 200, get_lm_service_response.json()
        assert models.LmService.parse_obj(get_lm_service_response.json()), \
            "Validation error while get_dist_lm_service"

    def set_dist_lm_service(self, name, lm_service_name):
        set_lm_service_response = requests.post(
            url=assistant_dists_endpoint + name + "/lm_service/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
            json={
                "name": lm_service_name
            }
        )
        assert set_lm_service_response.status_code == 200, set_lm_service_response.json()
        assert models.LmService.parse_obj(set_lm_service_response.json()), \
            "Validation error while set_dist_lm_service"

    def debug_template(self, name):
        template_file_path = "template_file_path"
        owner_address = "owner_address"
        get_debug_template_response = requests.get(
            url=assistant_dists_endpoint + "/templates" + "template_file_path",
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
        assert get_list_of_components_response.status_code == 200, get_list_of_components_response.json()
        for dist_components in get_list_of_components_response.json():
            assert models.ComponentShort.parse_obj(dist_components), \
                "Validation error while test_get_public_dist_components_by_name"
        return get_list_of_components_response.json()

    def create_component(self):
        get_dist_components_response = requests.post(components_endpoint,
                                                     headers={
                                                         'accept': 'application/json',
                                                         'token': auth_token,
                                                         'Content-Type': 'application/json',
                                                     },
                                                     json={
                                                         'display_name': 'string',
                                                         'description': 'string',
                                                         'lm_service_id': 1,
                                                         'prompt': 'string',
                                                     }
                                                     )
        assert get_dist_components_response.status_code == 201, get_dist_components_response.json()
        assert models.ComponentShort.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()

    def get_component(self, component_id):
        get_dist_components_response = requests.get(url=components_endpoint + str(component_id),
                                                    headers={
                                                        'accept': 'application/json',
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, get_dist_components_response.json()
        assert models.ComponentShort.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"
        return get_dist_components_response.json()["id"]

    def delete_component(self, component_id):
        get_dist_components_response = requests.delete(url=components_endpoint + str(component_id),
                                                       headers={
                                                           'accept': '*/*',
                                                           'token': auth_token,
                                                       }
                                                       )
        assert get_dist_components_response.status_code == 204, get_dist_components_response.json()

    def patch_component(self, component_id):
        get_dist_components_response = requests.patch(components_endpoint,
                                                      headers={
                                                          'accept': 'application/json',
                                                          'token': auth_token,
                                                          'Content-Type': 'application/json',
                                                      },
                                                      json={
                                                          'display_name': 'string',
                                                          'description': 'string',
                                                          'lm_service_id': 1,
                                                          'prompt': 'string',
                                                      }
                                                      )
        assert get_dist_components_response.status_code == 201, get_dist_components_response.json()
        assert models.ComponentShort.parse_obj(get_dist_components_response.json()), \
            "Validation error while test_get_public_dist_components_by_name"

    def get_list_of_group_components(self, group_name):
        get_dist_components_response = requests.get(url=components_endpoint + "group/" + group_name,
                                                    headers={
                                                        'accept': 'application/json',
                                                    }
                                                    )
        assert get_dist_components_response.status_code == 200, get_dist_components_response.json()
        for dist_components in get_dist_components_response.json():
            assert models.ComponentShort.parse_obj(dist_components), \
                "Validation error while test_get_public_dist_components_by_name"

        # users

    def get_all_users(self):
        get_all_users_response = requests.get(
            url=users_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_all_users_response.status_code == 200, get_all_users_response.json()
        for user in get_all_users_response.json():
            assert models.User.parse_obj(user), "Validation error while get_all_users"

    def get_user_self(self):
        get_user_response = requests.get(
            url=users_endpoint + "self",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_user_response.status_code == 200, get_user_response.json()
        assert models.User.parse_obj(get_user_response.json()), "Validation error while get_user_self"
        return str(get_user_response.json()["id"])

    def get_user_by_id(self, user_id):
        get_user_by_id_response = requests.get(
            url=users_endpoint + user_id,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_user_by_id_response.status_code == 200, get_user_by_id_response.json()
        assert models.User.parse_obj(get_user_by_id_response.json()), "Validation error while get_user_by_id"

    def get_user_api_tokens(self, user_id):
        get_user_api_tokens_response = requests.get(
            url=users_endpoint + user_id + "/settings/api_tokens/",
            headers={
                'accept': 'application/json',
                'token': auth_token,
            }
        )
        assert get_user_api_tokens_response.status_code == 200, get_user_api_tokens_response.json()
        for user_api_token in get_user_api_tokens_response.json():
            assert models.UserApiToken.parse_obj(user_api_token), \
                "Validation error while get_user_by_api_tokens"
        return get_user_api_tokens_response.json()[0]["id"]

    def create_or_update_user_api_token(self, user_id, token_value):
        api_token_id = 1
        update_user_api_token_response = requests.post(
            url=users_endpoint + user_id + "/settings/api_tokens/",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "api_token_id": api_token_id,
                "token_value": token_value,
            },
        )
        assert update_user_api_token_response.status_code == 201, update_user_api_token_response.json()
        assert models.UserApiToken.parse_obj(update_user_api_token_response.json()), \
            "Validation error while create_or_update_user_api_token"

    def get_user_api_token(self, user_id, user_api_token_id):
        get_user_api_token_response = requests.get(
            url=users_endpoint + user_id + "/settings/api_tokens/" + str(user_api_token_id),
            headers={
                'accept': 'application/json',
                'token': auth_token,
            }
        )
        assert get_user_api_token_response.status_code == 201, get_user_api_token_response.json()
        assert models.UserApiToken.parse_obj(get_user_api_token_response.json()), \
            "Validation error while get_user_api_token"

    def delete_user_api_token(self, user_id, user_api_token_id):
        get_user_api_token_response = requests.delete(
            url=users_endpoint + user_id + "/settings/api_tokens/" + str(user_api_token_id),
            headers={
                'accept': 'application/json',
                'token': auth_token,
            }
        )
        assert get_user_api_token_response.status_code == 201, get_user_api_token_response.json()

    # api_tokens
    def get_all_api_tokens(self):
        get_all_api_tokens_response = requests.get(
            url=api_tokens_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_all_api_tokens_response.status_code == 200, get_all_api_tokens_response.json()
        for token in get_all_api_tokens_response.json():
            assert models.ApiToken.parse_obj(token), "Validation error while test_get_all_api_tokens"

    # dialog_sessions

    def create_dialog_sessions(self, name):
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": name,
            },
        )
        assert create_dialog_response.status_code == 201, \
            f"Error while create_dialog_sessions with {name} assistant"
        assert models.DialogSession.parse_obj(create_dialog_response.json()), \
            f"Validation error while create_dialog_sessions with {name} assistant "
        return create_dialog_response.json()

    def get_dialog_sessions(self, dialog_session_id):

        get_dialog_response = requests.get(
            url=dialog_sessions_endpoint + str(dialog_session_id),
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_dialog_response.status_code == 200, get_dialog_response.json()
        assert models.DialogSession.parse_obj(get_dialog_response.json()), \
            "Validation error while test_create_dialog_sessions"

    def send_dialog_session_message(self, dialog_session_id):
        send_message_response = requests.post(
            url=dialog_sessions_endpoint + str(dialog_session_id) + "/chat",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )
        assert send_message_response.status_code == 201, send_message_response.json()
        assert models.DialogChatMessageResponse.parse_obj(send_message_response.json()), \
            "Validation error while test_send_dialog_session_message"

    def get_dialog_session_history(self, dialog_session_id):
        get_dialog_history_response = requests.get(
            url=dialog_sessions_endpoint + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_dialog_history_response.status_code == 200, get_dialog_history_response.json()
        for dialog in get_dialog_history_response.json():
            assert models.DialogUtterance.parse_obj(dialog), "Validation error while test_get_dialog_session_history"

    # deployments


class DeploymentsMethods:

    def get_all_lm_services(self):
        lm_services_list_response = requests.get(
            url=deployments_endpoint + "lm_services", headers={"accept": "application/json"}
        )
        assert lm_services_list_response.status_code == 200, lm_services_list_response.json()
        for lm_service in lm_services_list_response.json():
            assert models.LmService.parse_obj(lm_service), "Validation error while get_all_lm_services"

    def create_deployment(self, va_id):
        deployment_response = requests.get(
            url=deployments_endpoint + "lm_services",
            headers={
                'accept': 'application/json',
                'token': '1',
                'Content-Type': 'application/json',
            },
            json={
                'virtual_assistant_id': va_id,
            }

        )
        assert deployment_response.status_code == 200, deployment_response.json()
        # assert models.DeploymentCreate.parse_obj(deployment_response), "Validation error while create_deployment"


class AdminMethods:

    # admin

    def get_all_publish_requests(self):
        response = requests.get(
            url=admin_endpoint,
            headers={
                'accept': 'application/json',
                'token': auth_token,
            }
        )
        assert response.status_code == 200, response.json()
        for publish_request in response.json():
            assert models.PublishRequestRead.parse_obj(publish_request)
        return response.json()

    def get_unreviewed_publish_requests(self):
        response = requests.get(
            url=admin_endpoint + "unreviewed",
            headers={
                'accept': 'application/json',
                'token': auth_token,
            }
        )
        assert response.status_code == 200, response.json()
        for publish_request in response.json():
            assert models.PublishRequestRead.parse_obj(publish_request)
        return response.json()

    def confirm_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + str(publish_request_id) + "/confirm",
            headers={
                'accept': 'application/json',
                'token': auth_token,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert response.status_code == 200, response.json()
        assert models.PublishRequestRead.parse_obj(response.json())

    def decline_publish_request(self, publish_request_id):
        response = requests.post(
            url=admin_endpoint + str(publish_request_id) + "/decline",
            headers={
                'accept': 'application/json',
                'token': auth_token,
                'content-type': 'application/x-www-form-urlencoded',
            }
        )
        assert response.status_code == 200, response.json()
        assert models.PublishRequestRead.parse_obj(response.json())
