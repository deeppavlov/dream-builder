import logging
import smtplib
import ssl
from email.message import EmailMessage

from jinja2 import Environment, FileSystemLoader, select_autoescape, Template

from apiconfig.config import settings

env = Environment(
    loader=FileSystemLoader("services/distributions_api/templates"),
    autoescape=select_autoescape(),
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
        self._server.ehlo()
        self._server.login(self.user, self.password)

    def _create_message_from_template(self, subject: str, to: str, template: Template, **template_kwargs):
        msg = EmailMessage()

        msg["Subject"] = subject
        msg["From"] = self.user
        msg["To"] = to
        msg.set_content(template.render(**template_kwargs), subtype="html")

        return msg

    def _send_message(self, msg, **kwargs):
        try:
            self._server.send_message(msg, **kwargs)
        except smtplib.SMTPServerDisconnected:
            logging.warning("SMTP server disconnected, retrying login...")
            self._server.starttls(context=self.context)
            self._server.ehlo()
            self._server.login(self.user, self.password)
            logging.warning("SMTP login ok")
            self._server.send_message(msg, **kwargs)
        except Exception as e:
            logging.error(f"Failed to send message! {type(e)}: {e}")
            raise e

    def send_publish_request_created_to_moderators(
        self, moderator_address: str, owner_address: str, name: str, display_name: str
    ) -> None:
        """
        Sends email to publisher mailbox notifying moderators about the pending distribution publish request

        Args:
            moderator_address: moderator's address
            owner_address: distribution owner's address
            name: distribution name
            display_name: distribution display name

        Returns:
            None
        """
        msg = self._create_message_from_template(
            f"Publish Request for {display_name} from {owner_address}",
            moderator_address,
            env.get_template("publish_request_created_to_moderators.html"),
            owner_address=owner_address,
            name=name,
            display_name=display_name,
        )
        self._send_message(msg)

    def send_publish_request_created_to_owner(self, owner_address: str, display_name: str) -> None:
        """
        Sends email to distribution owner's mailbox which notifies that their distribution publish request was created

        Args:
            owner_address: distribution owner's address
            display_name: distribution name

        Returns:
            None
        """
        msg = self._create_message_from_template(
            f"Publish Request for {display_name} from you",
            owner_address,
            env.get_template("publish_request_created_to_owner.html"),
            owner_address=owner_address,
            display_name=display_name,
        )
        self._send_message(msg)

    def send_publish_request_confirmed_to_owner(self, owner_address: str, display_name: str) -> None:
        msg = self._create_message_from_template(
            f"Your Publish Request for {display_name} was confirmed",
            owner_address,
            env.get_template("publish_request_confirmed_to_owner.html"),
            owner_address=owner_address,
            display_name=display_name,
        )
        self._send_message(msg)

    def send_publish_request_declined_to_owner(self, owner_address: str, display_name: str) -> None:
        msg = self._create_message_from_template(
            f"Your Publish Request for {display_name} was declined",
            owner_address,
            env.get_template("publish_request_declined_to_owner.html"),
            owner_address=owner_address,
            display_name=display_name,
        )
        self._send_message(msg)


emailer = Emailer(settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password)
