import time
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage
from tests.frontend.locators.locators import PropertiesAPanelLocators
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name


class ProperiesAPanel:
    def __init__(self, browser, url, timeout=15):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def click_more_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.MORE_BUTTON_SIDE_PANEL)
        button.click()

        #BasePage.source_type = 'va_sidepanel'

    def click_rename_assistant_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.RENAME_ASSISTANT_BUTTON_SIDE_PANEL)
        button.click()

        #BasePage.source_type = 'va_sidepanel'

    def click_close_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.CLOSE_BUTTON_SIDE_PANEL)
        button.click()

        #BasePage.source_type = 'va_sidepanel'

    def click_edit_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.CLOSE_BUTTON_SIDE_PANEL)
        button.click()

        #BasePage.source_type = 'va_sidepanel'

    def click_details_tab(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.DETAILS_TAB)
        button.click()

        #BasePage.source_type = 'va_sidepanel'

    def click_rename_skill_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.RENAME_ASSISTANT_BUTTON_SIDE_PANEL)
        button.click()

        BasePage.source_type = "sidepanel_button"

    def click_edit_skill_button_side_panel(self):
        button = self.browser.find_element(*PropertiesAPanelLocators.EDIT_BUTTON_SIDE_PANEL)
        button.click()

        BasePage.source_type = 'sidepanel_details_edit'
        #BasePage.skill_view = "none"
