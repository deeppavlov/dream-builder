import secrets
import string
from typing import Tuple

import services.shared.user

CYRILLIC_TO_LATIN = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "j",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "cz",
    "ч": "ch",
    "ш": "sh",
    "щ": "sch",
    "ы": "y",
    "э": "je",
    "ю": "y",
    "я": "ya",
}


def _map_character(char: str, space_replacement: str, lower: bool = True):
    clean_value = ""

    if lower:
        char = char.lower()

    if char == " ":
        clean_value = space_replacement
    elif char.isalpha():
        if char in CYRILLIC_TO_LATIN:
            clean_value = CYRILLIC_TO_LATIN[char]
        elif char in string.ascii_letters:
            clean_value = char
    elif char.isnumeric():
        clean_value = char

    return clean_value


def name_with_underscores_from_display_name(display_name: str):
    """Generates unique underscore_separated_name from human-readable name

    Args:
        display_name: human-readable name

    Returns:
        string in snake_case with unique identifier
    """
    normalized_name = "".join(_map_character(char, "_") for char in display_name)
    random_id = secrets.token_hex(4)

    return f"{normalized_name}_{random_id}"


def name_with_dashes_from_display_name(display_name: str):
    """Generates unique dash-separated-name from human-readable name

    Args:
        display_name: human-readable name

    Returns:
        string in snake_case with unique identifier
    """
    normalized_name = "".join(_map_character(char, "-") for char in display_name)
    random_id = secrets.token_hex(4)

    return f"{normalized_name}-{random_id}"


def names_from_display_name(display_name: str) -> Tuple[str, str]:
    """Generates both underscore_separated_name and dash-separated-name from human-readable name

    Args:
        display_name: human-readable name

    Returns:
        string in snake_case with unique identifier
    """
    normalized_name_with_underscores = "".join(_map_character(char, "_") for char in display_name)
    normalized_name_with_dashes = "".join(_map_character(char, "-") for char in display_name)
    random_id = secrets.token_hex(4)

    return f"{normalized_name_with_underscores}_{random_id}", f"{normalized_name_with_dashes}-{random_id}"


def from_email(user: services.shared.user.User):
    """
    User may not have an email field. The function generates mockemail as a Kostyl
    """
    return user.email if user.email else f"{user.outer_id}@noemail.com"