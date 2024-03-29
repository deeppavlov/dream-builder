from tests.frontend.locators.locators import GithubAuthPageLocators
from .base_page import BasePage
from tests.frontend.config import public_va_name, github_email, github_password, skill_name, generative_model


class GithubAuthPage(BasePage):
    def enter_login(self):
        email_textarea = self.browser.find_element(*GithubAuthPageLocators.EMAIL_TEXTAREA)
        email_textarea.send_keys(github_email)

    def enter_password(self):
        email_textarea = self.browser.find_element(*GithubAuthPageLocators.PASSWORD_TEXTAREA)
        email_textarea.send_keys(github_password)

    def click_sign_in(self):
        BasePage.auth_status = "true"
        email_textarea = self.browser.find_element(*GithubAuthPageLocators.SIGN_IN)
        email_textarea.click()
