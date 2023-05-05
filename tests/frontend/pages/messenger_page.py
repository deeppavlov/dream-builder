from .base_page import BasePage
from locators.locators import MessengerPageLocators
import time


class MessengerPage(BasePage):
    def click_say_hi(self):
        button = self.browser.find_element(*MessengerPageLocators.SAY_HI_BUTTON)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*MessengerPageLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        button = self.browser.find_element(*MessengerPageLocators.SEND_BUTTON)
        button.click()

    def check_bot_message(self):
        button = self.browser.find_element(*MessengerPageLocators.BOT_MESSAGE)

    def click_check_properties(self):
        button = self.browser.find_element(*MessengerPageLocators.PROPERTIES_BUTTON)
        button.click()

    def click_make_copy(self):
        button = self.browser.find_element(*MessengerPageLocators.MAKE_COPY_BUTTON)
        button.click()

    def click_share_button(self):
        button = self.browser.find_element(*MessengerPageLocators.SHARE_BUTTON)
        button.click()

    def click_share_on_social_media_button(self):
        button = self.browser.find_element(*MessengerPageLocators.SHARE_ON_SOCIAL_MEDIA_BUTTON)
        button.click()

    def click_share_on_telegram(self):
        button = self.browser.find_element(*MessengerPageLocators.SHARE_TO_TELEGRAM_BUTTON)
        button.click()

    def click_embed_button(self):
        button = self.browser.find_element(*MessengerPageLocators.EMBED_BUTTON)
        button.click()
