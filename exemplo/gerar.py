"""Gera exemplo/index.html a partir de painel_vip/templates/painel_vip/exemplo.html.

Uso (com um Python que tenha Django e django-shadcn instalados):
    python exemplo/gerar.py

Depois é só abrir exemplo/index.html no navegador.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ))

import django  # noqa: E402
from django.conf import settings  # noqa: E402

urlpatterns = []

settings.configure(
    DEBUG=True,
    ROOT_URLCONF=__name__,
    # URL absoluta provisória: o Django não mexe nela, e depois vira caminho relativo.
    STATIC_URL="http://estatico.local/",
    INSTALLED_APPS=["django.contrib.staticfiles", "django_shadcn", "painel_vip"],
    TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True}],
)
django.setup()

from django.template.loader import render_to_string  # noqa: E402


class UsuarioExemplo:
    is_authenticated = True
    username = "exemplo"

    def get_full_name(self):
        return "Usuária Exemplo"

    def get_short_name(self):
        return "Usuária"


html = render_to_string("painel_vip/exemplo.html", {"user": UsuarioExemplo()})
# O shadcn.js é do django-shadcn (só serve para toasts e menus suspensos); fora do Django ele não existe.
html = re.sub(r'\s*<script src="[^"]*django_shadcn/js/shadcn\.js"></script>', "", html)
html = html.replace("http://estatico.local/", "../painel_vip/static/")
destino = RAIZ / "exemplo" / "index.html"
destino.write_text(html, encoding="utf-8")
print(f"Gerado: {destino}")
