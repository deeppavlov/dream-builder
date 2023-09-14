from .base_page import BasePage
from locators.locators import MessengerPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tests.config import openai_token


class MessengerPage(BasePage):
    def click_enter_your_token_mw(self):
        button = self.browser.find_element(*MessengerPageLocators.ENTER_YOUR_TOKEN_MW)
        button.click()

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

    def check_bot_message_edited_prompt(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 25).until_not(
                EC.text_to_be_present_in_element(MessengerPageLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert assistant_message is False, \
                f"assistant_message.text is (1): {self.browser.find_element(*MessengerPageLocators.BOT_MESSAGE).text}"
        assistant_message = self.browser.find_element(*MessengerPageLocators.BOT_MESSAGE).text
        assert "Sale" in assistant_message or "sale" in assistant_message or \
               "sales" in assistant_message or "Sales" in assistant_message, \
            f"assistant_message.text is: {assistant_message}"

    def click_check_properties(self):
        button = self.browser.find_element(*MessengerPageLocators.PROPERTIES_BUTTON)
        button.click()

    def click_make_copy(self):
        button = self.browser.find_element(*MessengerPageLocators.MAKE_COPY_BUTTON)
        button.click()

    def click_share_button(self):
        button = self.browser.find_element(*MessengerPageLocators.SHARE_BUTTON)
        button.click()

    def click_share_on_telegram(self):
        button = self.browser.find_element(*MessengerPageLocators.SHARE_TO_TELEGRAM_BUTTON)
        button.click()

    def click_embed_button(self):
        button = self.browser.find_element(*MessengerPageLocators.EMBED_BUTTON)
        button.click()

    def click_key_button(self):
        textarea = self.browser.find_element(*MessengerPageLocators.KEY_BUTTON)
        textarea.click()

    def enter_token(self):
        textarea = self.browser.find_element(*MessengerPageLocators.TOKEN_TEXTAREA)
        textarea.click()
        textarea.send_keys(openai_token)

    def open_choose_service_dropdown(self):
        button = self.browser.find_element(*MessengerPageLocators.CHOOSE_TOKEN_SERVICES_DROPDOWN)
        button.click()

    def choose_service(self):
        button = self.browser.find_element(*MessengerPageLocators.CHOOSE_TOKEN_SERVICE_OPENAI)
        button.click()

    def click_enter_token_button(self):
        edit_button = WebDriverWait(self.browser, 3).until(
            EC.element_to_be_clickable(MessengerPageLocators.ENTER_TOKEN_BUTTON)
        ).click()

    def click_remove_button(self):
        button = self.browser.find_element(*MessengerPageLocators.REMOVE_TOKEN)
        button.click()

    def check_successfully_created_toast(self):
        success_toast = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located(MessengerPageLocators.SUCCESS_TOAST)
        )

    def click_close_button(self):
        success_toast = WebDriverWait(self.browser, 3).until(
            EC.presence_of_element_located(MessengerPageLocators.CLOSE_BUTTON)
        ).click()

    def click_close_button_get_started(self):
        success_toast = WebDriverWait(self.browser, 3).until(
            EC.presence_of_element_located(MessengerPageLocators.CLOSE_BUTTON_GET_STARTED)
        ).click()

