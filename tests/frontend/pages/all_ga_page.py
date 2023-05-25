from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage
from locators.locators import AllGAPageLocators
from tests.config import public_va_name, users_email, skill_name, generative_model
import time


class AllGAPage(BasePage):
    def is_va_loaded(self):
        pass
        #startTime = time.time()
        #link = self.browser.find_element(*AllGAPageLocators.CLONE_PUBLIC_VA_BUTTON)
        #endTime = time.time()
        #print("Время загрузки VA = ", endTime-startTime)

    # PUBLIC

    def scroll_public_templates_right(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_RIGHT_SCROLL_BUTTON)
        button.click()

    def click_kebab_public_template(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB)
        button.click()

    def click_kebab_public_template_chat(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_CHAT)
        button.click()

    def click_kebab_public_template_check_skills(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_CHECK_SKILLS)
        button.click()

    def click_use_template(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_BUTTON)
        button.click()

    def click_use_template_modal_window(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_MW_USE_BUTTON)
        button.click()

    def click_cancel_template_modal_window(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_MW_CANCEL_BUTTON)
        button.click()


    def click_on_public_template_card(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_TEMPLATE_CARD)
        button.click()

    def check_is_properties_panel_present(self):
        assert self.is_element_present(*AllGAPageLocators.PROPERTIES_PANEL_HEADER), \
            "properties_panel is not presented, but should be"

    def check_is_not_properties_panel_present(self):
        assert self.is_not_element_present(*AllGAPageLocators.PROPERTIES_PANEL_HEADER), \
            "properties_panel is not presented, but should be"



    # PRIVATE

    def click_your_a_edit_button(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_EDIT_BUTTON)
        button.click()

    def click_kebab_your_a(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB)
        button.click()

    def click_kebab_your_a_chat(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_CHAT)
        button.click()

    def click_kebab_your_a_share(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_SHARE)
        button.click()

    def get_share_link(self):
        link = self.browser.find_element(*AllGAPageLocators.SHARE_LINK).get_attribute("value")
        return link

    def click_kebab_your_a_visibility(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_VISIBILITY)
        button.click()

    def change_visibility_to_private(self):
        button = self.browser.find_element(*AllGAPageLocators.PRIVATE_VISIBILITY_MW)
        button.click()

    def change_visibility_to_unlisted(self):
        button = self.browser.find_element(*AllGAPageLocators.UNLISTED_VISIBILITY_MW)
        button.click()

    def change_visibility_to_public_template(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_TEMPLATE_VISIBILITY_MW)
        button.click()

    def save_visibility(self):
        button = self.browser.find_element(*AllGAPageLocators.SAVE_BUTTON_VISIBILITY_MW)
        button.click()

    def publish_visibility(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLISH_BUTTON_VISIBILITY_MW)
        button.click()

    def click_kebab_your_a_rename(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_RENAME)
        button.click()

    def click_kebab_your_a_properties(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_PROPERTIES)
        button.click()

    def click_kebab_your_a_delete(self):
        button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_PROPERTIES)
        button.click()

    def click_create_from_scratch_button(self):
        button = self.browser.find_element(*AllGAPageLocators.CREATE_VA_BUTTON)
        button.click()

    def enter_name_in_create_va_mw(self):
        textarea = self.browser.find_element(*AllGAPageLocators.CREATE_VA_NAME_TEXTAREA)
        textarea.click()
        textarea.send_keys(f"{public_va_name}")

    def enter_description_in_create_va_mw(self):
        textarea = self.browser.find_element(*AllGAPageLocators.CREATE_VA_DESCRIPTION_TEXTAREA)
        textarea.click()
        textarea.send_keys("New description")

    def click_create_in_create_va_mw(self):
        button = self.browser.find_element(*AllGAPageLocators.CREATE_VA_CREATE_BUTTON)
        button.click()

    def click_close_in_create_va_mw(self):
        button = self.browser.find_element(*AllGAPageLocators.CREATE_VA_CLOSE_BUTTON)
        button.click()






