import time
import pytest
from qaseio.pytest import qase
from .config import (
    va_data,
    public_va_names,
    lm_service_id_list,
    counter_distributions as counter
)
from .distributions_methods import (
    UserMethods,
    DeploymentsMethods,
    AdminMethods
)


class TestDistributions:

    # ASSISTANTS_DISTS

    @qase.title(f"{counter()}. test_create_va")
    def test_create_va(self):
        display_name = va_data["name"]
        user = UserMethods()
        user.create_virtual_assistant(display_name)

    @qase.title(f"{counter()}. test_get_list_of_public_va")
    def test_get_list_of_public_va(self):
        user = UserMethods()
        user.get_list_of_public_va()

    @qase.title(f"{counter()}. test_get_list_of_your_va")
    def test_get_list_of_your_a(self):
        display_name = va_data["name"]
        user = UserMethods()
        va_name = user.create_virtual_assistant(display_name)["name"]
        user.get_list_of_private_va(va_name)

    @qase.title(f"{counter()}. test_get_your_va_by_name")
    def test_get_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_by_name(name)

    @qase.title(f"{counter()}. test_get_public_va_by_name")
    def test_get_public_va_by_name(self):
        name = public_va_names[0]
        user = UserMethods()
        user.get_va_by_name(name)

    # @qase.title(f"{counter()}. test_get_non_exist_va_by_name")
    # def test_get_non_exist_dist_by_name(self):
    #    name = "non_exist_name"
    #    user = UserMethods()
    #    user.create_virtual_assistant()
    #    user.get_va_by_name(name)

    @qase.title(f"{counter()}. test_delete_your_va_by_name")
    def test_delete_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.delete_va_by_name(name)

    @qase.title(f"{counter()}. test_patch_your_va_by_name")
    def test_patch_your_va_by_name(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.patch_va_by_name(name)

    @qase.title(f"{counter()}. test_clone_public_va")
    def test_clone_public_va(self):
        name = public_va_names[0]
        user = UserMethods()
        user.clone_va(name)

    @qase.title(f"{counter()}. test_clone_created_from_scratch_va")
    def test_clone_created_from_scratch_va(self):
        name = va_data["name"]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        user.clone_va(va_name)

    @qase.title(f"{counter()}. test_clone_edited_va")
    def test_clone_edited_va(self):
        name = va_data["name"]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        user.add_va_component(va_name, 2)

        user.clone_va(va_name)

    @qase.title(f"{counter()}. test_after_cloning_delete_initial_va")
    def test_after_cloning_delete_initial_va(self):
        name = va_data["name"]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        user.clone_va(va_name)

        user.delete_va_by_name(va_name)

    # VA COMPONENTS

    @qase.title(f"{counter()}. test_get_public_va_components_by_name")
    def test_get_public_va_components_by_name(self):
        name = public_va_names[0]
        user = UserMethods()
        user.get_va_components(name)

    @qase.title(f"{counter()}. test_get_created_from_scratch_va_components_by_name")
    def test_get_created_from_scratch_va_components_by_name(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.get_va_components(name)

    @qase.title(f"{counter()}. test_get_cloned_va_components_by_name")
    def test_get_cloned_va_components_by_name(self):
        name = public_va_names[0]
        user = UserMethods()
        va_name = user.clone_va(name)["name"]
        user.get_va_components(va_name)

    @qase.title(f"{counter()}. test_add_cloned_va_component")
    def test_add_cloned_va_component(self):
        name = public_va_names[0]
        user = UserMethods()
        va_name = user.clone_va(name)["name"]
        component_id = 2
        user.add_va_component(va_name, component_id)

    @qase.title(f"{counter()}. test_add_created_from_scratch_va_component")
    def test_add_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = 2
        user.add_va_component(name, component_id)

    @qase.title(f"{counter()}. test_delete_cloned_va_component")
    def test_delete_cloned_va_component(self):
        name = public_va_names[0]
        user = UserMethods()
        va_name = user.clone_va(name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)
        user.delete_component(component_id)

    @qase.title(f"{counter()}. test_delete_created_from_scratch_va_component")
    def test_delete_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = user.create_component()["id"]
        va_component_id = user.add_va_component(name, component_id)["id"]
        user.delete_va_component(name, va_component_id)
        user.delete_component(component_id)

    @qase.title(f"{counter()}. test_patch_cloned_va_component")
    def test_patch_cloned_va_component(self):
        name = public_va_names[0]
        user = UserMethods()
        va_name = user.clone_va(name)["name"]
        component_id = 2
        user.add_va_component(va_name, component_id)
        user.patch_va_component(va_name, component_id)

    @qase.title(f"{counter()}. test_patch_created_from_scratch_va_component")
    def test_patch_created_from_scratch_va_component(self):
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        component_id = 2
        user.add_va_component(name, component_id)
        user.patch_va_component(name, component_id)

    # PUBLISH

    @qase.title(f"{counter()}. test_publish_dist_unlisted")
    def test_publish_dist_unlisted(self):
        visibility = 'UNLISTED_INVITATION'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

    @qase.title(f"{counter()}. test_publish_dist_private")
    def test_publish_dist_private(self):
        visibility = 'PRIVATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

    @qase.title(f"{counter()}. test_publish_dist_public_template")
    def test_publish_dist_public_template(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

    # COMPONENTS

    @qase.title(f"{counter()}. test_get_list_of_components")
    def test_get_list_of_components(self):
        user = UserMethods()
        user.get_list_of_components()

    @qase.title(f"{counter()}. test_create_get_patch_delete_component")
    def test_create_get_patch_delete_component(self):
        user = UserMethods()
        component_id = user.create_component()["id"]
        user.get_component(component_id)
        user.patch_component(component_id)
        user.delete_component(component_id)

    @qase.title(f"{counter()}. test_get_list_of_group_components")
    def test_get_list_of_group_components(self):
        group_name = "Generative"
        user = UserMethods()
        user.get_list_of_group_components(group_name)

    # USERS

    @qase.title(f"{counter()}. test_get_all_users")
    def test_get_all_users(self):
        user = UserMethods()
        user.get_all_users()

    @qase.title(f"{counter()}. test_get_user_self")
    def test_get_user_self(self):
        user = UserMethods()
        user.get_user_self()

    @qase.title(f"{counter()}. test_get_user_by_id")
    def test_get_user_by_id(self):
        user = UserMethods()
        user_id = user.get_user_self()
        user.get_user_by_id(user_id)

    # API_TOKENS

    @qase.title(f"{counter()}. test_get_all_api_keys")
    def test_get_all_api_keys(self):
        user = UserMethods()
        user.get_all_api_keys()

    # DIALOG_SESSIONS

    @qase.title(f"{counter()}. test_create_dialog_sessions_with_not_deployed_created_from_scratch_va")
    def test_create_dialog_sessions_with_not_deployed_created_from_scratch_va(self):
        name = va_data["name"]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        user.create_dialog_sessions_not_deployed(va_name)

    @pytest.mark.parametrize('va_name', public_va_names)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_public_va")
    def test_get_dialog_session_history_with_public_template_va(self, va_name):
        user = UserMethods()
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

    @pytest.mark.parametrize('lm_service_id', lm_service_id_list)
    @qase.title(f"{counter()}. test_get_dialog_session_history_with_universal_prompted_assistant_on_various_lm")
    def test_get_dialog_session_history_with_universal_prompted_assistant_on_various_lm(self, lm_service_id):
        va_name = "universal_prompted_assistant"
        user = UserMethods()
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)
#
    @pytest.mark.parametrize('lm_service_id', lm_service_id_list)
    @qase.title(f"{counter()}. test_build_assistant_on_various_lm")
    def test_build_assistant_on_various_lm(self, lm_service_id):
        va_name = "universal_prompted_assistant"
        user = UserMethods()
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
#
        deploy = DeploymentsMethods()
        deploy.create_deployment(va_name)
        time.sleep(60)
#
        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message_various_lm(dialog_session_id, lm_service_id)
        user.get_dialog_session_history(dialog_session_id)

    @qase.title(f"{counter()}. test_get_dialog_session_history_with_created_from_scratch_va")
    def test_get_dialog_session_history_with_created_from_scratch_va(self):
        name = va_data["name"]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        deploy = DeploymentsMethods()
        deployment_id = deploy.create_deployment(va_name)["id"]
        time.sleep(70)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        deploy.delete_deployment(deployment_id)

    @qase.title(f"{counter()}. test_get_dialog_session_history_with_cloned_va")
    def test_get_dialog_session_history_with_cloned_va(self):
        name = public_va_names[0]
        user = UserMethods()
        va = user.create_virtual_assistant(name)
        va_id = va["id"]
        va_name = va["name"]

        deploy = DeploymentsMethods()
        deployment_id = deploy.create_deployment(va_name)["id"]
        time.sleep(70)

        dialog_session_id = user.create_dialog_sessions(va_name)["id"]
        user.send_dialog_session_message(dialog_session_id)
        user.get_dialog_session_history(dialog_session_id)

        deploy.delete_deployment(deployment_id)

    # LM_SERVICES

    @qase.title(f"{counter()}. test_get_all_lm_services")
    def test_get_all_lm_services(self):
        user = UserMethods()
        user.get_all_lm_services()

    # DEPLOYMENTS

    @qase.title(f"{counter()}. test_get_stacks")
    def test_get_stacks(self):
        deploy = DeploymentsMethods()
        deploy.get_stacks()

    @qase.title(f"{counter()}. test_get_stack_ports")
    def test_get_stack_ports(self):
        deploy = DeploymentsMethods()
        deploy.get_stack_ports()

    @qase.title(f"{counter()}. test_create_get_patch_delete_deployment")
    def test_create_get_patch_delete_deployment(self):
        name = va_data["name"]
        user = UserMethods()

        va = user.create_virtual_assistant(name)
        va_name = va["name"]

        deploy = DeploymentsMethods()
        deployment = deploy.create_deployment(va_name)
        time.sleep(60)
        deployment_id = deployment["id"]
        deploy.get_deployment(deployment_id)
        deploy.patch_deployment(deployment_id)
        time.sleep(60)
        deploy.delete_deployment(deployment_id)

    # @pytest.mark.atom
    # @pytest.mark.parametrize("stack_id", range(578, 699))
    # @qase.title(f"{counter()}. test_delete_stack")
    # def test_delete_stack(self, stack_id):
    #    deploy = DeploymentsMethods()
    #    deploy.delete_stack(stack_id)

    # ADMIN

    @qase.title(f"{counter()}. test_get_all_publish_requests")
    def test_get_all_publish_requests(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods()
        admin.get_all_publish_requests()

    @qase.title(f"{counter()}. test_get_unreviewed_publish_requests")
    def test_get_get_unreviewed_publish_requests(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods()
        admin.get_all_publish_requests()

    @qase.title(f"{counter()}. test_confirm_publish_request")
    def test_confirm_publish_request(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods()
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.confirm_publish_request(publish_request_id)

    @qase.title(f"{counter()}. test_decline_publish_request")
    def test_decline_publish_request(self):
        visibility = 'PUBLIC_TEMPLATE'
        display_name = va_data["name"]
        user = UserMethods()
        name = user.create_virtual_assistant(display_name)["name"]
        user.publish_va(name, visibility)

        admin = AdminMethods()
        publish_request_id = admin.get_unreviewed_publish_requests()[-1]["id"]
        admin.decline_publish_request(publish_request_id)

    # LM_SERVICE

    @qase.title(f"{counter()}. get_all_lm_services")
    def test_get_all_lm_services(self):
        user = UserMethods()
        va = user.get_all_lm_services()
