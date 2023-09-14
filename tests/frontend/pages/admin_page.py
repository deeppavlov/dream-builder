from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage
from locators.locators import AdminPageLocators
from tests.config import public_va_name, users_email, skill_name, generative_model


class AdminPage(BasePage):
    def click_approve_button(self):
        button = self.browser.find_element(*AdminPageLocators.APPROVE_BUTTON)
        button.click()

