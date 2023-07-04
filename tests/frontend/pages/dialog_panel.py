from .base_page import BasePage
from locators.locators import DialogPanelLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class DialogPanel(BasePage):
    def click_build_assistant(self):
        button = self.browser.find_element(*DialogPanelLocators.BUILD_ASSISTANT)
        button.click()

    def click_restart_button(self):
        button = self.browser.find_element(*DialogPanelLocators.RESTART_DIALOG_BUTTON)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        button = self.browser.find_element(*DialogPanelLocators.SEND_BUTTON)
        button.click()

    def delete_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.clear()
        WebDriverWait(self.browser, 5).until(
            EC.text_to_be_present_in_element(DialogPanelLocators.MESSAGE_TEXTAREA, "")
        )

    def check_bot_message(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 25).until_not(
                EC.text_to_be_present_in_element(DialogPanelLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert assistant_message is False, \
                f"assistant_message.text is (1): {self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text

        assert "Marketing" in assistant_message or "marketing" in assistant_message, \
            f"assistant_message.text is: {assistant_message}"

    def check_bot_message_edited_prompt(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 15).until_not(
                EC.text_to_be_present_in_element(DialogPanelLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert assistant_message is False, \
                f"assistant_message.text is (1): {self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text

        assert "Sale" in assistant_message or "sale" in assistant_message or \
               "sales" in assistant_message or "Sales" in assistant_message, \
            f"assistant_message.text is: {assistant_message}"

