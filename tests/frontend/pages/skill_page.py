from .base_page import BasePage
from locators.locators import SkillPageLocators
import time


class SkillPage(BasePage):
    def click_edit_skill(self):
        button = self.browser.find_element(*SkillPageLocators.EDIT_SKILL_BUTTON)
        button.click()

    def click_paly_button(self):
        button = self.browser.find_element(*SkillPageLocators.PLAY_BUTTON)
        button.click()





