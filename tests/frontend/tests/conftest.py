import pytest
from selenium import webdriver
import time


# from selenium.webdriver.chrome.options import Options


def pytest_addoption(parser):
    parser.addoption('--browser_name', action='store', default='chrome',
                     help="Choose browser: chrome, firefox, edge")


@pytest.fixture(scope="function")
def browser(request):
    browser = 0
    browser_name = request.config.getoption("browser_name")

    if browser_name == "chrome":
       browser = webdriver.Chrome()
    elif browser_name == "firefox":
       browser = webdriver.Firefox()
    elif browser_name == "edge":
       browser = webdriver.Edge()

    print(f"\nstart {browser_name} browser for test..")

    browser.set_window_size(1920, 1080)

    yield browser
    print("\nquit browser..")
    time.sleep(1)
    browser.quit()
