from locust import HttpUser, task, between
import time
import sys
sys.path.append('K:\\work\\dream-builder')
from services.distributions_api import schemas as models
#from tests.backend.distributions_methods import (
#    UserMethods,
#    DeploymentsMethods,
#    AdminMethods
#)
from tests.backend.config import (
    assistant_dists_endpoint,
    components_endpoint,
    users_endpoint,
    api_keys_endpoint,
    dialog_sessions_endpoint,
    deployments_endpoint,
    admin_endpoint,
    auth_token, lm_services_endpoint,
)


class QuickstartUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def test_get_dialog_session_history_with_created_from_scratch_va(self):

        name = 'TestVA'
        #user = UserMethods()

        #va = user.create_virtual_assistant(name)
        dist_response = self.client.post(
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


        va_id = dist_response.json()["id"]
        va_name = dist_response.json()["name"]
#
        #deploy = DeploymentsMethods()
        #deployment_id = deploy.create_deployment(va_name)["id"]

        deployment_response = self.client.post(
            url=deployments_endpoint,
            headers={
                'accept': 'application/json',
                'token': auth_token,
                'Content-Type': 'application/json',
            },
            json={
                f'virtual_assistant_name': va_name,

            }

        )
        assert deployment_response.status_code == 201, deployment_response.json()
        assert models.DeploymentRead.parse_obj(deployment_response.json()), "Validation error while create_deployment"

        time.sleep(60)
#
        #dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        create_dialog_response = self.client.post(
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
        assert models.DialogSessionRead.parse_obj(create_dialog_response.json()), \
            f"Validation error while create_dialog_sessions with {name} assistant "

        dialog_session_id = create_dialog_response.json()["id"]

        #user.send_dialog_session_message(dialog_session_id)
        send_message_response = self.client.post(
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
        assert models.DialogChatMessageRead.parse_obj(send_message_response.json()), \
            "Validation error while test_send_dialog_session_message"
        assert send_message_response.json()["active_skill"] != "dummy_skill", \
            "Dummy skill answers"


        #user.get_dialog_session_history(dialog_session_id)
        get_dialog_history_response = self.client.get(
            url=dialog_sessions_endpoint + str(dialog_session_id) + "/history",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_dialog_history_response.status_code == 200, get_dialog_history_response.json()
        for dialog in get_dialog_history_response.json():
            assert models.DialogUtteranceRead.parse_obj(dialog), "Validation error while " \
                                                                 "test_get_dialog_session_history "


