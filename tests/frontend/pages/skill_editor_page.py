import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from .base_page import BasePage
from tests.frontend.locators.locators import SkillEditorPageLocators
from tests.frontend.config import lm_service_en_list, lm_service_ru_list, default_prompt_ru, default_prompt_en


class SkillEditorPage(BasePage):
    page_type = "va_skill_editor"

    def open_models_dropdown(self):
        button = self.browser.find_element(*SkillEditorPageLocators.OPEN_MODELS_DROPDOWN)
        button.click()

        BasePage.source_type = "skill_editor_prompt_panel"

    def check_dropdown_opened(self):
        time.sleep(1)
        WebDriverWait(self.browser, 2).until(EC.visibility_of_element_located(SkillEditorPageLocators.DROPDOWN_IS_OPEN))

    def check_dropdown_closed(self):
        WebDriverWait(self.browser, 1).until(
            EC.presence_of_element_located(SkillEditorPageLocators.WHOLE_MODELS_DROPDOWN)
        )

    def choose_generative_model(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CHOOSE_MODEL)
        button.click()

        BasePage.new_model_name = "ChatGPT (Advanced, 4K tokens)"
        BasePage.model_name = "ChatGPT (Advanced, 4K tokens)"

    def select_specific_model(self, model_name):
        button = self.browser.find_element(By.XPATH, f"//span[contains(text(),'{model_name}')]")
        button.click()

    def check_all_en_models(self):
        models_list = self.browser.find_elements(*SkillEditorPageLocators.ALL_MODELS)
        lm_service_en_list_actual = [model.text for model in models_list]
        assert (
            lm_service_en_list_actual == lm_service_en_list
        ), f"English lm services do not match, actual is: {lm_service_en_list_actual}"

        return

    def check_all_ru_models(self):
        models_list = self.browser.find_elements(*SkillEditorPageLocators.ALL_MODELS)
        lm_service_ru_list_actual = [model.text for model in models_list]
        assert (
            lm_service_ru_list_actual == lm_service_ru_list
        ), f"Not all required Russian lm services are presented, actual is: {lm_service_ru_list_actual}"

    def check_default_prompt_ru(self):
        prompt_list = self.browser.find_elements(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        actual_prompt_ru = [prompt.text for prompt in prompt_list]
        assert actual_prompt_ru == default_prompt_ru, f"Incorrect russian default prompt, actual is: {actual_prompt_ru}"

    def check_default_prompt_en(self):
        prompt_list = self.browser.find_elements(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        actual_prompt_en = [prompt.text for prompt in prompt_list]
        print(actual_prompt_en)
        assert actual_prompt_en == default_prompt_en, f"Incorrect english default prompt, actual is: {actual_prompt_en}"

    def click_enter_token_here(self):
        button = self.browser.find_element(*SkillEditorPageLocators.ENTER_TOKEN_HERE)
        button.click()

    def clear_old_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        # textarea.send_keys('')

        # textarea.clear()
        # WebDriverWait(self.browser, 5).until(
        #    EC.text_to_be_present_in_element(SkillEditorPageLocators.PROMPT_TEXTAREA, "")
        # )

    def enter_new_prompt(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.click()
        textarea.send_keys("Your name is Sale Assistant. You work with sales specialists and you help them do sales.")

        BasePage.source_type = "skill_editor_prompt_panel"

    def enter_new_prompt_upper_limit(self):
        textarea = self.browser.find_element(*SkillEditorPageLocators.PROMPT_TEXTAREA)
        textarea.click()
        # textarea.send_keys(description_1001_symbol*50)
        textarea.send_keys(default_prompt_en)

    def check_error_message_limit_prompt(self):
        error = self.browser.find_element(*SkillEditorPageLocators.ERROR_MESSAGE_PROMPT_LIMIT)

    def check_error_message_field_cant_be_empty(self):
        error = self.browser.find_element(*SkillEditorPageLocators.ERROR_MESSAGE_FIELD_CANT_BE_EMPTY)

    def check_error_message_field_cant_be_empty_disappear(self):
        WebDriverWait(self.browser, 2).until(
            EC.presence_of_element_located(SkillEditorPageLocators.ERROR_MESSAGE_FIELD_CANT_BE_EMPTY)
        )

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
            assert (
                assistant_message is False
            ), f"assistant_message.text is (1): {self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text

        assert (
            "Marketing" in assistant_message or "marketing" in assistant_message
        ), f"assistant_message.text is: {assistant_message}"

    def check_bot_message_edited_prompt(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 15).until_not(
                EC.text_to_be_present_in_element(SkillEditorPageLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert (
                assistant_message is False
            ), f"assistant_message.text is (1): {self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*SkillEditorPageLocators.BOT_MESSAGE).text

        assert (
            "Sale" in assistant_message
            or "sale" in assistant_message
            or "sales" in assistant_message
            or "Sales" in assistant_message
        ), f"assistant_message.text is: {assistant_message}"

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

    def click_close_skill_editor_page(self):
        button = self.browser.find_element(*SkillEditorPageLocators.CLOSE_SKILL_EDITOR_BUTTON)
        button.click()

    def update_model_status(self):
        BasePage.old_model_name = BasePage.new_model_name
