from .base_page import BasePage
from locators.locators import DeepyLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class DeepyPanel(BasePage):
    def check_welcome_dialogue(self):
        deepy_message = 0
        try:
            deepy_message = WebDriverWait(self.browser, 15).until_not(
                EC.text_to_be_present_in_element(DeepyLocators.DEEPY_MESSAGE, "•")
            )
        finally:
            assert deepy_message is False, \
                f"deepy_message.text is (1): {self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE).text}"

        deepy_text = self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE).text

        assert "Deepy" in deepy_text or "deepy" in deepy_message, \
            f"deepy_message.text is: {deepy_text}"

    def enter_message_deepy(self):
        textarea = self.browser.find_element(*DeepyLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message_deepy(self):
        textarea = self.browser.find_element(*DeepyLocators.SEND_BUTTON)
        textarea.click()

    def check_deepy_message(self):
        textarea = self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE)

    def close_deepy_panel(self):
        button = self.browser.find_element(*DeepyLocators.CLOSE_BUTTON)
        button.click()
