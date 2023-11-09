from tests.frontend.tests.screen.screenshots_processing import compare_pictures
import pytest
from qaseio.pytest import qase
from tests.frontend.config import env_name
from tests.backend.config import counter_ui as counter


class TestScreen:
    @pytest.mark.screen_chrome_e2e
    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"{counter()}. e2e - Chrome")
    def test_screen_chrome_e2e(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)

    @pytest.mark.screen_edge_e2e
    @pytest.mark.parametrize('browser', ['edge'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"{counter()}. e2e - Edge")
    def test_screen_edge_e2e(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)

    @pytest.mark.screen_firefox_e2e
    @pytest.mark.parametrize('browser', ['firefox'], indirect=True)
    @pytest.mark.parametrize('screen_size', [['1920,1080']], indirect=True)
    @qase.title(f"{counter()}. e2e - Firefox")
    def test_screen_firefox_e2e(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)

    @pytest.mark.screen_chrome_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['chrome'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @qase.title(f"{counter()}. e2e - Chrome")
    def test_screen_chrome_e2e_parametrize_screen_size(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)

    @pytest.mark.screen_edge_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['edge'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @qase.title(f"{counter()}. e2e - Edge")
    def test_screen_edge_e2e_parametrize_screen_size(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)

    @pytest.mark.screen_firefox_e2e_parametrize_screen_size
    @pytest.mark.parametrize('browser', ['firefox'], indirect=True)
    @pytest.mark.parametrize('screen_size',
                             [["1920,1080"], ["1536,864"], ["1366,768"], ["1280,720"]], indirect=True)
    @qase.title(f"{counter()}. e2e - Firefox ")
    def test_screen_firefox_e2e_parametrize_screen_size(self, browser, screen_size):
        compare_pictures(env_name, screen_size, browser.name)
