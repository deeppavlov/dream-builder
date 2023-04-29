from .base_page import BasePage
from locators.locators import AllGAPageLocators
import time


class VaPage(BasePage):
    def is_va_loaded(self):
        #startTime = time.time()
        link = self.browser.find_element(*AllGAPageLocators.CLONE_PUBLIC_VA_BUTTON)
        #endTime = time.time()
        #print("Время загрузки VA = ", endTime-startTime)


