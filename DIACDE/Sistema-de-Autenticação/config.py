import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "ssoseguro123")
    CLIENT_ID = os.environ.get("CLIENT_ID")
    CLIENT_SECRET = os.environ.get("CLIENT_SECRET")
    DISCOVERY_URL = "https://sso.tjgo.jus.br/auth/realms/tjgo.jus.br-2fa/.well-known/openid-configuration"
    REDIRECT_URI = os.environ.get("REDIRECT_URI", "http://localhost:5000/oauth2callback")
