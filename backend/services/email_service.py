import resend

from core.config import (
    RESEND_API_KEY,
    RESEND_FROM_EMAIL,
    FRONTEND_URL,
)


def send_password_reset_email(
    recipient_email: str,
    reset_url: str,
):
    resend.api_key = RESEND_API_KEY

    resend.Emails.send(
        {
            "from": RESEND_FROM_EMAIL,
            "to": [recipient_email],
            "subject": "Reset your password",
            "html": f"""
                <h2>Password Reset</h2>
                <p>You requested a password reset for your AI Research Assistant account.</p>
                <p>
                    <a href="{reset_url}">
                        Reset your password
                    </a>
                </p>
                <p>This link will expire soon.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
            """,
        }
    )