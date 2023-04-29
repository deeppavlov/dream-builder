from qaseio.pytest import qase
import time
from pages.all_ga_page import AllGAPage
from pages.google_auth_page import GoogleAuthPage
from pages.dialog_panel import DialogPanel
from pages.skill_page import SkillPage
from pages.skill_editor_page import SkillEditorPage
from pages.profile_page import ProfilePage
from config import url


@qase.title(f"1.test: Scenario 1 main")
def test_scenario_1_main(browser):
    with qase.step("1. Wendy visits site: (alpha) (not login)"):
        page = AllGAPage(browser, url)
        page.open()

    with qase.step("2. Wendy scrolls though VAs templates"):
        page.scroll_public_templates_right()

    with qase.step("3. Wendy picks a VAs template to check and chat with it"):
        time.sleep(2)
        page.click_kebab_public_template()
        time.sleep(2)

        page.click_kebab_public_template_chat()
        time.sleep(2)
        panel = DialogPanel(browser, browser.current_url)
        panel.click_run_test()
        panel.enter_message()
        panel.send_message()
        time.sleep(7)
        panel.check_bot_message()

    with qase.step("4. Wendy likes and use the template (must login)"):
        page.click_use_template()
        time.sleep(2)

        page.click_sign_in_button_modal_window()
        time.sleep(2)

        page = GoogleAuthPage(browser, browser.current_url)
        page.do_auth()
        time.sleep(2)
        page = AllGAPage(browser, browser.current_url)
        time.sleep(5)

        page.click_use_template()
        page.click_use_template_modal_window()

    with qase.step("5. Wendy wants to edit skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()

    with qase.step("6. Wendy chooses СhatGPT modal"):
        page = SkillEditorPage(browser, browser.current_url)
        page.open_models_dropdown()
        page.choose_generative_model()

    with qase.step("7. Wendy clicks on Enter token and goes to page where she can add her own OpenAI key"):
        pass
        # page.click_enter_token_here()

        page = ProfilePage(browser, browser.current_url)
        page.enter_token()
        page.open_choose_service_dropdown()
        page.choose_service()
        page.click_enter_token_button()

    with qase.step("8. Wendy chooses her created VAs"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)
        page.click_private_edit_button()

    with qase.step("9. Wendy edits prompts till she likes dialog of the skill"):
        page = SkillPage(browser, browser.current_url)
        page.click_edit_skill()

        page = SkillEditorPage(browser, browser.current_url)
        page.clear_old_prompt()
        page.enter_new_prompt()
        page.click_save_button()
        page.enter_message()
        page.send_message()
        time.sleep(7)
        page.check_bot_message()

    with qase.step("10. Wendy clicks play to check VA dialog"):
        page.click_breadcrumbbar_skill_name()
        page.click_close_do_you_want_to_clos_modal_window()

        page = SkillPage(browser, browser.current_url)
        page.click_paly_button()

        panel = DialogPanel(browser, browser.current_url)
        panel.click_run_test()
        panel.enter_message()
        panel.send_message()
        time.sleep(7)
        panel.check_bot_message()

    with qase.step("11. Wendy wants to share her created VA"):
        page.click_home_button()
        page = AllGAPage(browser, browser.current_url)

    with qase.step("12. Wendy undestands before sharing her VA, she needs to change visibility of her VA"):
        pass

    with qase.step("13. Wendy changes visibility to Unlisted"):
        pass

    with qase.step("14. Wendy waits approval letter"):
        pass

    with qase.step("15. Wendy finally sharing her VA with potential clients"):
        pass
