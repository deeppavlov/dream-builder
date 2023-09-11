import time
import pytest
from qaseio.pytest import qase
from .config import (
    va_data,
    public_va_names_en,
    public_va_names_ru,
    lm_service_id_list,
    lm_service_id_russian_list,
    auth_token_user1,
    auth_token_user2,
    auth_token,
    test_token_github,

    counter_distributions as counter
)
from .distributions_methods import (
    UserMethods,
    AdminMethods
)


class TestDistributions:

    # ASSISTANTS_DISTS

    @pytest.mark.atom
    @qase.title(f"{counter()}. test_create_ru_assistant")
    def test_create_ru_assistant(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token='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', auth_type='github')
        name = user.create_virtual_assistant(name=display_name, language="ru")["name"]

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_create_en_assistant")
    def test_create_en_assistant(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(name=display_name, language="en")["name"]

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_get_list_of_public_va")
    def test_get_list_of_public_va(self):
        user = UserMethods(auth_token_user1)
        user.get_list_of_public_va()

    @qase.title(f"{counter()}. test_get_list_of_your_va")
    def test_get_list_of_your_a(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_list_of_private_va(name)

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_get_your_va_by_name")
    def test_get_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_by_name(name)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_get_public_va_by_name")
    def test_get_public_va_by_name(self):
        name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        user.get_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_delete_your_va_by_name")
    def test_delete_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]

        user.delete_va_by_name(name)
        user.get_va_by_name_non_exist(name)

    @qase.title(f"{counter()}. test_patch_your_va_by_name")
    def test_patch_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.patch_va_by_name(name)

        user.delete_va_by_name(name)

    #@pytest.mark.atom
    @pytest.mark.parametrize('va_name', [public_va_names_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_clone_public_va")
    def test_clone_public_va(self, va_name):
        display_name = va_name
        user = UserMethods(auth_token_user1)
        name = user.clone_va(display_name)["name"]

        user.check_language_inheritance(display_name, name)

        user.delete_va_by_name(name)

    #@pytest.mark.atom
    @qase.title(f"{counter()}. test_clone_created_from_scratch_ru_va")
    def test_clone_created_from_scratch_ru_va(self):
        display_name = va_data["name"]
        language = "ru"
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(name=display_name, language="ru")["name"]
        clone_name = user.clone_va(name)["name"]

        user.check_language_inheritance(name, clone_name)

        user.delete_va_by_name(name)
        user.delete_va_by_name(clone_name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_clone_created_from_scratch_en_va")
    def test_clone_created_from_scratch_en_va(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(name=display_name, language="en")["name"]
        clone_name = user.clone_va(name)["name"]

        user.check_language_inheritance(name, clone_name)

        user.delete_va_by_name(name)
        user.delete_va_by_name(clone_name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_clone_edited_va")
    def test_clone_edited_va(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        clone_name = user.clone_va(name)["name"]

        user.delete_va_by_name(name)
        user.delete_va_by_name(clone_name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_after_cloning_delete_initial_va")
    def test_after_cloning_delete_initial_va(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        clone_name = user.clone_va(name)["name"]

        user.delete_va_by_name(name)
        user.delete_va_by_name(clone_name)

    # VA COMPONENTS

    @qase.title(f"{counter()}. test_get_public_va_components_by_name")
    def test_get_public_va_components_by_name(self):
        name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        user.get_va_components(name)

    @qase.title(f"{counter()}. test_get_created_from_scratch_va_components_by_name")
    def test_get_created_from_scratch_va_components_by_name(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_components(name)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_get_cloned_va_components_by_name")
    def test_get_cloned_va_components_by_name(self):
        display_name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        name = user.clone_va(display_name)["name"]
        user.get_va_components(name)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_add_cloned_va_component")
    def test_add_cloned_va_component(self):
        display_name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_add_created_from_scratch_va_component")
    def test_add_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)

        component_list = user.get_va_components(name)
        user.get_component_in_component_list(component_list, component_id)

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_delete_cloned_va_component")
    def test_delete_cloned_va_component(self):
        display_name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)

        component_list = user.get_va_components(name)
        user.get_component_not_exist_in_component_list(component_list, va_component_id)

        user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_delete_created_from_scratch_va_component")
    def test_delete_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_patch_cloned_va_component")
    def test_patch_cloned_va_component(self):
        display_name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        name = user.clone_va(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        user.patch_va_component(name, component_id)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_patch_created_from_scratch_va_component")
    def test_patch_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        user.add_va_component(name, component_id)
        user.patch_va_component(name, component_id)

        user.delete_va_by_name(name)

    # PUBLISH

    @qase.title(f"{counter()}. test_publish_dist_unlisted")
    def test_publish_dist_unlisted(self):
        visibility = 'UNLISTED_INVITATION'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_publish_dist_private")
    def test_publish_dist_private(self):
        visibility = 'PRIVATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_publish_dist_public_template")
    def test_publish_dist_public_template(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        user.delete_va_by_name(name)

    # COMPONENTS

    @qase.title(f"{counter()}. test_get_list_of_components")
    def test_get_list_of_components(self):
        user = UserMethods(auth_token_user1)
        user.get_list_of_components()

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_create_get_patch_delete_component")
    def test_create_get_patch_delete_component(self):
        user = UserMethods(auth_token_user1)
        component_id = user.create_component()["id"]
        user.get_component(component_id)
        user.patch_component(component_id)
        user.delete_component(component_id)

    @qase.title(f"{counter()}. test_get_list_of_group_components")
    def test_get_list_of_group_components(self):
        group_name = "Generative"
        user = UserMethods(auth_token_user1)
        user.get_list_of_group_components(group_name)

    # USERS

    @qase.title(f"{counter()}. test_get_all_users")
    def test_get_all_users(self):
        user = UserMethods(auth_token)
        user.get_all_users()

    @qase.title(f"{counter()}. test_get_user_self")
    def test_get_user_self(self):
        user = UserMethods(auth_token_user1)
        user.get_user_self()

    @qase.title(f"{counter()}. test_get_user_by_id")
    def test_get_user_by_id(self):
        user = UserMethods(auth_token_user1)
        user_id = user.get_user_self()
        user.get_user_by_id(user_id)

    # API_TOKENS

    @qase.title(f"{counter()}. test_get_all_api_keys")
    def test_get_all_api_keys(self):
        user = UserMethods(auth_token_user1)
        user.get_all_api_keys()

    # DIALOG_SESSIONS

    @qase.title(f"{counter()}. test_create_dialog_sessions_with_not_deployed_created_from_scratch_va")
    def test_create_dialog_sessions_with_not_deployed_created_from_scratch_va(self):
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.create_dialog_sessions_not_deployed(name)

        user.delete_va_by_name(name)

    #@pytest.mark.atom
    @pytest.mark.parametrize('va_name', [public_va_names_en[0], public_va_names_ru[0]])
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_template_va_unauthorized")
    def test_get_dialog_session_history_with_public_template_va_unauthorized(self, va_name):
        user = UserMethods('1')
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

    #@pytest.mark.atom
    @pytest.mark.parametrize('va_name', [*public_va_names_en, *public_va_names_ru])
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_template_va")
    def test_get_dialog_session_history_with_public_template_va(self, va_name):
        user = UserMethods(auth_token_user1)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

    # @pytest.mark.atom
    @pytest.mark.parametrize('lm_service_id', lm_service_id_list)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_universal_prompted_assistant_on_various_lm")
    def test_get_dialog_session_history_with_universal_prompted_assistant_on_various_lm(self, lm_service_id):
        va_name = "universal_prompted_assistant"
        user = UserMethods(auth_token_user1)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

    # @pytest.mark.atom
    @pytest.mark.parametrize('lm_service_id', lm_service_id_russian_list)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_universal_prompted_assistant_on_various_russian_lm")
    def test_get_dialog_session_history_with_universal_prompted_assistant_on_various_russian_lm(self, lm_service_id):
        va_name = "universal_prompted_assistant"
        user = UserMethods(auth_token_user1)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_russian_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

    # @pytest.mark.atom
    @pytest.mark.parametrize('lm_service_id', lm_service_id_list)
    @qase.title(f"{counter()}. test_build_assistant_on_various_lm_en")
    def test_build_assistant_on_various_lm_en(self, lm_service_id):
        va_name = f"assistant_lm_service_id_{lm_service_id}"
        user = UserMethods(auth_token_user1)
        va_name = user.create_virtual_assistant(va_name)["name"]
        default_component = user.get_va_components(va_name)["skills"]
        #
        for component in default_component:
            if component['component_type'] == 'Generative':
                component_id = component['component_id']
                user.patch_component(component_id=component_id,
                                     lm_service_id=lm_service_id,
                                     prompt="TASK:  You are a chatbot that can only answers questions below. "
                                            "FAQ: What is your name? My name is Paul.")

        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_deployment(deployment_id)
        user.delete_va_by_name(va_name)

    @pytest.mark.parametrize('lm_service_id', lm_service_id_russian_list)
    @qase.title(f"{counter()}. test_build_assistant_on_various_lm_ru")
    def test_build_assistant_on_various_lm_ru(self, lm_service_id):
        va_name = f"assistant_lm_service_id_{lm_service_id}"
        user = UserMethods(auth_token_user1)
        va_name = user.create_virtual_assistant(name=va_name, language="ru")["name"]
        default_component = user.get_va_components(va_name)["skills"]

        for component in default_component:
            if component['component_type'] == 'Generative':
                component_id = component['component_id']
                user.patch_component(component_id=component_id,
                                     lm_service_id=lm_service_id,
                                     prompt='''Вы — чат-бот, который может отвечать только на 
                                     часто задаваемые вопросы об ИИ. 
                ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ: 
                Что такое умный дом? Умный дом — это как личный помощник для вашего дома. Это 
                система устройств и приборов, которыми можно управлять дистанционно и запрограммировать на 
                автоматическое выполнение задач. Например, вы можете использовать свой смартфон, чтобы включить свет, 
                отрегулировать термостат или запустить кофеварку еще до того, как встанете с постели. 
                ИНСТРУКЦИЯ: 
                Человек вступает в разговор и начинает задавать вопросы. Сгенерируйте ответ на основе списка часто 
                задаваемых вопросов.''', )
        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_russian_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)
        user.delete_deployment(deployment_id)
        user.delete_va_by_name(va_name)

    @qase.title(f"{counter()}. test_get_dialog_session_history_with_created_from_scratch_va")
    def test_get_dialog_session_history_with_created_from_scratch_va(self):
        name = va_data["name"]
        user = UserMethods(auth_token_user1)
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_deployment(deployment_id)
        user.delete_va_by_name(va_name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_cloned_va")
    def test_get_dialog_session_history_with_cloned_va(self):
        name = public_va_names_en[0]
        user = UserMethods(auth_token_user1)
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        deployment_id = user.create_deployment(va_name)["id"]
        time.sleep(60)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        user.delete_deployment(deployment_id)
        user.delete_va_by_name(va_name)

    # LM_SERVICES

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_get_all_lm_services")
    def test_get_all_lm_services(self):
        user = UserMethods(auth_token_user1)
        user.get_all_lm_services()

    # DEPLOYMENTS

    # @qase.title(f"{counter()}. test_get_stacks")
    # def test_get_stacks(self):
    #    user = UserMethods(auth_token)
    #    user.get_stacks()

    # @qase.title(f"{counter()}. test_get_stack_ports")
    # def test_get_stack_ports(self):
    #    user = UserMethods(auth_token)
    #    user.get_stack_ports()

    #@pytest.mark.atom
    @qase.title(f"{counter()}. test_create_get_patch_delete_deployment")
    def test_create_get_patch_delete_deployment(self):
        name = va_data["name"]
        user = UserMethods(auth_token_user1)

        va = user.create_virtual_assistant(name)
        va_name = va["name"]

        deployment = user.create_deployment(va_name)
        time.sleep(60)
        deployment_id = deployment["id"]
        # task_id = user.get_deployment(deployment_id)
        user.patch_deployment(deployment_id)
        time.sleep(60)
        user.delete_deployment(deployment_id)
        user.get_deployment_non_exists(deployment_id)

        user.delete_va_by_name(va_name)

    # @pytest.mark.atom
    # @pytest.mark.parametrize("stack_id", range(578, 699))
    # @qase.title(f"{counter()}. test_delete_stack")
    # def test_delete_stack(self, stack_id):
    #    deploy = DeploymentsMethods(auth_token_user1)
    #    deploy.delete_stack(stack_id)

    # ADMIN

    @qase.title(f"{counter()}. test_get_all_publish_requests")
    def test_get_all_publish_requests(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods(auth_token)
        admin.get_all_publish_requests()

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_get_unreviewed_publish_requests")
    def test_get_get_unreviewed_publish_requests(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods(auth_token)
        admin.get_all_publish_requests()

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_confirm_publish_request")
    def test_confirm_publish_request(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods(auth_token)
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.confirm_publish_request(publish_request_id)

        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_decline_publish_request")
    def test_decline_publish_request(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods(auth_token)
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.decline_publish_request(publish_request_id)

        user.delete_va_by_name(name)

    # PERMISSIONS

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_patch_clone_publish_delete")
    def test_non_owner_cannot_access_private_assistant_get_patch_clone_publish_delete(self):
        display_name = va_data["name"]
        user1 = UserMethods(auth_token_user1)
        name = user1.create_virtual_assistant(display_name)["name"]
        user2 = UserMethods(auth_token_user2)
        user2.get_va_by_name_no_access(name)
        user2.clone_va_no_access(name)
        user2.patch_va_by_name_no_access(name)
        user2.publish_va_no_access(name, visibility='PUBLIC_TEMPLATE')
        user2.delete_va_by_name_no_access(name)
        user1.delete_va_by_name(name)

    # @pytest.mark.atom
    # @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_add_patch_delete_components")
    # def test_non_owner_cannot_access_private_assistant_get_add_patch_delete_components(self):
    #    display_name = va_data["name"]
    #    user1 = UserMethods(auth_token_user1)
    #    name = user1.create_virtual_assistant(display_name)["name"]
    #    skills = user1.get_va_components(name)["skills"]
    #    component_id = [skill["id"] for skill in skills if skill["component_type"] == "Generative"][0]
    #    user1.patch_va_component(name, component_id)
    #    user2 = UserMethods(auth_token_user2)
    #    user2.get_va_components_no_access(name)
    #    user2.add_va_component_no_access(name, component_id)
    #    user2.patch_va_component_no_access(name, component_id)
    #    user2.delete_va_component_no_access(name, component_id)
    #    user1.delete_va_by_name(name)

    #@pytest.mark.atom
    @qase.title(f"{counter()}. test_non_owner_can_access_unlisted_assistant")
    def test_non_owner_non_auth_can_access_unlisted_assistant(self):
        display_name = va_data["name"]
        user1 = UserMethods(auth_token_user1)
        name = user1.create_virtual_assistant(display_name)["name"]
        user1.publish_va(name, 'UNLISTED_LINK')
        user1.create_deployment(name)
        time.sleep(60)

        user2 = UserMethods('1')
        dialog_session_id = user2.create_dialog_sessions(name)["id"]
        user2.send_dialog_session_message(dialog_session_id)
        user2.get_dialog_session_history(dialog_session_id)

        user1.delete_va_by_name(name)

    #@pytest.mark.atom
    @qase.title(f"{counter()}. test_non_owner_can_access_public_template_assistant")
    def test_non_owner_can_access_public_template_assistant(self):
        display_name = va_data["name"]
        user1 = UserMethods(auth_token_user1)
        name = user1.create_virtual_assistant(display_name)["name"]
        user1.publish_va(name, "PUBLIC_TEMPLATE")
        user1.create_deployment(name)
        time.sleep(60)
        admin = AdminMethods(auth_token)
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.confirm_publish_request(publish_request_id)
        user2 = UserMethods(auth_token_user2)
        user2.get_va_by_name(name)
        user1.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_get_patch_delete_deployment")
    def test_non_owner_cannot_access_private_assistant_get_patch_delete_deployment(self):
        display_name = va_data["name"]
        user1 = UserMethods(auth_token_user1)
        name = user1.create_virtual_assistant(display_name)["name"]
        deployment_id = user1.create_deployment(name)["id"]
        time.sleep(60)
        task_id = user1.get_deployment(deployment_id)
        user2 = UserMethods(auth_token_user2)
        user2.get_deployment_no_access(deployment_id)
        user2.patch_deployment_no_access(deployment_id, task_id)
        user2.delete_deployment_no_access(deployment_id)
        user1.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_non_owner_cannot_access_private_assistant_dialog_session")
    def test_non_owner_cannot_access_private_assistant_dialog_session(self):
        display_name = va_data["name"]
        user1 = UserMethods(auth_token_user1)
        name = user1.create_virtual_assistant(display_name)["name"]
        deployment_id = user1.create_deployment(name)["id"]
        time.sleep(60)
        dialog_session_id = user1.create_dialog_sessions(name)["id"]
        user1.send_dialog_session_message(dialog_session_id)
        user2 = UserMethods(auth_token_user2)
        user2.get_dialog_sessions_no_access(dialog_session_id)
        user2.send_dialog_session_message_no_access(dialog_session_id)
        user2.get_dialog_session_history_no_access(dialog_session_id)
        user2.create_dialog_sessions_no_access(name)
        user1.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"{counter()}. test_non_admin_cannot_get_confirm_decline_publish_request")
    def test_non_admin_cannot_get_confirm_decline_publish_request(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods(auth_token_user1)
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods(auth_token)
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]

        admin_fake = AdminMethods(auth_token_user1)

        admin_fake.get_all_publish_requests_no_access()
        admin_fake.confirm_publish_request_no_access(publish_request_id)
        admin_fake.confirm_publish_request_no_access(publish_request_id)
        admin_fake.decline_publish_request_no_access(publish_request_id)

        user.delete_va_by_name(name)
