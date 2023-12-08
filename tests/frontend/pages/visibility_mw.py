import time

from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage
from tests.frontend.locators.locators import Visibility_MW_Locators
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name


class Visibility_MW:
    def __init__(self, browser, url, timeout=15):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def change_visibility_to_private(self):
        button = self.browser.find_element(*Visibility_MW_Locators.PRIVATE_VISIBILITY_MW)
        button.click()

        BasePage.va_temp_status = "private"

    def change_visibility_to_unlisted(self):
        button = self.browser.find_element(*Visibility_MW_Locators.UNLISTED_VISIBILITY_MW)
        button.click()
        ActionChains(self.browser).move_to_element(button).perform()

        BasePage.va_temp_status = "unlisted"

    def change_visibility_to_public_template(self):
        button = self.browser.find_element(*Visibility_MW_Locators.PUBLIC_TEMPLATE_VISIBILITY_MW)
        button.click()
        ActionChains(self.browser).move_to_element(button).perform()

        BasePage.va_temp_status = "public"

    def save_visibility(self):
        button = self.browser.find_element(*Visibility_MW_Locators.SAVE_BUTTON_VISIBILITY_MW)
        button.click()

    def publish_visibility(self):
        button = self.browser.find_element(*Visibility_MW_Locators.PUBLISH_BUTTON_VISIBILITY_MW)
        button.click()

    def click_continue_publish_visibility(self):
        button = self.browser.find_element(*Visibility_MW_Locators.CONTINUE_BUTTON_IMPORTANT_PUBLISH_MW)
        button.click()

    def click_cancel_publish_visibility(self):
        button = self.browser.find_element(*Visibility_MW_Locators.CANCEL_BUTTON_IMPORTANT_PUBLISH_MW)
        button.click()

    def check_unlisted_visibility_tooltip(self):
        time.sleep(1)
        WebDriverWait(self.browser, 2).until(
            EC.visibility_of_element_located(Visibility_MW_Locators.UNLISTED_TOOLTIP_VISIBILITY_MW)
        )

    def check_public_template_visibility_tooltip(self):
        time.sleep(1)
        WebDriverWait(self.browser, 2).until(
            EC.visibility_of_element_located(Visibility_MW_Locators.PUBLIC_TEMPLATE_TOOLTIP_VISIBILITY_MW)
        )

    def update_visibility_status(self):
        BasePage.va_prev_status = BasePage.va_temp_status
