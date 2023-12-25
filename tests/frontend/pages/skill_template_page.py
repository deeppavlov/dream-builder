from tests.frontend.pages.base_page import BasePage
from tests.frontend.locators.locators import SkillPageLocators
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from .skill_page import SkillPage


class SkillTemplatePage(SkillPage):
    page_type = "va_template_skillset_page"
