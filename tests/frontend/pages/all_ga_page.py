import time

from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage
from .create_va_mw import Create_VA_MW
from .your_a_kebab import YourAKebab
from .properties_a_panel import ProperiesAPanel
from tests.frontend.locators.locators import AllGAPageLocators
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name


class AllGAPage(BasePage, Create_VA_MW, YourAKebab, ProperiesAPanel):
    page_type = "all_va_page"

    def check_is_public_template_loaded(self):
        if BasePage.view == "card":
            WebDriverWait(self.browser, 40).until(
                EC.visibility_of_element_located(AllGAPageLocators.PUBLIC_TEMPLATE_CARD))
        elif BasePage.view == "list":
            WebDriverWait(self.browser, 40).until(
                EC.visibility_of_element_located(AllGAPageLocators.PUBLIC_TEMPLATE_CARD_LIST_VIEW))

    def click_change_view_type_to_list(self):
        button = self.browser.find_element(*AllGAPageLocators.CHANGE_VIEW_TYPE)
        button.click()
        BasePage.view = "list"
        BasePage.source_type = "top_panel"

    def click_change_view_type_to_card(self):
        button = self.browser.find_element(*AllGAPageLocators.CHANGE_VIEW_TYPE)
        button.click()
        BasePage.view = "card"
        BasePage.source_type = "top_panel"

    def scroll_public_templates_right(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_RIGHT_SCROLL_BUTTON)
        button.click()

    def scroll_public_templates_left(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_LEFT_SCROLL_BUTTON)
        button.click()

    # PUBLIC ASSISTANTS

    def click_show_all_templates_assistants(self):
        button = self.browser.find_element(*AllGAPageLocators.SHOW_ALL_PUBLIC_TEMPLATES)
        button.click()

    def click_kebab_public_template(self):
        button = ''
        if BasePage.view == "card":
            button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB)
        elif BasePage.view == "list":
            button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_LIST_VIEW)
        button.click()

        WebDriverWait(self.browser, 2).until(EC.visibility_of_element_located(AllGAPageLocators.PUBLIC_KEBAB_CHAT))

    def click_kebab_public_template_chat(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_CHAT)
        button.click()

    def click_kebab_public_template_check_skills(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_CHECK_SKILLS)
        button.click()

    def click_kebab_public_template_properties(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_KEBAB_PROPERTIES)
        button.click()

    def click_use_template(self):
        button = ''
        if BasePage.view == "card":
            button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_BUTTON)
        elif BasePage.view == "list":
            button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_BUTTON_LIST_VIEW)
        button.click()

        BasePage.source_type = 'va_templates_block'

    def click_use_template_modal_window(self):
        WebDriverWait(self.browser, 4).until(
            EC.element_to_be_clickable(AllGAPageLocators.PUBLIC_USE_MW_USE_BUTTON)
        ).click()

        # self.browser.execute_script('arguments[0].click()', AllGAPageLocators.PUBLIC_USE_MW_USE_BUTTON)

    def click_cancel_template_modal_window(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_USE_MW_CANCEL_BUTTON)
        button.click()

    def click_on_public_template_card(self):
        button = self.browser.find_element(*AllGAPageLocators.PUBLIC_TEMPLATE_CARD)
        button.click()

    def check_is_properties_panel_present(self):
        assert self.is_element_present(
            *AllGAPageLocators.PROPERTIES_PANEL_HEADER
        ), "properties_panel is not presented, but should be"

    def check_is_not_properties_panel_present(self):
        assert self.is_not_element_present(
            *AllGAPageLocators.PROPERTIES_PANEL_HEADER
        ), "properties_panel is not presented, but should be"

    # YOUR ASSISTANTS

    def click_on_your_assistant_card(self):
        button = ''
        if BasePage.view == "card":
            button = self.browser.find_element(*AllGAPageLocators.YOUR_CARD)
        elif BasePage.view == "list":
            button = self.browser.find_element(*AllGAPageLocators.YOUR_CARD_LIST_VIEW)
        button.click()

        BasePage.source_type = "va_card_click"

    def click_show_all_your_assistants(self):
        button = self.browser.find_element(*AllGAPageLocators.SHOW_ALL_YOUR_VA)
        button.click()

    def click_your_a_edit_button(self):
        WebDriverWait(self.browser, 3).until(
            EC.visibility_of_element_located(AllGAPageLocators.YOUR_EDIT_BUTTON)
        ).click()

    def click_kebab_your_a(self):
        BasePage.source_type = 'va_block'

        button = ''
        if BasePage.view == "card":
            button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB)
        elif BasePage.view == "list":
            button = self.browser.find_element(*AllGAPageLocators.YOUR_KEBAB_LIST_VIEW)

        button.click()
        WebDriverWait(self.browser, 2).until(EC.visibility_of_element_located(AllGAPageLocators.YOUR_KEBAB_CHAT))

    def click_create_from_scratch_button(self):
        button = self.browser.find_element(*AllGAPageLocators.CREATE_VA_BUTTON)
        button.click()

        BasePage.source_type = 'va_templates_block'

    def click_choose_language_assistant_dropdown(self):
        textarea = self.browser.find_element(*AllGAPageLocators.CREATE_VA_LANGUAGE_DROPDOWN)
        textarea.click()

    def click_choose_language_assistant_en(self):
        textarea = self.browser.find_element(*AllGAPageLocators.CREATE_VA_LANGUAGE_EN)
        textarea.click()

    def click_choose_language_assistant_ru(self):
        textarea = self.browser.find_element(*AllGAPageLocators.CREATE_VA_LANGUAGE_RU)
        textarea.click()

    def check_building_is_done(self):
        edit_button = WebDriverWait(self.browser, 90).until(
            EC.visibility_of_element_located(AllGAPageLocators.READY_TO_CHAT)
        )

    def check_your_assistant_is_public(self):
        edit_button = WebDriverWait(self.browser, 10).until(
            EC.visibility_of_element_located(AllGAPageLocators.YOUR_ASSISTANT_IN_PUBLIC)
        )

    def check_your_assistant_public_wrap(self):
        edit_button = WebDriverWait(self.browser, 10).until(
            EC.visibility_of_element_located(AllGAPageLocators.YOUR_ASSISTANT_PUBLIC_TEMPLATE_WRAP)
        )

    def check_deepy_tooltip(self):
        edit_button = WebDriverWait(self.browser, 3).until(
            EC.visibility_of_element_located(AllGAPageLocators.DEEPY_TOOLTIP)
        )

    def check_google_github_logo(self):
        WebDriverWait(self.browser, 3).until(
            EC.visibility_of_element_located(AllGAPageLocators.GOOGLE_LOGO)
        )
        WebDriverWait(self.browser, 3).until(
            EC.visibility_of_element_located(AllGAPageLocators.GITHUB_LOGO)
        )
