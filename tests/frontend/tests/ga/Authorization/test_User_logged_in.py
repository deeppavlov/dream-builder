from tests.frontend.pages.all_ga_page import AllGAPage
from tests.frontend.pages.all_your_a_page import AllYourAPage
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
    @qase.title(f"test_user_logged_in")
    def test_user_logged_in(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
        with qase.step("1.1. unauth, from all_va_page, site open"):
            page = AllGAPage(browser, url)
            page.open()
            page.check_is_public_template_loaded()
            get_ga_requests(browser, "VA_Page_Opened", page)

        with qase.step("1.1. auth_button, all_va_page, logout all_va_page"):
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

            get_ga_requests(browser, "User_logged_in", page)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("1.2. auth_button, allbots, logout allbots"):
            page.click_show_all_templates_assistants()

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

            get_ga_requests(browser, "User_logged_in", page)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("1.3. auth_button, va_template_page, logout va_template_page"):
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

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

            get_ga_requests(browser, "User_logged_in", page)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("2.1. use_template, all_va_page, logout va_skillset_page"):
            page.click_use_template()

            page.check_google_github_logo()
            page.click_sign_in_with_github()
            time.sleep(2)
            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()
            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

            get_ga_requests(browser, "User_logged_in", page)

            page.clear_name_in_create_va_mw()
            page.enter_name_in_create_va_mw()
            page.enter_description_in_create_va_mw()
            page.click_create_in_create_va_mw()

            page = SkillPage(browser, browser.current_url)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("2.2. use_template, allbots, logout va_skill_editor_page"):
            page.click_use_template()

            page.check_google_github_logo()
            page.click_sign_in_with_github()
            time.sleep(2)
            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()
            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

            get_ga_requests(browser, "User_logged_in", page)

            page.click_close_in_create_va_mw()
            page.click_your_a_edit_button()
            page = SkillPage(browser, browser.current_url)
            page.click_edit_skill()
            page = SkillEditorPage(browser, browser.current_url)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("2.3. use_template (duplicate), logout yourbots"):
            page.click_use_template()

            page.check_google_github_logo()
            page.click_sign_in_with_github()
            time.sleep(2)
            page = GithubAuthPage(browser, browser.current_url)
            page.enter_login()
            page.enter_password()
            page.click_sign_in()
            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

            get_ga_requests(browser, "User_logged_in", page)

            page.click_close_in_create_va_mw()
            page.click_show_all_your_assistants()
            page = AllYourAPage(browser, browser.current_url)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()

        with qase.step("3.1. create_from_scratch_button, all_va_page, va_skillset_page"):
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

            get_ga_requests(browser, "User_logged_in", page)

            page.clear_name_in_create_va_mw()
            page.enter_name_in_create_va_mw()
            page.enter_description_in_create_va_mw()
            page.click_create_in_create_va_mw()

            page = SkillPage(browser, browser.current_url)

            page.click_user_avatar_button()
            page.click_logout_button()

            get_ga_requests(browser, "User_logged_out", page)

            page = AllGAPage(browser, browser.current_url)
            page.check_is_public_template_loaded()
