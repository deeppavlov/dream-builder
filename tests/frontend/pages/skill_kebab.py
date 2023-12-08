from tests.frontend.locators.locators import SkillKebabLocators
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage


class SkillKebab:
    def __init__(self, browser, url, timeout=15):
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def click_skill_delete(self):
        button = self.browser.find_element(*SkillKebabLocators.SKILL_KEBAB_DELETE)
        button.click()

    def click_kebab_skill_rename(self):
        button = self.browser.find_element(*SkillKebabLocators.SKILL_KEBAB_RENAME)
        button.click()

    def click_kebab_skill_properties(self):
        button = self.browser.find_element(*SkillKebabLocators.SKILL_KEBAB_PROPERTIES)
        button.click()

        BasePage.source_type = "skill_block_context_menu"
