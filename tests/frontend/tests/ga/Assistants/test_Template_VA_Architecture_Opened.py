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
    @qase.title(f"test_template_va_architecture_opened")
    def test_template_va_architecture_opened(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
        with qase.step("1.1 all_va_page, va_template_sidepanel, card view"):
            page = AllGAPage(browser, browser.current_url)
            page.click_on_public_template_card()
            page.click_more_button_side_panel()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("1.2 all_va_page, va_template_sidepanel, list view"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_change_view_type_to_list()
            page.click_on_public_template_card()
            page.click_more_button_side_panel()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("1.3 all_va_page, va_templates_block, list view"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("1.4 all_va_page, va_templates_block, card view"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_change_view_type_to_card()
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("2.1 allbots, va_template_sidepanel, card view"):
            page.click_home_button()
            page = AllGAPage(browser, browser.current_url)
            page.click_show_all_templates_assistants()

            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_on_public_template_card()
            page.click_more_button_side_panel()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("2.2 allbots, va_template_sidepanel, list view"):
            page.click_bcb_public_templates_button()
            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_change_view_type_to_list()
            page.click_on_public_template_card()
            page.click_more_button_side_panel()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("2.3 allbots, va_templates_block, list view"):
            page.click_bcb_public_templates_button()
            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("2.4 allbots, va_templates_block, card view"):
            page.click_bcb_public_templates_button()
            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_change_view_type_to_card()
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)

            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("3 link"):
            link = browser.current_url
            page.click_home_button()
            browser.get(link)

            get_ga_requests(browser, "Template_VA_Architecture_Opened", page)
