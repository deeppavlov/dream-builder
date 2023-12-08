import time

from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage
from tests.frontend.locators.locators import CreateVA_MW_Locators
from tests.frontend.config import skill_name, generative_model, your_va_name, your_skill_name, default_skill_name


class Create_VA_MW:
    def __init__(self, browser, url, timeout=15):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def click_save_in_edit_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.EDIT_VA_SAVE_BUTTON)
        textarea.click()

    def enter_name_in_create_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(f"{your_va_name}")

        BasePage.va_name = your_va_name

    def clear_name_in_create_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys("")

    def clear_description_in_create_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys(Keys.CONTROL + "a")
        textarea.send_keys(Keys.DELETE)
        textarea.send_keys("")

    def enter_description_in_create_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("New description")

    def enter_description_upper_limit_in_create_va_mw(self):
        textarea = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("1234 " * 250)

    def click_create_in_create_va_mw(self):
        button = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_CREATE_BUTTON)
        button.click()

        BasePage.skill_name = default_skill_name
        BasePage.skill_template_name = "none"

    def click_close_in_create_va_mw(self):
        button = self.browser.find_element(*CreateVA_MW_Locators.CREATE_VA_CLOSE_BUTTON)
        button.click()
