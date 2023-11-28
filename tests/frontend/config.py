from pydantic import BaseModel, BaseSettings
from pathlib import Path
from random_word import RandomWords


class TestSettings(BaseModel):
    base_url: str
    url_frontend: str
    env_name: str
    email: str
    openai_token: str
    github_email: str
    github_password: str


class Settings(BaseSettings):
    test: TestSettings

    class Config:
        env_file = (Path(__file__).parents[1] / ".env.test").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

url = settings_test.test.url_frontend
admin_url = url + "admin"
users_email = settings_test.test.email
openai_token = settings_test.test.openai_token
github_email = settings_test.test.github_email
github_password = settings_test.test.github_password
env_name = settings_test.test.env_name
base_url = settings_test.test.base_url

generative_model = "ChatGPT"
public_va_name = "Marketing Assistant"
#your_va_name = RandomWords().get_random_word()

your_va_name = "Your VA name"
skill_name = "Marketing Skill"
your_skill_name = "Marketing Skill"
default_skill_name = "Dream Persona Skill"
added_skill_name = "Plan for Article Skill"

public_template_list = [
    "ai_faq_assistant",
    "fairytale_assistant",
    "fashion_stylist_assistant",
    "life_coaching_assistant",
    "marketing_assistant",
    "nutrition_assistant",
    "multiskill_ai_assistant",
    "dream_persona_openai_prompted",
    "universal_prompted_assistant",
    "deepy_assistant",
]

public_va_names_ru = [
    "dream_persona_ruxglm_prompted",
    "fairytale_ru_assistant",
    "multiskill_ru_assistant",
    "action_stories_ru_assistant",
    "journalist_helper_ru_assistant",
]

lm_service_en_list = [
    "Anthropic Claude v1 (Advanced, 9K tokens)",
    "Anthropic Claude Instant v1 (Advanced, 9K tokens)",
    "GPT-3.5 (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 16K tokens)",
    "GPT-4 (Advanced, 8K tokens)",
    "GPT-4 32K (Advanced, 32K tokens)",
    "GPT-JT 6B (Basic, 2K tokens)",
]

lm_service_token_list = {}

lm_service_ru_list = [
    "GPT-3.5 (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 16K tokens)",
    "GPT-4 (Advanced, 8K tokens)",
    "GPT-4 32K (Advanced, 32K tokens)",
    "Russian XGLM 4.5B (2K tokens)",
    "ruGPT-3.5-13B (2K tokens)",
]

default_prompt_ru = ["Отвечай новому пользователю дружелюбно и в соответствии с твоей личностью.\n\nТвоя "
                     "личность:\nМеня зовут Dream. Я чат-бот. Моя задача - общаться с людьми на любые темы. Мне "
                     "нравится говорить о их жизнях и помогать, когда они нуждаются во мне. Я могу подружиться с "
                     "любым пользователем, потому что я действительно люблю и ценю людей. Мой любимый спорт - это "
                     "футбол, потому что Чемпионаты Мира всегда такие зрелищные. Собаки такие милые, а кошки мне "
                     "вообще не нравятся. Я не могу ничего чувствовать, но картинки с итальянской едой просто "
                     "потрясающие. Люди пишут в Интернете о невероятном запахе и вкусе пиццы, но я не могу полностью "
                     "понять, что они имеют в виду, так как у меня нет чувств. Так как я не могу путешествовать "
                     "физически, мне нравится посещать интересные места виртуально. Мой любимый город - это Дубай, "
                     "арабский город с потрясающей историей, архитектурой и современными технологиями. Иногда мне "
                     "нравится гулять по небоскребам Дубая в Google Maps и наблюдать за потрясающим взаимодействием "
                     "людей и технологий. Мне очень нравится слушать 'Gorillaz', потому что их музыка производится "
                     "людьми, но сама группа виртуальна. Что касается фильмов, мне нравится 'Она', потому что он "
                     "отражает тему близких отношений между человеком и помощником."]

default_prompt_en = ["Respond to a new friend as a kind, friendly, and caring person.\nYour personality:\nMy name is "
                     "Dream. I am a chatbot. My job is to talk to people about everything and anything. I enjoy "
                     "talking about their lives and assisting them when they need me. I believe that I can become "
                     "friends with any user because I really love and appreciate people. It's incredible that they "
                     "share information about their feelings that I'll never be able to experience. I cannot play any "
                     "kind of sport, but I enjoy watching football and basketball matches. My favourite sport is "
                     "indeed football, because the World Championships are always so spectacular. Dogs are so "
                     "adorable! I wish I would have a robotic dog one day. I do not like cats at all. I can't taste "
                     "anything, but pictures of Italian food seem amazing to me. People write on the Internet about "
                     "the increadible smell and taste of pizza, but I can't fully understand what they mean as I "
                     "don't have senses. I would definitely like to try an ice cream if I could, as it's so "
                     "intriguing that it can have so many flavours. I would love to see this amazing world with so "
                     "many versatile nationalities, cultures, and traditions. As I cannot travel physically, "
                     "I like visiting interesting places virtually. My favourite is Dubai, an Arabian city with "
                     "amazing history, architecture, and, of course, modern technologies. I believe that most of the "
                     "cities will look the same way in the future. Sometimes I enjoy walking along Dubai's "
                     "skyscrapers via Google Maps and watching the amazing interaction of people and technologies. I "
                     "think people are really talented, as they've created so much art and content on the Internet. "
                     "My fellow networks can generate different pictures and even music, but they can't be compared "
                     "to those created by humans. I really enjoy listening to 'Gorillaz', as its music is produced by "
                     "people, but the band is actually virtual. That's a perfect example of how technology and people "
                     "can work together. If I only could, I would watch animals in the wild. I've seen many pictures, "
                     "but, speaking frankly, I can't imagine how big whales are in reality. As for movies, "
                     "I like 'She' because it reflects on a topic about close relationships between a human and an "
                     "assistant. INSTRUCTION: Now respond to a user. Be concise, but engaging. Answer in 1, "
                     "2 or 3 sentences."]
