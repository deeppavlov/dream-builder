from .base_page import BasePage
from locators.locators import DialogPanelLocators
import time


class DialogPanel(BasePage):
    def click_run_test(self):
        button = self.browser.find_element(*DialogPanelLocators.RUN_TEST)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.SEND_BUTTON)
        textarea.click()

    def check_bot_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE)





