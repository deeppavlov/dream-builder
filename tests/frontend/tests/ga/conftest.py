import pytest
from qaseio.pytest import qase
from seleniumwire import webdriver

from seleniumwire.webdriver import ChromeOptions
from seleniumwire.webdriver import FirefoxOptions
from seleniumwire.webdriver import EdgeOptions


# def pytest_addoption(parser):
#    parser.addoption("--browser_name", default="chrome", help="Choose browser: chrome, firefox, edge")
#    parser.addoption(
#        "--window_size", default="1920,1080", help='Choose window-size: "1920,1080", "1536,864", "1366,768", "1280,720"'
#    )

def set_options(options):
    options.add_argument("--lang=en-GB")
    # options.add_argument("--lang=ru")
    # options.add_argument('--headless')
    options.add_argument("--disable-blink-features=AutomationControlled")
    # options.add_argument(
    #    "--user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) "
    #    "Chrome/117.0.0.0 Safari/537.36"
    # )


@pytest.fixture(scope="function")
def browser(request):
    browser_name = request.param
    browser = 0
    window_size = tuple(request.config.getoption("window_size").split(","))

    if browser_name == "chrome":
        options = ChromeOptions()
        set_options(options)
        browser = webdriver.Chrome(options=options)

    elif browser_name == "firefox":
        options = FirefoxOptions()
        options.set_preference("intl.accept_languages", "en-GB")
        set_options(options)
        browser = webdriver.Firefox(options=options)

    elif browser_name == "edge":
        options = EdgeOptions()
        set_options(options)
        browser = webdriver.Edge(options=options)

    print(f"\nstart {browser_name} browser for test..")

    browser.set_window_size(*window_size)

    yield browser
    print("\nquit browser..")
    browser.quit()


@pytest.fixture(scope="function")
def screen_size(request, browser):
    window_size = tuple(request.param[0].split(","))
    browser.set_window_size(*window_size)
    return window_size


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        fixture_browser = item.funcargs["browser"]
        # fixture_browser.save_screenshot(f"screen_{item.name}.png")
        qase.attach(f"screen_{item.name}.png")
