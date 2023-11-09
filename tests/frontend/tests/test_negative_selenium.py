import pytest
from qaseio.pytest import qase
import time
from tests.frontend.pages.all_ga_page import AllGAPage
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
    def teardown_method(self):
        user = UserMethods()
        names_list = user.get_list_of_private_va_wo_assert()
        if names_list:
            for name in names_list:
                user.delete_va_by_name(name)

    @pytest.mark.negative_ui
    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"test_create_assistant_from_scratch_negative_inputs")
    def test_create_assistant_from_scratch_negative_inputs(self, browser, screen_size):
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
