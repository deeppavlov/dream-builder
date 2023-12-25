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
from tests.frontend.tests.ga.ga_config_skill import get_ga_requests


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
    @qase.title(f"test_skill_properties_opened")
    def test_skill_properties_opened(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
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
        with qase.step("1.1 va_skillset_page, card_click, card view"):
            page.click_on_skill_card()

            get_ga_requests(browser, "Skill_Properties_Opened", page)

            page.click_details_tab()

            get_ga_requests(browser, "Skill_Details_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("1.2 va_skillset_page, card_click, list view"):
            page.click_change_view_to_list()

            get_ga_requests(browser, "VA_Skillset_View_Changed", page)

            page.click_on_skill_card()

            get_ga_requests(browser, "Skill_Properties_Opened", page)

            page.click_details_tab()

            get_ga_requests(browser, "Skill_Details_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("2.1 va_skillset_page, skill_block_context_menu, card view"):
            page.click_change_view_to_card()

            get_ga_requests(browser, "VA_Skillset_View_Changed", page)

            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_properties()

            get_ga_requests(browser, "Skill_Properties_Opened", page)

            page.click_details_tab()

            get_ga_requests(browser, "Skill_Details_Opened", page)

            page.click_close_button_side_panel()

        with qase.step("2.2 va_skillset_page, skill_block_context_menu, list view"):
            page.click_change_view_to_list()

            get_ga_requests(browser, "VA_Skillset_View_Changed", page)

            page.click_on_skill_card_context_menu()
            page.click_on_skill_card_context_menu_properties()

            get_ga_requests(browser, "Skill_Properties_Opened", page)

            page.click_details_tab()

            get_ga_requests(browser, "Skill_Details_Opened", page)

            page.click_close_button_side_panel()
