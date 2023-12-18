from .base_page import BasePage
from tests.frontend.locators.locators import DialogPanelLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class DialogPanel(BasePage):
    def __init__(self, browser, url, timeout=15):
        # source_type = "va_dialog_panel"
        source_type = "va_sidepanel"
        page_type = self.page_type
        view = self.view
        auth_status = self.auth_status

        super().__init__(browser, url, timeout)
        self.browser = browser
        self.url = url
        self.browser.implicitly_wait(timeout)

    def check_is_dialog_panel_loaded(self):
        WebDriverWait(self.browser, 3).until(EC.visibility_of_element_located(DialogPanelLocators.CLOSE_BUTTON))

    def check_is_dialog_panel_closed(self):
        WebDriverWait(self.browser, 1).until(EC.presence_of_element_located(DialogPanelLocators.WHOLE_DIALOG_PANEL))

    def click_build_assistant(self):
        button = self.browser.find_element(*DialogPanelLocators.BUILD_ASSISTANT)
        button.click()

    def click_close_button(self):
        button = self.browser.find_element(*DialogPanelLocators.CLOSE_BUTTON)
        button.click()

    def click_restart_button(self):
        button = self.browser.find_element(*DialogPanelLocators.RESTART_DIALOG_BUTTON)
        button.click()

    def enter_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.send_keys("Hello, what is your name")

    def send_message(self):
        button = self.browser.find_element(*DialogPanelLocators.SEND_BUTTON)
        button.click()

    def delete_message(self):
        textarea = self.browser.find_element(*DialogPanelLocators.MESSAGE_TEXTAREA)
        textarea.click()
        textarea.clear()
        WebDriverWait(self.browser, 5).until(EC.text_to_be_present_in_element(DialogPanelLocators.MESSAGE_TEXTAREA, ""))

    def check_bot_message(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 25).until_not(
                EC.text_to_be_present_in_element(DialogPanelLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert (
                assistant_message is False
            ), f"assistant_message.text is (1): {self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text

        assert (
            "Marketing" in assistant_message or "marketing" in assistant_message
        ), f"assistant_message.text is: {assistant_message}"

    def check_bot_message_edited_prompt(self):
        assistant_message = 0
        try:
            assistant_message = WebDriverWait(self.browser, 15).until_not(
                EC.text_to_be_present_in_element(DialogPanelLocators.BOT_MESSAGE, "•")
            )
        finally:
            assert (
                assistant_message is False
            ), f"assistant_message.text is (1): {self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text}"

        assistant_message = self.browser.find_element(*DialogPanelLocators.BOT_MESSAGE).text

        assert (
            "Sale" in assistant_message
            or "sale" in assistant_message
            or "sales" in assistant_message
            or "Sales" in assistant_message
        ), f"assistant_message.text is: {assistant_message}"

    def check_token_error_message(self):
        error = self.browser.find_element(*DialogPanelLocators.ERROR_TOKEN_MESSAGE)

    def click_enter_token_button(self):
        error = self.browser.find_element(*DialogPanelLocators.ENTER_TOKEN_BUTTON)

        BasePage.services = "OpenAI"
