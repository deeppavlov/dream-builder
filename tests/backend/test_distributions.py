import pytest
import requests
from qaseio.pytest import qase
from sqlalchemy.dialects.postgresql import insert
import database.crud as crud
from database import models as db_models
from database.core import init_db
from services.distributions_api import schemas as models
from .config import (
    assistant_dists_endpoint,
    users_endpoint,
    api_tokens_endpoint,
    dialog_sessions_endpoint,
    deployments_endpoint,
    auth_token,db_config,
    exist_email,
    google_user,
    uservalid_user,
    va_data,
    clean_testdata_wo_user,
    clean_testdb,
    create_mocks_public_dist,
    counter_distributions as counter
)


# assistant_dists


@pytest.fixture(scope="function")
def create_va_by_db():
    # to display private distributions, you need to use the database methods:
    # 1) create user (in setup_class)
    # 2) create VA
    # 3) deploy VA from copy (from scratch not works)
    db = init_db(*db_config)()
    author_id = crud.get_user_by_email(db=db, email=exist_email).id
    virtual_assistant = crud.create_virtual_assistant(
        db=db,
        cloned_from_id=va_data["cloned_from_id"],
        author_id=author_id,
        source=va_data["source"],
        name=va_data["name"],
        display_name=va_data["display_name"],
        description=va_data["description"],
    )
    va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
    deployment = db.scalar(
        insert(db_models.Deployment)
            .values(
            virtual_assistant_id=va.id,
            chat_url="chat_url",
            prompt="prompt",
            lm_service_id=1,
        )
            .returning(db_models.Deployment)
    )
    db.commit()

    yield
    clean_testdata_wo_user(db, exist_email)
    db.close()


class TestDistributions:
    @classmethod
    def setup_class(self):
        db = init_db(*db_config)()
        create_mocks_public_dist(db=db)
        crud.add_google_user(db=db, user=google_user)
        crud.add_user_to_uservalid(db=db, user=uservalid_user, email=exist_email)
        db.close()

    @classmethod
    def teardown_class(self):
        db = init_db(*db_config)()
        # clean_all_testdata(db, exist_email)
        clean_testdb(db=db)
        db.close()

    @qase.title(f"{counter()}. test_create_distribution")
    def test_create_distribution(self):
        dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            json={"display_name": "TestBot", "description": "TestBot"},
        )

        assert dist_response.status_code == 201, dist_response.json()
        assert models.AssistantDistModelShort.parse_obj(dist_response.json())

    @qase.title(f"{counter()}. test_get_list_of_public_dist")
    def test_get_list_of_public_dist(self):
        public_dist_list = requests.get(assistant_dists_endpoint + "public")
        assert public_dist_list.status_code == 200, public_dist_list.json()

        for public_dist in public_dist_list.json():
            assert models.VirtualAssistant.parse_obj(public_dist), \
                "Validation error while test_get_list_of_public_dist"

    @qase.title(f"{counter()}. test_get_list_of_private_dist")
    def test_get_list_of_private_dist(self, create_va_by_db):
        private_dist_list = requests.get(
            url=assistant_dists_endpoint + "private",
            headers={
                "accept": "*/*",
                "token": auth_token,
            },
        )
        #print(f"private_dist_list = {private_dist_list.json()}")
        assert private_dist_list.status_code == 200, private_dist_list.json()
        for private_dist in private_dist_list.json():
            assert models.VirtualAssistant.parse_obj(private_dist),\
                "Validation error while test_get_list_of_private_dist"

    @qase.title(f"{counter()}. test_get_exist_dist_by_name")
    def test_get_exist_dist_by_name(self):
        name = va_data["name"]
        create_dist_response = requests.post(
            url=f"{assistant_dists_endpoint}",
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            json={"display_name": name, "description": "description"},
        )
        get_dist_response = requests.get(assistant_dists_endpoint + create_dist_response.json()["name"])
        assert get_dist_response.status_code == 200, get_dist_response.json()
        assert models.AssistantDistModelShort.parse_obj(get_dist_response.json())
        assert get_dist_response.json()["display_name"] == name, get_dist_response.json()

    @qase.title(f"{counter()}. test_get_non_exist_dist_by_name")
    def test_get_non_exist_dist_by_name(self):
        response = requests.get(assistant_dists_endpoint + "name")
        assert response.status_code == 404, response.json()

    @qase.title(f"{counter()}. test_delete_dist_by_name")
    def test_delete_dist_by_name(self, create_va_by_db):
        # need create from scratch
        delete_response = requests.delete(
            url=assistant_dists_endpoint + va_data["name"],
            headers={
                "accept": "*/*",
                "token": auth_token,
            },
        )
        assert delete_response.status_code == 204, delete_response.json()

    @qase.title(f"{counter()}. test_patch_dist_by_name")
    def test_patch_dist_by_name(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        patch_dist_response = requests.patch(
            url=assistant_dists_endpoint + public_dist["name"],
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={"display_name": "New_test_name", "description": "string"},
        )
        assert patch_dist_response.status_code == 200, patch_dist_response.json()
        assert models.AssistantDistModelShort.parse_obj(
            patch_dist_response.json()
        ), "Validation error while test_clone_public_dist"

    @qase.title(f"{counter()}. test_clone_public_dist")
    def test_clone_public_dist(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        clone_dist_response = requests.post(
            url=assistant_dists_endpoint + public_dist["name"] + "/clone",
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
        assert models.VirtualAssistant.parse_obj(
            clone_dist_response.json()
        ), "Validation error while test_clone_public_dist"

    @qase.title(f"{counter()}. test_get_public_dist_components_by_name")
    def test_get_public_dist_components_by_name(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        get_dist_components_response = requests.get(assistant_dists_endpoint + public_dist["name"] + "/components/")
        assert get_dist_components_response.status_code == 200, get_dist_components_response.json()
        assert models.DistComponentsResponse.parse_obj(
            get_dist_components_response.json()
        ), "Error while test_get_public_dist_components_by_name"

    # @qase.title(f"{counter()}. test_get_exist_private_dist_components_by_name")
    # def test_get_exist_private_dist_components_by_name(self, cr):
    # need create from scratch

    @qase.title(f"{counter()}. test_get_non_exist_dist_components_by_name")
    def test_get_non_exist_dist_components_by_name(self):
        response = requests.get(assistant_dists_endpoint + "name/components/")
        assert response.status_code == 404, response.json()

    # @qase.title(f"{counter()}. test_publish_dist")
    # def test_publish_dist(self):
    # need create from scratch
    #    create_va_by_db()
    #    response_post = requests.post(url=assistant_dists_endpoint,
    #                                  headers={
    #                                      'accept': 'application/json',
    #                                      'Content-Type': 'application/json',
    #                                  },
    #                                  json={
    #                                      "display_name": "string",
    #                                      "description": "string"
    #                                  }
    #                                  )
    #
    #    response = requests.post(url=assistant_dists_endpoint + response_post.json()["name"] + '/publish/',
    #                             headers={
    #                                 'accept': '*/*',
    #                                 'token': auth_token,
    #                                 'content-type': 'application/x-www-form-urlencoded',
    #                             }
    #                             )
    #    assert response.status_code == 200, response.json()

    @qase.title(f"{counter()}. test_chat_dist")
    def test_chat_dist(self):
        response_post = requests.post(
            url=assistant_dists_endpoint,
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            json={"display_name": "string", "description": "string"},
        )

        response = requests.post(
            url=assistant_dists_endpoint + response_post.json()["name"] + "/chat/",
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            json={
                "text": "string",
            },
        )
        assert response.status_code == 200, response.json()
        assert models.AssistantDistChatResponse.parse_obj(response.json())

    @qase.title(f"{counter()}. test_get_public_dist_prompt")
    def test_get_public_dist_prompt(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        get_prompt_response = requests.get(
            url=assistant_dists_endpoint + public_dist["name"] + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_prompt_response.status_code == 200, get_prompt_response.json()
        assert models.Prompt.parse_obj(get_prompt_response.json())

    @qase.title(f"{counter()}. test_get_private_dist_prompt")
    def test_get_private_dist_prompt(self, create_va_by_db):
        # need create from scratch
        get_prompt_response = requests.get(
            url=assistant_dists_endpoint + va_data["name"] + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_prompt_response.status_code == 200, get_prompt_response.json()
        assert models.Prompt.parse_obj(get_prompt_response.json())

    @qase.title(f"{counter()}. test_set_public_dist_prompt")
    def test_set_public_dist_prompt(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        prompt = "new_prompt_string"
        set_prompt_response = requests.post(
            url=assistant_dists_endpoint + public_dist["name"] + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "new_prompt_string",
            },
        )
        assert set_prompt_response.status_code == 200, set_prompt_response.json()
        assert models.Deployment.parse_obj(set_prompt_response.json())
        assert set_prompt_response.json()["prompt"] == prompt

    @qase.title(f"{counter()}. test_set_private_dist_prompt")
    def test_set_private_dist_prompt(self, create_va_by_db):
        # need create from scratch
        prompt = "new_prompt_string"
        set_prompt_response = requests.post(
            url=assistant_dists_endpoint + va_data["name"] + "/prompt/",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "new_prompt_string",
            },
        )
        assert set_prompt_response.status_code == 200, set_prompt_response.json()
        assert models.Deployment.parse_obj(set_prompt_response.json())
        assert set_prompt_response.json()["prompt"] == prompt

    @qase.title(f"{counter()}. test_get_public_dist_lm_service")
    def test_get_public_dist_lm_service(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        get_lm_service_response = requests.get(
            url=assistant_dists_endpoint + public_dist["name"] + "/lm_service/",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_lm_service_response.status_code == 200, get_lm_service_response.json()
        assert models.LmService.parse_obj(get_lm_service_response.json())

    # @qase.title(f"{counter()}. test_get_public_dist_prompt")
    # def test_get_private_dist_lm_service(self, create_va_by_db):
    #    get_lm_service_response = requests.get(url=assistant_dists_endpoint + va_data["name"] + '/lm_service/',
    #                                           headers={
    #                                               'accept': 'application/json',
    #                                               'token': auth_token,
    #                                           }
    #                                           )
    #    assert get_lm_service_response.status_code == 200, get_lm_service_response.json()
    #    assert models.LmService.parse_obj(get_lm_service_response.json())

    # users

    @qase.title(f"{counter()}. test_get_all_users")
    def test_get_all_users(self):
        get_all_users_response = requests.get(
            url=users_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_all_users_response.status_code == 200, get_all_users_response.json()
        for user in get_all_users_response.json():
            assert models.User.parse_obj(user)

    @qase.title(f"{counter()}. test_get_user_self")
    def test_get_user_self(self):
        get_user_response = requests.get(
            url=users_endpoint + "self",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_user_response.status_code == 200, get_user_response.json()
        assert models.User.parse_obj(get_user_response.json())

    @qase.title(f"{counter()}. test_get_user_by_id")
    def test_get_user_by_id(self):
        get_user_response = requests.get(
            url=users_endpoint + "self",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        user_id = str(get_user_response.json()["id"])
        get_user_by_id_response = requests.get(
            url=users_endpoint + user_id,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_user_by_id_response.status_code == 200, get_user_by_id_response.json()
        assert models.User.parse_obj(get_user_by_id_response.json())

    @qase.title(f"{counter()}. test_create_or_update_user_api_token")
    def test_create_or_update_user_api_token(self):
        get_user_response = requests.get(
            url=users_endpoint + "self",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        user_id = str(get_user_response.json()["id"])
        update_user_api_token_response = requests.post(
            url=users_endpoint + user_id + "/settings/api_tokens/",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "api_token_id": user_id,
                "token_value": "string",
            },
        )

        assert update_user_api_token_response.status_code == 201, update_user_api_token_response.json()
        assert models.UserApiToken.parse_obj(update_user_api_token_response.json())

    # api_tokens

    @qase.title(f"{counter()}. test_get_all_api_tokens")
    def test_get_all_api_tokens(self):
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

    @qase.title(f"{counter()}. test_create_dialog_sessions")
    def test_create_dialog_sessions(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": public_dist["name"],
            },
        )
        assert create_dialog_response.status_code == 201, create_dialog_response.json()
        assert models.DialogSession.parse_obj(
            create_dialog_response.json()
        ), "Validation error while test_create_dialog_sessions"

    @qase.title(f"{counter()}. test_get_dialog_sessions")
    def test_get_dialog_sessions(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": public_dist["name"],
            },
        )

        dialog_session_id = str(create_dialog_response.json()["id"])
        get_dialog_response = requests.get(
            url=dialog_sessions_endpoint + dialog_session_id,
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_dialog_response.status_code == 200, get_dialog_response.json()
        assert models.DialogSession.parse_obj(
            get_dialog_response.json()
        ), "Validation error while test_create_dialog_sessions"

    @qase.title(f"{counter()}. test_send_dialog_session_message")
    def test_send_dialog_session_message(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": public_dist["name"],
            },
        )

        dialog_session_id = str(create_dialog_response.json()["id"])
        send_message_response = requests.post(
            url=dialog_sessions_endpoint + dialog_session_id + "/chat",
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
        assert models.DialogChatMessageResponse.parse_obj(
            send_message_response.json()
        ), "Validation error while test_send_dialog_session_message"

    @qase.title(f"{counter()}. test_get_dialog_session_history")
    def test_get_dialog_session_history(self):
        get_public_dist_list_response = requests.get(assistant_dists_endpoint + "public")
        public_dist = get_public_dist_list_response.json()[0]
        create_dialog_response = requests.post(
            url=dialog_sessions_endpoint,
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "virtual_assistant_name": public_dist["name"],
            },
        )

        dialog_session_id = str(create_dialog_response.json()["id"])

        send_message_response = requests.post(
            url=dialog_sessions_endpoint + dialog_session_id + "/chat",
            headers={
                "accept": "application/json",
                "token": auth_token,
                "Content-Type": "application/json",
            },
            json={
                "text": "Hello! What is your name?",
            },
        )

        get_dialog_history_response = requests.get(
            url=dialog_sessions_endpoint + dialog_session_id + "/history",
            headers={
                "accept": "application/json",
                "token": auth_token,
            },
        )
        assert get_dialog_history_response.status_code == 200, get_dialog_history_response.json()
        for dialog in get_dialog_history_response.json():
            assert models.DialogUtterance.parse_obj(dialog), "Validation error while test_get_dialog_session_history"

    # deployments

    @qase.title(f"{counter()}. test_get_all_lm_services")
    def test_get_all_lm_services(self):
        lm_services_list_response = requests.get(
            url=deployments_endpoint + "lm_services", headers={"accept": "application/json"}
        )
        assert lm_services_list_response.status_code == 200, lm_services_list_response.json()
        for lm_service in lm_services_list_response.json():
            assert models.LmService.parse_obj(lm_service), "Validation error while test_get_dialog_session_history"
