from locators.locators import GoogleAuthPageLocators
from .base_page import BasePage
from tests.cookies import cookies_list
import time


class GoogleAuthPage(BasePage):
    def do_auth(self):
        self.browser.delete_all_cookies()
        time.sleep(1)
        for cookie in cookies_list:
            self.browser.add_cookie(cookie)
        time.sleep(6)
        #self.browser.delete_all_cookies()
        #for cookie in cookies_list:
        #    self.browser.add_cookie(cookie)
        #time.sleep(5)
        self.browser.refresh()
        time.sleep(2)

        link = self.browser.find_element(*GoogleAuthPageLocators.USER_BUTTON)
        link.click()


