from typing import Union, Literal

from services.auth_api.auth_type.base import OAuth, OAuth2
from services.auth_api.auth_type.provider import GithubAuth, GoogleOAuth2
from services.auth_api.auth_type.unauth import Unauth

AuthProviders = Union[GithubAuth, GoogleOAuth2]
OAuth2ProviderNames = Literal["", "google"]
