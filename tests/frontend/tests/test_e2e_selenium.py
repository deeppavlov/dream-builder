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
from tests.frontend.config import url, env_name
from tests.backend.config import counter_ui as counter
from tests.backend.config import empty_counter
from tests.backend.distributions_methods import UserMethods
from tests.frontend.tests.screen.screenshots_processing import save_screenshot, create_screen_folder_if_not_exists


def e2e_scenario(browser, env, screen_size):
    screen_counter = empty_counter()
    create_screen_folder_if_not_exists(env, browser.name, screen_size)
    with qase.step(f"1. Wendy visits site: (alpha) (not login) {browser.name}"):
        page = AllGAPage(browser, url)
        page.open()

        page.check_is_public_template_loaded()
        browser.execute_script("scrollTo(0,0);")
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.check_deepy_tooltip()
        page.scroll_public_templates_left()
        page.click_deepy_button()

        panel = DeepyPanel(browser, browser.current_url)
        # panel.check_welcome_dialogue()
        panel.click_deepy_button()
    with qase.step("2. Wendy scrolls though VAs templates"):
        page.scroll_public_templates_left()
    with qase.step("3. Wendy picks a VAs template to check and chat with it"):
        time.sleep(2)
        page.click_kebab_public_template()
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)
        page.click_kebab_public_template_chat()

        panel = DialogPanel(browser, browser.current_url)
        panel.check_is_dialog_panel_loaded()
        panel.click_restart_button()
        time.sleep(2)
        panel.enter_message()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        panel.send_message()
        panel.check_bot_message()

        panel.click_close_button()
        panel.check_is_dialog_panel_closed()

    with qase.step("4. Wendy likes and use the template (must login)"):
        page.click_use_template()
        page.check_google_github_logo()
        time.sleep(1)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_sign_in_with_github()
        time.sleep(2)
        page = GithubAuthPage(browser, browser.current_url)
        page.enter_login()
        page.enter_password()
        page.click_sign_in()
        page = AllGAPage(browser, browser.current_url)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.enter_name_in_create_va_mw()

        page.clear_description_in_create_va_mw()
        page.enter_description_in_create_va_mw()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_use_template_modal_window()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("5. Wendy wants to edit skill"):
        page = SkillPage(browser, browser.current_url)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_edit_skill()

    with qase.step("6. Wendy chooses СhatGPT model"):
        page = SkillEditorPage(browser, browser.current_url)

        #page.check_error_message_field_cant_be_empty()
        #page.check_error_message_field_cant_be_empty_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.open_models_dropdown()
        page.check_dropdown_opened()

        # баг -
        #page.check_all_en_models()
        # баг -

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.choose_generative_model()
        page.check_dropdown_closed()

        page.click_save_button()
        page.check_success_toast()

        page.check_success_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

    with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
        page.click_enter_token_here()
        page = ProfilePage(browser, browser.current_url)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.enter_token()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.click_enter_token_button()
        page.check_success_toast()
        page.check_success_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_close_button()
    with qase.step("8. Wendy chooses her created VAs"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_your_a_edit_button()
    with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
        page = SkillEditorPage(browser, browser.current_url)
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(2)

        page.check_error_message_field_cant_be_empty()
        page.enter_new_prompt()
        page.check_error_message_field_cant_be_empty_disappear()

        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page.enter_message()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.send_message()
        page.check_bot_message_edited_prompt()
    with qase.step("10. Wendy clicks play to check VA dialog"):
        page.click_breadcrumbbar_skills()
        # page.click_close_do_you_want_to_close_modal_window()
        page = SkillPage(browser, browser.current_url)
        page.click_chat_with_assistant_button()
        time.sleep(2)
        panel = DialogPanel(browser, browser.current_url)
        panel.check_is_dialog_panel_loaded()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        panel.click_build_assistant()
        page = AllGAPage(browser, browser.current_url)

        page.check_building_is_done()
        time.sleep(2)
        browser.refresh()
        time.sleep(2)
        page.click_kebab_your_a()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_kebab_your_a_chat()
        panel = DialogPanel(browser, browser.current_url)
        panel.check_is_dialog_panel_loaded()
        time.sleep(2)
        panel.enter_message()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        panel.send_message()

        # баг - !
        panel.check_bot_message_edited_prompt()
        # баг - !

        panel.click_close_button()
        panel.check_is_dialog_panel_closed()

    with qase.step("11. Wendy wants to share her created VA"):
        page = AllGAPage(browser, browser.current_url)

    with qase.step("12. Wendy understands before sharing her VA, she needs to change visibility of her VA"):
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()

    with qase.step("13. Wendy changes visibility to Unlisted"):

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.change_visibility_to_unlisted()
        page.check_unlisted_visibility_tooltip()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.save_visibility()
        page.check_success_toast()
        page.check_success_toast_disappear()

        page.click_kebab_your_a()
        page.click_kebab_your_a_share()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        share_link = page.get_share_link()

    with qase.step("The user story for user of Wendy: 1. User visits link of VA"):
        page = MessengerPage(browser, url=share_link)
        page.open()
        time.sleep(3)

    with qase.step("The user story for user of Wendy: 2. User starts talk to VA"):
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        # page.click_key_button()
        page.click_enter_your_token_mw()
        page.enter_token()
        page.open_choose_service_dropdown()

        page.choose_service()
        page.click_enter_token_button()

        page.check_success_toast()
        page.check_success_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_close_button()
        page.click_close_button_get_started()

        page.enter_message()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.send_message()
        page.check_bot_message_edited_prompt()
        page.click_restart_button()

        page.check_dialog_is_restarted()

    with qase.step("The user story for user of Wendy: 3. User wants to read about VA"):
        page.click_properties_panel()
        page.click_main_menu()
        page.check_properties_is_opened()
        page.check_main_menu_is_opened()
        time.sleep(2)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_close_button_properties_panel()
        page.check_properties_is_closed()
        page.check_main_menu_is_closed()
    with qase.step("The user story for user of Wendy: 4. User wants to share this link with other of his friends"):
        page.click_share_button()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_share_on_telegram()
        time.sleep(5)

        browser.switch_to.window(browser.window_handles[1])
        browser.close()
        browser.switch_to.window(browser.window_handles[0])

        page.close_share_mw()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_properties_panel()
        page.check_properties_is_opened()
        page.click_open_dream_builder_button()
        browser.switch_to.window(browser.window_handles[1])

    with qase.step("8. Alex changes visibilty to public templates"):
        page = AllGAPage(browser, url)
        page.open()
        page.check_is_public_template_loaded()
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        page.change_visibility_to_public_template()
        page.check_public_template_visibility_tooltip()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)
        page.publish_visibility()
        page.click_continue_publish_visibility()
        page.check_submitted_toast()
        page.check_submitted_toast_disappear()
        page.check_building_is_done()
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        # - не можем проверить, нет доступа к админке
        # page = AdminPage(browser, admin_url)
        # page.open()
        # age.click_approve_button()
        # page = AllGAPage(browser, admin_url)
        # browser.refresh()
        # page.check_your_assistant_is_public()
        # page.check_your_assistant_public_wrap()
        # page.click_kebab_your_a_share()
        # share_link = page.get_share_link()
        # - не можем проверить, нет доступа к админке

    with qase.step("10.Alex want to edit assistant and edit visibility to unlisted"):
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        page.change_visibility_to_private()
        page.save_visibility()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("10.Alex check the integration page"):
        page.click_your_a_edit_button()
        page = SkillPage(browser, browser.current_url)
        page.switch_to_integration_tab()
        page.click_copy_code_button()
        page.check_copied_toast()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.switch_to_api_call_tab()
        page.click_copy_code_button()
        page.check_copied_toast()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.switch_to_nodejs_tab()
        page.click_copy_code_button()
        page.check_copied_toast()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.switch_to_python_tab()
        page.click_copy_code_button()
        page.check_copied_toast()
        page.check_copied_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_user_avatar_button()
        page.click_profile_settings_button()

        page = ProfilePage(browser, browser.current_url)

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.switch_to_personal_tokens_tab()
        page.click_remove_button()

        page.check_success_toast()
        page.check_success_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.switch_to_personal_account_tab()
        page.click_change_language()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_cancel_button_language_mw()
        page.click_close_button()

    with qase.step("10.Alex check token error message"):
        page = SkillPage(browser, browser.current_url)
        page.click_chat_with_assistant_button()

        page = DialogPanel(browser, browser.current_url)
        page.check_is_dialog_panel_loaded()
        page.check_token_error_message()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.click_close_button()
        page.check_is_dialog_panel_closed()

    with qase.step("10.Alex want to delete his english Assistant"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)

        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("10.Alex want to create russian Assistant"):
        page.click_create_from_scratch_button()
        page.click_choose_language_assistant_dropdown()
        page.click_choose_language_assistant_ru()
        page.enter_name_in_create_va_mw()
        page.enter_description_in_create_va_mw()
        page.click_create_in_create_va_mw()

        page.check_success_toast()
        page.check_success_toast_disappear()

        page = SkillEditorPage(browser, browser.current_url)

        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()

        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        page.check_dropdown_opened()
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

        page.choose_generative_model()
        page.check_dropdown_closed()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()

        # - баг!
        page.check_all_ru_models()
        # - баг!

        page.check_default_prompt_ru()
        save_screenshot(browser, env, browser.name, screen_size, screen_counter)

    with qase.step("10.Alex want to delete his russian Assistant"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()

        save_screenshot(browser, env, browser.name, screen_size, screen_counter)


def decorator_base_test(func):
    def wrapper(self, browser, screen_size):
        func(self, browser, screen_size)
        env = env_name
        e2e_scenario(browser, env, screen_size)

    return wrapper


class TestUI:
    def teardown_method(self):
        user = UserMethods()
        names_list = user.get_list_of_private_va_wo_assert()
        if names_list:
            for name in names_list:
                user.delete_va_by_name(name)

    @pytest.mark.chrome_e2e
    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Chrome")
    def test_chrome_e2e(self, browser, screen_size):
        pass

    @pytest.mark.edge_e2e
    @pytest.mark.parametrize('browser', ['edge'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Edge")
    def test_edge_e2e(self, browser, screen_size):
        pass

    @pytest.mark.firefox_e2e
    @pytest.mark.parametrize('browser', ['firefox'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Firefox")
    def test_firefox_e2e(self, browser, screen_size):
        pass

    @pytest.mark.chrome_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Chrome")
    def test_chrome_e2e_parametrize_screen_size(self, browser, screen_size):
        pass

    @pytest.mark.edge_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['edge'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Edge")
    def test_edge_e2e_parametrize_screen_size(self, browser, screen_size):
        pass

    @pytest.mark.firefox_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['firefox'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @decorator_base_test
    @qase.title(f"{counter()}. e2e - Firefox ")
    def test_firefox_e2e_parametrize_screen_size(self, browser, screen_size):
        pass
