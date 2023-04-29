from .base_page import BasePage
from locators.locators import SkillEditorPageLocators
import time


class SkillEditorPage(BasePage):
    def open_models_dropdown(self):
        button = self.browser.find_element(*SkillEditorPageLocators.OPEN_MODELS_DROPDOWN)
        button.click()

    def choose_generative_model(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CHOOSE_MODEL)
        button.click()

    def click_enter_token_here(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CHOOSE_MODEL)
        button.click()

    def clear_old_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.click()
        textarea.clear()

    def enter_new_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.click()
        textarea.send_keys("new_prompt")

    def click_save_button(self):
        button = self.browser.find_element(*SkillEditorPageLocators.SAVE_BUTTON)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        button = self.browser.find_element(*SkillEditorPageLocators.SEND_BUTTON)
        button.click()

    def check_bot_message(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE)

    def restart_dialog(self):
        button = self.browser.find_element(*SkillEditorPageLocators.RESTART_DIALOG_BUTTON)
        button.click()

    def click_breadcrumbbar_skill_name(self):
        button = self.browser.find_element(*SkillEditorPageLocators.BCB_SKILL_NAME)
        button.click()

    def click_close_do_you_want_to_clos_modal_window(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CLOSE_BUTTON_MODAL_WINDOW)
        button.click()



