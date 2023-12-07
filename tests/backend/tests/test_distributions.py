import time
import pytest
from qaseio.pytest import qase
from tests.backend.config import (
    va_data,
    public_va_names_en,
    public_va_names_visible_en,
    public_va_names_ru,
    lm_service_id_en_list,
    lm_service_id_ru_list,
    counter_distributions as counter,
)
from tests.backend.distributions_methods import UserMethods, AdminMethods


class TestDistributions:

    # ASSISTANTS_DISTS

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_create_ru_assistant")
    def test_create_ru_assistant(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(name=display_name, language="ru")["name"]

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_create_en_assistant")
    def test_create_en_assistant(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(name=display_name, language="en")["name"]

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_list_of_public_va")
    def test_get_list_of_public_va(self, user):
        user.get_list_of_public_va()

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_list_of_your_va")
    def test_get_list_of_your_a(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_list_of_private_va(name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_your_va_by_name")
    def test_get_your_va_by_name(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_public_va_by_name")
    def test_get_public_va_by_name(self, user):
        name = public_va_names_en[0]
        user.get_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_delete_your_va_by_name")
    def test_delete_your_va_by_name(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]

        user.delete_va_by_name(name)
        user.get_va_by_name_non_exist(name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_patch_your_va_by_name")
    def test_patch_your_va_by_name(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.patch_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.parametrize("va_name", [public_va_names_visible_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_clone_public_va_smoke")
    def test_clone_public_va_smoke(self, user, va_name):
        display_name = va_name
        name = user.clone_va(display_name)["name"]
        user.check_language_inheritance(display_name, name)

    @pytest.mark.regression
    @pytest.mark.parametrize("va_name", [*public_va_names_visible_en, *public_va_names_ru])
    @qase.title(f"{counter()}. test_clone_public_va")
    def test_clone_public_va(self, user, va_name):
        display_name = va_name
        name = user.clone_va(display_name)["name"]
        user.check_language_inheritance(display_name, name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_clone_created_from_scratch_ru_va")
    def test_clone_created_from_scratch_ru_va(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(name=display_name, language="ru")["name"]
        clone_name = user.clone_va(name)["name"]
        user.check_language_inheritance(name, clone_name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_clone_created_from_scratch_en_va")
    def test_clone_created_from_scratch_en_va(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(name=display_name, language="en")["name"]
        clone_name = user.clone_va(name)["name"]
        user.check_language_inheritance(name, clone_name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_clone_edited_va")
    def test_clone_edited_va(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        clone_name = user.clone_va(name)["name"]

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_after_cloning_delete_initial_va")
    def test_after_cloning_delete_initial_va(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        clone_name = user.clone_va(name)["name"]

    # VA COMPONENTS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_public_va_components_by_name")
    def test_get_public_va_components_by_name(self, user):
        name = public_va_names_en[0]
        user.get_va_components(name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_created_from_scratch_va_components_by_name")
    def test_get_created_from_scratch_va_components_by_name(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_components(name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_cloned_va_components_by_name")
    def test_get_cloned_va_components_by_name(self, user):
        display_name = public_va_names_en[0]
        name = user.clone_va(display_name)["name"]
        user.get_va_components(name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_add_cloned_va_component")
    def test_add_cloned_va_component(self, user):
        display_name = public_va_names_en[0]
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_add_created_from_scratch_va_component")
    def test_add_created_from_scratch_va_component(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)

        component_list = user.get_va_components(name)
        user.get_component_in_component_list(component_list, component_id)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_delete_cloned_va_component")
    def test_delete_cloned_va_component(self, user):
        display_name = public_va_names_en[0]
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)

        component_list = user.get_va_components(name)
        user.get_component_not_exist_in_component_list(component_list, va_component_id)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_delete_created_from_scratch_va_component")
    def test_delete_created_from_scratch_va_component(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_patch_cloned_va_component")
    def test_patch_cloned_va_component(self, user):
        display_name = public_va_names_en[0]
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        user.patch_va_component(name, component_id)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_patch_created_from_scratch_va_component")
    def test_patch_created_from_scratch_va_component(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        user.patch_va_component(name, component_id)

    # PUBLISH

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_publish_dist_unlisted")
    def test_publish_dist_unlisted(self, user):
        visibility = "UNLISTED_INVITATION"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        user.delete_va_by_name(name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_publish_dist_private")
    def test_publish_dist_private(self, user):
        visibility = "PRIVATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_publish_dist_public_template")
    def test_publish_dist_public_template(self, user):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        user.delete_va_by_name(name)

    # COMPONENTS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_list_of_components")
    def test_get_list_of_components(self, user):
        user.get_list_of_components()

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_create_get_patch_delete_component")
    def test_create_get_patch_delete_component(self, user):
        component_id = user.create_component()["id"]
        user.get_component(component_id)
        user.patch_component(component_id)
        user.delete_component(component_id)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_list_of_group_components")
    def test_get_list_of_group_components(self, user):
        group_name = "Generative"
        user.get_list_of_group_components(group_name)

    # USERS

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_users")
    def test_get_all_users(self, admin):
        admin.get_all_users()

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_user_self, user")
    def test_get_user_self(self, user):
        user.get_user_self()

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_user_by_id")
    def test_get_user_by_id(self, user):
        user_id = str(user.get_user_self()["id"])
        user.get_user_by_id(user_id)

    # API_TOKENS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_api_keys")
    def test_get_all_api_keys(self, user):
        user.get_all_api_keys()

    # DIALOG_SESSIONS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_create_dialog_sessions_with_not_deployed_created_from_scratch_va")
    def test_create_dialog_sessions_with_not_deployed_created_from_scratch_va(self, user):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.create_dialog_sessions_not_deployed(name)

    @pytest.mark.smoke
    @pytest.mark.parametrize("va_name", [public_va_names_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_va__not_required_token_unauthorized_smoke")
    def test_get_dialog_session_history_with_public_va__not_required_token_unauthorized_smoke(self, user, va_name):
        user = UserMethods("1")
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

    # @pytest.mark.regression
    # @pytest.mark.parametrize("va_name", [*public_va_names_en, *public_va_names_ru])
    # @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_template_va_unauthorized")
    # def test_get_dialog_session_history_with_public_template_va_unauthorized(self, user, va_name):
    #    user = UserMethods("1")
    #    dialog_session_id = user.create_dialog_sessions(va_name)["id"]
    #    user.send_dialog_session_message(dialog_session_id)
    #    user.get_dialog_session_history(dialog_session_id)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @pytest.mark.parametrize("va_name", [*public_va_names_en, *public_va_names_ru])
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_template_va")
    def test_get_dialog_session_history_with_public_template_va(self, user, va_name):
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", lm_service_id_en_list)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_universal_prompted_assistant_on_various_en_lm")
    def test_get_dialog_session_history_with_universal_prompted_assistant_on_various_en_lm(self, user, lm_service_id):
        va_name = "universal_prompted_assistant"
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", lm_service_id_ru_list)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_universal_prompted_assistant_on_various_ru_lm")
    def test_get_dialog_session_history_with_universal_prompted_assistant_on_various_ru_lm(self, user, lm_service_id):
        va_name = "universal_prompted_assistant"
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_russian_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @qase.title(f"{counter()}. test_build_assistant_smoke")
    def test_build_assistant_smoke(self, user, lm_service_id=2):
        name = f"assistant_lm_service_id_{lm_service_id}"
        va_name = user.create_virtual_assistant(name)["name"]
        default_component = user.get_va_components(va_name)["skills"]
        for component in default_component:
            if component["component_type"] == "Generative":
                component_id = component["component_id"]
                user.patch_component(
                    component_id=component_id,
                    lm_service_id=lm_service_id,
                    prompt="TASK:  You are a chatbot that can only answers questions below. "
                           "FAQ: What is your name? My name is Paul.",
                )
        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)
        #user.delete_va_by_name(va_name)

    #@pytest.mark.atom
    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", lm_service_id_en_list)
    @qase.title(f"{counter()}. test_build_assistant_on_various_lm_en")
    def test_build_assistant_on_various_lm_en(self, user, lm_service_id):
        name = f"assistant_lm_service_id_{lm_service_id}"
        va_name = user.create_virtual_assistant(name)["name"]
        default_component = user.get_va_components(va_name)["skills"]

        for component in default_component:
            if component["component_type"] == "Generative":
                component_id = component["component_id"]
                user.patch_component(
                    component_id=component_id,
                    lm_service_id=lm_service_id,
                    prompt="TASK:  You are a chatbot that can only answers questions below. "
                           "FAQ: What is your name? My name is Paul.",
                )

        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_va_by_name(va_name)

    #@pytest.mark.atom
    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", lm_service_id_ru_list)
    @qase.title(f"{counter()}. test_build_assistant_on_various_lm_ru")
    def test_build_assistant_on_various_lm_ru(self, user, lm_service_id):
        assistant_name = f"assistant_lm_service_id_{lm_service_id}"
        va_name = user.create_virtual_assistant(name=assistant_name, language="ru")["name"]
        default_component = user.get_va_components(va_name)["skills"]

        for component in default_component:
            if component["component_type"] == "Generative":
                component_id = component["component_id"]
                user.patch_component(
                    component_id=component_id,
                    lm_service_id=lm_service_id,
                    prompt="""Вы — чат-бот, который может отвечать только на 
                                     часто задаваемые вопросы об ИИ. 
                ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ: 
                Что такое умный дом? Умный дом — это как личный помощник для вашего дома. Это 
                система устройств и приборов, которыми можно управлять дистанционно и запрограммировать на 
                автоматическое выполнение задач. Например, вы можете использовать свой смартфон, чтобы включить свет, 
                отрегулировать термостат или запустить кофеварку еще до того, как встанете с постели. 
                ИНСТРУКЦИЯ: 
                Человек вступает в разговор и начинает задавать вопросы. Сгенерируйте ответ на основе списка часто 
                задаваемых вопросов.""",
                )
        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_russian_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_va_by_name(va_name)

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_created_from_scratch_va")
    def test_get_dialog_session_history_with_created_from_scratch_va(self, user):
        name = va_data["name"]
        va_name = user.create_virtual_assistant(name)["name"]
        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_va_by_name(va_name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_cloned_va")
    def test_get_dialog_session_history_with_cloned_va(self, user):
        name = public_va_names_en[0]
        va_name = user.create_virtual_assistant(name)["name"]
        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_va_by_name(va_name)

    # LM_SERVICES

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_lm_services")
    def test_get_all_lm_services(self, user):
        user.get_all_lm_services()

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_lm_services_en")
    def test_get_all_lm_services_en(self, user):
        user.get_all_lm_services_for_language("en")

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_lm_services_ru")
    def test_get_all_lm_services_ru(self, user):
        user.get_all_lm_services_for_language("ru")

    # DEPLOYMENTS

    # @qase.title(f"{counter()}. test_get_stacks")
    # def test_get_stacks(self, user):
    #    user = userMethods(auth_token)
    #    user.get_stacks()

    # @qase.title(f"{counter()}. test_get_stack_ports")
    # def test_get_stack_ports(self, user):
    #    user = userMethods(auth_token)
    #    user.get_stack_ports()

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_create_get_patch_delete_deployment")
    def test_create_get_patch_delete_deployment(self, user):
        name = va_data["name"]
        va_name = user.create_virtual_assistant(name)["name"]

        deployment = user.create_deployment(va_name)
        time.sleep(60)
        deployment_id = deployment["id"]
        user.patch_deployment(deployment_id)
        time.sleep(60)
        user.delete_deployment(deployment_id)
        user.get_deployment_non_exists(deployment_id)

        user.delete_va_by_name(va_name)

    # ADMIN

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_all_publish_requests")
    def test_get_all_publish_requests(self, user, admin):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin.get_all_publish_requests()

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_get_unreviewed_publish_requests")
    def test_get_get_unreviewed_publish_requests(self, user, admin):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin.get_all_publish_requests()

        user.delete_va_by_name(name)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_confirm_publish_request")
    def test_confirm_publish_request(self, user, admin):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.confirm_publish_request(publish_request_id)

        user.delete_va_by_name(name)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_decline_publish_request")
    def test_decline_publish_request(self, user, admin):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.decline_publish_request(publish_request_id)

        user.delete_va_by_name(name)

    # PERMISSIONS

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_patch_clone_publish_delete")
    def test_non_owner_cannot_access_private_assistant_get_patch_clone_publish_delete(self, user, user2):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]

        user2.get_va_by_name_no_access(name)
        user2.clone_va_no_access(name)
        user2.patch_va_by_name_no_access(name)
        user2.publish_va_no_access(name, visibility="PUBLIC_TEMPLATE")
        user2.delete_va_by_name_no_access(name)

    # @pytest.mark.atom
    # @pytest.mark.regression
    # @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_add_patch_delete_components")
    # def test_non_owner_cannot_access_private_assistant_get_add_patch_delete_components(self, user):
    #    display_name = va_data["name"]
    #    user = userMethods(auth_token_user)
    #    name = user.create_virtual_assistant(display_name)["name"]
    #    skills = user.get_va_components(name)["skills"]
    #    component_id = [skill["id"] for skill in skills if skill["component_type"] == "Generative"][0]
    #    user.patch_va_component(name, component_id)
    #    user2 = userMethods(auth_token_user2)
    #    user2.get_va_components_no_access(name)
    #    user2.add_va_component_no_access(name, component_id)
    #    user2.patch_va_component_no_access(name, component_id)
    #    user2.delete_va_component_no_access(name, component_id)
    #    user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_can_access_unlisted_assistant")
    def test_non_owner_non_auth_can_access_unlisted_assistant(self, user, user2):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, "UNLISTED_LINK")
        user.create_deployment(name)
        time.sleep(60)

        user2 = UserMethods("1")
        dialog_session_id = user2.create_dialog_sessions(name)["id"]
        user2.send_dialog_session_message(dialog_session_id)
        user2.get_dialog_session_history(dialog_session_id)

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_can_access_public_template_assistant")
    def test_non_owner_can_access_public_template_assistant(self, user, user2, admin):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, "PUBLIC_TEMPLATE")
        user.create_deployment(name)
        time.sleep(60)

        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.confirm_publish_request(publish_request_id)

        user2.get_va_by_name(name)
        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_patch_delete_deployment")
    def test_non_owner_cannot_access_private_assistant_get_patch_delete_deployment(self, user, user2):
        display_name = va_data["name"]

        name = user.create_virtual_assistant(display_name)["name"]
        deployment_id = user.create_deployment(name)["id"]
        time.sleep(60)
        task_id = user.get_deployment(deployment_id)

        user2.get_deployment_no_access(deployment_id)
        user2.patch_deployment_no_access(deployment_id, task_id)
        user2.delete_deployment_no_access(deployment_id)
        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_dialog_session")
    def test_non_owner_cannot_access_private_assistant_dialog_session(self, user, user2):
        display_name = va_data["name"]
        name = user.create_virtual_assistant(display_name)["name"]
        deployment_id = user.create_deployment(name)["id"]
        time.sleep(60)
        dialog_session_id = user.create_dialog_sessions(name)["id"]
        user.send_dialog_session_message(dialog_session_id)

        user2.get_dialog_sessions_no_access(dialog_session_id)
        user2.send_dialog_session_message_no_access(dialog_session_id)
        user2.get_dialog_session_history_no_access(dialog_session_id)
        user2.create_dialog_sessions_no_access(name)
        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_admin_cannot_get_confirm_decline_publish_request")
    def test_non_admin_cannot_get_confirm_decline_publish_request(self, user, user2, admin):
        visibility = "PUBLIC_TEMPLATE"
        display_name = va_data["name"]

        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]

        user2.get_all_publish_requests_no_access()
        user2.confirm_publish_request_no_access(publish_request_id)
        user2.confirm_publish_request_no_access(publish_request_id)
        user2.decline_publish_request_no_access(publish_request_id)

        user.delete_va_by_name(name)

    ##@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_unauth_user_cannot_access_someone_else_dialog_session_with_public_template")
    def test_unauth_user_cannot_access_someone_else_dialog_session_with_public_template(self, user, unauth_user):
        va_name = public_va_names_en[0]

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)

        unauth_user.get_dialog_sessions_no_access(dialog_session_id)
        unauth_user.send_dialog_session_message_no_access(dialog_session_id)
        unauth_user.get_dialog_session_history_no_access(dialog_session_id)

    ##@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_non_owner_cannot_access_someone_else_dialog_session_with_public_template")
    def test_non_owner_cannot_access_someone_else_dialog_session_with_public_template(self, user, user2):
        va_name = public_va_names_en[0]

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)

        user2.get_dialog_sessions_no_access(dialog_session_id)
        user2.send_dialog_session_message_no_access(dialog_session_id)
        user2.get_dialog_session_history_no_access(dialog_session_id)

    ##@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_unauth_user_can_access_someone_else_unauth_dialog_session_with_public_template")
    def test_unauth_user_can_access_someone_else_unauth_dialog_session_with_public_template(self, unauth_user):
        va_name = public_va_names_en[0]
        unauth_user2 = UserMethods("", "")

        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message(dialog_session_id)

        #unauth_user2.get_dialog_sessions_no_access(dialog_session_id)
        #unauth_user2.send_dialog_session_message_no_access(dialog_session_id)
        #unauth_user2.get_dialog_session_history_no_access(dialog_session_id)

        unauth_user2.get_dialog_sessions(dialog_session_id)
        unauth_user2.send_dialog_session_message(dialog_session_id)
        unauth_user2.get_dialog_session_history(dialog_session_id)


    #blah
    #bla http
    #blah

    #@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_create_ru_assistant")
    def test_wo_token_create_ru_assistant(self, unauth_user):
        display_name = va_data["name"]
        unauth_user.create_virtual_assistant(name=display_name, language="ru", status_code=400)

    #@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_create_en_assistant")
    def test_wo_token_create_en_assistant(self, unauth_user):
        display_name = va_data["name"]
        unauth_user.create_virtual_assistant(name=display_name, language="en", status_code=400)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_list_of_public_va")
    def test_wo_token_get_list_of_public_va(self, unauth_user):
        unauth_user.get_list_of_public_va()

    #@pytest.mark.atom
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_list_of_your_va")
    def test_wo_token_get_list_of_your_a(self, unauth_user):
        unauth_user.get_list_of_private_va(public_va_names_en[0], status_code=400)

    #@pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_public_va_by_name")
    def test_wo_token_get_public_va_by_name(self, unauth_user):
        name = public_va_names_en[0]
        unauth_user.get_va_by_name(name)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_delete_your_va_by_name")
    def test_wo_token_delete_your_va_by_name(self, unauth_user):
        unauth_user.delete_va_by_name(public_va_names_en[0], status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_patch_your_va_by_name")
    def test_wo_token_patch_your_va_by_name(self, unauth_user):
        unauth_user.patch_va_by_name(public_va_names_en[0], status_code=400)

    # @pytest.mark.atom
    @pytest.mark.smoke
    @pytest.mark.parametrize("va_name", [public_va_names_visible_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_wo_token_clone_public_va_smoke")
    def test_wo_token_clone_public_va_smoke(self, unauth_user, va_name):
        display_name = va_name
        unauth_user.clone_va(display_name, status_code=400)

    # VA COMPONENTS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_public_va_components_by_name")
    def test_wo_token_get_public_va_components_by_name(self, unauth_user):
        unauth_user.get_va_components(public_va_names_en[0])

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_create_from_scratch_va_component")
    def test_wo_token_create_from_scratch_va_component(self, unauth_user):
        unauth_user.create_component(status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_delete_va_component")
    def test_wo_token_delete_va_component(self, unauth_user):
        unauth_user.delete_va_component(public_va_names_en[0], 188, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_patch_cloned_va_component")
    def test_wo_token_patch_cloned_va_component(self, user):
        user.patch_va_component(public_va_names_en[0], 188, status_code=400)

    # PUBLISH

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_publish_dist_unlisted")
    def test_wo_token_publish_dist_unlisted(self, unauth_user):
        visibility = "UNLISTED_INVITATION"
        unauth_user.publish_va(public_va_names_en[0], visibility, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_publish_dist_private")
    def test_wo_token_publish_dist_private(self, unauth_user):
        visibility = "PRIVATE"
        unauth_user.publish_va(public_va_names_en[0], visibility, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_publish_dist_public_template")
    def test_wo_token_publish_dist_public_template(self, unauth_user):
        visibility = "PUBLIC_TEMPLATE"
        unauth_user.publish_va(public_va_names_en[0], visibility, status_code=400)

    # COMPONENTS

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_list_of_components")
    def test_wo_token_get_list_of_components(self, unauth_user):
        unauth_user.get_list_of_components()

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_component")
    def test_wo_token_create_get_patch_delete_component(self, unauth_user):
        component_id = 188
        unauth_user.create_component(status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_patch_component")
    def test_wo_token_patch_component(self, unauth_user):
        component_id = 188
        unauth_user.patch_component(component_id, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_delete_component")
    def test_wo_token_delete_component(self, unauth_user):
        component_id = 188
        unauth_user.delete_component(component_id, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_list_of_group_components")
    def test_wo_token_get_list_of_group_components(self, unauth_user):
        group_name = "Generative"
        unauth_user.get_list_of_group_components(group_name)

    # USERS

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_user_self")
    def test_wo_token_get_user_self(self, unauth_user):
        unauth_user.get_user_self()

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_user_by_id")
    def test_wo_token_get_user_self(self, unauth_user):
        unauth_user.get_user_self(status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_user_by_id")
    def test_wo_token_get_user_by_id(self, unauth_user):
        unauth_user.get_user_by_id("1", status_code=200)

    # API_TOKENS

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_all_api_keys")
    def test_wo_token_get_all_api_keys(self, unauth_user):
        unauth_user.get_all_api_keys()

    # DIALOG_SESSIONS

    @pytest.mark.smoke
    @pytest.mark.parametrize("va_name", [public_va_names_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_wo_token_get_dialog_session_history_with_public_va_not_required_token_smoke")
    def test_wo_token_get_dialog_session_history_with_public_va_not_required_token_smoke(self, unauth_user, va_name):
        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message(dialog_session_id)
        unauth_user.get_dialog_session_history(dialog_session_id)

    @pytest.mark.atom
    @pytest.mark.regression
    @pytest.mark.parametrize("va_name", [public_va_names_en[1], public_va_names_en[-1]])
    @qase.title(f"{counter()}. test_wo_token_empty_openai_dialog_with_public_template_va_dummy_response")
    def test_wo_token_empty_openai_dialog_with_public_template_va_dummy_response(self, unauth_user, va_name):
        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message(dialog_session_id, openai_api_key="")
        unauth_user.get_dialog_session_history(dialog_session_id)

    @pytest.mark.atom
    @pytest.mark.regression
    @pytest.mark.parametrize("va_name", [public_va_names_en[1], public_va_names_en[-1]])
    @qase.title(f"{counter()}. test_wo_token_invalid_openai_dialog_with_public_template_va_dummy_response")
    def test_wo_token_invalid_openai_dialog_with_public_template_va_dummy_response(self, unauth_user, va_name):
        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message(dialog_session_id, openai_api_key="string")
        unauth_user.get_dialog_session_history(dialog_session_id)

    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", [5])
    @qase.title(f"{counter()}. test_wo_token_empty_openai_dialog_with_universal_prompted_assistant_dummy_response")
    def test_wo_token_empty_openai_dialog_with_universal_prompted_assistant_dummy_response(
            self, unauth_user, lm_service_id):
        va_name = "universal_prompted_assistant"
        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id, openai_api_key="")
        unauth_user.get_dialog_session_history(dialog_session_id)

    @pytest.mark.regression
    @pytest.mark.parametrize("lm_service_id", [5])
    @qase.title(f"{counter()}. test_wo_token_invalid_openai_dialog_with_universal_prompted_assistant_dummy_response")
    def test_wo_token_invalid_openai_dialog_with_universal_prompted_assistant_dummy_response(
            self, unauth_user, lm_service_id):
        va_name = "universal_prompted_assistant"
        dialog_session_id = unauth_user.create_dialog_sessions(va_name)["id"]
        unauth_user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id, openai_api_key="string")
        unauth_user.get_dialog_session_history(dialog_session_id)

    # DEPLOYMENT

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_build_assistant")
    def test_wo_token_build_assistant(self, unauth_user):
        unauth_user.create_deployment(public_va_names_en[0], status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_deployment")
    def test_wo_token_get_deployment(self, unauth_user):
        unauth_user.get_deployment(1)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_patch_deployment")
    def test_wo_token_patch_deployment(self, unauth_user):
        unauth_user.patch_deployment(1, status_code=400)

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_delete_deployment")
    def test_wo_token_delete_deployment(self, unauth_user):
        unauth_user.delete_deployment(1, status_code=400)

    # LM_SERVICES

    @pytest.mark.smoke
    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_all_lm_services")
    def test_wo_token_get_all_lm_services(self, unauth_user):
        unauth_user.get_all_lm_services()

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_all_lm_services_en")
    def test_wo_token_get_all_lm_services_en(self, unauth_user):
        unauth_user.get_all_lm_services_for_language("en")

    @pytest.mark.regression
    @qase.title(f"{counter()}. test_wo_token_get_all_lm_services_ru")
    def test_wo_token_get_all_lm_services_ru(self, unauth_user):
        unauth_user.get_all_lm_services_for_language("ru")
