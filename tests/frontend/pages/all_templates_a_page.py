import time

from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from .base_page import BasePage
from .all_ga_page import AllGAPage
from tests.frontend.config import public_va_name, users_email, skill_name, generative_model, your_va_name


class AllTemplatesAPage(AllGAPage):
    page_type = "allbots"
