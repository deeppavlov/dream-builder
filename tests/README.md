## How to run tests locally?
### 1. Clone git repository:
https://github.com/deeppavlov/dream-builder.git

### 2. Go to tests folder:
cd tests

### 3. Install virtual environment (windows):
venv\scripts\activate

### 4. Install requirements:
pip install -r requirements.txt

### 5. Add .env.test file to dream-builder\tests folder:

Example of .env.test file
```
TEST__URL_FRONTEND = (dev/stage/alpha url)
TEST__URL_AUTH_API = (dev/stage/alpha url)
TEST__URL_DISTRIBUTIONS_API = (dev/stage/alpha url)

TEST__TOKEN_ADMIN = (admin token)
TEST__TOKEN_GITHUB1 = (user1 token)
TEST__TOKEN_GITHUB2 = (user2 token)

TEST__OPENAI_TOKEN = (your OpenAI token)

TEST__EMAIL = (your test email)
TEST__GITHUB_EMAIL = (your github email)
TEST__GITHUB_PASSWORD = (your github password)

TEST__QASE_TO_API_TOKEN = (your QASE to API token token)
```

### 7. Installing browser drivers for UI tests

**Crome**
* Download latest version of chromedriver: https://chromedriver.chromium.org/downloads 
* Move chromedriver.exe file to C:\chromedriver\chromedriver.exe 
* Or specify path in the "conftest.py" file: 
browser = webdriver.Chrome(options=options, executable_path = "path\chromedriver.exe")

**Firefox**
* Download latest version of geckodriver: https://github.com/mozilla/geckodriver/releases 
* Move chromedriver.exe file to C:\geckodriver\geckodriver.exe 
* Or specify path in the "conftest.py" file: 
browser = webdriver.Chrome(options=options, executable_path = "path\geckodriver.exe")

**Edge**
* Download latest version of msedgedriver: https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/ 
* Move chromedriver.exe file to C:\msedgedriver\msedgedriver.exe 
* Or specify path in the "conftest.py" file: 
browser = webdriver.Chrome(options=options, executable_path = "path\msedgedriverr.exe")


### 8. Run tests
* Run all tests: pytest -sv
* Run selected module, for example: pytest -sv test_distributions.py
* Run tests with selected markers, for example: pytest -sv -m smoke

Existing markers:
**atom**: Add this marker to any test if you want to run atomic isolated tests.
**smoke**: Marker for smoke backend tests (for quick testing on a dev environment).
**regression**: Marker for regression backend tests (for testing on a stage environment).
**chrome_e2e**: Marker for e2e UI tests in Chrome browser.
**edge_e2e**: Marker for e2e UI tests in Edge browser.
**firefox_e2e**: Marker for e2e UI tests in Firefox browser.
**chrome_e2e_parametrize_screen_size**: Marker for e2e UI tests in Chrome browser on different screen sizes.
**edge_e2e_parametrize_screen_size**: Marker for e2e UI tests in Edge browser on different screen sizes.
**firefox_e2e_parametrize_screen_size**: Marker for e2e UI tests in Firefox browser on different screen sizes.
**negative_ui**: Marker for negative UI tests.


### 9. Test report
If we want a report at the QASE TMS, run tests with data:
pytest -sv ...(your parametres)... --qase-to-api-token = (your QASE to API token token)  --qase-to-project=DB --qase-mode=testops