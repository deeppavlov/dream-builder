import pytest
from qaseio.pytest import qase
import time
from tests.frontend.pages.all_ga_page import AllGAPage
from tests.frontend.pages.all_your_a_page import AllYourAPage
from tests.frontend.pages.all_templates_a_page import AllTemplatesAPage
from tests.frontend.pages.github_auth_page import GithubAuthPage
from tests.frontend.pages.skill_template_page import SkillTemplatePage
from tests.frontend.pages.dialog_panel import DialogPanel
from tests.frontend.pages.deepy_panel import DeepyPanel
from tests.frontend.pages.skill_page import SkillPage
from tests.frontend.pages.skill_editor_page import SkillEditorPage
from tests.frontend.pages.profile_page import ProfilePage
from tests.frontend.pages.messenger_page import MessengerPage
from tests.frontend.pages.admin_page import AdminPage
from tests.frontend.config import url, admin_url, lm_service_en_list, lm_service_ru_list
from tests.backend.distributions_methods import UserMethods
import pytest
from qaseio.pytest import qase

import time

import pychrome
from seleniumwire import webdriver

from tests.frontend.tests.ga.ga_config_skill import get_ga_requests


class TestGA:
    def teardown_method(self):
        user = UserMethods()
        names_list = user.get_list_of_private_va_wo_assert()
        if names_list:
            for name in names_list:
                user.delete_va_by_name(name)

    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"test_skill_editor_opened")
    def test_skill_editor_opened(self, browser, screen_size):
        page = AllGAPage(browser, url)
        page.open()

        page.check_is_public_template_loaded()
        browser.execute_script("scrollTo(0,0);")

        page.click_create_from_scratch_button()
        page.check_google_github_logo()
        page.click_sign_in_with_github()
        time.sleep(2)
        page = GithubAuthPage(browser, browser.current_url)
        page.enter_login()
        page.enter_password()
        page.click_sign_in()
        page = AllGAPage(browser, browser.current_url)
        page.check_is_public_template_loaded()
        page.enter_name_in_create_va_mw()
        page.enter_description_in_create_va_mw()
        page.click_create_in_create_va_mw()
        page.check_success_toast()
        page.check_success_toast_disappear()

        page = SkillPage(browser, browser.current_url)
        page.click_settings_button()
        page = ProfilePage(browser, browser.current_url)
        page.switch_to_personal_tokens_tab()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.enter_token()
        time.sleep(2)
        page.click_enter_token_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page.click_close_button()
        page = SkillPage(browser, browser.current_url)
        with qase.step("1.1 va_skillset_page, sidepanel_details_edit, skill_created_type=default"):
            page.click_on_skill_card()
            page.check_is_properties_panel_present()
            page.click_details_tab()
            page.click_edit_skill_button_side_panel()

            get_ga_requests(browser, "Skill_Editor_Opened", page)

            page = SkillEditorPage(browser, browser.current_url)
            time.sleep(5)
            page.open_models_dropdown()
            page.choose_generative_model()

            get_ga_requests(browser, "Skill_Model_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.update_model_status()

            page.clear_old_prompt()
            time.sleep(2)
            page.enter_new_prompt()

            get_ga_requests(browser, "Skill_Prompt_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Start", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Send", page)

            page.restart_dialog()

            get_ga_requests(browser, "Skill_Chat_Refresh", page)

            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

        with qase.step("1.2 va_skillset_page, skill_block, skill_created_type=default"):
            page.click_edit_skill()

            get_ga_requests(browser, "Skill_Editor_Opened", page)

            page = SkillEditorPage(browser, browser.current_url)
            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_delete()
            page.click_delete_skill_delete_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()

        with qase.step("2.1 va_skillset_page, card_click, skill_created_type=from_scratch"):
            page.click_create_skill_button()
            page.click_create_skill_from_scratch_button()
            page.enter_name_in_create_skill_mw()
            page.enter_description_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()
            page = SkillEditorPage(browser, browser.current_url)
            page.open_models_dropdown()
            page.choose_generative_model()

            get_ga_requests(browser, "Skill_Model_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.update_model_status()

            page.clear_old_prompt()
            page.enter_new_prompt()

            get_ga_requests(browser, "Skill_Prompt_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Start", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Send", page)

            page.restart_dialog()

            get_ga_requests(browser, "Skill_Chat_Refresh", page)

            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

        with qase.step("2.2 va_skillset_page, skill_block_context_menu, skill_created_type=from_scratch"):
            page.click_edit_skill()

            get_ga_requests(browser, "Skill_Editor_Opened", page)

            page = SkillEditorPage(browser, browser.current_url)
            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_delete()
            page.click_delete_skill_delete_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()

        with qase.step("3.1 va_skillset_page, card_click, skill_created_type=from_template"):
            page.click_create_skill_button()
            page.click_add_skill_in_choose_skill_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page = SkillEditorPage(browser, browser.current_url)
            page.open_models_dropdown()
            page.choose_generative_model()

            get_ga_requests(browser, "Skill_Model_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.update_model_status()

            page.clear_old_prompt()
            page.enter_new_prompt()

            get_ga_requests(browser, "Skill_Prompt_Edited", page)

            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()

            get_ga_requests(browser, "Skill_Changed", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Start", page)

            page.enter_message()
            page.send_message()
            page.check_bot_message_edited_prompt()

            get_ga_requests(browser, "Skill_Chat_Send", page)

            page.restart_dialog()

            get_ga_requests(browser, "Skill_Chat_Refresh", page)

            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

        with qase.step("3.2 va_skillset_page, skill_block_context_menu, skill_created_type=from_template"):
            page.click_edit_skill()

            get_ga_requests(browser, "Skill_Editor_Opened", page)

            page = SkillEditorPage(browser, browser.current_url)
            page.click_close_skill_editor_page()

            get_ga_requests(browser, "Skill_Editor_Closed", page)

            page = SkillPage(browser, browser.current_url)

            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_delete()
            page.click_delete_skill_delete_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()
