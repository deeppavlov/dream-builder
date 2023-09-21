import pytest
from qaseio.pytest import qase

from selenium import webdriver
import time
from selenium.webdriver.chrome.options import Options


def pytest_addoption(parser):
    parser.addoption("--browser_name", action="store", default="chrome", help="Choose browser: chrome, firefox, edge")


@pytest.fixture(scope="function")
def browser(request):
    browser = 0
    browser_name = request.config.getoption("browser_name")

    options = Options()
    options.add_argument("lang=en-GB")
    # options.add_argument("lang=ru")
    # options.add_argument('--headless')
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/117.0.0.0 Safari/537.36"
    )

    if browser_name == "chrome":
        browser = webdriver.Chrome(options=options)
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


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        fixture_browser = item.funcargs["browser"]
        fixture_browser.save_screenshot(f"screen_{item.name}.png")

        qase.attach(f"screen_{item.name}.png")
