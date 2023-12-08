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
    @qase.title(f"test_deepy_chat_opened")
    def test_deepy_chat_opened(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
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

        with qase.step("1. va_skillset_page"):
            page = SkillPage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

            # У Артема source_type вместо  left_panel выдает va_templates_block !!

        with qase.step("2. prompt editor _page"):
            page.click_edit_skill()
            page = SkillEditorPage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

        with qase.step("3. all_va_page"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

        with qase.step("4. yourbots"):
            page.click_show_all_your_assistants()
            page = AllYourAPage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

        with qase.step("5. allbots"):
            page.click_show_all_templates_assistants()
            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

        with qase.step("6. va_template_page"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            page = SkillTemplatePage(browser, browser.current_url)
            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()

        with qase.step("7. va_template_page integration_tab"):
            page.switch_to_integration_tab()

            page.click_deepy_button()

            panel = DeepyPanel(browser, browser.current_url)

            get_ga_requests(browser, "Deepy_Chat_Opened", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Start", page)

            panel.enter_message_deepy()
            panel.send_message_deepy()

            get_ga_requests(browser, "Deepy_Chat_Send", page)

            panel.refresh_dialog_deepy()

            get_ga_requests(browser, "Deepy_Chat_Refresh", page)

            panel.close_deepy_panel()
