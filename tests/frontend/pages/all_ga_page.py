from .base_page import BasePage
from locators.locators import AllGAPageLocators
import time


class AllGAPage(BasePage):
    def is_va_loaded(self):
        pass
        #startTime = time.time()
        #link = self.browser.find_element(*AllGAPageLocators.CLONE_PUBLIC_VA_BUTTON)
        #endTime = time.time()
        #print("Время загрузки VA = ", endTime-startTime)

    def scroll_public_templates_right(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_RIGHT_SCROLL_BUTTON)
        button.click()

    def click_kebab_public_template(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB)
        button.click()

    def click_kebab_public_template_chat(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_CHAT)
        button.click()

    def click_use_template(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE)
        button.click()

    def click_use_template_modal_window(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_MW)
        button.click()
        #self.browser.switch_to.frame(iframe_1)

    def click_private_edit_button(self):
        button = self.browser.find_element(*AllGAPageLocators.PRIVATE_EDIT_BUTTON)
        button.click()

