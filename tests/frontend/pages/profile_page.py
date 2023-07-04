from .base_page import BasePage
from locators.locators import ProfilePageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tests.config import openai_token
import time


class ProfilePage(BasePage):
    def enter_token(self):
        textarea = self.browser.find_element(*ProfilePageLocators.TOKEN_TEXTAREA)
        textarea.click()
        textarea.send_keys(openai_token)

    def open_choose_service_dropdown(self):
        button = self.browser.find_element(*ProfilePageLocators.CHOOSE_TOKEN_SERVICES_DROPDOWN)
        button.click()

    def choose_service(self):
        button = self.browser.find_element(*ProfilePageLocators.CHOOSE_TOKEN_SERVICE_OPENAI)
        button.click()

    def click_enter_token_button(self):
        edit_button = WebDriverWait(self.browser, 3).until(
            EC.element_to_be_clickable(ProfilePageLocators.ENTER_TOKEN_BUTTON)
        ).click()

    def click_remove_button(self):
        button = self.browser.find_element(*ProfilePageLocators.REMOVE_TOKEN)
        button.click()

    def check_successfully_created_toast(self):
        success_toast = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located(ProfilePageLocators.SUCCESS_TOAST)
        )

    def click_close_button(self):
        success_toast = WebDriverWait(self.browser, 3).until(
            EC.presence_of_element_located(ProfilePageLocators.CLOSE_BUTTON)
        ).click()

