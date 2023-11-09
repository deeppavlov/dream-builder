from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tests.frontend.locators.locators import BasePageLocators


class BasePage:
    def __init__(self, browser, url, timeout=15):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def open(self):
        self.browser.get(self.url)

    def delete_all_cookies(self):
        self.browser.delete_all_cookies()

    # HEADER PANEL

    def click_user_avatar_button(self):
        button = self.browser.find_element(*BasePageLocators.AVATAR_BUTTON)
        button.click()

    def click_logout_button(self):
        button = self.browser.find_element(*BasePageLocators.LOGOUT_BUTTON)
        button.click()

    def click_profile_settings_button(self):
        button = self.browser.find_element(*BasePageLocators.PROFILE_SETTINGS_BUTTON)
        button.click()

    # SIGN IN

    def click_sign_in_button(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_BUTTON)
        button.click()

    def click_sign_in_button_modal_window(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_BUTTON_MODAL_WINDOW)
        button.click()

    def click_sign_in_with_google(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_WITH_GOOGLE)
        button.click()

    def click_sign_in_with_github(self):
        button = self.browser.find_element(*BasePageLocators.SIGN_IN_WITH_GITHUB)
        button.click()

    # MAIN MENU

    def click_main_menu(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_BUTTON)
        button.click()

    def check_main_menu_is_opened(self):
        WebDriverWait(self.browser, 3).until(EC.visibility_of_element_located(
            BasePageLocators.MAIN_MENU_WHOLE))

    def check_main_menu_is_closed(self):
        WebDriverWait(self.browser, 1).until(
            EC.presence_of_element_located(BasePageLocators.MAIN_MENU_WHOLE)
        )

    def click_main_menu_about(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_ABOUT)
        button.click()

    def click_main_menu_welcome_guide(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_WELCOME_GUIDE)
        button.click()

    def click_main_menu_rename(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_RENAME)
        button.click()

    def click_main_menu_feedback(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_FEEDBACK)
        button.click()

    def click_main_menu_add_skills(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_ADD_SKILLS)
        button.click()

    def click_main_menu_visibility(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_VISIBILITY)
        button.click()

    def click_main_menu_share(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_SHARE)
        button.click()

    def click_main_menu_delete(self):
        button = self.browser.find_element(*BasePageLocators.MAIN_MENU_DELETE)
        button.click()

    def click_home_button(self):
        button = self.browser.find_element(*BasePageLocators.HOME_BUTTON)
        button.click()

    def click_deepy_button(self):
        button = (
            WebDriverWait(self.browser, 3)
            .until(EC.visibility_of_element_located(BasePageLocators.DEEPY_BUTTON))
            .click()
        )

    # SUCCESS TOASTS

    def check_success_toast(self):
        success_toast = WebDriverWait(self.browser, 25).until(
            EC.text_to_be_present_in_element(BasePageLocators.SUCCESS_TOAST, "Success")
        )

    def check_success_toast_disappear(self):
        success_toast = WebDriverWait(self.browser, 12).until(
            EC.invisibility_of_element_located(BasePageLocators.SUCCESS_TOAST)
        )

    def check_submitted_toast(self):
        success_toast = WebDriverWait(self.browser, 15).until(
            EC.text_to_be_present_in_element(BasePageLocators.SUBMITTED_TOAST, "Submitted")
        )

    def check_submitted_toast_disappear(self):
        success_toast = WebDriverWait(self.browser, 12).until(
            EC.invisibility_of_element_located(BasePageLocators.SUBMITTED_TOAST)
        )

    def check_copied_toast(self):
        success_toast = WebDriverWait(self.browser, 3).until(
            EC.text_to_be_present_in_element(BasePageLocators.COPIED_TOAST, "Copied")
        )

    def check_copied_toast_disappear(self):
        success_toast = WebDriverWait(self.browser, timeout=2).until(
            EC.invisibility_of_element_located(BasePageLocators.COPIED_TOAST)
        )

    def is_element_present(self, how, what):
        try:
            self.browser.find_element(how, what)
        except NoSuchElementException:
            return False
        return True

    def is_not_element_present(self, how, what, timeout=2):
        try:
            WebDriverWait(self.browser, timeout).until(EC.presence_of_element_located((how, what)))
        except TimeoutException:
            return True
        return False

    def is_disappeared(self, how, what, timeout=4):
        try:
            WebDriverWait(self.browser, timeout, 1, TimeoutException).until_not(
                EC.presence_of_element_located((how, what))
            )
        except TimeoutException:
            return False
        return True

    def should_be_authorized_user(self):
        assert self.is_element_present(*BasePageLocators.AVATAR_BUTTON), "User icon is not presented"

    def get_coordinates_of_element(self, element_locator):
        element = self.browser.find_element(*element_locator)
        location = element.location
        size = element.size

        left = location['x']
        top = location['y']
        right = location['x'] + size['width']
        bottom = location['y'] + size['height']

        return left, top, right, bottom
