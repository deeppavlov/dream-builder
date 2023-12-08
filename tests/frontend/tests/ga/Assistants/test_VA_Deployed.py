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
from seleniumwire import webdriver
from tests.frontend.tests.ga.ga_config import get_ga_requests


class TestGA:
    def teardown_method(self):
        user = UserMethods()
        names_list = user.get_list_of_private_va_wo_assert()
        if names_list:
            for name in names_list:
                user.delete_va_by_name(name)

    @pytest.mark.ga_events
    @pytest.mark.parametrize("browser", ["chrome"], indirect=True)
    @pytest.mark.parametrize("screen_size", [["1920,1080"]], indirect=True)
    @qase.title(f"test_va_deployed")
    def test_va_deployed(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
        page = AllGAPage(browser, url)
        page.open()

        page.check_is_public_template_loaded()
        browser.execute_script("scrollTo(0,0);")

        page.click_sign_in_button()
        page.check_google_github_logo()
        page.click_sign_in_with_github()
        time.sleep(2)
        page = GithubAuthPage(browser, browser.current_url)
        page.enter_login()
        page.enter_password()
        page.click_sign_in()
        page = AllGAPage(browser, browser.current_url)
        page.check_is_public_template_loaded()

        page.click_create_from_scratch_button()
        page.enter_name_in_create_va_mw()
        page.enter_description_in_create_va_mw()
        page.click_create_in_create_va_mw()

        with qase.step("1. va_skillset_page va_control_block, stop va_skillset_page va_control_block"):
            page = SkillPage(browser, browser.current_url)
            page.click_build_assistant()
            page = AllGAPage(browser, browser.current_url)
            page.check_building_is_done()

            get_ga_requests(browser, "VA_Deployed", page)

            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_stop_assistant()
            page.check_assistant_stopped()

            get_ga_requests(browser, "VA_Undeployed", page)

        with qase.step("2. va_skillset_page sidepanel, delete skill"):
            page.click_chat_with_assistant_button()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_build_assistant()

            page = AllGAPage(browser, browser.current_url)
            page.check_building_is_done()

            get_ga_requests(browser, "VA_Deployed", page)

            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_delete()
            page.click_delete_skill_delete_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()
            page.check_assistant_stopped()

            get_ga_requests(browser, "VA_Undeployed", page)

        with qase.step("3. va_skillset_page visibility, add skill"):
            page.click_visibility_button()
            page.change_visibility_to_unlisted()
            page.save_visibility()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page = AllGAPage(browser, browser.current_url)
            page.check_building_is_done()

            get_ga_requests(browser, "VA_Deployed", page)

            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_create_skill_button()
            page.click_create_skill_from_scratch_button()
            page.enter_name_in_create_skill_mw()
            page.enter_description_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page.click_bcb_your_assistant_name_button()
            page.check_assistant_stopped()

            get_ga_requests(browser, "VA_Undeployed", page)

        with qase.step("4. all_va_page va_sidepanel, edit prompt"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_kebab_your_a()
            page.click_kebab_your_a_chat()

            panel = DialogPanel(browser, browser.current_url)
            panel.click_build_assistant()

            page.check_building_is_done()

            get_ga_requests(browser, "VA_Deployed", page)

            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_edit_skill()

            page = SkillEditorPage(browser, browser.current_url)
            page.clear_old_prompt()
            time.sleep(1)
            page.clear_old_prompt()
            time.sleep(2)
            page.enter_new_prompt()
            page.click_save_button()
            page.check_success_toast()
            page.check_success_toast_disappear()
            page.click_bcb_your_assistant_name_button()

            page = SkillPage(browser, browser.current_url)
            page.check_assistant_stopped()

            get_ga_requests(browser, "VA_Undeployed", page)

        with qase.step("6. va_skillset_page va_action_menu visibility, stop va_skillset_page va_action_menu add skill"):
            page.click_main_menu()
            page.click_main_menu_visibility()

            page.click_visibility_button()
            page.change_visibility_to_unlisted()
            page.save_visibility()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page = AllGAPage(browser, browser.current_url)
            page.check_building_is_done()

            get_ga_requests(browser, "VA_Deployed", page)

            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_main_menu()
            page.click_main_menu_add_skills()
            page.click_create_skill_from_scratch_button()
            page.enter_name_in_create_skill_mw()
            page.enter_description_in_create_skill_mw()
            page.click_create_in_create_skill_mw()
            page.check_success_toast()
            page.check_success_toast_disappear()

            page.click_bcb_your_assistant_name_button()
            page.check_assistant_stopped()

            get_ga_requests(browser, "VA_Undeployed", page)
