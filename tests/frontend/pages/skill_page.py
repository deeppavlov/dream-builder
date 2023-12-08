from .base_page import BasePage
from tests.frontend.locators.locators import SkillPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from .create_va_mw import Create_VA_MW
from .properties_a_panel import ProperiesAPanel
from .your_a_kebab import YourAKebab
from .skill_kebab import SkillKebab
from tests.frontend.config import skill_name, your_skill_name, default_skill_name, added_skill_name


class SkillPage(BasePage, Create_VA_MW, ProperiesAPanel, YourAKebab, SkillKebab):
    page_type = "va_skillset_page"
    view = "none"

    def click_edit_skill(self):
        edit_button = (
            WebDriverWait(self.browser, 8)
            .until(EC.element_to_be_clickable(SkillPageLocators.EDIT_SKILL_BUTTON))
            .click()
        )

        BasePage.source_type = "skill_editor_dialog_panel"
        # BasePage.skill_view = "none"

    def click_properties_assistant_button(self):
        button = self.browser.find_element(*SkillPageLocators.PROPERTIES_ASSISTANT_BUTTON)
        button.click()

        self.source_type = "va_sidepanel"

    def click_create_skill_button(self):
        button = (
            WebDriverWait(self.browser, 6)
            .until(EC.element_to_be_clickable(SkillPageLocators.CREATE_SKILL_BUTTON))
            .click()
        )

    def click_create_skill_from_scratch_button(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_FROM_SCRATCH_BUTTON)
        button.click()

        BasePage.skill_created_type = "from_scratch"
        BasePage.old_model_name = "GPT-3.5 (Advanced, 4K tokens)"

    def click_add_skill_in_choose_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.ADD_SKILL_BUTTON_IN_CHOOSE_SKILL_MW)
        button.click()

        BasePage.skill_created_type = "from_from_template"
        BasePage.skill_template_name = added_skill_name
        BasePage.skill_name = added_skill_name
        BasePage.new_model_name = "GPT-3.5 (Advanced, 4K tokens)"
        BasePage.old_model_name = "GPT-3.5 (Advanced, 4K tokens)"
        BasePage.model_name = "GPT-3.5 (Advanced, 4K tokens)"

    def enter_name_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(your_skill_name)

        BasePage.skill_name = your_skill_name

    def enter_description_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("New description")

    def enter_description_upper_limit_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("1234 " * 101)

    def clear_name_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys("")

    def clear_description_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys("")

    def click_create_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CREATE_BUTTON)
        button.click()

    def click_close_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CLOSE_BUTTON)
        button.click()

    def click_cancel_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CANCEL_BUTTON)
        button.click()

    def click_ok_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_OK_BUTTON)
        button.click()

    def click_save_in_rename_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.RENAME_SKILL_SAVE_BUTTON)
        button.click()

    def check_error_message_name_cant_be_empty_in_create_skill_mw(self):
        error = self.browser.find_element(*SkillPageLocators.CREATE_VA_ERROR_NAME_CANT_BE_EMPTY)

    def check_error_message_description_cant_be_empty_in_create_skill_mw(self):
        error = self.browser.find_element(*SkillPageLocators.CREATE_VA_ERROR_DESCRIPTION_CANT_BE_EMPTY)

    def check_error_message_limit_text_description_in_create_skill_mw(self):
        error = self.browser.find_element(*SkillPageLocators.CREATE_VA_ERROR_LIMIT_TEXT_DESCRIPTION)

    def click_on_skill_card(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD)
        button.click()

    def click_on_skill_card_context_menu(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU)
        button.click()

        BasePage.source_type = "skill_block_context_menu"

    def click_on_skill_card_context_menu_rename(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_RENAME)
        button.click()

    def click_on_skill_card_context_menu_properties(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_PROPERTIES)
        button.click()

    def click_on_skill_card_context_menu_delete(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_DELETE)
        button.click()

    def click_delete_skill_delete_mw(self):
        button = self.browser.find_element(*SkillPageLocators.DELETE_SKILL_DELETE_MW)
        button.click()

    def check_is_properties_panel_present(self):
        edit_button = (
            WebDriverWait(self.browser, 2).until(
                EC.visibility_of_element_located(SkillPageLocators.PROPERTIES_PANEL_HEADER)
            ),
            "properties_panel is not presented, but should be",
        )

    def check_is_not_properties_panel_present(self):
        edit_button = (
            WebDriverWait(self.browser, 2).until(
                EC.invisibility_of_element_located(SkillPageLocators.PROPERTIES_PANEL_HEADER)
            ),
            "properties_panel is presented, but should not been",
        )

    def click_build_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.BUILD_ASSISTANT_BUTTON)
        button.click()

        BasePage.source_type = "va_control_block"

    def click_stop_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.STOP_ASSISTANT_BUTTON)
        button.click()

        BasePage.source_type = "va_control_block"

    def check_assistant_stopped(self):
        build_button = WebDriverWait(self.browser, 5).until(
            EC.presence_of_element_located(SkillPageLocators.BUILD_ASSISTANT_BUTTON)
        )

    def click_duplicate_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.DUPLICATE_ASSISTANT_BUTTON)
        button.click()

    def click_share_buton(self):
        button = self.browser.find_element(*SkillPageLocators.SHARE_BUTTON)
        button.click()

    def click_visibility_button(self):
        button = self.browser.find_element(*SkillPageLocators.VISIBILITY_BUTTON)
        button.click()

    def click_read_first(self):
        button = self.browser.find_element(*SkillPageLocators.READ_FIRST_BUTTON)
        button.click()

    def close_read_first_panel(self):
        button = self.browser.find_element(*SkillPageLocators.CLOSE_READ_FIRST_PANEL)
        button.click()

    def click_change_view_to_list(self):
        button = self.browser.find_element(*SkillPageLocators.CHANGE_VIEW_BUTTON_TO_LIST)
        button.click()

        BasePage.skill_view = "list"

    def click_change_view_to_card(self):
        button = self.browser.find_element(*SkillPageLocators.CHANGE_VIEW_BUTTON_TO_LIST)
        button.click()

        BasePage.skill_view = "card"

    # INTEGRATION TAB

    def switch_to_integration_tab(self):
        button = self.browser.find_element(*SkillPageLocators.INTEGRATION_TAB)
        button.click()

    def switch_to_skills_tab(self):
        button = self.browser.find_element(*SkillPageLocators.SKILLS_TAB)
        button.click()

    def switch_to_web_chat_tab(self):
        button = self.browser.find_element(*SkillPageLocators.WEB_CHAT_TAB)
        button.click()

    def switch_to_api_call_tab(self):
        button = self.browser.find_element(*SkillPageLocators.API_CALL_TAB)
        button.click()

    def switch_to_curl_tab(self):
        button = self.browser.find_element(*SkillPageLocators.CURL_TAB)
        button.click()

    def switch_to_nodejs_tab(self):
        button = self.browser.find_element(*SkillPageLocators.NODE_JS_TAB)
        button.click()

    def switch_to_python_tab(self):
        button = self.browser.find_element(*SkillPageLocators.PYTHON_TAB)
        button.click()

    def click_copy_code_button(self):
        button = self.browser.find_element(*SkillPageLocators.COPY_CODE)
        button.click()
