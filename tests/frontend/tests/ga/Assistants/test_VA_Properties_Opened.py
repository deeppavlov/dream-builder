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

from tests.frontend.tests.ga.ga_config import get_ga_requests


class TestGA:
    def teardown_method(self):
        user = UserMethods()
        names_list = user.get_list_of_private_va_wo_assert()
        if names_list:
            for name in names_list:
                user.delete_va_by_name(name)

    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"test_va_properties_opened")
    def test_va_properties_opened(self, browser, screen_size):

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

        with qase.step("1. va_skillset_page, control block"):
            page = SkillPage(browser, browser.current_url)
            page.click_properties_assistant_button()

            get_ga_requests(browser, "VA_Properties_Opened", page)

        with qase.step("2.1 all_va_page, va_card_click, card view"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_on_your_assistant_card()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("2.2 all_va_page, va_card_click, list view"):
            page.click_change_view_type_to_list()
            page.click_on_your_assistant_card()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("2.3 all_va_page, va_card_context_menu, list view"):
            page.click_change_view_type_to_list()
            page.click_kebab_your_a()
            page.click_kebab_your_a_properties()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("2.4 all_va_page, va_card_context_menu, card view"):
            page.click_change_view_type_to_card()
            page.click_kebab_your_a()
            page.click_kebab_your_a_properties()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("3.1 yourbots, va_card_click, card view"):
            page.click_show_all_your_assistants()
            page = AllYourAPage(browser, browser.current_url)
            page.click_on_your_assistant_card()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("3.2 yourbots, va_card_click, list view"):
            page.click_change_view_type_to_list()
            page.click_on_your_assistant_card()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("3.3 yourbots, va_card_context_menu, list view"):
            page.click_change_view_type_to_list()
            page.click_kebab_your_a()
            page.click_kebab_your_a_properties()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("3.4 yourbots, va_card_context_menu, card view"):
            page.click_change_view_type_to_card()
            page.click_kebab_your_a()
            page.click_kebab_your_a_properties()

            get_ga_requests(browser, "VA_Properties_Opened", page)

            page.click_close_button_side_panel()
