from services.auth_api.config import settings


GOOGLE_SCOPE = ['https://www.googleapis.com/auth/userinfo.profile']

CLIENT_INFO = {
    "client_id": settings.auth.google_client_id,
    "client_secret": settings.auth.google_client_secret,
}