from .base_page import BasePage
from locators.locators import DeepyLocators
import time


class DeepyPanel(BasePage):
    def click_deepy_button(self):
        button = self.browser.find_element(*DeepyLocators.DEEPY_BUTTON)
        button.click()

    def check_deepy_tooltip(self):
        tooltip = self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE)

    def check_welcome_dialogue(self):
        user_message = self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE)
        assert user_message.text == "Hello"
        deepy_message = self.browser.find_element(*DeepyLocators.DEEPY_MESSAGE)
        assert deepy_message.text == "Hello i'm deepy i can help you with this and that"

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

