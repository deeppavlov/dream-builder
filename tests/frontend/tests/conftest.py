import pytest
from selenium import webdriver
import time
#from selenium.webdriver.chrome.options import Options


@pytest.fixture(scope="function")
def browser(request):
    print("\nstart chrome browser for test..")
    browser = webdriver.Chrome()
    browser.set_window_size(1920, 1080)

    yield browser
    print("\nquit browser..")
    time.sleep(1)
    browser.quit()


