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
    @qase.title(f"test_access_tokens_page_view")
    def test_access_tokens_page_view(self, browser: webdriver.Chrome | webdriver.Edge | webdriver.Firefox, screen_size):
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
        page.click_edit_skill()

        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        page.choose_generative_model()
        page.click_save_button()

        page.check_saving_toast()
        page.check_success_toast()
        page.check_success_toast_disappear()

        page.click_bcb_your_assistant_name_button()

        page = SkillPage(browser, browser.current_url)
        page.click_build_assistant()

        page = AllGAPage(browser, browser.current_url)
        page.check_building_is_done()

        with qase.step("1.1 va_skillset_page, profile_settings"):
            page.click_your_a_edit_button()

            page = SkillPage(browser, browser.current_url)
            page.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillPage(browser, browser.current_url)

        with qase.step("1.2 va_skillset_page, services_common_button"):
            page.click_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillPage(browser, browser.current_url)

        with qase.step("1.3 va_skillset_page, va_dialog_panel"):
            page.click_chat_with_assistant_button()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillPage(browser, browser.current_url)

        with qase.step("2.1 va_skill_editor, profile_settings"):
            page.click_edit_skill()
            page = SkillEditorPage(browser, browser.current_url)
            page.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillEditorPage(browser, browser.current_url)

        with qase.step("2.2 va_skill_editor, services_common_button"):
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillEditorPage(browser, browser.current_url)

        with qase.step("2.3 va_skill_editor, skill_editor_dialog_panel"):
            page.click_enter_token_here()

            page = ProfilePage(browser, browser.current_url)

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillEditorPage(browser, browser.current_url)

        with qase.step("3.1 yourbots, profile_settings"):
            page.click_home_button()

            page = AllGAPage(browser, browser.current_url)
            page.click_show_all_your_assistants()

            page = AllYourAPage(browser, browser.current_url)
            page.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllYourAPage(browser, browser.current_url)

        with qase.step("3.2 yourbots, services_common_button"):
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllYourAPage(browser, browser.current_url)

        with qase.step("3.3 yourbots, va_dialog_panel"):
            page.click_kebab_your_a()
            page.click_kebab_your_a_chat()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllYourAPage(browser, browser.current_url)

        with qase.step("4.1 allbots, profile_settings"):
            page.click_show_all_templates_assistants()
            page = AllTemplatesAPage(browser, browser.current_url)
            page.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllTemplatesAPage(browser, browser.current_url)

        with qase.step("4.2 allbots, services_common_button"):
            page.click_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllTemplatesAPage(browser, browser.current_url)

        with qase.step("4.3 allbots, va_template_dialog_panel,"):
            page.click_kebab_public_template()
            page.click_kebab_public_template_chat()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllTemplatesAPage(browser, browser.current_url)

        with qase.step("5.1 all_va_page, profile_settings"):
            page.click_home_button()
            panel = AllGAPage(browser, browser.current_url)
            panel.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllGAPage(browser, browser.current_url)

        with qase.step("5.2 all_va_page, services_common_button"):
            page.click_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllGAPage(browser, browser.current_url)

        with qase.step("5.3 all_va_page, va_dialog_panel"):
            page.click_kebab_your_a()
            page.click_kebab_your_a_chat()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllGAPage(browser, browser.current_url)

        with qase.step("5.3 allbots, va_template_dialog_panel"):
            page.click_kebab_public_template()
            page.click_kebab_public_template_chat()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = AllGAPage(browser, browser.current_url)

        with qase.step("6.1 va_template_skillset_page, profile_settings"):
            page.click_kebab_public_template()
            page.click_kebab_public_template_check_skills()

            page = SkillTemplatePage(browser, browser.current_url)
            page.click_user_avatar_button()
            page.click_profile_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("6.2 va_template_skillset_page, services_common_button"):
            page.click_settings_button()

            page = ProfilePage(browser, browser.current_url)
            page.switch_to_personal_tokens_tab()

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillTemplatePage(browser, browser.current_url)

        with qase.step("6.3 va_template_skillset_page, va_dialog_panel"):
            page.click_chat_with_assistant_button()
            panel = DialogPanel(browser, browser.current_url)
            panel.click_enter_token_button()

            page = ProfilePage(browser, browser.current_url)

            get_ga_requests(browser, "AccessTokens_Page_View", page)

            page.enter_token()
            page.open_choose_service_dropdown()
            page.choose_service()

            get_ga_requests(browser, "AccessTokens_Pasted", page)

            page.click_enter_token_button()

            get_ga_requests(browser, "AccessTokens_Added", page)

            page.click_remove_button()

            get_ga_requests(browser, "AccessTokens_Deleted", page)

            page.click_close_button()
            page = SkillTemplatePage(browser, browser.current_url)
