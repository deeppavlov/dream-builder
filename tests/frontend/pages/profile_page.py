from .base_page import BasePage
from locators.locators import ProfilePageLocators
import time


class ProfilePage(BasePage):
    def enter_token(self):
        textarea = self.browser.find_element(*ProfilePageLocators.TOKEN_TEXTAREA)
        textarea.click()
        textarea.send_keys("token")

    def open_choose_service_dropdown(self):
        button = self.browser.find_element(*ProfilePageLocators.CHOOSE_TOKEN_SERVICES_DROPDOWN)
        button.click()

    def choose_service(self):
        button = self.browser.find_element(*ProfilePageLocators.CHOOSE_TOKEN_SERVICE_OPENAI)
        button.click()

    def click_enter_token_button(self):
        button = self.browser.find_element(*ProfilePageLocators.ENTER_TOKEN_BUTTON)
        button.click()

    def click_remove_button(self):
        button = self.browser.find_element(*ProfilePageLocators.REMOVE_TOKEN)
        button.click()
