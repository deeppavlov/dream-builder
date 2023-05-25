import pytest
from qaseio.pytest import qase
import time
from pages.all_ga_page import AllGAPage
from pages.google_auth_page import GoogleAuthPage
from pages.dialog_panel import DialogPanel
from pages.deepy_panel import DeepyPanel
from pages.skill_page import SkillPage
from pages.skill_editor_page import SkillEditorPage
from pages.profile_page import ProfilePage
from pages.messenger_page import MessengerPage
from .config import url


#@pytest.mark.atom
@qase.title(f"1.test: Scenario 1 main")
def test_scenario_1_main(browser):
    with qase.step("1. Wendy visits site: (alpha) (not login)"):
        page = AllGAPage(browser, url)
        #print(f'url = =  = {url}')
        page.open()

        # Implementation Details
        panel = DeepyPanel(browser, browser.current_url)
        #panel.check_deepy_tooltip()
        panel.click_deepy_button()
        time.sleep(2)
        #panel.check_welcome_dialogue()
        panel.click_deepy_button()


    with qase.step("2. Wendy scrolls though VAs templates"):
        page.scroll_public_templates_right()

    with qase.step("3. Wendy picks a VAs template to check and chat with it"):
        time.sleep(2)
        page.click_kebab_public_template()
        time.sleep(2)

        page.click_kebab_public_template_chat()
        time.sleep(2)
        panel = DialogPanel(browser, browser.current_url)
        panel.enter_message()
        time.sleep(1)
        panel.send_message()
        time.sleep(9)
        panel.check_bot_message()

    with qase.step("4. Wendy likes and use the template (must login)"):
        page.click_use_template()
        time.sleep(2)

        page.click_sign_in_button_modal_window()
        time.sleep(2)

        page = GoogleAuthPage(browser, browser.current_url)
        page.do_auth()

        page = AllGAPage(browser, browser.current_url)
        time.sleep(5)

        #page.click_use_template()
        #time.sleep(1)

        page.click_use_template_modal_window()
        time.sleep(2)

    with qase.step("5. Wendy wants to edit skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
        time.sleep(2)

    with qase.step("6. Wendy chooses СhatGPT model"):
        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        time.sleep(1)
        page.choose_generative_model()
        time.sleep(1)
        page.click_save_button()
        time.sleep(3)

    with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
        page.click_enter_token_here()

        page = ProfilePage(browser, browser.current_url)
        page.enter_token()
        time.sleep(1)
        page.open_choose_service_dropdown()
        page.choose_service()
        time.sleep(1)

        page.click_enter_token_button()
        time.sleep(2)

    with qase.step("8. Wendy chooses her created VAs"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_your_a_edit_button()
        time.sleep(2)

    with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
        time.sleep(2)

        page = SkillEditorPage(browser, browser.current_url)
        page.clear_old_prompt()
        page.enter_new_prompt()
        time.sleep(2)
        page.click_save_button()
        time.sleep(2)
        page.enter_message()
        page.send_message()
        time.sleep(7)
        page.check_bot_message()
        time.sleep(2)

    with qase.step("10. Wendy clicks play to check VA dialog"):
        page.click_breadcrumbbar_skill_name()
        page.click_close_do_you_want_to_close_modal_window()
        time.sleep(2)

        page = SkillPage(browser, browser.current_url)
        page.click_chat_with_assistant_button()
        time.sleep(2)

        panel = DialogPanel(browser, browser.current_url)
        panel.click_build_assistant()
        time.sleep(55)

        page = AllGAPage(browser, browser.current_url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_chat()

        panel.enter_message()
        panel.send_message()
        time.sleep(7)
        panel.check_bot_message()
        time.sleep(2)

    with qase.step("11. Wendy wants to share her created VA"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        time.sleep(2)

    with qase.step("12. Wendy understands before sharing her VA, she needs to change visibility of her VA"):
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()

    with qase.step("13. Wendy changes visibility to Unlisted"):
        page.change_visibility_to_unlisted()
        page.save_visibility()
        time.sleep(1)
        page.click_kebab_your_a()
        time.sleep(1)
        page.click_kebab_your_a_share()
        share_link = page.get_share_link()
        time.sleep(2)

    with qase.step("14.(not checked) Wendy waits approval letter"):
        time.sleep(1)

    with qase.step("15. Wendy finally sharing her VA with potential clients"):
        page = MessengerPage(browser, share_link)
        page.open()
        time.sleep(10)

    with qase.step("The user story for user of Wendy: 1. User visits link of VA"):
        page = MessengerPage(browser, share_link)
        page.open()
        time.sleep(3)

    with qase.step("The user story for user of Wendy: 2. User starts talk to VA"):
        page.enter_message()
        page.send_message()
        time.sleep(3)
        #page.check_bot_message()

    with qase.step("The user story for user of Wendy: 3. User wants to read about VA"):
        page.click_check_properties()
        time.sleep(1)

    with qase.step("The user story for user of Wendy: 4. User wants to share this link with other of his friends"):
        page.click_share_button()
        time.sleep(1)
        page.click_share_on_social_media_button()
        time.sleep(1)
        page.click_share_on_telegram()
        time.sleep(3)


@pytest.mark.atom
@qase.title(f"3. test: Scenario 2 secondary")
def test_scenario_2_secondary(browser):
    with qase.step("0. Alex visits site: (alpha) (not login)"):
        page = AllGAPage(browser, url)
        page.open()

    with qase.step("1. Alex before create smth from scratch wants to see artchitecture of Assistants in templates"):
        page.scroll_public_templates_right()
        time.sleep(1)
        page.click_kebab_public_template()
        time.sleep(1)
        page.click_kebab_public_template_check_skills()
        time.sleep(2)

        page = SkillPage(browser, browser.current_url)

        # Implementation Details
        page.click_on_skill_card()
        #page.check_is_properties_panel_present()
        time.sleep(1)
        page.click_on_skill_card()
        #page.check_is_not_properties_panel_present()

    with qase.step("2. Alex want to create VAs from scratch (must login)"):
        page.click_home_button()
        time.sleep(2)
        page = AllGAPage(browser, browser.current_url)
        page.click_create_from_scratch_button()
        page.click_sign_in_button_modal_window()

        time.sleep(2)

        page = GoogleAuthPage(browser, browser.current_url)
        page.do_auth()

        page = AllGAPage(browser, browser.current_url)
        time.sleep(2)

        page.enter_name_in_create_va_mw()
        page.enter_description_in_create_va_mw()
        page.click_create_in_create_va_mw()

    with qase.step("3. Alex checks architecture mode"):
        page = SkillPage(browser, browser.current_url)

    with qase.step("4. Alex creates generative skill"):
        time.sleep(3)
        page.click_create_skill_button()
        time.sleep(1)
        page.click_create_skill_from_scratch_button()
        time.sleep(1)
        page.enter_name_in_create_skill_mw()
        page.enter_description_in_create_skill_mw()
        time.sleep(1)
        page.click_create_in_create_skill_mw()
        time.sleep(1)
        page.click_ok_in_create_skill_mw()
        time.sleep(1)


    with qase.step("5. Alex edits prompt and checking skill dialog"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()
        time.sleep(1)
        page = SkillEditorPage(browser, browser.current_url)
        page.clear_old_prompt()
        page.enter_new_prompt()
        time.sleep(1)

    with qase.step("6. Alex saves prompt"):
        page.click_save_button()
        time.sleep(1)

    with qase.step("7. Alex talks with VA"):
        page.enter_message()
        page.send_message()
        time.sleep(7)
        page.check_bot_message()

    with qase.step("8. Alex changes visibilty to public templates"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_kebab_your_a()
        page.click_kebab_your_a_visibility()
        time.sleep(1)
        page.change_visibility_to_public_template()
        time.sleep(1)
        page.publish_visibility()


    with qase.step("9.(not checked) Alex waits moderation"):
        time.sleep(1)

    with qase.step("10.(not checked) Alex sees his template in public templates he wants to share it "
                   "with others and promote it"):
        time.sleep(1)

    with qase.step("11.(not checked) Alex needs to check how many users using his templates (after MVP)"):
        time.sleep(1)
