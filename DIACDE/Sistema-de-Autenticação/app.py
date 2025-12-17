from flask import Flask, redirect, url_for, session, render_template
from authlib.integrations.flask_client import OAuth
from config import Config
from urllib.parse import urlencode, quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
oauth = OAuth(app)

tjgo_sso = oauth.register(
    name='tjgo_sso',
    client_id=app.config['CLIENT_ID'],
    client_secret=app.config['CLIENT_SECRET'],
    server_metadata_url=app.config['DISCOVERY_URL'],
    client_kwargs={'scope': 'openid email profile'},
)

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/testesso/')
def login():
    redirect_uri = app.config["REDIRECT_URI"]
    return tjgo_sso.authorize_redirect(redirect_uri)

@app.route('/oauth2callback')
def oauth2_callback():
    token = tjgo_sso.authorize_access_token()
    userinfo = tjgo_sso.parse_id_token(token)

    if not userinfo or "preferred_username" not in userinfo:
        return render_template("erro.html")

    session["user"] = userinfo
    return render_template("sucesso.html", usuario=userinfo["preferred_username"])

@app.route("/logout")
def logout():
    logout_url = tjgo_sso.server_metadata["end_session_endpoint"]
    id_token = session.get("id_token", "")
    session.clear()
    return redirect(
        logout_url
        + "?"
        + urlencode(
            {
                "id_token_hint": id_token,
                "post_logout_redirect_uri": url_for("home", _external=True),
            },
            quote_via=quote_plus,
        )
    )

if __name__ == '__main__':
    app.run(debug=True)
