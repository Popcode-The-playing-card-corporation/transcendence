# validators.py
import re
from django.core.exceptions import ValidationError

class CustomPasswordValidator:
    def validate(self, password, user=None):

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                "Le mot de passe doit contenir une majuscule."
            )

        if not re.search(r'[a-z]', password):
            raise ValidationError(
                "Le mot de passe doit contenir une minuscule."
            )

        if not re.search(r'[\W_]', password):
            raise ValidationError(
                "Le mot de passe doit contenir un caractère spécial."
            )

    def get_help_text(self):
        return (
            "Votre mot de passe doit contenir "
            "une majuscule, une minuscule et un caractère spécial."
        )