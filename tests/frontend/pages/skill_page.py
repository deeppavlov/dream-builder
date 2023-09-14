from .base_page import BasePage
from locators.locators import SkillPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class SkillPage(BasePage):
    def click_edit_skill(self):
        edit_button = WebDriverWait(self.browser, 6).until(
            EC.element_to_be_clickable(SkillPageLocators.EDIT_SKILL_BUTTON)
        ).click()

    def click_chat_with_assistant_button(self):
        button = self.browser.find_element(*SkillPageLocators.CHAT_WITH_ASSISTANT_BUTTON)
        button.click()

    def click_create_skill_button(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_BUTTON)
        button.click()

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

    def click_on_skill_card(self):
        button = self.browser.find_element(*SkillPageLocators.SKILL_CARD)
        button.click()

    def check_is_properties_panel_present(self):
        edit_button = WebDriverWait(self.browser, 2).until(
            EC.visibility_of_element_located(SkillPageLocators.PROPERTIES_PANEL_HEADER)
        ), "properties_panel is not presented, but should be"

    def check_is_not_properties_panel_present(self):
        edit_button = WebDriverWait(self.browser, 2).until(
            EC.invisibility_of_element_located(SkillPageLocators.PROPERTIES_PANEL_HEADER)
        ), "properties_panel is presented, but should not been"

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
