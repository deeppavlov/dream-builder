from selenium.webdriver.common.by import By
from tests.config import public_va_name, users_email, skill_name, generative_model


class BasePageLocators:
    SIGN_IN_BUTTON = (By.XPATH, "//button[contains(text(),'Sign in')]")
    SIGN_IN_BUTTON_MODAL_WINDOW = (By.CSS_SELECTOR, "button._sign-in-btn_r2j2k_128")

    MAIN_MENU_BUTTON = (By.CSS_SELECTOR, "div._menu_1g902_119")
    ABOUT_DB_BUTTON = (By.CSS_SELECTOR, "button._item_1oqtt_119")

    AVATAR_BUTTON = (By.CSS_SELECTOR, "div._avatar_1v5ye_119")
    EMAIL_BUTTON = (By.CSS_SELECTOR, "//li[@class='_item_1v5ye_187'][1]")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "//li[@class='_item_1v5ye_187'][2]")

    HOME_BUTTON = (By.CSS_SELECTOR, "button._topbarBtn_wfcpg_119")


class GoogleAuthPageLocators:
    USER_BUTTON = (By.CSS_SELECTOR, f"[data-email={users_email}]")


class AllGAPageLocators:
    # CLONE_PUBLIC_VA_BUTTON = (By.XPATH, "//button[contains(text(),'Clone')]")
    PUBLIC_RIGHT_SCROLL_BUTTON = (By.CSS_SELECTOR, "._btnR_j5dfs_162:nth-child(4)")
    PUBLIC_KEBAB = (By.XPATH,
                    f"//div[text()={public_va_name}]/../div[2]//button[contains(@class,"
                    "'_button_theme_secondary_small')]")
    PUBLIC_KEBAB_CHAT = (By.XPATH,
                         "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_PROPERTIES = (By.XPATH,
                               "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_CHECK_ARCHITECTURE = (By.XPATH,
                                       "//span[text()='Chat With Bot']")
    PUBLIC_USE = (By.XPATH,
                  f"//div[text()={public_va_name}]/../div[2]//button[contains(@class,"
                  "'_button_theme_primary_small')]")
    PUBLIC_USE_MW = (By.CSS_SELECTOR, "._assistantModal_1juys_119 [type='submit']")

    PRIVATE_EDIT_BUTTON = (By.XPATH, f"//div[text()={public_va_name}]/../div[2]//button[text()='Edit']")


class SkillPageLocators:
    EDIT_SKILL_BUTTON = (By.XPATH,
                         f"//p[text()={public_va_name}]/../..//button[contains(@class,"
                         "'_button_theme_primary_small')]")
    PLAY_BUTTON = (By.CSS_SELECTOR, "button._test_f46qd_119")


class SkillEditorPageLocators:
    OPEN_MODELS_DROPDOWN = (By.CSS_SELECTOR, "svg._arrowDown_1pat5_129")
    CHOOSE_MODEL = (By.XPATH, f"//li[text()={generative_model}]")
    ENTER_TOKEN_HERE = (By.XPATH, "")
    PROMPT_TEXTAREA = (By.CSS_SELECTOR, "input._field_tsih4_133")
    SAVE_BUTTON = (By.CSS_SELECTOR, "button._button_theme_primary_6t3ib_166")

    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "textarea._textarea_1gbu8_208")
    SEND_BUTTON = (By.CSS_SELECTOR, "//div[@class='_btns_1gbu8_241']/button[text()='Send']")
    BOT_MESSAGE = (By.CSS_SELECTOR, "li._bot_1gbu8_169")
    RESTART_DIALOG_BUTTON = (By.XPATH, "//div[@class='_btns_1gbu8_241']/button[1]")

    BCB_SKILL_NAME = (By.XPATH, f"//a[text()='{skill_name}']")

    CLOSE_BUTTON_MODAL_WINDOW = (By.CSS_SELECTOR, "div._btns_16aa1_133 ._button_theme_primary_6t3ib_166")


class ProfilePageLocators:
    TOKEN_TEXTAREA = (By.CSS_SELECTOR, "input._field_tsih4_133")
    CHOOSE_TOKEN_SERVICES_DROPDOWN = (By.CSS_SELECTOR, "svg._arrowDown_1pat5_129")
    CHOOSE_TOKEN_SERVICE = (By.CSS_SELECTOR, "li._item_1pat5_206")
    ENTER_TOKEN_BUTTON = (By.CSS_SELECTOR, "button._button_theme_tertiary_6t3ib_239")
    REMOVE_TOKEN = (By.CSS_SELECTOR, "button._remove_dq10a_204")


class MessengerPageLocators:
    CLONE_PUBLIC_VA_BUTTON = (By.XPATH, "//button[contains(text(),'Clone')]")


class DialogPanelLocators:
    RUN_TEST = (By.CSS_SELECTOR, "button._runTest_1t2t4_314")
    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "textarea._dialogSidePanel__textarea_1t2t4_161")
    SEND_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] button[type='submit']")
    BOT_MESSAGE = (By.CSS_SELECTOR, "span._chat__message_bot_1t2t4_239")
    RESTART_DIALOG_BUTTON = (By.CSS_SELECTOR, "div._right_1t2t4_263 ._button_6t3ib_119")
    CLOSE_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] ._close_140z8_135")


class DeepyLocators:
    DEEPY_BUTTON = (By.CSS_SELECTOR, "button#helperTab")

    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "textarea._dialogSidePanel__textarea_yvnkh_186")
    SEND_BUTTON = (By.CSS_SELECTOR, "[id='sp_left'] ._button_theme_primary_6t3ib_166")
    BOT_MESSAGE = (By.CSS_SELECTOR, "[id='sp_left'] span._chat__message_bot_w1nhx_281")
    # RESTART_DIALOG_BUTTON = (By.CSS_SELECTOR, "div._right_1t2t4_263 ._button_6t3ib_119")
    CLOSE_BUTTON = (By.CSS_SELECTOR, "[id='sp_left'] ._close_140z8_135")
