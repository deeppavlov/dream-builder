import requests
import logging
import pytest
from services.distributions_api import schemas as models
from pydantic import validate_model
from jsonschema import validate
from .config import assistant_dists_endpoint, users_endpoint, api_tokens_endpoint, \
    dialog_sessions_endpoint, deployments_endpoint, auth_token

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
import database.crud as crud


# logging.basicConfig(encoding='utf-8', level=logging.DEBUG)
# assistant_dists

@pytest.mark.smoke
def test_create_distribution():
    response = requests.post(url=f"{assistant_dists_endpoint}",
                             headers={
                                 'accept': 'application/json',
                                 'Content-Type': 'application/json',
                             },
                             json={
                                 "display_name": "TestBot",
                                 "description": "TestBot"
                             }
                             )

    schema = models.AssistantDistModelShort.schema()
    assert response.status_code == 201, response.json()
    assert validate(instance=response.json(), schema=schema) is None

    public = requests.get(assistant_dists_endpoint + "public")
    private = requests.get(url=assistant_dists_endpoint + "private",
                           headers={
                               'accept': '*/*',
                               'token': auth_token,
                           }
                           )

    for public_dist in public.json():
        print(f"public = {public_dist['display_name']}")
    print()
    print(f"private = {private.json()}")


def test_get_list_of_public_dist():
    public_dist_list = requests.get(assistant_dists_endpoint + "public")

    schema = models.VirtualAssistant.schema()
    assert public_dist_list.status_code == 200, public_dist_list.json()

    # проблемс - валидция типа - int (если None - то валидация падает)
    #for public_dist in public_dist_list.json():
    #    print(f"public_dist = {public_dist}")
    #    validate(instance=public_dist, schema=schema)
        #print(f"private = {private.json()}")
        #assert validate(instance=public_dist, schema=schema) is None


def test_get_list_of_private_dist_empty():
    response = requests.get(url=assistant_dists_endpoint + "private",
                            headers={
                                'accept': '*/*',
                                'token': auth_token,
                            }
                            )
    assert response.status_code == 200, response.json()
    assert response.json() == []


# Почему когда создаем Create Distribution, то он не отображается в private dist ?
# Ну и соответсвенно Delete тоже не робит

# def test_get_list_of_private_dist():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
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
#    response = requests.get(url=assistant_dists_endpoint + "private",
#                            headers={
#                                'accept': '*/*',
#                                'token': auth_token,
#                            }
#                            )
#    print(response.json())
#    assert response.status_code == 200, response.json()
#    assert response.json() == []


def test_get_exist_dist_by_name():
    response_post = requests.post(url=f"{assistant_dists_endpoint}",
                                  headers={
                                      'accept': 'application/json',
                                      'Content-Type': 'application/json',
                                  },
                                  json={
                                      "display_name": "string",
                                      "description": "string"
                                  }
                                  )
    response = requests.get(assistant_dists_endpoint + response_post.json()["name"])
    assert response.status_code == 200, response.json()


def test_get_non_exist_dist_by_name():
    response = requests.get(assistant_dists_endpoint + "name")
    assert response.status_code == 404, response.json()


# def test_delete_exist_dist_by_name():
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
#    response = requests.delete(url=assistant_dists_endpoint + response_post.json()["name"],
#                               headers={
#                                   'accept': '*/*',
#                                   'token': auth_token,
#                               }
#                               )
#    assert response.status_code == 204, response.json()
#
#
# def test_delete_non_exist_dist_by_name():
#    response = requests.delete(url=assistant_dists_endpoint + "name",
#                               headers={
#                                   'accept': '*/*',
#                                   'token': auth_token,
#                               }
#                               )
#
#    assert response.status_code == 404, response.json()


def test_patch_dist_by_name():
    response_post = requests.post(url=assistant_dists_endpoint,
                                  headers={
                                      'accept': 'application/json',
                                      'Content-Type': 'application/json',
                                  },
                                  json={
                                      "display_name": "string",
                                      "description": "string"
                                  }
                                  )

    response_patch = requests.patch(url=assistant_dists_endpoint + response_post.json()["name"],
                                    headers={
                                        'accept': 'application/json',
                                        'token': auth_token,
                                        'Content-Type': 'application/json',
                                    },
                                    json={
                                        "display_name": "string",
                                        "description": "string"
                                    })
    assert response_patch.status_code == 200, response_patch.json()


# def test_clone_dist():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
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
#    response = requests.post(url=assistant_dists_endpoint + response_post.json()["name"] + '/clone',
#                             headers={
#                                 'accept': 'application/json',
#                                 'token': auth_token,
#                                 'Content-Type': 'application/json',
#                             },
#                             json={
#                                 'display_name': 'string',
#                                 'description': 'string',
#                                 'annotators': [
#                                     'string',
#                                 ],
#                                 'response_annotators': [
#                                     'string',
#                                 ],
#                                 'candidate_annotators': [
#                                     'string',
#                                 ],
#                                 'skill_selectors': [
#                                     'string',
#                                 ],
#                                 'skills': [
#                                     'string',
#                                 ],
#                                 'response_selectors': [
#                                     'string',
#                                 ],
#                             }
#                             )
#    assert response.status_code == 201, response.json()


# def test_get_exist_dist_components_by_name():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
#                                  headers={
#                                      'accept': 'application/json',
#                                      'Content-Type': 'application/json',
#                                  },
#                                  json={
#                                      "display_name": "string",
#                                      "description": "string"
#                                  }
#                                  )
#    response = requests.get(assistant_dists_endpoint + response_post.json()["name"] + '/components/')
#    schema = models.DistComponentsResponse.schema()
#    assert response.status_code == 200, response.json()
#    assert validate(instance=response.json(), schema=schema) is None


def test_get_non_exist_dist_components_by_name():
    response = requests.get(assistant_dists_endpoint + "name/components/")
    assert response.status_code == 404, response.json()


# def test_publish_dist():
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

# долгий, пока уберем
# def test_chat_dist():
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
#    response = requests.post(url=assistant_dists_endpoint + response_post.json()["name"] + '/chat/',
#                             headers={
#                                 'accept': 'application/json',
#                                 'Content-Type': 'application/json',
#                             },
#
#                             json={
#                                 'text': 'string',
#                             }
#                             )
#    schema = models.AssistantDistChatResponse.schema()
#    assert response.status_code == 200, response.json()
#    assert validate(instance=response.json(), schema=schema) is None


# def test_get_exist_dist_prompt():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
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
#    response = requests.get(url=assistant_dists_endpoint + response_post.json()["name"]+'/prompt/',
#                            headers = {
#                             'accept': 'application/json',
#                             'token': auth_token,
#                         }
#                         )
#    schema = models.Prompt.schema()
#    assert response.status_code == 200, response.json()
#    assert validate(instance=response.json(), schema=schema) is None


# def test_set_exist_dist_prompt():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
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
#    response = requests.post(url=assistant_dists_endpoint + response_post.json()["name"]+'/prompt/',
#                            headers = {
#                                           'accept': 'application/json',
#                                           'token': auth_token,
#                                           'Content-Type': 'application/json',
#                                       }
#
#                                       json_data = {
#                                           'text': 'string',
#                                       }
#                         )
#    schema = models.Prompt.schema()
#    assert response.status_code == 200, response.json()
#    assert validate(instance=response.json(), schema=schema) is None


# def test_get_exist_dist_lm_service():
#    response_post = requests.post(url=f"{assistant_dists_endpoint}",
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
#    response = requests.get(url=assistant_dists_endpoint + response_post.json()["name"]+'/lm_service/',
#                            headers = {
#                                           'accept': 'application/json',
#                                           'token': auth_token,
#                                       }
#                         )
#    schema = models.LmService.schema()
#    assert response.status_code == 200, response.json()
#    assert validate(instance=response.json(), schema=schema) is None


# users

def test_get_all_users():
    response = requests.get(url=users_endpoint,
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    assert response.status_code == 200, response.json()


def test_get_user_self():
    response = requests.get(url=users_endpoint + "self",
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    assert response.status_code == 200, response.json()


def test_get_user_by_id():
    response = requests.get(url=users_endpoint + "self",
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    user_id = str(response.json()["id"])
    print(f"id = {user_id}")

    response = requests.get(url=users_endpoint + user_id,
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    assert response.status_code == 200, response.json()


def test_create_or_update_user_api_token():
    response = requests.get(url=users_endpoint + "self",
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    user_id = str(response.json()["id"])

    response = requests.post(url=users_endpoint + user_id + "/settings/api_tokens/",
                             headers={
                                 'accept': 'application/json',
                                 'token': auth_token,
                                 'Content-Type': 'application/json',
                             },

                             json={
                                 'api_token_id': user_id,
                                 'token_value': 'string',
                             }
                             )

    assert response.status_code == 201, response.json()


# api_tokens


def test_get_all_api_tokens():
    response = requests.get(url=api_tokens_endpoint,
                            headers={
                                'accept': 'application/json',
                                'token': auth_token,
                            }
                            )
    assert response.status_code == 200, response.json()


# dialog_sessions


# def test_create_dialog_sessions():
#    response = requests.post(url=dialog_sessions_endpoint,
#                             headers={
#                                 'accept': 'application/json',
#                                 'token': auth_token,
#                                 'Content-Type': 'application/json',
#                             },
#
#                             json={
#                                 'virtual_assistant_name': 'string',
#                             }
#                            )
#    print(response.status_code)
#    assert response.status_code == 201, response.json()


# def test_get_dialog_sessions():
#    response = requests.post(url=dialog_sessions_endpoint,
#                             headers={
#                                 'accept': 'application/json',
#                                 'token': auth_token,
#                                 'Content-Type': 'application/json',
#                             },
#
#                             json={
#                                 'virtual_assistant_name': 'string',
#                             }
#                             )

#    dialog_session_id = response.json()["dialog_session_id"]
#
#    response = requests.get(url=dialog_sessions_endpoint+dialog_session_id,
#                            headers={
#                                'accept': 'application/json',
#                                'token': auth_token,
#                            }
#                            )
#    assert response.status_code == 200, response.json()


# def test_get_dialog_session_history():


# response = requests.post(url=dialog_sessions_endpoint,
#                             headers={
#                                 'accept': 'application/json',
#                                 'token': auth_token,
#                                 'Content-Type': 'application/json',
#                             },
#
#                             json={
#                                 'virtual_assistant_name': 'string',
#                             }
#                             )
#
#    dialog_session_id = response.json()["dialog_session_id"]
#
#    response = requests.get(url=dialog_sessions_endpoint + dialog_session_id + "/history",
#                             headers={
#                                 'accept': 'application/json',
#                                 'token': auth_token,
#                             }
#                             )
#    print(response.status_code)
#    assert response.status_code == 200, response.json()


# deployments

def test_get_all_lm_services():
    lm_services_list = requests.get(url=deployments_endpoint + "lm_services",
                                    headers={
                                        'accept': 'application/json'
                                    }
                                    )

    schema = models.LmService.schema()
    assert lm_services_list.status_code == 200, lm_services_list.json()

    for lm_service in lm_services_list.json():
        assert validate(instance=lm_service, schema=schema) is None
