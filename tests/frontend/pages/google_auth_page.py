from tests.frontend.locators.locators import GoogleAuthPageLocators
from .base_page import BasePage

f  # rom tests.frontend.cookies import cookies_list
import time
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model


class GoogleAuthPage(BasePage):
    def do_auth(self):
        # self.browser.delete_all_cookies()
        # for cookie in cookies_list:
        #    self.browser.add_cookie(cookie)
        time.sleep(3)
        self.browser.refresh()
        time.sleep(1)

        email_textarea = self.browser.find_element(*GoogleAuthPageLocators.EMAIL_TEXTAREA)
        email_textarea.click()
        email_textarea.send_keys(users_email)

        time.sleep(1)
        next_button = self.browser.find_element(*GoogleAuthPageLocators.NEXT_BUTTON)
        next_button.click()
        time.sleep(1)
        next_button = self.browser.find_element(*GoogleAuthPageLocators.NEXT_BUTTON)
        next_button.click()
        time.sleep(2)
        button = self.browser.find_element(*GoogleAuthPageLocators.USER_EMAIL_BUTTON)
        button.click()
