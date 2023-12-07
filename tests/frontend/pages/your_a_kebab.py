from tests.frontend.locators.locators import YourAKebabLocators
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
from .visibility_mw import Visibility_MW
from .base_page import BasePage


class YourAKebab(Visibility_MW):
    def click_kebab_your_a_visibility(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_VISIBILITY)
        button.click()

    def click_kebab_your_a_chat(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_CHAT)
        button.click()

    def click_kebab_your_a_delete(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_DELETE)
        button.click()

    def click_mw_your_a_delete(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_A_DELETE_MW_DELETE)
        button.click()

    def click_kebab_your_a_share(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_SHARE)
        button.click()

    def get_share_link(self):
        link = self.browser.find_element(*YourAKebabLocators.SHARE_LINK).get_attribute("value")
        return link

    def close_share_mw(self):
        button = self.browser.find_element(*YourAKebabLocators.CLOSE_BUTTON_SHARE_MW)
        button.click()

    def click_kebab_your_a_rename(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_RENAME)
        button.click()

    def click_kebab_your_a_properties(self):
        button = self.browser.find_element(*YourAKebabLocators.YOUR_KEBAB_PROPERTIES)
        button.click()

        BasePage.source_type = "va_card_context_menu"

