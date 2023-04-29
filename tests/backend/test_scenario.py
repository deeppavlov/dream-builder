from qaseio.pytest import qase
from .config import (
    va_data,
    public_va_names,
    counter_distributions as counter
)
from .distributions_methods import (
    UserMethods,
    AdminMethods
)


class TestScenario:
    @qase.title(f"{counter()}. test: Scenario 1 main")
    def test_scenario_1_main(self):
        with qase.step("1. Wendy visits site: (alpha)"):
            user_id = 1
            user = UserMethods()

        with qase.step("2. Wendy scrolls though VAs templates"):
            list_of_va_templates = user.get_list_of_public_va()

        with qase.step("3. Wendy picks a VAs template to check and chat with it"):
            picked_va_template = list_of_va_templates[1]
            dialog_session_id = user.create_dialog_sessions(picked_va_template)["id"]
            user.get_dialog_sessions(dialog_session_id)
            user.send_dialog_session_message(dialog_session_id)
            user.get_dialog_session_history(dialog_session_id)

        with qase.step("4. Wendy likes and use the template"):
            va_name = user.clone_va(picked_va_template)["name"]

        with qase.step("5. Wendy wants to edit skill"):
            user.get_va_components(va_name)

        with qase.step("6. Wendy chooses СhatGPT modal"):
            user.get_dist_lm_service(va_name)
            user.set_dist_lm_service(va_name, lm_service_name="СhatGPT")

        with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
            user.create_or_update_user_api_token(user_id, token_value="valid_token")

        with qase.step("8. Wendy chooses her created VAs"):
            user.get_va_by_name(va_name)

        with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
            user.get_dist_prompt(va_name)
            user.set_dist_prompt(va_name)

        with qase.step("10. Wendy clicks play to check VA dialog"):
            dialog_session_id = user.create_dialog_sessions(va_name)["id"]
            user.get_dialog_sessions(dialog_session_id)
            user.send_dialog_session_message(dialog_session_id)
            user.get_dialog_session_history(dialog_session_id)

        with qase.step("11. Wendy wants to share her created VA"):
            user.get_va_by_name(va_name)

        with qase.step("12. Wendy undestands before sharing her VA, she needs to change visibility of her VA"):
            pass

        with qase.step("13. Wendy changes visibility to Unlisted"):
            user.publish_va(va_name, "unlisted")

        with qase.step("14. Wendy waits approval letter"):
            qase.step("15. Wendy finally sharing her VA with potential clients")

    @qase.title(f"{counter()}. test: Scenario 2 secondary")
    def test_scenario_2_secondary(self):
        with qase.step("1. Wendy visits site: (alpha)"):
            user_id = 1
            user = UserMethods()

        with qase.step("2. Alex want to create VAs from scratch"):
            va_name = user.create_virtual_assistant("display_name")["name"]

        with qase.step("3. Alex checks architecture mode"):
            user.get_va_components(va_name)

        with qase.step("4. Alex creates generative skill"):
            component_id = user.create_component()["id"]
            user.add_va_component(va_name, component_id)

        with qase.step("5. Alex edits prompt and checking skill dialog"):
            user.get_dist_prompt(va_name)
            user.set_dist_prompt(va_name)
            dialog_session_id = user.create_dialog_sessions(public_va_names[7])["id"]
            user.get_dialog_sessions(dialog_session_id)
            user.send_dialog_session_message(dialog_session_id)
            user.get_dialog_session_history(dialog_session_id)

        with qase.step("6. Alex saves prompt"):
            user.get_dist_prompt(va_name)

        with qase.step("7. Alex talks with VA"):
            dialog_session_id = user.create_dialog_sessions(va_name)["id"]
            user.get_dialog_sessions(dialog_session_id)
            user.send_dialog_session_message(dialog_session_id)
            user.get_dialog_session_history(dialog_session_id)

        with qase.step("8. Alex changes visibilty to public templates"):
            user.publish_va(va_name, "public_templates")

        with qase.step("9. Alex waits moderation"):
            admin = AdminMethods()
            request_id = admin.get_unreviewed_publish_requests()["id"]
            admin.confirm_publish_request(request_id)

        with qase.step(
                "10. Alex sees his template in public templates he wants to share it with others and promote it"):
            public_template_names = user.get_list_of_public_va()
            assert va_name in public_template_names, \
                "Error, Alex's VA not in public templates"

        with qase.step("11. Alex needs to check how many users using his templates (after MVP)"):
            pass

