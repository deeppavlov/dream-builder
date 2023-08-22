from selenium.webdriver.common.by import By
from tests.config import public_va_name, users_email, skill_name, generative_model, your_va_name


class BasePageLocators:
    SIGN_IN_BUTTON = (By.XPATH, "//button[contains(text(),'Sign in')]")
    SIGN_IN_BUTTON_MODAL_WINDOW = (By.XPATH, "//button[contains(@class,'_sign-in-btn')]")

    #MAIN MENU
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
    BCB_PUBLIC_TEMPLATES = (By.XPATH, f"[href='/allbots']")
    BCB_YOUR_ASSISTANTS = (By.XPATH, f"[href='/yourbots']")
    BCB_YOUR_ASSISTANT_NAME = (By.XPATH, f"//a[text()='{your_va_name}']")
    BCB_PUBLIC_ASSISTANT_NAME = (By.XPATH, f"//a[text()='{public_va_name}']")

    CHANGE_VIEW_TYPE = (By.CSS_SELECTOR, "button[data-tooltip-id='viewType']")

    DEEPY_BUTTON = (By.CSS_SELECTOR, "button#helperTab")
    SETTINGS_BUTTON = (By.CSS_SELECTOR, "button#settingsTab")

    SUCCESS_TOAST = (By.XPATH, "//div[contains(text(),'Success')]")
    SUBMITTED_TOAST = (By.XPATH, "//div[contains(text(),'Submitted')]")


class GoogleAuthPageLocators:
    EMAIL_TEXTAREA = (By.CSS_SELECTOR, "input[type='email']")
    NEXT_BUTTON = (By.XPATH, "//span[text()='Далее']")
    USER_EMAIL_BUTTON = (By.CSS_SELECTOR, f"[data-email='{users_email}']")


class AllGAPageLocators:
    # PUBLIC TEMPLATES ASSISTANTS
    PUBLIC_TEMPLATE_CARD = (By.XPATH, f"//span[text()='{public_va_name}']/../..")

    PUBLIC_RIGHT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnR')][contains(@class,'_sub')]")
    PUBLIC_LEFT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnL')][contains(@class,'_sub')]")
    PUBLIC_KEBAB = (By.XPATH, f"//span[text()='{public_va_name}']/../..//button[contains(@class,'secondary')]")

    PUBLIC_KEBAB_CHAT = (By.XPATH,
                         "//span[text()='Chat With Assistant']")
    PUBLIC_KEBAB_PROPERTIES = (By.XPATH,
                               "//span[text()='Properties']")
    PUBLIC_KEBAB_CHECK_SKILLS = (By.XPATH,
                                 "//span[text()='Check Skills']")
    PUBLIC_USE_BUTTON = (By.XPATH,
                         f"//div[contains(@class,'public')]//span[text()='{public_va_name}']/../..//button["
                         f"contains(@class,'primary')]")

    PUBLIC_USE_MW_USE_BUTTON = (By.XPATH, "//button[contains(text(),'Create')]")
    PUBLIC_USE_MW_CANCEL_BUTTON = (By.XPATH, "//form[contains(@class,'_assistantModal')]//button[1]")

    SHOW_ALL_PUBLIC_TEMPLATES = (By.CSS_SELECTOR, "[href='/allbots']>button")

    PROPERTIES_PANEL_HEADER = (By.XPATH, "//li[text()='Properties']")

    # YOUR ASSISTANTS

    CREATE_VA_BUTTON = (By.XPATH, "//button[contains(@class,'_forCard')]")
    CREATE_VA_NAME_TEXTAREA = (By.CSS_SELECTOR, "[name='display_name']")
    CREATE_VA_DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "[name='description']")
    CREATE_VA_CANCEL_BUTTON = (By.XPATH, "//button[text()='Cancel']")
    CREATE_VA_CLOSE_BUTTON = (By.CSS_SELECTOR, "[stroke='inherit']")
    CREATE_VA_CREATE_BUTTON = (By.XPATH, "//button[text()='Create']")

    YOUR_EDIT_BUTTON = (By.XPATH,
                        f"//div[contains(@class,'_wrapper')][2]//span[text()='{your_va_name}']/../../div[2]//button[text()='Edit']")
    YOUR_RIGHT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnR')][contains(@class,'_private')]")
    YOUR_LEFT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnL')][contains(@class,'_private')]")

    YOUR_KEBAB = (By.XPATH, f"//div[contains(@class,'_wrapper')][2]//span[text()='{your_va_name}']/../..//button[2]")
    YOUR_KEBAB_CHAT = (By.XPATH, "//span[text()='Chat With Assistant']")

    YOUR_KEBAB_SHARE = (By.XPATH, "//span[text()='Share']")
    SHARE_LINK = (By.CSS_SELECTOR, "[name='link']")
    COPY_LINK_BUTTON = (By.XPATH, "//button[contains(@class,'_close')]")
    OPEN_IN_ANOTHER_TAB_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[contains(text(),'Open in "
                                            "another tab')]")
    SHARE_TO_FACEBOOK_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[@aria-label='facebook']")
    SHARE_TO_TWITTER_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[@aria-label='twitter']")
    SHARE_TO_TELEGRAM_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[@aria-label='telegram']")
    SHARE_TO_LINKEDIN_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[@aria-label='linkedin']")
    SHARE_TO_REDDIT_BUTTON = (By.XPATH, "//div[contains(@class,'_shareModal')]//button[@aria-label='reddit']")

    YOUR_KEBAB_VISIBILITY = (By.XPATH, "//span[text()='Visibility']")
    YOUR_KEBAB_RENAME = (By.XPATH, "//span[text()='Rename']")
    YOUR_KEBAB_PROPERTIES = (By.XPATH, "//span[text()='Properties']")

    YOUR_KEBAB_DELETE = (By.XPATH, "//span[text()='Delete']")
    YOUR_A_DELETE_MW_DELETE = (By.XPATH, "//button[text()='Delete']")

    PRIVATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Private")
    UNLISTED_VISIBILITY_MW = (By.CSS_SELECTOR, "#Unlisted")
    PUBLIC_TEMPLATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Public")
    SAVE_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(text(),'Save')]")
    PUBLISH_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(text(),'Publish')]")
    NO_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(text(),'No')]")
    CLOSE_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(@class,'_close')]")

    SHOW_ALL_YOUR_VA = (By.CSS_SELECTOR, "[href='/yourbots']>button")

    READY_TO_CHAT = (By.XPATH, f"//span[contains(text(),'{your_va_name}')]/../..//span[contains(text(),'Ready')]")

    YOUR_ASSISTANT_IN_PUBLIC = (
        By.XPATH, f"//div[contains(@class,'_primary')]//span[contains(text(),'{your_va_name}')]/../..//span[contains("
                  f"text(),'Public Template')]")
    YOUR_ASSISTANT_PUBLIC_TEMPLATE_WRAP = (
        By.XPATH, f"//span[contains(text(),'Ready')]/../..//span[contains(text(),'Public Template')]")

    DEEPY_TOOLTIP = (By.XPATH, "//div[contains(text(),'Ask Deepy')]")


class SkillPageLocators:
    # SKILLS TAB
    SKILLS_TAB = (By.CSS_SELECTOR, "[data-tooltip-id='sidebarSkillTab']")

    # EDIT_SKILL_BUTTON = (By.XPATH, "//p[contains(text(),'Generative')]/../../..//button[contains(text(),'Edit')]")
    EDIT_SKILL_BUTTON = (By.XPATH, f"//p[contains(text(),'{skill_name}')]/../..//button[contains(text(),'Edit')]")
    CHAT_WITH_ASSISTANT_BUTTON = (By.CSS_SELECTOR, "button[data-tooltip-id='chatWithBot']")
    BUILD_ASSISTANT_BUTTON = (By.XPATH, "//button[contains(text(),'Build Assistant')]")
    STOP_ASSISTANT_BUTTON = (By.XPATH, "//button[contains(text(),'Stop Assistant')]")
    DUPLICATE_ASSISTANT_BUTTON = (By.XPATH, "//button[contains(text(),'Duplicate Assistant')]")
    INFO_ASSISTANT_BUTTON = (By.XPATH, "//div[contains(@class,'_wrapper')][1]/div[2]//button[1]")

    VISIBILITY_BUTTON = (By.XPATH, "//input")
    PRIVATE_VISIBILITY_BUTTON = (By.XPATH, "//button[contains(text(),'Visibility')]")
    UNLISTED_VISIBILITY_BUTTON = (By.XPATH, "//li[contains(text(),'Unlisted')]")
    PUBLIC_TEMPLATE_VISIBILITY_BUTTON = (By.XPATH, "//li[contains(text(),'Public Template')]")

    SHARE_BUTTON = (By.XPATH, "//div[contains(@class,'_wrapper')][1]/div[3]//button")

    READ_FIRST_BUTTON = (By.CSS_SELECTOR, "//button[contains(text(),'Read First!')]")
    CLOSE_READ_FIRST_PANEL = (By.CSS_SELECTOR, "[id='sp_right'] [stroke='inherit']")
    CHANGE_VIEW_BUTTON = (By.CSS_SELECTOR, "//div[contains(@class,'_wrapper')][2]/div//button[2]")

    CREATE_SKILL_BUTTON = (By.XPATH, "//button[contains(@class,'_forCard')]")
    CREATE_FROM_SCRATCH_BUTTON = (By.XPATH, "//p[text()='Create From Scratch']/..")
    CREATE_SKILL_NAME_TEXTAREA = (By.CSS_SELECTOR, "[name='display_name']")
    CREATE_SKILL_DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "[name='description']")
    CREATE_SKILL_CANCEL_BUTTON = (By.XPATH, "//button[text()='Cancel']")
    CREATE_SKILL_CLOSE_BUTTON = (By.CSS_SELECTOR, "[stroke='inherit']")
    CREATE_SKILL_CREATE_BUTTON = (By.XPATH, "//button[text()='Create']")
    CREATE_SKILL_OK_BUTTON = (By.XPATH, "//button[text()='OK']")

    SKILL_CARD = (By.XPATH, f"//p[text()='{skill_name}']")
    PROPERTIES_PANEL_HEADER = (By.XPATH, "//li[text()='Properties']")

    CARD_MODE_TAB = (By.XPATH, "//button[contains(@class,'_left')]")
    LIST_MODE_TAB = (By.XPATH, "//button[contains(@class,'_right')]")

    VISIBILITY_LABEL = (By.XPATH, "//span[contains(@class,'_text')]")
    READY_TO_CHAT_WRAP = (By.XPATH, "//span[contains(text(),'Ready')]")

    ASSISTANT_NAME = (By.XPATH, "//h5[contains(@class,'_title')]")
    ASSISTANT_DESCRIPTION = (By.XPATH, "//span[contains(@class,'_body')]")


    # INTEGRATION TAB

    INTEGRATION_TAB = (By.CSS_SELECTOR, "[data-tooltip-id='sidebarIntegrationTab']")
    WEB_CHAT_TAB = (By.XPATH, "//button[text()='Web Chat']")
    API_CALL_TAB = (By.XPATH, "//button[text()='API Call']")
    COPY_CODE = (By.XPATH, "//button[text()='Copy Code']")

    CURL_TAB = (By.CSS_SELECTOR, "//button[text()='cURL']")
    NODE_JS_TAB = (By.CSS_SELECTOR, "//button[text()='NodeJS']")
    PYTHON_TAB = (By.CSS_SELECTOR, "//button[text()='Python']")

    CURL_CODE = (By.CSS_SELECTOR, ".language-bash")
    NODE_JS_CODE = (By.CSS_SELECTOR, ".language-js")
    PYTHON_CODE = (By.CSS_SELECTOR, ".language-python")







class SkillEditorPageLocators:
    OPEN_MODELS_DROPDOWN = (By.CSS_SELECTOR, "input[placeholder='Choose model']")
    CHOOSE_MODEL = (By.XPATH, f"//span[contains(text(),'{generative_model}')]")
    ENTER_TOKEN_HERE = (By.XPATH, "//button[contains(text(),'Enter your')]")
    PROMPT_TEXTAREA = (By.XPATH, "//textarea[contains(@class,'_field')]")
    SAVE_BUTTON = (By.XPATH, "//button[contains(text(),'Save')]")

    MESSAGE_TEXTAREA = (By.XPATH, "//form[contains(@class,'_dialog_')]//textarea")
    SEND_BUTTON = (By.XPATH, "//form[contains(@class,'_dialog_')]//button[2]")
    RESTART_DIALOG_BUTTON = (By.XPATH, "//form[contains(@class,'_dialog_')]//button[1]")

    USER_MESSAGE = (By.XPATH, "//li[contains(@class,'_msg')][1]")
    BOT_MESSAGE = (By.XPATH, "//li[contains(@class,'_msg')][2]")

    CLOSE_BUTTON_MODAL_WINDOW = (By.XPATH, "//div[contains(@class,'_wrapper')]/button[contains(@class,'_close')]")

    BCB_SKILLS = (By.XPATH, f"//a[text()='Skills']")
    BCB_SKILL_NAME = (By.XPATH, f"//a[text()='{skill_name}']")


class ProfilePageLocators:
    ACCOUNT_TAB = (By.XPATH, "//li[contains(text(),'Account')]")
    PERSONAL_TOKENS = (By.XPATH, "//li[contains(text(),'Personal tokens')]")

    CURRENT_LANGUAGE = (By.XPATH,
                        "//li[contains(text(),'//span[text()='Language']/../span[contains(@class,'_value')]')]")
    CHANGE_LANGUAGE = (By.XPATH, "//button[text()='Change language']")
    RADIOBUTTON_ENGLISH = (By.CSS_SELECTOR, "input[id='English']")
    RADIOBUTTON_RUSSIAN = (By.CSS_SELECTOR, "input[id='Russian']")
    SAVE_BUTTON = (By.CSS_SELECTOR, "//div[contains(@class,'_footer')]/button[contains(@class,'primary')]")
    CANCEL_BUTTON = (By.CSS_SELECTOR, "//div[contains(@class,'_footer')]/button[contains(@class,'secondary')]")

    TOKEN_TEXTAREA = (By.CSS_SELECTOR, "input[name='token']")
    CHOOSE_TOKEN_SERVICES_DROPDOWN = (By.CSS_SELECTOR, "input[name='service']")
    CHOOSE_TOKEN_SERVICE_OPENAI = (By.XPATH, "//span[contains(text(),'OpenAI')]")
    ENTER_TOKEN_BUTTON = (By.XPATH, "//button[text()='Enter']")
    CLOSE_BUTTON = (By.XPATH, "//*[local-name() = 'svg'][contains(@class,'_close')]")

    REMOVE_TOKEN = (By.XPATH, "//button[contains(@class,'_remove')]")
    ADDED_TOKEN = (By.XPATH, "//div[contains(@class,'_tokenName')]")

    SUCCESS_TOAST = (By.XPATH, "//div[contains(text(),'Success')]")


class MessengerPageLocators:
    SAY_HI_BUTTON = (By.XPATH, "//button[text()='Say Hi!']")
    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "div textarea")
    BOT_MESSAGE = (By.CSS_SELECTOR, "[data-idx='1']")
    SEND_BUTTON = (By.XPATH, "//button[text()='Send']")
    PROPERTIES_BUTTON = (By.CSS_SELECTOR, "[stroke='#8d96b5']")
    SHARE_BUTTON = (By.XPATH, "//div[contains(@class,'_share')]")
    SHARE_ON_SOCIAL_MEDIA_BUTTON = (By.XPATH, "//button[text()='Share on social media']")
    SHARE_TO_TELEGRAM_BUTTON = (By.XPATH, "//button[text()=' Telegram']")
    EMBED_BUTTON = (By.XPATH, "//button[text()='Embed']")
    MAKE_COPY_BUTTON = (By.XPATH, "//span[contains(text(),'Make Copy')]/../..")

    KEY_BUTTON = (By.XPATH, "//div[contains(@class,'_key-icon')]")
    CLOSE_BUTTON = (By.XPATH, "//div[contains(@class,'_close-btn')]")

    TOKEN_TEXTAREA = (By.CSS_SELECTOR, "input[name='tokenValue']")

    CHOOSE_TOKEN_SERVICES_DROPDOWN = (By.CSS_SELECTOR, "input[name='tokenService']")
    CHOOSE_TOKEN_SERVICE_OPENAI = (By.XPATH, "//li[contains(text(),'Openai')]")
    ENTER_TOKEN_BUTTON = (By.XPATH, "//button[text()='Enter']")

    REMOVE_TOKEN = (By.XPATH, "//button[contains(@class,'_remove')]")
    ADDED_TOKEN = (By.XPATH, "//div[contains(@class,'_tokenName')]")

    SUCCESS_TOAST=''


class DialogPanelLocators:
    # RUN_TEST = (By.XPATH, "/button[contains(@class,'_runTest_')]")
    BUILD_ASSISTANT = (By.XPATH, "//div[contains(@class,'_deployPanel')]/button")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_right']//textarea")

    SEND_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] button[type='submit']")

    USER_MESSAGE = (By.XPATH, "//div[1]/span[contains(@class,'_chat')]")
    BOT_MESSAGE = (By.XPATH, "//div[2]/span[contains(@class,'_chat')]")

    RESTART_DIALOG_BUTTON = (By.XPATH, "//div[@id='sp_right']//button[contains(@class,'secondary')] ")
    CLOSE_BUTTON = (By.XPATH, "//div[@id='sp_right']//button[contains(@class,'_close')] ")


class DeepyLocators:
    #DEEPY_TOOLTIP = (By.CSS_SELECTOR, "button#helperTab")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_left']//textarea[contains(@class,'_dialogSidePanel')]")
    SEND_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class, 'primary')]")
    RESTART_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class, 'secondary')]")

    USER_MESSAGE = (By.XPATH, "//div[@id='sp_left']//span[contains(@class,'_botMessage')]")
    DEEPY_MESSAGE = (By.XPATH, "//div[@id='sp_left']//span[contains(@class,'_botMessage')]")
    CLOSE_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class,'_close')]")


class AdminPageLocators:
    APPROVE_BUTTON = (By.XPATH, f"//mark[text()='{users_email}']/../..//button[1]")
