import pytest
from qaseio.pytest import qase
import time
from pages.all_ga_page import AllGAPage
from pages.google_auth_page import GoogleAuthPage
from pages.github_auth_page import GithubAuthPage
from pages.dialog_panel import DialogPanel
from pages.deepy_panel import DeepyPanel
from pages.skill_page import SkillPage
from pages.skill_editor_page import SkillEditorPage
from pages.profile_page import ProfilePage
from pages.messenger_page import MessengerPage
from pages.admin_page import AdminPage
from .config import url, admin_url


@pytest.mark.atom
@qase.title(f"1.test: Scenario 1 main")
def test_scenario_1_main(browser):
    with qase.step(f"1. Wendy visits site: (alpha) (not login) {browser.name}"):
        page = AllGAPage(browser, url)
        page.open()

        # Implementation Details
        page.check_deepy_tooltip()
        page.scroll_public_templates_left()
        page.click_deepy_button()

        panel = DeepyPanel(browser, browser.current_url)
        #panel.check_welcome_dialogue()
        panel.click_deepy_button()

    with qase.step("2. Wendy scrolls though VAs templates"):
        page.scroll_public_templates_right()

    with qase.step("3. Wendy picks a VAs template to check and chat with it"):
        time.sleep(2)
        page.click_kebab_public_template()

        page.click_kebab_public_template_chat()
        panel = DialogPanel(browser, browser.current_url)
        panel.click_restart_button()
        time.sleep(2)
        panel.enter_message()
        panel.send_message()
        panel.check_bot_message()

    with qase.step("4. Wendy likes and use the template (must login)"):
        page.click_use_template()
        time.sleep(1)

        page.click_sign_in_with_github()
        time.sleep(2)

        page = GithubAuthPage(browser, browser.current_url)
        page.enter_login()
        page.enter_password()
        page.click_sign_in()

        #page = AllGAPage(browser, browser.current_url)
        #page.click_sign_in_button()
        #page.click_sign_in_with_github()

        #page = GoogleAuthPage(browser, browser.current_url)
        #time.sleep(2)
        #page.do_auth()

        page = AllGAPage(browser, browser.current_url)
        #time.sleep(3)
        #page.click_use_template()
        #time.sleep(3)
        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.enter_name_in_create_va_mw()
        page.click_use_template_modal_window()
##
##
    with qase.step("5. Wendy wants to edit skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
##
    with qase.step("6. Wendy chooses СhatGPT model"):
        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        page.choose_generative_model()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
##
    with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
        page.click_enter_token_here()
##
        page = ProfilePage(browser, browser.current_url)
        page.enter_token()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.click_enter_token_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page.click_close_button()
#
    with qase.step("8. Wendy chooses her created VAs"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_your_a_edit_button()
#
    with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
##
        page = SkillEditorPage(browser, browser.current_url)
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(2)
        page.enter_new_prompt()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
##
        page.enter_message()
        page.send_message()
        page.check_bot_message_edited_prompt()
##
    with qase.step("10. Wendy clicks play to check VA dialog"):
        page.click_breadcrumbbar_skills()
        #page.click_close_do_you_want_to_close_modal_window()
##
        page = SkillPage(browser, browser.current_url)
        page.click_chat_with_assistant_button()
        time.sleep(2)
##
        panel = DialogPanel(browser, browser.current_url)
        panel.click_build_assistant()
##
        page = AllGAPage(browser, browser.current_url)
        page.check_building_is_done()
##
        time.sleep(2)
        browser.refresh()
        time.sleep(2)
##
        page.click_kebab_your_a()
        page.click_kebab_your_a_chat()
##
        panel = DialogPanel(browser, browser.current_url)
        panel.enter_message()
        time.sleep(2)
        panel.send_message()
        panel.check_bot_message_edited_prompt()
##
    with qase.step("11. Wendy wants to share her created VA"):
        page = AllGAPage(browser, browser.current_url)
##
    with qase.step("12. Wendy understands before sharing her VA, she needs to change visibility of her VA"):
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
##
    with qase.step("13. Wendy changes visibility to Unlisted"):
        page.change_visibility_to_unlisted()
        page.save_visibility()
        page.check_success_toast()
        time.sleep(2)
        page.click_kebab_your_a()
        page.click_kebab_your_a_share()
        share_link = page.get_share_link()
##
    with qase.step("14.(not checked) Wendy waits approval letter"):
        time.sleep(1)
##
    with qase.step("15. Wendy finally sharing her VA with potential clients"):
        time.sleep(1)
#
    with qase.step("The user story for user of Wendy: 1. User visits link of VA"):
        page = MessengerPage(browser, url=share_link)
        page.open()
        time.sleep(3)
#
    with qase.step("The user story for user of Wendy: 2. User starts talk to VA"):
        #page.click_key_button()
        page.click_enter_your_token_mw()
        page.enter_token()
        page.open_choose_service_dropdown()
        time.sleep(1)
        page.choose_service()
        page.click_enter_token_button()
        time.sleep(1)
        #page.check_success_toast()
        #page.check_success_toast_disappear()
        page.click_close_button()
        page.click_close_button_get_started()

        page.enter_message()
        page.send_message()
        page.check_bot_message_edited_prompt()
#
    with qase.step("The user story for user of Wendy: 3. User wants to read about VA"):
        page.click_check_properties()
        time.sleep(2)
#
    with qase.step("The user story for user of Wendy: 4. User wants to share this link with other of his friends"):
        page.click_share_button()
        page.click_share_on_telegram()
        time.sleep(3)

        page = AllGAPage(browser, url)
        page.open()
        browser.refresh()

        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("8. Alex changes visibilty to public templates"):
        page = AllGAPage(browser, url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        page.change_visibility_to_public_template()
        page.publish_visibility()
        page.check_submitted_toast()
        #
        page.check_building_is_done()
    #
    with qase.step("9.Alex waits moderation"):
        page = AdminPage(browser, admin_url)
        page.open()
        page.click_approve_button()
    #
    with qase.step("10.Alex sees his template in public templates he wants to share it "
                   "with others and promote it"):
        page = AllGAPage(browser, url)
        page.open()
        browser.refresh()
        page.check_your_assistant_is_public()
        page.check_your_assistant_public_wrap()
        # page.click_kebab_your_a_share()
        # share_link = page.get_share_link()
        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()
    #
    with qase.step("11.(not checked) Alex needs to check how many users using his templates (after MVP)"):
        time.sleep(1)

#@pytest.mark.atom
@qase.title(f"1.test: Scenario 1 main_extended")
def test_scenario_1_main_extended(browser):
    with qase.step(f"1. Wendy visits site: (alpha) (not login) {browser.name}"):
        page = AllGAPage(browser, url)
        page.open()

        '''
        need to add
        
        page.click_main_menu
        page.click_main_menu_about
        
        page = AllGAPage(browser, url)
        page.open()
        
        page.click_settings_button
        
        page = ProfilePage(browser, browser.current_url)
        page.close_token
        
        page = ProfilePage(browser, browser.current_url)
        page.scroll_public_templates_right()
        page.check_public_template_wrap()
        page.check_info - date_created
        page.check_properties_side_panel - date_created
        page.check_properties_side_panel - public_template_wrap
        page.check_properties_description_accordeon
        page.check_properties_description_accordeon
        page.check_properties_use
        page.check_properties_more
        page.check_properties_more_chat
        page.check_properties_more_check_skills
        page.check_properties_close_button
        
        
#       '''
        # Implementation Details
        panel = DeepyPanel(browser, browser.current_url)
        panel.click_deepy_button()
        panel.check_welcome_dialogue()
        panel.click_deepy_button()
#
    with qase.step("2. Wendy scrolls though VAs templates"):
        page.scroll_public_templates_right()
#
    with qase.step("3. Wendy picks a VAs template to check and chat with it"):
        time.sleep(2)
        page.click_kebab_public_template()
##
        page.click_kebab_public_template_chat()
        panel = DialogPanel(browser, browser.current_url)
        panel.click_restart_button()
        time.sleep(2)
        panel.enter_message()
        panel.send_message()
        panel.check_bot_message()
##
    with qase.step("4. Wendy likes and use the template (must login)"):
        page.click_use_template()
        time.sleep(1)
        page.click_sign_in_button_modal_window()
        time.sleep(2)
#
        page = GoogleAuthPage(browser, browser.current_url)
        time.sleep(2)
        page.do_auth()
#
        page = AllGAPage(browser, browser.current_url)
        time.sleep(3)
        page.clear_name_in_create_va_mw()
        time.sleep(1)
        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.enter_name_in_create_va_mw()
        page.click_use_template_modal_window()
#
#
    with qase.step("5. Wendy wants to edit skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
#
    with qase.step("6. Wendy chooses СhatGPT model"):
        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        page.choose_generative_model()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
#
    with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
        page.click_enter_token_here()
#
        page = ProfilePage(browser, browser.current_url)
        page.enter_token()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.click_enter_token_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page.click_close_button()
#
    with qase.step("8. Wendy chooses her created VAs"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_your_a_edit_button()
#
    with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
#
        page = SkillEditorPage(browser, browser.current_url)
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(2)
        page.enter_new_prompt()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
#
        page.enter_message()
        page.send_message()
        page.check_bot_message_edited_prompt()
#
    with qase.step("10. Wendy clicks play to check VA dialog"):
        page.click_breadcrumbbar_skills()
        #page.click_close_do_you_want_to_close_modal_window()
#
        page = SkillPage(browser, browser.current_url)
        page.click_chat_with_assistant_button()
        time.sleep(2)
#
        panel = DialogPanel(browser, browser.current_url)
        panel.click_build_assistant()
#
        page = AllGAPage(browser, browser.current_url)
        page.check_building_is_done()
#
        time.sleep(2)
        browser.refresh()
        time.sleep(2)
#
        page.click_kebab_your_a()
        page.click_kebab_your_a_chat()
#
        panel = DialogPanel(browser, browser.current_url)
        panel.enter_message()
        time.sleep(2)
        panel.send_message()
        panel.check_bot_message_edited_prompt()
#
    with qase.step("11. Wendy wants to share her created VA"):
        page = AllGAPage(browser, browser.current_url)
#
    with qase.step("12. Wendy understands before sharing her VA, she needs to change visibility of her VA"):
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
#
    with qase.step("13. Wendy changes visibility to Unlisted"):
        page.change_visibility_to_unlisted()
        page.save_visibility()
        page.check_success_toast()
        time.sleep(2)
        page.click_kebab_your_a()
        page.click_kebab_your_a_share()
        share_link = page.get_share_link()
#
    with qase.step("14.(not checked) Wendy waits approval letter"):
        time.sleep(1)
#
    with qase.step("15. Wendy finally sharing her VA with potential clients"):
        time.sleep(1)

    with qase.step("The user story for user of Wendy: 1. User visits link of VA"):
        page = MessengerPage(browser, url=share_link)
        page.open()
        time.sleep(3)
#
    with qase.step("The user story for user of Wendy: 2. User starts talk to VA"):
        page.enter_message()
        page.send_message()
        page.check_bot_message_edited_prompt()
#
    with qase.step("The user story for user of Wendy: 3. User wants to read about VA"):
        page.click_check_properties()
        time.sleep(2)
#
    with qase.step("The user story for user of Wendy: 4. User wants to share this link with other of his friends"):
        page.click_share_button()
        page.click_share_on_social_media_button()
        page.click_share_on_telegram()
        time.sleep(3)

        page = AllGAPage(browser, url)
        page.open()
        browser.refresh()

        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("8. Alex changes visibilty to public templates"):
        page = AllGAPage(browser, url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        page.change_visibility_to_public_template()
        page.publish_visibility()
        page.check_submitted_toast()
        #
        page.check_building_is_done()
    #
    with qase.step("9.Alex waits moderation"):
        page = AdminPage(browser, admin_url)
        page.open()
        page.click_approve_button()
    #
    with qase.step("10.Alex sees his template in public templates he wants to share it "
                   "with others and promote it"):
        page = AllGAPage(browser, url)
        page.open()
        browser.refresh()
        page.check_your_assistant_is_public()
        page.check_your_assistant_public_wrap()
        # page.click_kebab_your_a_share()
        # share_link = page.get_share_link()
        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()
    #
    with qase.step("11.(not checked) Alex needs to check how many users using his templates (after MVP)"):
        time.sleep(1)


#@pytest.mark.atom
@qase.title("3. test: Scenario 2 secondary}")
def test_scenario_2_secondary(browser):
    with qase.step(f"0. Alex visits site: (alpha) (not login) {browser.name}"):
        print(f'name = {browser.name}')
        page = AllGAPage(browser, url)
        page.open()

    with qase.step("1. Alex before create smth from scratch wants to see artchitecture of Assistants in templates"):
        page.scroll_public_templates_right()
        time.sleep(2)
        page.click_kebab_public_template()
        page.click_kebab_public_template_check_skills()

        page = SkillPage(browser, browser.current_url)

        # Implementation Details
        page.click_on_skill_card()
        page.check_is_properties_panel_present()
        page.click_on_skill_card()
        page.check_is_not_properties_panel_present()

    with qase.step("2. Alex want to create VAs from scratch (must login)"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_create_from_scratch_button()

        page.click_sign_in_button_modal_window()
        time.sleep(2)
        page = GoogleAuthPage(browser, browser.current_url)
        page.do_auth()

        page = AllGAPage(browser, browser.current_url)
        time.sleep(2)
        time.sleep(3)
        page.clear_name_in_create_va_mw()
        time.sleep(1)
        page.clear_name_in_create_va_mw()
        time.sleep(2)
        page.enter_name_in_create_va_mw()
        page.enter_description_in_create_va_mw()
        page.click_create_in_create_va_mw()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("3. Alex checks architecture mode"):
        page = SkillPage(browser, browser.current_url)

    with qase.step("4. Alex creates generative skill"):
        page.click_create_skill_button()
        page.click_create_skill_from_scratch_button()
        page.enter_name_in_create_skill_mw()
        page.enter_description_in_create_skill_mw()
        page.click_create_in_create_skill_mw()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("4.1. Alex chooses СhatGPT model"):
        page = SkillEditorPage(browser, browser.current_url)
        time.sleep(2)
        page.open_models_dropdown()
        page.choose_generative_model()
        page.click_save_button()
        page.check_success_toast()
        page.check_success_toast_disappear()

    with qase.step("4.2. Alex clicks on Enter token and goes to page where she can add her own OpenAI key"):
        page.click_enter_token_here()

        page = ProfilePage(browser, browser.current_url)
        page.enter_token()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.click_enter_token_button()
        page.check_success_toast()
        page.check_success_toast_disappear()
        page.click_close_button()

    with qase.step("5. Alex edits prompt and checking skill dialog"):
        page = SkillEditorPage(browser, browser.current_url)
        time.sleep(4)
        page.clear_old_prompt()
        time.sleep(1)
        page.clear_old_prompt()
        time.sleep(2)
        page.enter_new_prompt()
#
    with qase.step("6. Alex saves prompt"):
        page.click_save_button()
        time.sleep(4)
        page.check_success_toast()
        page.check_success_toast_disappear()
#
    with qase.step("7. Alex talks with VA"):
        page.enter_message()
        time.sleep(2)
        page.send_message()
        page.check_bot_message_edited_prompt()
#
    with qase.step("8. Alex changes visibilty to public templates"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        page.change_visibility_to_public_template()
        page.publish_visibility()
        page.check_submitted_toast()
#
        page.check_building_is_done()
#
    with qase.step("9.Alex waits moderation"):
        page = AdminPage(browser, admin_url)
        page.open()
        page.click_approve_button()
#
    with qase.step("10.Alex sees his template in public templates he wants to share it "
                   "with others and promote it"):
        page = AllGAPage(browser, url)
        page.open()
        browser.refresh()

        page.check_your_assistant_is_public()
        page.check_your_assistant_public_wrap()
        #page.click_kebab_your_a_share()
        #share_link = page.get_share_link()
        page.click_kebab_your_a()
        page.click_kebab_your_a_delete()
        page.click_mw_your_a_delete()
        page.check_success_toast()
        page.check_success_toast_disappear()
#
    with qase.step("11.(not checked) Alex needs to check how many users using his templates (after MVP)"):
        time.sleep(1)
