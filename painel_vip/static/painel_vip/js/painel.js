/* Menu lateral (indicador, recolher, celular) e efeitos de entrada das telas. */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function guardar(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (erro) { /* sem armazenamento */ }
  }

  // ===== menu lateral =====
  var menu = document.getElementById("menu-lateral");
  var indicador = document.getElementById("menu-indicador");

  function ativo() {
    return menu ? menu.querySelector('a[aria-current="page"]') : null;
  }

  function moverPara(link) {
    if (!indicador) return;
    if (!link) {
      indicador.classList.remove("visivel");
      return;
    }
    var altura = indicador.offsetHeight || 22;
    indicador.style.transform = "translateY(" + (link.offsetTop + (link.offsetHeight - altura) / 2) + "px)";
    indicador.classList.add("visivel");
  }

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("mouseenter", function () { moverPara(link); });
      link.addEventListener("focus", function () { moverPara(link); });
    });
    menu.addEventListener("mouseleave", function () { moverPara(ativo()); });
    moverPara(ativo());
    window.addEventListener("load", function () { moverPara(ativo()); });
    window.addEventListener("resize", function () { moverPara(ativo()); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moverPara(ativo()); });
    }
  }

  var recolher = document.getElementById("menu-recolher");
  if (recolher) {
    var rotular = function () {
      var recolhido = raiz.classList.contains("menu-recolhido");
      recolher.setAttribute("data-nome", recolhido ? "Abrir menu" : "Recolher menu");
      recolher.setAttribute("aria-label", recolhido ? "Abrir menu" : "Recolher menu");
      recolher.setAttribute("aria-expanded", recolhido ? "false" : "true");
    };
    rotular();
    recolher.addEventListener("click", function () {
      raiz.classList.toggle("menu-recolhido");
      guardar("menu", raiz.classList.contains("menu-recolhido") ? "recolhido" : "aberto");
      rotular();
      window.setTimeout(function () { moverPara(ativo()); }, 320);
    });
  }

  // celular: abre o menu por cima da tela
  var abrir = document.getElementById("menu-abrir");
  var fundo = document.getElementById("menu-fundo");
  function fecharMenuCelular() {
    raiz.classList.remove("menu-aberto");
    if (abrir) abrir.setAttribute("aria-expanded", "false");
  }
  if (abrir) {
    abrir.addEventListener("click", function () {
      var aberto = raiz.classList.toggle("menu-aberto");
      abrir.setAttribute("aria-expanded", aberto ? "true" : "false");
      window.setTimeout(function () { moverPara(ativo()); }, 300);
    });
  }
  if (fundo) fundo.addEventListener("click", fecharMenuCelular);
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") fecharMenuCelular();
  });

  // iniciais do nome (círculo ao lado do formalizador)
  document.querySelectorAll(".js-iniciais[data-nome]").forEach(function (el) {
    var partes = (el.getAttribute("data-nome") || "").trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return;
    el.textContent = (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
  });

  // ===== entrada das telas =====
  var principal = document.querySelector(".page-main");
  if (principal && !reduzir) {
    var blocos = principal.querySelectorAll("[data-anim]");
    if (!blocos.length) {
      blocos = principal.querySelectorAll(":scope > section > *, :scope > section > .space-y-6 > *");
      blocos.forEach(function (bloco) { bloco.setAttribute("data-anim", ""); });
    }
    blocos.forEach(function (bloco, indice) {
      if (!bloco.style.getPropertyValue("--i")) bloco.style.setProperty("--i", String(Math.min(indice, 14)));
    });
    raiz.classList.add("p-entrando");
  }

  // números contando até o valor (1.234 · 64,6% · 186)
  function lerNumero(texto) {
    var m = texto.trim().match(/^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?(%?)$/);
    if (!m) return null;
    var casas = m[2] ? m[2].length : 0;
    return {
      valor: parseFloat(m[1].replace(/\./g, "") + (m[2] ? "." + m[2] : "")),
      casas: casas,
      sufixo: m[3] || "",
    };
  }

  if (!reduzir) {
    document.querySelectorAll(".js-contar").forEach(function (el) {
      var numero = lerNumero(el.textContent);
      if (!numero || !numero.valor) return;
      var final = el.textContent;
      var formatar = function (v) {
        return v.toLocaleString("pt-BR", {
          minimumFractionDigits: numero.casas,
          maximumFractionDigits: numero.casas,
        }) + numero.sufixo;
      };
      var inicio = null;
      var duracao = 1000;
      var passo = function (agora) {
        if (inicio === null) inicio = agora;
        var k = Math.min(1, (agora - inicio) / duracao);
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = k < 1 ? formatar(numero.valor * e) : final;
        if (k < 1) window.requestAnimationFrame(passo);
      };
      el.textContent = formatar(0);
      window.requestAnimationFrame(passo);
    });
  }
})();
