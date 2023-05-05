from .base_page import BasePage
from locators.locators import SkillPageLocators
import time


class SkillPage(BasePage):
    def click_edit_skill(self):
        button = self.browser.find_element(*SkillPageLocators.EDIT_SKILL_BUTTON)
        button.click()

    def click_play_button(self):
        button = self.browser.find_element(*SkillPageLocators.PLAY_BUTTON)
        button.click()

    def click_create_skill_button(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_BUTTON)
        button.click()

    def click_create_skill_from_scratch_button(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_FROM_SCRATCH_BUTTON)
        button.click()

    def enter_name_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys("New Sill name")

    def enter_description_in_create_skill_mw(self):
        textarea = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("New description")

    def click_create_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CREATE_BUTTON)
        button.click()

    def click_close_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CLOSE_BUTTON)
        button.click()

    def click_cancel_in_create_skill_mw(self):
        button = self.browser.find_element(*SkillPageLocators.CREATE_SKILL_CANCEL_BUTTON)
        button.click()






