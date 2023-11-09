from .base_page import BasePage
from tests.frontend.locators.locators import SkillPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


class SkillPage(BasePage):
    def click_edit_skill(self):
        edit_button = (
            WebDriverWait(self.browser, 6)
            .until(EC.element_to_be_clickable(SkillPageLocators.EDIT_SKILL_BUTTON))
            .click()
        )

    def click_chat_with_assistant_button(self):
        button = self.browser.find_element(*SkillPageLocators.CHAT_WITH_ASSISTANT_BUTTON)
        button.click()

    def click_create_skill_button(self):
        button = (
            WebDriverWait(self.browser, 6)
                .until(EC.element_to_be_clickable(SkillPageLocators.CREATE_SKILL_BUTTON))
                .click()
        )

    def click_create_skill_from_scratch_button(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_FROM_SCRATCH_BUTTON)
        button.click()

    def enter_name_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys("New Skill Name")

    def enter_description_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("New description")

    def enter_description_upper_limit_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys('1234 '*101)

    def clear_name_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys('')

    def clear_description_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys('')

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

    def click_on_skill_card_context_menu_rename(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_RENAME)
        button.click()

    def click_on_skill_card_context_menu_properties(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_PROPERTIES)
        button.click()

    def click_on_skill_card_context_menu_delete(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD_CONTEXT_MENU_DELETE)
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

    def click_stop_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.STOP_ASSISTANT_BUTTON)
        button.click()

    def click_duplicate_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.DUPLICATE_ASSISTANT_BUTTON)
        button.click()

    def click_info_assistant(self):
        button = self.browser.find_element(*SkillPageLocators.INFO_ASSISTANT_BUTTON)
        button.click()

    def click_share_buton(self):
        button = self.browser.find_element(*SkillPageLocators.SHARE_BUTTON)
        button.click()

    def click_visibility_dropbox(self):
        button = self.browser.find_element(*SkillPageLocators.VISIBILITY_DROPBOX)
        button.click()

    def select_private_visibility(self):
        button = self.browser.find_element(*SkillPageLocators.PRIVATE_VISIBILITY_BUTTON)
        button.click()

    def select_unlisted_visibility(self):
        button = self.browser.find_element(*SkillPageLocators.UNLISTED_VISIBILITY_BUTTON)
        button.click()

    def select_public_template_visibility(self):
        button = self.browser.find_element(*SkillPageLocators.PUBLIC_TEMPLATE_VISIBILITY_BUTTON)
        button.click()

    def click_read_first(self):
        button = self.browser.find_element(*SkillPageLocators.READ_FIRST_BUTTON)
        button.click()

    def close_read_first_panel(self):
        button = self.browser.find_element(*SkillPageLocators.CLOSE_READ_FIRST_PANEL)
        button.click()

    def click_change_view(self):
        button = self.browser.find_element(*SkillPageLocators.CHANGE_VIEW_BUTTON)
        button.click()

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


