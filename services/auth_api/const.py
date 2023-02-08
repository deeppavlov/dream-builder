from services.auth_api.config import settings


CLIENT_INFO = {
    "client_id": settings.auth.google_client_id,
    "client_secret": settings.auth.google_client_secret,
}

URL_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
CLIENT_SECRET_FILENAME = "client_secret.json"
