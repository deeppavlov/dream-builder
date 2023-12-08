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
    @qase.title(f"test_messenger_va_chat_opened")
    def test_messenger_va_chat_opened(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
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
        page = SkillPage(browser, browser.current_url)
        page.click_visibility_button()
        page.change_visibility_to_unlisted()
        page.save_visibility()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page = AllGAPage(browser, browser.current_url)
        page.check_building_is_done()
        page.click_kebab_your_a()
        page.click_kebab_your_a_share()
        share_link = page.get_share_link()

        page = MessengerPage(browser, share_link)

        with qase.step("1. va_skillset_page"):
            get_ga_requests(browser, "Messenger_VA_Chat_Opened", page)

            page.enter_message()
            page.send_message()

            get_ga_requests(browser, "Messenger_VA_Chat_Start", page)

            page.enter_message()
            page.send_message()

            get_ga_requests(browser, "Messenger_VA_Chat_Send", page)

            page.click_restart_button()

            get_ga_requests(browser, "Messenger_VA_Chat_Refresh", page)
