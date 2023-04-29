from sqlalchemy.dialects.postgresql import insert
from database import models
import database.crud as crud
import pytest
from qaseio.pytest import qase
from database.core import init_db
from types import NoneType
from .config import (
    db_config,
    exist_email,
    not_exist_email,
    refresh_token,
    exist_sub,
    google_user,
    uservalid_user,
    va_data,
    clean_all_testdata,
    clean_testdb,
    create_mocks_public_dist,
    counter_db as counter, uservalid_user_updated, refresh_token_updated, expire_date_updated
)


@pytest.fixture(scope="function")
def db():
    db = init_db(*db_config)()
    yield db
    db.close()


class TestDb:
    # @classmethod
    # def setup_class(self):
    #    db = init_db(*db_config)()
    #    create_mocks_public_dist(db=db)
    #    db.close()

    @classmethod
    def teardown_class(self):
        db = init_db(*db_config)()
        # clean_all_testdata(db, exist_email)
        # clean_testdb(db=db)
        db.close()

    # USER

    @qase.title(f"{counter()}. test_get_all_users")
    def test_get_all_users(self, db):
        all_users = crud.get_all_users(db=db)
        users_emails = [user.email for user in all_users]
        assert exist_email in users_emails, "Error while get all users"

    @qase.title(f"{counter()}. test_check_user_exists")
    def test_check_user_exists(self, db):
        assert crud.check_user_exists(db=db, email=exist_email), "Error, the user actually exist"

    @qase.title(f"{counter()}. test_check_user_not_exists")
    def test_check_user_not_exists(self, db):
        assert not crud.check_user_exists(db=db, email=not_exist_email), "Error, the user actually does not exist"

    @qase.title(f"{counter()}. test_add_google_user")
    def test_add_google_user(self, db):
        crud.add_google_user(db=db, user=google_user)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add google_user"

    @qase.title(f"{counter()}. test_get_user")
    def test_get_user(self, db):
        id = crud.get_user_by_email(db=db, email=exist_email).id
        user = crud.get_user(db=db, user_id=id)
        assert user.id == id, "Error while get user"

    @qase.title(f"{counter()}. test_get_user_by_sub")
    def test_get_user_by_sub(self, db):
        user = crud.get_user_by_sub(db=db, sub=exist_sub)
        assert user.sub == exist_sub, "Error while get user by sub"

    @qase.title(f"{counter()}. test_get_user_by_email")
    def test_get_user_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert user.email == exist_email, "Error while get user by email"

    @qase.title(f"{counter()}. test_get_user_by_email")
    def test_get_user_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert user.email == exist_email, "Error while get user by email"

    @qase.title(f"{counter()}. test_get_users_by_role")
    def test_get_users_by_role(self, db):
        role_id = 1
        crud.get_users_by_role(db=db, role_id=role_id)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while get_users_by_role"

    # USER VALID

    @qase.title(f"{counter()}. test_add_user_to_uservalid")
    def test_add_user_to_uservalid(self, db):
        crud.add_user_to_uservalid(db=db, user=uservalid_user, email=exist_email)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add user to uservalid"

    @qase.title(f"{counter()}. test_set_users_refresh_token_invalid")
    def test_set_users_refresh_token_invalid(self, db):
        crud.set_users_refresh_token_invalid(db, refresh_token=refresh_token)
        assert crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token).is_valid is False, \
            "Error while set_users_refresh_token_invalid"

    @qase.title(f"{counter()}. test_get_uservalid_by_email")
    def test_get_uservalid_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        uservalid = crud.get_uservalid_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while get uservalid by email"

    @qase.title(f"{counter()}. test_get_uservalid_by_refresh_token")
    def test_get_uservalid_by_refresh_token(self, db):
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while get uservalid by refresh token"

    @qase.title(f"{counter()}. test_check_uservalid_exists")
    def test_check_uservalid_exists(self, db):
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while check_uservalid_exists"

    @qase.title(f"{counter()}. test_update_users_refresh_token")
    def test_update_users_refresh_token(self, db):
        # search by email, change the token and date
        # wait to fix id==user_id
        crud.update_users_refresh_token(db=db, user=uservalid_user_updated, email=exist_email)
        uservalid = crud.get_uservalid_by_email(db=db, email=exist_email)
        # print(uservalid.user_id)
        # print(uservalid_user_updated.refresh_token)
        assert uservalid.refresh_token == refresh_token_updated, \
            "Error while update_users_refresh_token, token is not updated"
        assert str(uservalid.expire_date) == expire_date_updated, \
            "Error while update_users_refresh_token, expire date is not updated"

    # API TOKEN

    @qase.title(f"{counter()}. test_get_all_api_tokens")
    def test_get_all_api_tokens(self, db):
        token_list = ["xGPT"]
        get_all_tokens = crud.get_all_api_tokens(db=db)
        all_tokens = [token.__dict__["name"] for token in get_all_tokens]
        assert token_list == all_tokens

    @qase.title(f"{counter()}. test_create_user_api_token")
    def test_create_user_api_token(self, db):
        user_id = crud.get_uservalid_by_email(db=db, email=exist_email).user_id
        # print(f'user_id  = {user_id}')
        user_api_token = crud.create_or_update_user_api_token(db=db,
                                                              user_id=user_id,
                                                              api_token_id=1,
                                                              token_value='token_value')
        assert user_api_token.user_id == user_id, "Error while create user api token"

    @qase.title(f"{counter()}. test_get_user_api_token")
    def test_get_user_api_token(self, db):
        api_token_id = 1
        token_value = 'token_value'
        assert crud.get_user_api_token(db=db, id=api_token_id) == token_value

    @qase.title(f"{counter()}. test_get_user_api_token")
    def test_get_user_api_tokens(self, db):
        api_token_id = 1
        token_value = 'token_value'
        get_user_tokens = crud.get_user_api_token(db=db, id=api_token_id)
        user_tokens = [token.__dict__["name"] for token in get_user_tokens]
        assert user_tokens[0] == token_value

    @qase.title(f"{counter()}. test_delete_user_api_token")
    def test_delete_user_api_token(self, db):
        api_token_id = 1
        token_value = 'token_value'
        crud.delete_user_api_token(db=db, user_api_token_id=api_token_id)
        assert crud.get_user_api_token(db=db, id=api_token_id) is None

    # VIRTUAL ASSISTANT

    @qase.title(f"{counter()}. test_create_virtual_assistant")
    def test_create_virtual_assistant(self, db):
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
        assert va.name == va_data["name"]

    @qase.title(f"{counter()}. test_get_virtual_assistant_by_name")
    def test_get_virtual_assistant_by_name(self, db):
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        assert va.name == va_data["name"]

    @qase.title(f"{counter()}. test_get_virtual_assistant")
    def test_get_virtual_assistant(self, db):
        id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        va = crud.get_virtual_assistant(db=db, id=id)
        assert va.name == va_data["name"]

    @qase.title(f"{counter()}. test_get_all_virtual_assistants")
    def test_get_all_virtual_assistants(self, db):
        all_va = crud.get_all_virtual_assistants(db=db)
        va_names = [va.name for va in all_va]
        assert va_data["name"] in va_names, "Error while get all virtual assistants"

    @qase.title(f"{counter()}. test_get_all_public_virtual_assistants")
    def test_get_all_public_virtual_assistants(self, db):
        public_va = "fairytale_assistant"
        get_all_public_va = crud.get_all_public_virtual_assistants(db=db)
        all_public_va = [va.__dict__["name"] for va in get_all_public_va]
        assert public_va in all_public_va, "Error while get all public virtual assistants"

    @qase.title(f"{counter()}. test_get_all_private_virtual_assistants")
    def test_get_all_private_virtual_assistants(self, db):
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        get_all_private_va = crud.get_all_private_virtual_assistants(db=db, user_id=user_id)
        all_private_va = [va.__dict__["name"] for va in get_all_private_va]
        assert va_data["name"] in all_private_va, "Error while get all private assistants"

    @qase.title(f"{counter()}. test_update_virtual_assistant_metadata_by_name")
    def test_update_virtual_assistant_metadata_by_name(self, db):
        new_name = "new_name"
        new_description = "new_description"
        crud.update_virtual_assistant_metadata_by_name(db=db,
                                                       name=va_data["name"],
                                                       new_name="new_name",
                                                       new_description="new_description"
                                                       )
        assert crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).name == new_name, \
            "Error while update_virtual_assistant_metadata_by_name, name is not updated"
        assert crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).description == new_description, \
            "Error while update_virtual_assistant_metadata_by_name, description is not updated"

    @qase.title(f"{counter()}. test_delete_virtual_assistant_by_name")
    def test_delete_virtual_assistant_by_name(self, db):
        crud.delete_virtual_assistant_by_name(db=db, name=va_data["name"])
        assert crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]) is None, \
            "Error while delete_virtual_assistant_by_name"

    # COMPONENT

    @qase.title(f"{counter()}. test_create_component")
    def test_create_component(self, db):
        component_id = 1
        port = 1
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        crud.create_component(db=db,
                              source="str",
                              name="str",
                              display_name="str",
                              container_name="str",
                              component_type="str",
                              is_customizable=True,
                              author_id=user_id,
                              ram_usage="str",
                              port=port,
                              group="str",
                              endpoint="str",
                              model_type=None,
                              gpu_usage=None,
                              description=None,
                              build_args=None,
                              compose_override=None,
                              compose_dev=None,
                              compose_proxy=None
                              )
        assert crud.get_component(db=db, component_id=component_id).id == component_id, \
            "Error while create_component"

    @qase.title(f"{counter()}. test_get_component")
    def test_get_component(self, db):
        component_id = 1
        assert crud.get_component(db=db, component_id=component_id).id == component_id, \
            "Error while get_component"

    @qase.title(f"{counter()}. get_all_components")
    def test_get_all_components(self, db):
        component_id = 1
        all_components = [va.__dict__["name"] for va in crud.get_all_components(db=db)]
        assert crud.get_component(db=db, component_id=component_id) in all_components, \
            "Error while get_all_components"

    @qase.title(f"{counter()}. test_get_components_by_group_name")
    def test_get_components_by_group_name(self, db):
        component_id = 1
        group = "group"
        group_components = [va.__dict__["name"] for va in crud.get_components_by_group_name(db=db, group=group)]
        assert crud.get_components_by_group_name(db=db, group=group) in group_components, \
            "Error while get_components_by_group_name"

    @qase.title(f"{counter()}. test_delete_component")
    def test_delete_component(self, db):
        component_id = 1
        group = "group"
        crud.delete_component(db=db, id=component_id)
        assert crud.get_component(db=db, component_id=component_id).id is None, \
            "Error while delete_component"

    @qase.title(f"{counter()}. test_get_next_available_component_port")
    def test_get_next_available_component_port(self, db):
        assert crud.get_next_available_component_port(db=db), \
            "Error while get_next_available_component_port"

    # VIRTUAL ASSISTANTS COMPONENT

    @qase.title(f"{counter()}. test_create_virtual_assistant_component")
    def test_create_virtual_assistant_component(self, db):
        component_id = 1
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        crud.create_virtual_assistant_component(db=db,
                                                virtual_assistant_id=va_id,
                                                component_id=component_id,
                                                is_enabled=True)

        assert crud.get_virtual_assistant_components(db=db, virtual_assistant_id=va_id), \
            "Error while create_virtual_assistant_component"

    @qase.title(f"{counter()}. test_create_virtual_assistant_components")
    def test_create_virtual_assistant_components(self, db):
        component_id = 1
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        crud.create_virtual_assistant_components(db=db,
                                                 virtual_assistant_id=va_id,
                                                 components=models.VirtualAssistantComponent(virtual_assistant_id=va_id,
                                                                                             component_id=component_id,
                                                                                             is_enabled=True)
                                                 )
        assert crud.get_virtual_assistant_components(db=db, virtual_assistant_id=va_id), \
            "Error while create_virtual_assistant_component"

    @qase.title(f"{counter()}. test_get_virtual_assistant_components")
    def test_get_virtual_assistant_components(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        assert crud.get_virtual_assistant_components(db=db, virtual_assistant_id=va_id), \
            "Error while get_virtual_assistant_components"

    @qase.title(f"{counter()}. test_get_virtual_assistant_components_by_name")
    def test_get_virtual_assistant_component_by_name(self, db):
        component_id = crud.get_virtual_assistant_components_by_name(db=db, virtual_assistant_name=va_data["name"])
        assert component_id == 1, \
            "Error while get_virtual_assistant_components_by_name"

    @qase.title(f"{counter()}. test_delete_virtual_assistant_component")
    def test_delete_virtual_assistant_component(self, db):
        component_id = 1
        crud.delete_virtual_assistant_component(db=db, id=component_id)
        assert crud.get_virtual_assistant_components_by_name(db=db, virtual_assistant_name=va_data["name"]) is None, \
            "Error while delete_virtual_assistant_component"

    # PUBLISH REQUEST

    @qase.title(f"{counter()}. test_create_publish_request")
    def test_create_publish_request(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        publish_request = crud.create_publish_request(db=db,
                                                      virtual_assistant_id=va_id,
                                                      user_id=user_id,
                                                      slug="str")
        assert publish_request in crud.get_all_publish_requests(db=db), \
            "Error while create_publish_request"

    @qase.title(f"{counter()}. test_get_all_publish_requests")
    def test_get_all_publish_requests(self, db):
        publish_request = crud.get_all_publish_requests(db=db)
        # с чем ассерт?
        assert publish_request in crud.get_all_publish_requests(db=db), \
            "Error while get_all_publish_requests"

    @qase.title(f"{counter()}. test_get_unreviewed_publish_requests")
    def test_get_unreviewed_publish_requests(self, db):
        publish_request = crud.get_unreviewed_publish_requests(db=db)
        # с чем ассерт?
        assert publish_request in crud.get_all_publish_requests(db=db), \
            "Error while get_unreviewed_publish_requests"

    @qase.title(f"{counter()}. test_confirm_publish_request")
    def test_confirm_publish_request(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        user_id = crud.get_user_by_email(db=db, email=exist_email).id

        publish_request = crud.confirm_publish_request(db=db,
                                                       id=crud.get_all_publish_requests(db=db)[0],
                                                       reviewed_by_user_id=user_id)
        # с чем ассерт?
        assert publish_request in crud.get_all_publish_requests(db=db), \
            "Error while confirm_publish_request"

    @qase.title(f"{counter()}. test_decline_publish_request")
    def test_decline_publish_request(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        user_id = crud.get_user_by_email(db=db, email=exist_email).id

        publish_request = crud.decline_publish_request(db=db,
                                                       id=crud.get_all_publish_requests(db=db)[0],
                                                       reviewed_by_user_id=user_id)
        # с чем ассерт?
        assert publish_request in crud.get_all_publish_requests(db=db), \
            "Error while decline_publish_request"

    # DIALOG

    @qase.title(f"{counter()}. test_create_dialog_session_by_name")
    def test_create_dialog_session_by_name(self, db):
        va_name = "fairytale_assistant"
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        va = crud.get_virtual_assistant_by_name(db=db, name=va_name)
        dialog_session = crud.create_dialog_session_by_name(db=db,
                                                            user_id=user_id,
                                                            virtual_assistant_name=va_name)
        # assert dialog_session.user_id == va.author_id - by default values(user_id=1)
        assert dialog_session.is_active is True, \
            "Error while create_dialog_session_by_name"

    @qase.title(f"{counter()}. test_get_dialog_session")
    def test_get_dialog_session(self, db):
        va_name = "fairytale_assistant"
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        dialog_session = crud.create_dialog_session_by_name(db=db,
                                                            user_id=user_id,
                                                            virtual_assistant_name=va_name)
        # assert dialog_session.user_id == va.author_id - by default values(user_id=1)
        get_dialog_session = crud.get_dialog_session(db=db, dialog_session_id=dialog_session.id)
        assert get_dialog_session.is_active is True, \
            "Error while get_dialog_session"

    @qase.title(f"{counter()}. test_get_debug_assistant_chat_url")
    def test_get_debug_assistant_chat_url(self, db):
        assert crud.get_debug_assistant_chat_url(db=db), \
            "Error while get_debug_assistant_chat_url"

    @qase.title(f"{counter()}. test_update_dialog_session")
    def test_update_dialog_session(self, db):
        va_name = "fairytale_assistant"
        agent_dialog_id = "1"
        # why id: str ?
        user_id = crud.get_user_by_email(db=db, email=exist_email).id
        dialog_session = crud.create_dialog_session_by_name(db=db,
                                                            user_id=user_id,
                                                            virtual_assistant_name=va_name)
        # assert dialog_session.user_id == va.author_id - by default values(user_id=1)
        update_dialog_session = crud.update_dialog_session(
            db=db, dialog_session_id=dialog_session.id, agent_dialog_id=agent_dialog_id
        )
        get_dialog_session = crud.get_dialog_session(db=db, dialog_session_id=dialog_session.id)
        assert get_dialog_session.agent_dialog_id == agent_dialog_id, \
            "Error while update_dialog_session"


    # DEPLOYMENT

    @qase.title(f"{counter()}. test_create_deployment_from_scratch")
    def test_create_deployment_from_scratch(self, db):
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])

        deployment = db.scalar(
            insert(models.Deployment)
                .values(
                virtual_assistant_id=va.id,
                chat_url="chat_url",
                prompt="prompt",
                lm_service_id=1,
            )
                .returning(models.Deployment)
        )
        db.commit()

        assert deployment.virtual_assistant_id == va.id, "Error while create_deployment_from_scratch"

    @qase.title(f"{counter()}. test_create_deployment_from_copy")
    def test_create_deployment_from_copy(self, db):
        va_name = "fairytale_assistant"
        original_va = crud.get_virtual_assistant_by_name(db=db, name=va_name)
        author_id = crud.get_user_by_email(db=db, email=exist_email).id

        new_va = crud.create_virtual_assistant(
            db=db,
            cloned_from_id=original_va.id,
            author_id=author_id,
            source=va_data["source"],
            name="name2",
            display_name="display_name2",
            description=va_data["description"],
        )

        new_va = crud.get_virtual_assistant_by_name(db=db, name="name2")

        deployment = crud.create_deployment_from_copy(
            db=db, original_virtual_assistant_id=original_va.id, new_virtual_assistant_id=new_va.id
        )
        assert deployment.virtual_assistant_id == new_va.id, "Error while create_deployment_from_copy"

    @qase.title(f"{counter()}. test_update_deployment_by_virtual_assistant_name")
    def test_update_deployment_by_virtual_assistant_name(self, db):
        chat_url = "new_chat_url"
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        deployment = crud.update_deployment_by_virtual_assistant_name(
            db=db, name=va_data["name"], chat_url="new_chat_url"
        )
        assert deployment.chat_url == chat_url, \
            "Error while update_deployment_by_virtual_assistant_name"

    @qase.title(f"{counter()}. test_get_deployment_by_virtual_assistant_name")
    def test_get_deployment_by_virtual_assistant_name(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        deployment = crud.get_deployment_by_virtual_assistant_name(db=db, name=va_data["name"])
        assert deployment.virtual_assistant_id == va_id, \
            "Error while get_deployment_by_virtual_assistant_name"

    @qase.title(f"{counter()}. test_get_deployment_prompt_by_virtual_assistant_name")
    def test_get_deployment_prompt_by_virtual_assistant_name(self, db):
        prompt = "prompt"
        deployment = crud.get_deployment_by_virtual_assistant_name(db=db, name=va_data["name"])
        assert deployment.prompt == prompt, "Error while get_deployment_prompt_by_virtual_assistant_name"

    @qase.title(f"{counter()}. test_set_deployment_prompt_by_virtual_assistant_name")
    def test_set_deployment_prompt_by_virtual_assistant_name(self, db):
        prompt = "new_prompt"
        deployment = crud.set_deployment_prompt_by_virtual_assistant_name(db=db, name=va_data["name"], prompt=prompt)
        assert deployment.prompt == prompt, "Error while set_deployment_prompt_by_virtual_assistant_name"

    # @qase.title(f"{counter()}. test_set_deployment_lm_service_by_virtual_assistant_name")
    # def test_set_deployment_lm_service_by_virtual_assistant_name(self, db):
    #    new_lm_service_name = "new_lm_service_name"
    #    deployment = crud.set_deployment_lm_service_by_virtual_assistant_name(db=db,
    #                                                                          name=va_data["name"],
    #                                                                          lm_service_name=new_lm_service_name)
    #    lm_service = crud.get_lm_service_by_name(db=db, name="lm_service_name")
    #    assert deployment.lm_service == new_lm_service_name

    # @qase.title(f"{counter()}. test_get_deployment_lm_service_by_virtual_assistant_name")
    # def test_get_deployment_lm_service_by_virtual_assistant_name(self, db):
    #    deployment = crud.get_deployment_lm_service_by_virtual_assistant_name(db=db, name=va_data["name"])
    #    assert deployment.lm_service_id == "lm_service_name"

    @qase.title(f"{counter()}. test_get_all_lm_services")
    def test_get_all_lm_services(self, db):
        actual_lm_service_names_list = ["GPT-J 6B", "BLOOMZ 7B", "GPT-3.5", "ChatGPT"]
        all_lm_services = crud.get_all_lm_services(db=db)
        lm_services_names = [name.__dict__["display_name"] for name in all_lm_services]
        assert actual_lm_service_names_list == lm_services_names, "Error while get_all_lm_services"

    @qase.title(f"{counter()}. test_get_lm_service_by_name")
    def test_get_lm_service_by_name(self, db):
        lm_service_name = "ChatGPT"
        lm_service = crud.get_lm_service_by_name(db=db, name=lm_service_name)
        assert lm_service.__dict__["name"] == lm_service_name






    @qase.title(f"{counter()}. test_delete_virtual_assistant_by_name")
    def test_delete_virtual_assistant_by_name(self, db):
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        crud.delete_virtual_assistant_by_name(db=db, name=va_data["name"])
        deleted_va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        assert type(deleted_va) == NoneType, "Error while delete va by name"

    @qase.title(f"{counter()}. test_set_users_refresh_token_invalid")
    def test_set_users_refresh_token_invalid(self, db):
        crud.set_users_refresh_token_invalid(db=db, refresh_token=refresh_token)
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        assert type(uservalid) == NoneType, "Error while set users refresh token_invalid"
