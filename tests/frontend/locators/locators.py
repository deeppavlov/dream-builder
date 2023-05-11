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
    # PUBLIC TEMPLATES ASSISTANTS
    PUBLIC_TEMPLATE_CARD = (By.XPATH, f"//span[text()='{public_va_name}']/../..")

    PUBLIC_RIGHT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnR')][contains(@class,'_sub')]")
    PUBLIC_LEFT_SCROLL_BUTTON = (By.XPATH, "//button[contains(@class,'_btnL')][contains(@class,'_sub')]")
    PUBLIC_KEBAB = (By.XPATH, f"//div[contains(@class,'public')]//span[text()='{public_va_name}']/../..//button["
                              f"contains(@class,'secondary')]")

    PUBLIC_KEBAB_CHAT = (By.XPATH,
                         "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_PROPERTIES = (By.XPATH,
                               "//span[text()='Chat With Bot']")
    PUBLIC_KEBAB_CHECK_SKILLS = (By.XPATH,
                                 "//span[text()='Chat With Bot']")
    PUBLIC_USE_BUTTON = (By.XPATH,
                         f"//div[contains(@class,'public')]//span[text()='{public_va_name}']/../..//button["
                         f"contains(@class,'primary')]")

    PUBLIC_USE_MW_USE_BUTTON = (By.XPATH, "//form[contains(@class,'_assistantModal')]//button[2]")
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

    YOUR_EDIT_BUTTON = (By.XPATH, f"//div[text()={public_va_name}]/../div[2]//button[text()='Edit']")
    YOUR_RIGHT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnR')][contains(@class,'_private')]")
    YOUR_LEFT_SCROLL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_btnL')][contains(@class,'_private')]")

    YOUR_KEBAB = (By.XPATH, f"//div[contains(@class,'your')]//div[text()='{public_va_name}']/../div[2]//button["
                            f"contains(@class,'_button_theme_secondary_small')][1]")
    YOUR_KEBAB_CHAT = (By.XPATH, "//span[text()='Chat With Bot']")

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
    PRIVATE_KEBAB_PROPERTIES = (By.XPATH, "//span[text()='Properties']")
    PRIVATE_KEBAB_DELETE = (By.XPATH, "//span[text()='Delete']")

    PRIVATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Private")
    UNLISTED_VISIBILITY_MW = (By.CSS_SELECTOR, "#Unlisted")
    PUBLIC_TEMPLATE_VISIBILITY_MW = (By.CSS_SELECTOR, "#Public")
    SAVE_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(text(),'Save')]")
    NO_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(text(),'No')]")
    CLOSE_BUTTON_VISIBILITY_MW = (By.XPATH, "//button[contains(@class,'_close')]")

    SHOW_ALL_YOUR_VA = (By.CSS_SELECTOR, "[href='/yourbots']>button")


class SkillPageLocators:
    EDIT_SKILL_BUTTON = (By.XPATH, "//p[contains(text(),'Generative')]/../../..//button[contains(text(),'Edit')]")
    PLAY_BUTTON = (By.CSS_SELECTOR, "button[data-tooltip-id='chatWithBot']")

    CREATE_SKILL_BUTTON = (By.CSS_SELECTOR, "//button[contains(@class,'_forCard')]")
    CREATE_FROM_SCRATCH_BUTTON = (By.XPATH, "//p[text()='Create From Scratch']/..")
    CREATE_SKILL_NAME_TEXTAREA = (By.CSS_SELECTOR, "[name='display_name']")
    CREATE_SKILL_DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "[name='description']")
    CREATE_SKILL_CANCEL_BUTTON = (By.XPATH, "//button[text()='Cancel']")
    CREATE_SKILL_CLOSE_BUTTON = (By.CSS_SELECTOR, "[stroke='inherit']")
    CREATE_SKILL_CREATE_BUTTON = (By.XPATH, "//button[text()='Create']")


class SkillEditorPageLocators:
    OPEN_MODELS_DROPDOWN = (By.CSS_SELECTOR, "input[placeholder='Choose model']")
    CHOOSE_MODEL = (By.XPATH, f"//li[text()='{generative_model}']")
    ENTER_TOKEN_HERE = (By.XPATH, "//a[contains(text(),'Enter your personal access token here')]")
    PROMPT_TEXTAREA = (By.CSS_SELECTOR, "//textarea[contains(@class,'_field')]")
    SAVE_BUTTON = (By.CSS_SELECTOR, "//button[contains(text(),'Save')]")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[contains(@class,'_dialog_')]//textarea")
    SEND_BUTTON = (By.CSS_SELECTOR, "//div[contains(@class,'_dialog_')]//button[2]")
    RESTART_DIALOG_BUTTON = (By.XPATH, "//div[contains(@class,'_dialog_')]//button[1]")

    USER_MESSAGE = (By.XPATH, "//li[contains(@class,'_msg')][1]")
    BOT_MESSAGE = (By.XPATH, "//li[contains(@class,'_msg')][2]")

    BCB_SKILL_NAME = (By.XPATH, f"//a[text()='{skill_name}']")

    CLOSE_BUTTON_MODAL_WINDOW = (By.XPATH, "//div[contains(@class,'_wrapper')]/button[contains(@class,'_close')]")


class ProfilePageLocators:
    TOKEN_TEXTAREA = (By.CSS_SELECTOR, "input[name='token']")
    CHOOSE_TOKEN_SERVICES_DROPDOWN = (By.CSS_SELECTOR, "input[name='service']")
    CHOOSE_TOKEN_SERVICE_OPENAI = (By.XPATH, "//li[contains(text(),'OpenAI')]")
    ENTER_TOKEN_BUTTON = (By.XPATH, "//div[contains(@class,'_submit')]/button")
    REMOVE_TOKEN = (By.XPATH, "//button[contains(@class,'_remove')]")

    ADDED_TOKEN = (By.XPATH, "//div[contains(@class,'_tokenName')]")


class MessengerPageLocators:
    SAY_HI_BUTTON = (By.XPATH, "//button[text()='Say Hi!']")
    MESSAGE_TEXTAREA = (By.CSS_SELECTOR, "div textarea")
    BOT_MESSAGE = (By.CSS_SELECTOR, "")
    SEND_BUTTON = (By.XPATH, "//button[text()='Send']")
    PROPERTIES_BUTTON = (By.CSS_SELECTOR, "[stroke='#8d96b5']")
    SHARE_BUTTON = (By.CSS_SELECTOR, "//div[contains(@class,'_share')]")
    SHARE_ON_SOCIAL_MEDIA_BUTTON = (By.XPATH, "//button[text()='Share on social media']")
    SHARE_TO_TELEGRAM_BUTTON = (By.XPATH, "//button[text()=' Telegram']")
    EMBED_BUTTON = (By.XPATH, "//button[text()='Embed']")
    MAKE_COPY_BUTTON = (By.CSS_SELECTOR, "//span[contains(text(),'Make Copy')]/../..")


class DialogPanelLocators:
    # RUN_TEST = (By.XPATH, "/button[contains(@class,'_runTest_')]")
    BUILD_ASSISTANT = (By.XPATH, "//div[contains(@class,'_deployPanel')]/button")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_right']//textarea[contains(@class,'_dialogSidePanel')]")

    SEND_BUTTON = (By.CSS_SELECTOR, "[id='sp_right'] button[type='submit']")

    USER_MESSAGE = (By.XPATH, "//div[1]/span[contains(@class,'_chat')]")
    BOT_MESSAGE = (By.XPATH, "//div[2]/span[contains(@class,'_chat')]")

    RESTART_DIALOG_BUTTON = (By.XPATH, "//div[@id='sp_right']//button[contains(@class,'secondary')] ")
    CLOSE_BUTTON = (By.XPATH, "//div[@id='sp_right']//button[contains(@class,'_close')] ")


class DeepyLocators:
    DEEPY_TOOLTIP = (By.CSS_SELECTOR, "button#helperTab")

    DEEPY_BUTTON = (By.CSS_SELECTOR, "button#helperTab")

    MESSAGE_TEXTAREA = (By.XPATH, "//div[@id='sp_left']//textarea[contains(@class,'_dialogSidePanel')]")
    SEND_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class,'_button')]")

    USER_MESSAGE = (By.XPATH, "//div[1]/span[contains(@class,'_chat')]")
    DEEPY_MESSAGE = (By.XPATH, "//div[2]/span[contains(@class,'_chat')]")
    # RESTART_DIALOG_BUTTON = (By.CSS_SELECTOR, "")
    CLOSE_BUTTON = (By.XPATH, "//div[@id='sp_left']//button[contains(@class,'_close')]")


class CheckPromptLocators:
    USE_BUTTON = (By.XPATH, "//button[contains(text(),'Use')]")
