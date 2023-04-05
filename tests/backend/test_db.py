#импорты для def test_create_deployment_from_scratch
from sqlalchemy import select, update, and_, or_, delete
from sqlalchemy.dialects.postgresql import insert
from database import models
from sqlalchemy.orm import Session

#дальше то что нужно
import database.crud as crud
import pytest
from database.core import init_db
from types import NoneType
from .config import (
    db_config,
    exist_email,
    not_exist_email,
    refresh_token,
    refresh_token_updated,
    expire_date_updated,
    exist_sub,
    google_user,
    uservalid_user,
    uservalid_user_updated,
    va_data,
    clean_testdata,
    clean_testdb
)


@pytest.fixture(scope="function")
def db():
    db = init_db(*db_config)()
    yield db
    db.close()


class TestDb:
    @classmethod
    def teardown_class(self):
        db = init_db(*db_config)()
        #clean_testdata(db, exist_email)
        clean_testdb(db)
        db.close()

    def test_add_google_user(self, db):
        crud.add_google_user(db=db, user=google_user)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add google_user"

    def test_add_user_to_uservalid(self, db):
        crud.add_user_to_uservalid(db=db, user=uservalid_user, email=exist_email)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add user to uservalid"

    def test_check_user_exists(self, db):
        assert crud.check_user_exists(db=db, email=exist_email), "Error, the user actually exist"

    def test_check_user_not_exists(self, db):
        assert not crud.check_user_exists(db=db, email=not_exist_email), "Error, the user actually does not exist"

    def test_get_user_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert user.email == exist_email, "Error while get user by email"

    def test_get_uservalid_by_refresh_token(self, db):
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while get uservalid by refresh token"



#new tests

    def test_get_user_by_id(self, db):
        id = crud.get_user_by_email(db=db, email=exist_email).id
        user = crud.get_user_by_id(db=db, user_id=id)
        assert user.id == id, "Error while get user by id"

    def test_get_user_by_sub(self, db):
        user = crud.get_user_by_sub(db=db, sub=exist_sub)
        assert user.sub == exist_sub, "Error while get user by sub"

    def test_get_uservalid_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        uservalid = crud.get_uservalid_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while get uservalid by email"

#    def test_update_users_refresh_token(self, db):
#        #находим по email, меняем токен и дату
         #ждемс пока макс исправит
#        crud.update_users_refresh_token(db=db, user=uservalid_user_updated, email=exist_email)
#
#        uservalid = crud.get_uservalid_by_email(db=db, email=exist_email)
#
#        #print(uservalid.user_id)
#        #print(uservalid_user_updated.refresh_token)
#        assert uservalid.refresh_token == refresh_token_updated, "Error, token is not updated"
#        assert str(uservalid.expire_date) == expire_date_updated, "Error, expire date is not updated"

    def test_get_all_users(self, db):
        all_users = crud.get_all_users(db=db)
        users_emails = [user.email for user in all_users]
        print(users_emails)
        assert users_emails[0] == exist_email, "Error while get all users"


    #def test_create_or_update_user_api_token(self, db):
    #    user_id = crud.get_uservalid_by_email(db=db, email=exist_email).user_id
#
    #    user_api_token = crud.create_or_update_user_api_token(db=db,
    #                                                          user_id=user_id,
    #                                                          api_token_id=,
    #                                                          token_value=)
#
    #    assert user_api_token.token_value == user_id, "Error while create user api token"

        #сделать еще тест для update

    #def test_get_all_api_tokens(self, db):
    #    # с чем сравнить?
    #    # возвращает [<database.models.GoogleUser object at 0x0000022E3CEF9E70>]
    #    all_tokens = crud.get_all_api_tokens(db=db)
    #    print(all_tokens)


    def test_create_virtual_assistant(self, db):
        # проверить еще создание клонированием
        author_id = crud.get_user_by_email(db=db, email=exist_email).id
        virtual_assistant = crud.create_virtual_assistant(db=db,
                                                          cloned_from_id=va_data["cloned_from_id"],
                                                          author_id=author_id,
                                                          source=va_data["source"],
                                                          name=va_data["name"],
                                                          display_name=va_data["display_name"],
                                                          description=va_data["description"]
                                                          )
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        assert va.name == va_data["name"]

    def test_get_virtual_assistant_by_name(self, db):
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        assert va.name == va_data["name"]

    def test_get_virtual_assistant(self, db):
        id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        va = crud.get_virtual_assistant(db=db, id=id)
        assert va.name == va_data["name"]

    def test_get_all_virtual_assistants(self, db):
        all_va = crud.get_all_virtual_assistants(db=db)
        va_names = [va.name for va in all_va]
        print(f'all_va = {va_names}')
        assert va_names[0] == va_data["name"], "Error while get all virtual assistants"

#    def test_get_all_public_virtual_assistants(self, db):
# пока нет разделения на паблик и приват
#        va = crud.get_all_public_virtual_assistants(db=db)
#        assert va.name == va_data["name"]
#
#    def test_get_all_private_virtual_assistants(self, db):
#        va = crud.get_all_private_virtual_assistants(db=db, user_id=)
#        assert va.name == va_data["name"]
#

    def test_create_deployment_from_scratch(self, db):
        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])

        deployment = db.scalar(
            insert(models.Deployment)
                .values(
                virtual_assistant_id=va.id,
                chat_url="chat_url",
                prompt="prompt",
                lm_service_id=None,
            )
                .returning(models.Deployment)
        )
        db.commit()

        assert deployment.virtual_assistant_id == va.id

    def test_create_deployment_from_copy(self, db):
        original_va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
        author_id = crud.get_user_by_email(db=db, email=exist_email).id

        new_va = crud.create_virtual_assistant(db=db,
                                               cloned_from_id=original_va.id,
                                               author_id=author_id,
                                               source=va_data["source"],
                                               name="name2",
                                               display_name="display_name2",
                                               description=va_data["description"]
                                               )

        new_va = crud.get_virtual_assistant_by_name(db=db, name="name2")

        deployment = crud.create_deployment_from_copy(db=db,
                                                      original_virtual_assistant_id=original_va.id,
                                                      new_virtual_assistant_id=new_va.id)
        assert deployment.virtual_assistant_id == new_va.id

    #def test_update_deployment_by_virtual_assistant_name(self, db):
    #    crud.update_deployment_by_virtual_assistant_name(db=db,
    #                                                     name=
    #                                                     )

    def test_get_deployment_by_virtual_assistant_name(self, db):
        va_id = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"]).id
        deployment = crud.get_deployment_by_virtual_assistant_name(db=db, name=va_data["name"])
        assert deployment.virtual_assistant_id == va_id

    def test_get_deployment_prompt_by_virtual_assistant_name(self, db):
        deployment = crud.get_deployment_by_virtual_assistant_name(db=db, name=va_data["name"])
        assert deployment.prompt == "prompt"

    def test_set_deployment_prompt_by_virtual_assistant_name(self, db):
        deployment = crud.set_deployment_prompt_by_virtual_assistant_name(db=db, name=va_data["name"], prompt="prompt2")
        assert deployment.prompt == "prompt2"

    #def test_set_deployment_lm_service_by_virtual_assistant_name(self, db):
    #    deployment = crud.set_deployment_lm_service_by_virtual_assistant_name(db=db,
    #                                                                          name=va_data["name"],
    #                                                                          lm_service_name="lm_service_name")
    #    lm_service = crud.get_lm_service_by_name(db=db, name="lm_service_name")
    #    assert deployment.
#
    #def test_get_deployment_lm_service_by_virtual_assistant_name(self, db):
    #    deployment = crud.get_deployment_lm_service_by_virtual_assistant_name(db=db, name=va_data["name"])
    #    assert deployment.lm_service_id == "lm_service_name"




    #def test_get_all_lm_services(self, db):
    #    all_lm_services = crud.get_all_lm_services(db=db)
#
    #def test_get_lm_service_by_name(self, db):
    #    lm_service = crud.get_lm_service_by_name(db=db, name=)


#    def test_create_dialog_session_by_name(self, db):
#        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
#        dialog_session = crud.create_dialog_session_by_name(db=db, user_id=va.author_id, virtual_assistant_name=va.name)
#        assert dialog_session.user_id == va.author_id


#
#    def test_get_dialog_session(self, db):
#        crud.get_dialog_session(db=db, dialog_session_id=)
#
#    def test_update_dialog_session(self, db):
#        crud.update_dialog_session(db=db, dialog_session_id=, agent_dialog_id=)
#
#
#

#    def test_delete_virtual_assistant_by_name(self, db):
#        crud.delete_virtual_assistant_by_name(db=db, name=va_data["name"])
#        va = crud.get_virtual_assistant_by_name(db=db, name=va_data["name"])
#        assert type(va) == NoneType, "Error while delete va by name"
#
#
#    def test_set_users_refresh_token_invalid(self, db):
#        crud.set_users_refresh_token_invalid(db=db, refresh_token=refresh_token)
#        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
#        assert type(uservalid) == NoneType, "Error while set users refresh token_invalid"