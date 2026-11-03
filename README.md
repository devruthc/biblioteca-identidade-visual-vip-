# Painel VIP

Modelo visual do Dashboard Formalização, pronto para usar em outros projetos: menu lateral preto, cards de número, filtros, quadros com tabela, painel que abre pela esquerda, tema escuro e efeitos de entrada.

Ele fica por cima da biblioteca da empresa, o **django-shadcn** ([biblioteca-identidade-visual](https://github.com/leandro-vip/biblioteca-identidade-visual)), que fornece os componentes `{% button %}`, `{% label %}`, os toasts e o `shadcn.js`.

## Ver como fica

Abra `exemplo/index.html` no navegador. A página mostra todas as peças numa tela só, sem precisar rodar nada.

Se mudar o `exemplo.html` ou o CSS, gere a página de novo com um Python que tenha Django e django-shadcn instalados:

```
python exemplo/gerar.py
```

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `painel_vip/static/painel_vip/css/painel.css` | O visual: menu lateral, cards, quadros, tabelas, painel pela esquerda, efeitos |
| `painel_vip/static/painel_vip/css/shadcn.css` | O `shadcn.css` da biblioteca do Leandro com as cores do painel (fundo creme, bordas, tema escuro) |
| `painel_vip/static/painel_vip/js/painel.js` | Menu (indicador amarelo, recolher, celular), iniciais do nome, entrada das telas e números contando |
| `painel_vip/static/painel_vip/img/` | Logo e favicon da VIP |
| `painel_vip/templates/painel_vip/base.html` | Página base com o menu lateral. O menu e o nome do sistema são blocos |
| `painel_vip/templates/painel_vip/exemplo.html` | Tela de exemplo com todas as peças, para copiar |
| `exemplo/index.html` | A mesma tela em HTML puro, para abrir no navegador |

## Usar num projeto Django

**1. Instalar.** Ponha as duas bibliotecas no `requirements.txt` do projeto:

```
django-shadcn @ git+https://github.com/leandro-vip/biblioteca-identidade-visual.git
painel-vip @ git+https://github.com/devruthc/biblioteca-identidade-visual-vip-.git
```

Para travar uma versão, acrescente `@<commit>` no fim do link (igual ao django-shadcn no Dashboard Formalização). Se o repositório for privado, quem instala precisa ter acesso a ele no GitHub.

Para testar mudanças na biblioteca sem subir para o GitHub, instale direto da pasta:

```
pip install -e C:/Users/VIP-2065/Documents/painel-vip
```

**2. Ligar no `settings.py`.**

```python
INSTALLED_APPS = [
    # ...
    "django.contrib.staticfiles",
    "django_shadcn",
    "painel_vip",
]
```

**3. Criar o `templates/base.html` do projeto**, com o nome do sistema e os links do menu:

```django
{% extends "painel_vip/base.html" %}

{% block marca_nome %}Meu<br>Sistema{% endblock %}

{% block menu %}
  {% with url_name=request.resolver_match.url_name %}
  <div class="grupo-menu">Painéis</div>
  <a href="{% url 'inicio' %}" data-nome="Início" {% if url_name == 'inicio' %}aria-current="page"{% endif %}>
    <i data-lucide="home"></i><span class="rot">Início</span>
  </a>
  <a href="{% url 'relatorio' %}" data-nome="Relatório" {% if url_name == 'relatorio' %}aria-current="page"{% endif %}>
    <i data-lucide="file-spreadsheet"></i><span class="rot">Relatório</span>
  </a>

  <div class="grupo-menu">Gestão</div>
  <a href="{% url 'equipe' %}" data-nome="Equipe" {% if url_name == 'equipe' %}aria-current="page"{% endif %}>
    <i data-lucide="users"></i><span class="rot">Equipe</span>
  </a>
  {% endwith %}
{% endblock %}
```

- O `data-nome` é o texto que aparece ao passar o mouse com o menu recolhido.
- Os ícones são do [Lucide](https://lucide.dev/icons/): basta trocar o nome em `data-lucide`.
- Se o projeto tiver rotas chamadas `inicio` e `logout`, o logo leva para o Início e aparece o botão **Sair**. Sem elas, nada quebra.
- O menu só aparece para quem está logado.

**4. Montar as telas** estendendo o `base.html` do projeto. Copie os blocos que precisar do `exemplo.html`:

```django
{% extends "base.html" %}
{% load shadcn %}

{% block title %}Relatório · Meu Sistema{% endblock %}

{% block body %}
<section class="p-pagina">
  <div class="p-topo" data-anim>
    <div>
      <div class="p-migalha"><a href="{% url 'inicio' %}">Início</a><span>/</span><span>Relatório</span></div>
      <h1>Relatório</h1>
      <p class="p-sub">Uma frase explicando a tela.</p>
    </div>
  </div>
  ...
</section>
{% endblock %}
```

**Trocar o logo:** ponha a sua imagem em `static/painel_vip/img/logo-vip.png` dentro do projeto (numa pasta de `STATICFILES_DIRS`). O arquivo do projeto passa na frente do arquivo da biblioteca. O favicon também pode ser trocado pelo bloco `{% block favicon %}`.

## Usar sem Django

Copie a pasta `painel_vip/static/painel_vip/` e use `exemplo/index.html` como ponto de partida. As classes são as mesmas. Só os toasts e os menus suspensos do django-shadcn ficam de fora.

## Peças

| Peça | Classe | Detalhe |
|---|---|---|
| Página | `section.p-pagina` | Largura máxima de 1536px, centralizada. `.p-pagina.estreita` serve para formulários (760px) |
| Topo | `.p-topo`, `.p-migalha`, `h1`, `.p-sub` | Um botão dentro do `.p-topo` vai para a direita |
| Abas entre telas | `nav.abas > a[aria-current="page"]` | Contador opcional com `.cont` |
| Cards de número | `.kpis2`, `.kpis3`, `.kpis4`, `.kpis6` com `.kpc` | `.kpc-r` rótulo, `.kpc-v` número, `.kpc-p` apoio, `.kpc-ico` ícone, `.kpc-ir` seta |
| Card clicável | `a.kpc` | Levanta ao passar o mouse. Com `aria-current="true"` fica marcado |
| Cores do card | `.kpc.dest` verde, `.kpc.alerta` amarelo, `.kpc.pendente` número cinza | |
| Barra | `.barra > i[style="--w:64%"]` | `.mini-barra` é a versão pequena para tabela |
| Filtros | `form.p-filtros` | Grade: defina as colunas com `lg:grid-cols-[...]` do Tailwind |
| Recortes | `nav.seg > a[aria-current="true"]` | Botões redondos que trocam a lista |
| Quadro | `.quadro`, `.quadro-tit`, `.quadro-corpo` | `.tit-com-ico` + `.tit-ico` para título com ícone, `.tit-lado` para texto à direita |
| Tabela | `.p-tabela > table` | `td.b` negrito, `td.mut` cinza, `td.mono` números de ID, `td.msg` lista vazia, `tfoot` total |
| Pessoa | `.pessoa` + `.ini.js-iniciais[data-nome]` | Iniciais calculadas pelo JS. Use `button.pessoa` quando o nome abre algo, ou `span.pessoa.fixa` quando não abre |
| Status | `.st` + `pag`, `can`, `abe`, `ativo`, `inativo`, `resp`, `fec` | Bolinha colorida com o texto |
| Etiquetas | `.chip`, `.tempo.esp`, `.tempo.esp.forte`, `.tempo.ok` | |
| Ações da linha | `.acoes > button.acao` | `.acao.perigo` em vermelho |
| Barra empilhada | `.pilha > i.pg/.ab/.cc` + `.legenda` | Pagos, abertos e cancelados |
| Cards de módulo | `.resumo-grid > a.rc` | Como no Início do dashboard |
| Painel pela esquerda | `dialog.gaveta-dlg` | Abre com `data-gaveta-abrir="id"` e fecha com `data-gaveta-fechar`, pelo fundo ou pelo Esc |
| Entrada animada | `data-anim` | Os blocos sobem um a um. Os números com `.js-contar` contam até o valor |

O `painel.css` também traz algumas peças feitas para telas específicas do dashboard (Chats, Banco, Ligações, Resumo contratos). Elas podem ficar no arquivo sem atrapalhar.

## Atualizar a partir do dashboard

Quando o visual do Dashboard Formalização mudar, copie de novo `painel.css`, `painel.js` e `shadcn.css` (pasta `dashboard_atendimentos/static/`), rode `python exemplo/gerar.py`, aumente a `version` no `pyproject.toml` e faça um commit.

## Repositório

https://github.com/devruthc/biblioteca-identidade-visual-vip-

Depois de mudar algo aqui, faça o commit e rode `git push` para subir.
