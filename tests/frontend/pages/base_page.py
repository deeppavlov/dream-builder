from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from locators.locators import BasePageLocators


class BasePage:
    def __init__(self, browser, url, timeout=10):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def open(self):
        self.browser.get(self.url)

    def delete_all_cookies(self):
        self.browser.delete_all_cookies()

    def is_element_present(self, how, what):
        try:
            self.browser.find_element(how, what)
        except NoSuchElementException:
            return False
        return True

    def click_sign_in_button(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_BUTTON)
        button.click()

    def click_sign_in_button_modal_window(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_BUTTON_MODAL_WINDOW)
        button.click()

    def go_to_about_dreambuilder_page(self):
        button = self.browser.find_element(*BasePageLocators.ABOUT_DB_BUTTON)
        button.click()

    def click_home_button(self):
        button = self.browser.find_element(*BasePageLocators.HOME_BUTTON)
        button.click()





    def is_not_element_present(self, how, what, timeout=4):
        try:
            WebDriverWait(self.browser, timeout).until(EC.presence_of_element_located((how, what)))
        except TimeoutException:
            return True
        return False

    def is_disappeared(self, how, what, timeout=4):
        try:
            WebDriverWait(self.browser, timeout, 1, TimeoutException).\
                until_not(EC.presence_of_element_located((how, what)))
        except TimeoutException:
            return False
        return True

    def should_be_authorized_user(self):
        assert self.is_element_present(*BasePage.USER_ICON), "User icon is not presented," \
                                                                     " probably unauthorised user"

