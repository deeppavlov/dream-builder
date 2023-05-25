from .base_page import BasePage
from locators.locators import DialogPanelLocators
import time


class DialogPanel(BasePage):
    def click_build_assistant(self):
        button = self.browser.find_element(*DialogPanelLocators.BUILD_ASSISTANT)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        button = self.browser.find_element(*DialogPanelLocators.SEND_BUTTON)
        button.click()

    def check_bot_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE)





