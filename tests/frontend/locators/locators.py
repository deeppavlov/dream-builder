from selenium.webdriver.common.by import By
from tests.config import public_va_name, users_email, skill_name, generative_model


class BasePageLocators:
    SIGN_IN_BUTTON = (By.XPATH, "//button[contains(text(),'Sign in')]")
    SIGN_IN_BUTTON_MODAL_WINDOW = (By.XPATH, "//button[contains(@class,'_sign-in-btn')]")

    MAIN_MENU_BUTTON = (By.XPATH, "//div[contains(@class,'_menu')]")
    ABOUT_BUTTON = (By.XPATH, "//a[contains(text(),'About')]/..")
    WELCOME_GUIDE_BUTTON = (By.XPATH, "//span[contains(text(),'Welcome guide')]/..")
    RENAME_BUTTON = (By.XPATH, "//span[contains(text(),'Rename')]/..")
    ADD_SKILLS_BUTTON = (By.XPATH, "//span[contains(text(),'Add Skills')]/..")
    VISIBILITY_BUTTON = (By.XPATH, "//span[contains(text(),'Visibility')]/..")
    SHARE_BUTTON = (By.XPATH, "//span[contains(text(),'Share')]/..")
    DELETE_BUTTON = (By.XPATH, "//span[contains(text(),'Delete')]")

    AVATAR_BUTTON = (By.CSS_SELECTOR, "[data-tooltip-id='profile']")
    EMAIL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_item')][1]")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_item')][2]")

    HOME_BUTTON = (By.CSS_SELECTOR, "button[data-tooltip-id='home']")
    CHANGE_VIEW_TYPE = (By.CSS_SELECTOR, "button[data-tooltip-id='viewType']")


class GoogleAuthPageLocators:
    EMAIL_TEXTAREA = (By.CSS_SELECTOR, "input[type='email']")
    NEXT_BUTTON = (By.XPATH, "//span[text()='Далее']")
    USER_EMAIL_BUTTON = (By.CSS_SELECTOR, f"[data-email='{users_email}']")


class AllGAPageLocators:
    # PUBLIC
    PUBLIC_TEMPLATE_CARD = (By.XPATH, f"//span[text()='{public_va_name}']/../..")

    PUBLIC_RIGHT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnR')][contains(@class,'_sub')]")
    PUBLIC_LEFT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnL')][contains(@class,'_sub')]")
    PUBLIC_KEBAB = (By.XPATH, f"//div[contains(@class,'public')]//div[text()='{public_va_name}']/../div[2]//button["
                              f"contains(@class,'_button_theme_secondary_small')][1]")
    PUBLIC_KEBAB_CHAT = (By.XPATH,
                         "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_PROPERTIES = (By.XPATH,
                               "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_CHECK_SKILLS = (By.XPATH,
                                       "//span[text()='Chat With Bot']")
    PUBLIC_USE = (By.XPATH,
                  f"//div[contains(@class,'public')]//div[text()='{public_va_name}]/../div[2]//button[contains("
                  f"@class,'_button_theme_primary_small')]")
    PUBLIC_USE_MW = (By.CSS_SELECTOR, "._assistantModal_1juys_119 [type='submit']")

    SHOW_ALL_PUBLIC_TEMPLATES = (By.CSS_SELECTOR, "[href='/allbots'] button._ghost_btn_1g1pw_191")

    PROPERTIES_PANEL_HEADER = (By.XPATH, "//li[text()='Properties']")



    # PRIVATE

    CREATE_VA_BUTTON = (By.XPATH, "//button[contains(@class,'_forCard')]")
    CREATE_VA_NAME_TEXTAREA = (By.CSS_SELECTOR, "[name='display_name']")
    CREATE_VA_DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "[name='description']")
    CREATE_VA_CANCEL_BUTTON = (By.XPATH, "//button[text()='Cancel']")
    CREATE_VA_CLOSE_BUTTON = (By.CSS_SELECTOR, "[stroke='inherit']")
    CREATE_VA_CREATE_BUTTON = (By.XPATH, "//button[text()='Create']")


    PRIVATE_EDIT_BUTTON = (By.XPATH, f"//div[text()={public_va_name}]/../div[2]//button[text()='Edit']")
    PRIVATE_RIGHT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnR')][contains(@class,'_private')]")
    PRIVATE_LEFT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnL')][contains(@class,'_private')]")

    PRIVATE_KEBAB = (By.XPATH, f"//div[contains(@class,'your')]//div[text()='{public_va_name}']/../div[2]//button["
                               f"contains(@class,'_button_theme_secondary_small')][1]")
    PRIVATE_KEBAB_CHAT = (By.XPATH, "//span[text()='Chat With Bot']")

    PRIVATE_KEBAB_SHARE = (By.XPATH, "//span[text()='Share']")
    SHARE_LINK = (By.CSS_SELECTOR, "input._field_tsih4_133")

    PRIVATE_KEBAB_VISIBILITY = (By.XPATH, "//span[text()='Visibility']")
    PRIVATE_KEBAB_RENAME = (By.XPATH, "//span[text()='Rename']")
    PRIVATE_KEBAB_PROPERTIES = (By.XPATH, "//span[text()='Properties']")
    PRIVATE_KEBAB_DELETE = (By.XPATH, "//span[text()='Delete']")

    PRIVATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Private")
    UNLISTED_VISIBILITY_MW = (By.CSS_SELECTOR, "#Unlisted")
    PUBLIC_TEMPLATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Public")
    SAVE_BUTTON_VISIBILITY_MW = (By.CSS_SELECTOR, "div._publishAssistantModal_t8oq7_119 "
                                                  "._button_theme_primary_6t3ib_166")
    NO_BUTTON_VISIBILITY_MW = (By.CSS_SELECTOR, "div._publishAssistantModal_t8oq7_119 "
                                                "._button_theme_secondary_6t3ib_182")
    CLOSE_BUTTON_VISIBILITY_MW = (By.CSS_SELECTOR, "svg._close_5buha_151")

    SHOW_ALL_PRIVATE = (By.CSS_SELECTOR, "[href='/yourbots'] button._ghost_btn_1g1pw_191")


class SkillPageLocators:
    EDIT_SKILL_BUTTON = (By.XPATH, "//p[contains(text(),'Generative')]/../../..//button[contains(text(),'Edit')]")
    PLAY_BUTTON = (By.CSS_SELECTOR, "button._test_f46qd_119")

    CREATE_SKILL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_forCard')]")
    CREATE_FROM_SCRATCH_BUTTON = (By.XPATH, "//p[text()='Create From Scratch']/..")
    CREATE_SKILL_NAME_TEXTAREA = (By.CSS_SELECTOR, "[name='display_name']")
    CREATE_SKILL_DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "[name='description']")
    CREATE_SKILL_CANCEL_BUTTON = (By.XPATH, "//button[text()='Cancel']")
    CREATE_SKILL_CLOSE_BUTTON = (By.CSS_SELECTOR, "[stroke='inherit']")
    CREATE_SKILL_CREATE_BUTTON = (By.XPATH, "//button[text()='Create']")


class SkillEditorPageLocators:
    OPEN_MODELS_DROPDOWN = (By.CSS_SELECTOR, "svg._arrowDown_1pat5_129")
    CHOOSE_MODEL = (By.XPATH, f"//li[text()={generative_model}]")
    ENTER_TOKEN_HERE = (By.XPATH, "")
    PROMPT_TEXTAREA = (By.CSS_SELECTOR, "//textarea[contains(@class,'_field')]")
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
    SAY_HI_BUTTON = (By.XPATH, "//button[text()='Say Hi!']")
    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "div textarea")
    BOT_MESSAGE = (By.CSS_SELECTOR, "")
    SEND_BUTTON = (By.XPATH, "//button[text()='Send']")
    PROPERTIES_BUTTON = (By.CSS_SELECTOR, "[stroke='#8d96b5']")
    SHARE_BUTTON = (By.CSS_SELECTOR, "._share_zig8d_92._icon_zig8d_98")
    SHARE_ON_SOCIAL_MEDIA_BUTTON = (By.XPATH, "//button[text()='Share on social media']")
    SHARE_TO_TELEGRAM_BUTTON = (By.XPATH, "//button[text()=' Telegram']")
    EMBED_BUTTON = (By.XPATH, "//button[text()='Embed']")
    MAKE_COPY_BUTTON = (By.CSS_SELECTOR, "._button_clone_12bav_108")


class DialogPanelLocators:
    RUN_TEST = (By.CSS_SELECTOR, "button._runTest_1t2t4_314")
    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_right']//textarea[contains(@class,'_dialogSidePanel')]")
    SEND_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] button[type='submit']")
    BOT_MESSAGE = (By.CSS_SELECTOR, "span._chat__message_bot_1t2t4_239")
    RESTART_DIALOG_BUTTON = (By.CSS_SELECTOR, "div._right_1t2t4_263 ._button_6t3ib_119")
    CLOSE_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] ._close_140z8_135")


class DeepyLocators:
    DEEPY_TOOLTIP = (By.CSS_SELECTOR, "button#helperTab")

    DEEPY_BUTTON = (By.CSS_SELECTOR, "button#helperTab")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_left']//textarea[contains(@class,'_dialogSidePanel')]")
    SEND_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class,'_button')]")
    DEEPY_MESSAGE = (By.CSS_SELECTOR, "[id='sp_left'] span._chat__message_bot_w1nhx_281")
    #RESTART_DIALOG_BUTTON = (By.CSS_SELECTOR, "div._right_1t2t4_263 ._button_6t3ib_119")
    CLOSE_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class,'_close')]")


class CheckPromptLocators:
    USE_BUTTON = (By.XPATH, "//button[contains(text(),'Use')]")

