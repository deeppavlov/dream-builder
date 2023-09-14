from .base_page import BasePage
from locators.locators import SkillEditorPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class SkillEditorPage(BasePage):
    def open_models_dropdown(self):
        button = self.browser.find_element(*SkillEditorPageLocators.OPEN_MODELS_DROPDOWN)
        button.click()

    def choose_generative_model(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CHOOSE_MODEL)
        button.click()

    def click_enter_token_here(self):
        button = self.browser.find_element(*SkillEditorPageLocators.ENTER_TOKEN_HERE)
        button.click()

    def clear_old_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.clear()
        WebDriverWait(self.browser, 5).until(
            EC.text_to_be_present_in_element(SkillEditorPageLocators.PROMPT_TEXTAREA, "")
        )

    def enter_new_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.click()
        textarea.send_keys("Your name is Sale Assistant. You work with sales specialists and you help them do sales.")

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
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 25).until_not(
                EC.text_to_be_present_in_element(SkillEditorPageLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert assistant_message is False, \
                f"assistant_message.text is (1): {self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text

        assert "Marketing" in assistant_message or "marketing" in assistant_message, \
            f"assistant_message.text is: {assistant_message}"

    def check_bot_message_edited_prompt(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 15).until_not(
                EC.text_to_be_present_in_element(SkillEditorPageLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert assistant_message is False, \
                f"assistant_message.text is (1): {self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text

        assert "Sale" in assistant_message or "sale" in assistant_message or \
               "sales" in assistant_message or "Sales" in assistant_message, \
            f"assistant_message.text is: {assistant_message}"

    def restart_dialog(self):
        button = self.browser.find_element(*SkillEditorPageLocators.RESTART_DIALOG_BUTTON)
        button.click()

    def click_breadcrumbbar_skill_name(self):
        button = self.browser.find_element(*SkillEditorPageLocators.BCB_SKILL_NAME)
        button.click()

    def click_breadcrumbbar_skills(self):
        button = self.browser.find_element(*SkillEditorPageLocators.BCB_SKILLS)
        button.click()

    def click_close_do_you_want_to_close_modal_window(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CLOSE_BUTTON_MODAL_WINDOW)
        button.click()

    def check_prompt_is_not_builderbot(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        prompt = textarea.text
        assert prompt != "Your name is BuilderBot, act like you know a lot about building bots"
        assert prompt is not None
