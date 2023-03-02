import smtplib
import ssl
from email.message import EmailMessage

from jinja2 import Environment, FileSystemLoader, select_autoescape


env = Environment(
    loader=FileSystemLoader("services/distributions_api/templates"),
    autoescape=select_autoescape()
)


class Emailer:
    def __init__(self, server_name: str, port: int, user: str, password: str):
        self.server_name = server_name
        self.port = port
        self.user = user
        self.password = password

        self.context = ssl.create_default_context()

        self._server = smtplib.SMTP(self.server_name, self.port)

        self._server.starttls(context=self.context)
        self._server.login(self.user, self.password)

    def send_publish_request(self, from_user: str, dist_name: str):
        template = env.get_template("publish_request_email.html")
        msg = EmailMessage()

        msg["Subject"] = f"Publish Request for {dist_name} from {from_user}"
        msg["From"] = self.user
        msg["To"] = "publisher@deepdream.builders"
        msg.set_content(template.render(from_user=from_user, dist_name=dist_name), subtype="html")

        self._server.send_message(msg)
