import pytest
from qaseio.pytest import qase
import time
from tests.frontend.pages.all_ga_page import AllGAPage
from tests.frontend.pages.google_auth_page import GoogleAuthPage
from tests.frontend.pages.github_auth_page import GithubAuthPage
from tests.frontend.pages.dialog_panel import DialogPanel
from tests.frontend.pages.deepy_panel import DeepyPanel
from tests.frontend.pages.skill_page import SkillPage
from tests.frontend.pages.skill_editor_page import SkillEditorPage
from tests.frontend.pages.profile_page import ProfilePage
from tests.frontend.pages.messenger_page import MessengerPage
from tests.frontend.pages.admin_page import AdminPage
from tests.frontend.config import url, admin_url, lm_service_en_list, lm_service_ru_list
from tests.backend.distributions_methods import UserMethods


class TestUI:
    # def teardown_method(self):
    #    user = UserMethods()
    #    names_list = user.get_list_of_private_va_wo_assert()
    #    if names_list:
    #        for name in names_list:
    #            user.delete_va_by_name(name)

    # @pytest.mark.atom
    @qase.title(f"test_check_skill_editor_ru")
    def test_check_skill_editor_ru(self, browser):
        with qase.step(f"1. Wendy visits site: {browser.name}"):
            page = AllGAPage(browser, url)
            page.open()
            page.click_sign_in_button()
            page.click_sign_in_with_github()

            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()

            page = AllGAPage(browser, browser.current_url)
            page.click_create_from_scratch_button()
            page.click_choose_language_assistant_dropdown()
            page.click_choose_language_assistant_ru()
            page.enter_name_in_create_va_mw()
            page.enter_description_in_create_va_mw()
            page.click_create_in_create_va_mw()

            page = SkillPage(browser, browser.current_url)
            page.click_edit_skill()

            page = SkillEditorPage(browser, browser.current_url)
            # page.open_models_dropdown()
            # page.check_all_ru_models()

            page.check_default_prompt_ru()

    @pytest.mark.atom
    @pytest.mark.negative
    @qase.title(f"test_create_assistant_from_scratch_negative_inputs")
    def test_create_assistant_from_scratch_negative_inputs(self, browser):
        with qase.step(f"1. Open site: {browser.name}"):
            page = AllGAPage(browser, url)
            page.open()
            page.click_sign_in_button()
            page.click_sign_in_with_github()

        with qase.step(f"2. Log in: {browser.name}, github"):
            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()

        with qase.step(f"3. Open Create from scratch modal window"):
            page = AllGAPage(browser, browser.current_url)
            page.click_create_from_scratch_button()
            page.click_choose_language_assistant_dropdown()
            page.click_choose_language_assistant_en()

        with qase.step(f"3.1 Empty Name and Description inputs"):
            page.click_create_in_create_va_mw()
            page.check_error_message_name_cant_be_empty_in_create_skill_mw()
            page.check_error_message_description_cant_be_empty_in_create_skill_mw()

        with qase.step(f"3.2 Filled name and empty Description inputs"):
            page.enter_name_in_create_va_mw()
            page.click_create_in_create_va_mw()
            page.check_error_message_description_cant_be_empty_in_create_skill_mw()

        with qase.step(f"3.3 Empty Name and filled Description inputs"):
            page.clear_name_in_create_va_mw()
            page.enter_description_in_create_va_mw()
            page.click_create_in_create_va_mw()
            page.check_error_message_name_cant_be_empty_in_create_skill_mw()

        with qase.step(f"3.4 Filled Name and filled description upper limit"):
            page.clear_name_in_create_va_mw()
            page.clear_description_in_create_va_mw()

            page.enter_name_in_create_va_mw()
            page.enter_description_upper_limit_in_create_va_mw()

            page.click_create_in_create_va_mw()
            page.check_error_message_limit_text_description_in_create_skill_mw()

        with qase.step(f"3.5 Filled Name and Description inputs"):
            page.clear_name_in_create_va_mw()
            page.clear_description_in_create_va_mw()

            page.enter_name_in_create_va_mw()
            page.enter_description_in_create_va_mw()
            page.click_create_in_create_va_mw()

            page.check_success_toast()
            page.check_success_toast_disappear()

        with qase.step(f"4. Open Create Skill modal window"):
            page = SkillPage(browser, browser.current_url)
            page.click_create_skill_button()
            page.click_create_skill_from_scratch_button()

        with qase.step(f"4.1 Empty Skill Name and Description inputs"):
            page.clear_name_in_create_skill_mw()
            page.clear_description_in_create_skill_mw()

            page.click_create_in_create_skill_mw()
            page.check_error_message_name_cant_be_empty_in_create_skill_mw()
            page.check_error_message_description_cant_be_empty_in_create_skill_mw()

        with qase.step(f"4.2 Empty Description input"):
            page.enter_name_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.check_error_message_description_cant_be_empty_in_create_skill_mw()

        with qase.step(f"4.3 Empty Name input"):
            page.clear_name_in_create_skill_mw()
            page.enter_description_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.check_error_message_name_cant_be_empty_in_create_skill_mw()

        with qase.step(f"4.4 Filled Name and filled Description upper limit"):
            page.clear_name_in_create_skill_mw()
            page.clear_description_in_create_skill_mw()
            page.enter_name_in_create_skill_mw()
            page.enter_description_upper_limit_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.enter_description_upper_limit_in_create_skill_mw()

        with qase.step(f"4.5 Filled Skill Name and Description inputs"):
            page.clear_name_in_create_skill_mw()
            page.clear_description_in_create_skill_mw()
            page.enter_name_in_create_skill_mw()
            page.enter_description_in_create_skill_mw()
            page.click_create_in_create_skill_mw()

        with qase.step(f"5 Open Skill Editor Page"):
            page = SkillEditorPage(browser, browser.current_url)

        with qase.step(f"5.1 Save empty prompt"):
            page.clear_old_prompt()
            page.click_save_button()
            page.check_error_message_field_cant_be_empty()

    #    with qase.step(f"5.2 Select all models and fill the prompt upper limit"):
    #        for model_name in lm_service_en_list:
    #            page.open_models_dropdown()
    #            print(f'model_name = {model_name}')
    #            page.select_specific_model(model_name)
    #            page.clear_old_prompt()
#
    #            for i in range(0, 9):
    #                page.enter_new_prompt_upper_limit()
    #                #page.enter_new_prompt()
    #                time.sleep(2)
    #            page.click_save_button()
    #            page.check_error_message_limit_prompt()
    #
    #    for model_name in lm_service_ru_list:
    #        page.select_specific_model(model_name)
    #        page.clear_old_prompt()
    #        page.enter_new_prompt_upper_limit()
    #        page.check_tokens_is_more_than_limit()
    #
    #        page.click_save_button()
    #        page.check_that_save_button_is_non_clickable()
    #        page.check_error_message()
    #
    @pytest.mark.ui
    @qase.title(f"1.test: Scenario 1 main")
    def test_scenario_1_main(self, browser):
        with qase.step(f"1. Wendy visits site: (alpha) (not login) {browser.name}"):
            page = AllGAPage(browser, url)
            page.open()

            page.check_deepy_tooltip()
            page.scroll_public_templates_left()
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)
            # panel.check_welcome_dialogue()
            panel.click_deepy_button()

        with qase.step("2. Wendy scrolls though VAs templates"):
            page.scroll_public_templates_right()

        with qase.step("3. Wendy picks a VAs template to check and chat with it"):
            time.sleep(2)
            page.click_kebab_public_template()

            page.click_kebab_public_template_chat()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_restart_button()
            time.sleep(2)
            panel.enter_message()
            panel.send_message()
            panel.check_bot_message()

        with qase.step("4. Wendy likes and use the template (must login)"):
            page.click_use_template()
            time.sleep(1)

            page.click_sign_in_with_github()
            time.sleep(2)

            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()

            # page = AllGAPage(browser, browser.current_url)
            # page.click_sign_in_button()
            # page.click_sign_in_with_github()

            # page = GoogleAuthPage(browser, browser.current_url)
            # time.sleep(2)
            # page.do_auth()

            page = AllGAPage(browser, browser.current_url)
            # time.sleep(3)
            # page.click_use_template()
            # time.sleep(3)
            page.clear_name_in_create_va_mw()
            time.sleep(2)
            page.clear_name_in_create_va_mw()
            time.sleep(2)
            page.enter_name_in_create_va_mw()
            page.click_use_template_modal_window()

        with qase.step("5. Wendy wants to edit skill"):
            page = SkillPage(browser, browser.current_url)
            page.click_edit_skill()

        with qase.step("6. Wendy chooses СhatGPT model"):
            page = SkillEditorPage(browser, browser.current_url)
            page.open_models_dropdown()

            page.check_all_en_models()

            page.choose_generative_model()

            page.check_default_prompt_en()

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

        with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
            page.click_enter_token_here()

            page = ProfilePage(browser, browser.current_url)
            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()
            page.click_enter_token_button()
            page.check_success_toast()
            page.check_success_toast_disappear()
            page.click_close_button()

        with qase.step("8. Wendy chooses her created VAs"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_your_a_edit_button()

        with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
            page = SkillPage(browser, browser.current_url)
            page.click_edit_skill()

            page = SkillEditorPage(browser, browser.current_url)
            time.sleep(1)
            page.clear_old_prompt()
            time.sleep(1)
            page.clear_old_prompt()
            time.sleep(2)
            page.enter_new_prompt()
            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

        with qase.step("10. Wendy clicks play to check VA dialog"):
            page.click_breadcrumbbar_skills()
            # page.click_close_do_you_want_to_close_modal_window()

            page = SkillPage(browser, browser.current_url)
            page.click_chat_with_assistant_button()
            time.sleep(2)

            panel = DialogPanel(browser, browser.current_url)
            panel.click_build_assistant()

            page = AllGAPage(browser, browser.current_url)
            page.check_building_is_done()

            time.sleep(2)
            browser.refresh()
            time.sleep(2)

            page.click_kebab_your_a()
            page.click_kebab_your_a_chat()

            panel = DialogPanel(browser, browser.current_url)
            panel.enter_message()
            time.sleep(2)
            panel.send_message()
            panel.check_bot_message_edited_prompt()

        with qase.step("11. Wendy wants to share her created VA"):
            page = AllGAPage(browser, browser.current_url)

        with qase.step("12. Wendy understands before sharing her VA, she needs to change visibility of her VA"):
            page.click_kebab_your_a()
            page.click_kebab_your_a_visibility()

        with qase.step("13. Wendy changes visibility to Unlisted"):
            page.change_visibility_to_unlisted()
            page.save_visibility()
            page.check_success_toast()
            time.sleep(2)
            page.click_kebab_your_a()
            page.click_kebab_your_a_share()
            share_link = page.get_share_link()

        with qase.step("14.(not checked) Wendy waits approval letter"):
            time.sleep(1)

        with qase.step("15. Wendy finally sharing her VA with potential clients"):
            time.sleep(1)

        with qase.step("The user story for user of Wendy: 1. User visits link of VA"):
            page = MessengerPage(browser, url=share_link)
            page.open()
            time.sleep(3)

        with qase.step("The user story for user of Wendy: 2. User starts talk to VA"):
            # page.click_key_button()
            page.click_enter_your_token_mw()
            page.enter_token()
            page.open_choose_service_dropdown()
            time.sleep(1)
            page.choose_service()
            page.click_enter_token_button()
            time.sleep(1)
            # page.check_success_toast()
            # page.check_success_toast_disappear()
            page.click_close_button()
            page.click_close_button_get_started()

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

        with qase.step("The user story for user of Wendy: 3. User wants to read about VA"):
            page.click_check_properties()
            time.sleep(2)

        with qase.step("The user story for user of Wendy: 4. User wants to share this link with other of his friends"):
            page.click_share_button()
            page.click_share_on_telegram()
            time.sleep(3)

            page = AllGAPage(browser, url)
            page.open()
            browser.refresh()

            page.click_kebab_your_a()
            page.click_kebab_your_a_delete()
            page.click_mw_your_a_delete()
            page.check_success_toast()
            page.check_success_toast_disappear()

        with qase.step("8. Alex changes visibilty to public templates"):
            page = AllGAPage(browser, url)
            page.click_kebab_your_a()
            page.click_kebab_your_a_visibility()
            page.change_visibility_to_public_template()
            page.publish_visibility()
            page.check_submitted_toast()
            #
            page.check_building_is_done()

        with qase.step("9.Alex waits moderation"):
            page = AdminPage(browser, admin_url)
            page.open()
            page.click_approve_button()

        with qase.step(
                "10.Alex sees his template in public templates he wants to share it " "with others and promote it"
        ):
            page = AllGAPage(browser, url)
            page.open()
            browser.refresh()
            page.check_your_assistant_is_public()
            page.check_your_assistant_public_wrap()
            # page.click_kebab_your_a_share()
            # share_link = page.get_share_link()
            page.click_kebab_your_a()
            page.click_kebab_your_a_delete()
            page.click_mw_your_a_delete()
            page.check_success_toast()
            page.check_success_toast_disappear()
