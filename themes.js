/* =========================================================
   TEMAS POR PANTALLA (después del PIN)
   Cargar DESPUÉS de script.js
========================================================= */

(() => {

  const $ = (selector, root = document) => root.querySelector(selector);
  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- TEXTOS EDITABLES ---------- */

  // Frases de Jorge (el de los binoculares). Cada toque dice la siguiente.
  const JORGE_GIFT = [
    "¿Qué habrá dentro? 🤔",
    "¡Ooh ooh, ah ah! 🍌",
    "¡Eres yo je!",
    "¡Ábrelo, ábrelo!",
    "Yo ya vi... ¡pero no te digo! 🤫"
  ];

  // Lo que dicen los demás Jorges cuando los tocas
  const JORGE_SOUNDS = ["¡Ooh ooh!", "¡Ah ah!", "¡Jiji!", "¡Qué divertido!", "¡Cumpleaños!", "¡Wiii!"];

  const WALL_MESSAGE = "YOU ARE MY FAVORITE PERSON";

  // Iniciales de One Direction (pases backstage). Cambia lo que quieras.
  const BAND = [
    { letter: "H", name: "Harry" },
    { letter: "N", name: "Niall" },
    { letter: "L", name: "Louis" },
    { letter: "L", name: "Liam" },
    { letter: "Z", name: "Zayn" }
  ];


  /* ---------- GENERADORES DE ESCENAS ---------- */

  function sceneJorge(kind, bubbleText) {
    const img = name => `assets/img/cg-${name}.png`;

    const leaves = Array.from({ length: 12 }, (_, i) =>
      `<i class="leaf" style="left:${(i * 8.6 + rand(0, 4)).toFixed(1)}%;--r:${rand(-24, 24).toFixed(0)}deg;animation-delay:${-rand(0, 5).toFixed(1)}s;height:${rand(48, 80).toFixed(0)}px"></i>`
    ).join("");

    const fronds = Array.from({ length: 9 }, (_, i) => {
      const left = i < 5 ? i * 4.5 : 66 + (i - 5) * 8;
      return `<i class="frond" style="left:${left}%;--r:${rand(-32, 32).toFixed(0)}deg;--h:${rand(90, 170).toFixed(0)}px;animation-delay:${-rand(0, 6).toFixed(1)}s"></i>`;
    }).join("");

    const fireflies = Array.from({ length: 14 }, () =>
      `<i class="firefly" style="left:${rand(4, 96).toFixed(0)}%;top:${rand(12, 88).toFixed(0)}%;--fx:${rand(-40, 40).toFixed(0)}px;--fy:${rand(-40, 40).toFixed(0)}px;animation-delay:${-rand(0, 8).toFixed(1)}s;animation-duration:${rand(6, 11).toFixed(1)}s"></i>`
    ).join("");

    const butterflies = [1, 2, 3]
      .map(n => `<span class="butterfly bf${n}"><i></i><i></i></span>`)
      .join("");

    const bananas = [1, 2, 3, 4, 5, 6, 7]
      .map(n => `<span class="banana b${n}" role="button" aria-label="Banana">🍌</span>`)
      .join("");

    // Cada pantalla tiene su propio elenco de Jorges
    const cast = kind === "gift"
      ? `<div class="cg-btn cg-wave" role="button" tabindex="0" aria-label="Jorge saludando"><img src="${img("wave")}" alt=""></div>
         <div class="cg-btn cg-hat" role="button" tabindex="0" aria-label="Jorge bajo el sombrero"><img src="${img("hat")}" alt=""></div>
         <div class="cg-btn cg-balloons" role="button" tabindex="0" aria-label="Jorge con globos"><img src="${img("balloons")}" alt=""></div>`
      : `<div class="cg-btn cg-cake" role="button" tabindex="0" aria-label="Jorge con su pastel"><img src="${img("cake")}" alt=""></div>
         <div class="cg-btn cg-hat left" role="button" tabindex="0" aria-label="Jorge bajo el sombrero"><img src="${img("hat")}" alt=""></div>
         <div class="cg-btn cg-balloons right" role="button" tabindex="0" aria-label="Jorge con globos"><img src="${img("balloons")}" alt=""></div>`;

    return `
      <div class="scene scene-jorge">
        <i class="rays"></i>
        <i class="vine v1"></i><i class="vine v2"></i>
        <i class="vine v3"></i><i class="vine v4"></i>
        ${leaves}
        ${fireflies}
        ${butterflies}
        ${fronds}
        ${bananas}
        <span class="banana-count">🍌 <em>0</em> / 10</span>
        ${cast}
        <div class="peek" role="button" tabindex="0" aria-label="Jorge el Curioso">
          <span class="bubble">${bubbleText}</span>
          <div class="peek-clip"><img class="peek-img" src="${img("binoc")}" alt=""></div>
        </div>
      </div>`;
  }

  function sceneMafia(low) {
    const img = name => `assets/img/lm-${name}.png`;
    const jpg = name => `assets/img/lm-${name}.jpg`;

    // --- Cierre (noche): tablero de stickers + estrellitas ---
    if (low) {
      const twinkles = Array.from({ length: 16 }, () =>
        `<i class="lm-twinkle" style="left:${rand(2, 96).toFixed(0)}%;top:${rand(3, 94).toFixed(0)}%;animation-delay:${-rand(0, 2.6).toFixed(1)}s;animation-duration:${rand(2, 3.6).toFixed(1)}s"></i>`
      ).join("");

      return `
        <div class="scene scene-mafia lm-low">
          ${twinkles}
          <i class="lm-tape tape-a"></i><i class="lm-tape tape-b"></i>
          <img class="lm-banner" src="${jpg("banner")}" alt="Latin Mafia">
          <img class="lm-badge lm-b1" src="${jpg("b-pink")}" alt="">
          <img class="lm-badge lm-b2" src="${jpg("b-grey")}" alt="">
          <img class="lm-sticker lm-star" src="${img("star")}" alt="">
          <img class="lm-sticker lm-monster" src="${img("monster")}" alt="">
          <img class="lm-sticker lm-daisy" src="${img("daisy")}" alt="">
          <img class="lm-sticker lm-clover" src="${img("clover")}" alt="">
        </div>`;
    }

    // --- Día especial: pradera con nubes, polen y pasto ---
    const clouds = [
      { y: 6,  w: 150, d: 80, dl: -10 },
      { y: 16, w: 100, d: 62, dl: -38 },
      { y: 26, w: 130, d: 95, dl: -60 },
      { y: 11, w: 80,  d: 70, dl: -55 }
    ].map(c => `<i class="lm-cloud" style="--y:${c.y}%;--w:${c.w}px;--d:${c.d}s;--dl:${c.dl}s"></i>`).join("");

    const pollen = Array.from({ length: 16 }, () =>
      `<i class="lm-pollen" style="left:${rand(2, 98).toFixed(0)}%;--d:${rand(9, 17).toFixed(1)}s;--dx:${rand(-40, 40).toFixed(0)}px;animation-delay:${-rand(0, 16).toFixed(1)}s"></i>`
    ).join("");

    const tufts = Array.from({ length: 26 }, (_, i) =>
      `<i class="lm-tuft" style="left:${(i * 4 + rand(-1, 1)).toFixed(1)}%;--h:${rand(22, 46).toFixed(0)}px;animation-delay:${-rand(0, 3.6).toFixed(1)}s"></i>`
    ).join("");

    return `
      <div class="scene scene-mafia lm-day">
        ${clouds}
        ${pollen}
        ${tufts}
        <i class="lm-tape tape-a"></i><i class="lm-tape tape-b"></i>
        <img class="lm-banner" src="${jpg("banner")}" alt="Latin Mafia">
        <img class="lm-badge lm-b1" src="${jpg("b-face")}" alt="">
        <img class="lm-badge lm-b2" src="${jpg("b-scream")}" alt="">
        <img class="lm-sticker lm-star" src="${img("star")}" alt="">
        <img class="lm-sticker lm-monster" src="${img("monster")}" alt="">
        <img class="lm-sticker lm-daisy" src="${img("daisy")}" alt="">
        <img class="lm-sticker lm-clover" src="${img("clover")}" alt="">
      </div>`;
  }

  function scene1D(final) {
    const passes = BAND.map((b, i) => `
      <div class="pass p${i + 1}" role="button" tabindex="0" aria-label="${b.name}">
        <i class="string"></i>
        <span class="card"><em>${b.letter}</em><small>1D</small></span>
        <span class="who">${b.name}</span>
      </div>`).join("");

    const planes = [0, 1, 2]
      .map(n => `<span class="plane" style="top:${rand(16, 52).toFixed(0)}%;animation-delay:${-n * 6}s"></span>`)
      .join("");

    const COLORS = ["#ffc9e6", "#bfe3ff", "#fff0a8", "#d8c4ff", "#ffd2b0"];

    const confetti = Array.from({ length: 22 }, (_, i) =>
      `<i class="conf" style="left:${rand(0, 100).toFixed(0)}%;--c:${COLORS[i % COLORS.length]};--d:${rand(9, 16).toFixed(1)}s;--dx:${rand(-60, 60).toFixed(0)}px;animation-delay:${-rand(0, 14).toFixed(1)}s"></i>`
    ).join("");

    const sticks = Array.from({ length: 18 }, (_, i) =>
      `<i class="stick" style="left:${(3 + i * 5.4 + rand(-1.5, 1.5)).toFixed(1)}%;--c:${COLORS[i % COLORS.length]};--d:${rand(1.6, 3).toFixed(1)}s;animation-delay:${-rand(0, 2.4).toFixed(1)}s;height:${rand(26, 42).toFixed(0)}px"></i>`
    ).join("");

    const cams = Array.from({ length: 7 }, () =>
      `<i class="cam" style="left:${rand(4, 94).toFixed(0)}%;--b:${rand(26, 80).toFixed(0)}px;--d:${rand(3.5, 8).toFixed(1)}s;animation-delay:${-rand(0, 8).toFixed(1)}s"></i>`
    ).join("");

    return `
      <div class="scene scene-1d">
        <i class="spot sp1"></i><i class="spot sp2"></i><i class="spot sp3"></i><i class="spot sp4"></i>
        <span class="wm">1D</span>
        ${confetti}
        ${planes}
        <i class="vinyl"></i>
        ${final ? '<div class="ticket">ADMIT ONE<em>Always &amp; Forever</em></div>' : ""}
        <div class="crowd">
          <i class="heads back"></i>
          ${sticks}
          <i class="heads"></i>
        </div>
        ${cams}
        ${passes}
      </div>`;
  }

  function sceneStranger() {
    const spores = Array.from({ length: 22 }, () =>
      `<i class="spore" style="left:${rand(0, 100)}%;--d:${rand(10, 20)}s;--dx:${rand(-40, 40)}px;animation-delay:${-rand(0, 18)}s"></i>`
    ).join("");

    return `
      <div class="scene scene-st">
        <i class="mist"></i>
        <i class="flash"></i>
        ${spores}
      </div>`;
  }


  function sceneMinecraft() {
    const stars = Array.from({ length: 46 }, () =>
      `<i class="mc-star" style="left:${rand(1, 99).toFixed(1)}%;top:${rand(2, 58).toFixed(1)}%;--s:${pick([2, 3, 3, 4])}px;--d:${rand(2, 5).toFixed(1)}s;animation-delay:${-rand(0, 5).toFixed(1)}s"></i>`
    ).join("");

    const clouds = [
      { y: 8,  w: 130, d: 110, dl: -20 },
      { y: 20, w: 96,  d: 85,  dl: -60 },
      { y: 31, w: 150, d: 130, dl: -95 }
    ].map(c => `<i class="mc-cloud" style="--y:${c.y}%;--w:${c.w}px;--d:${c.d}s;animation-delay:${c.dl}s"></i>`).join("");

    const loves = Array.from({ length: 7 }, () =>
      `<i class="mc-love" style="left:${rand(6, 94).toFixed(0)}%;--d:${rand(9, 15).toFixed(1)}s;--dx:${rand(-30, 30).toFixed(0)}px;animation-delay:${-rand(0, 14).toFixed(1)}s"></i>`
    ).join("");

    const orbs = Array.from({ length: 7 }, () =>
      `<i class="mc-orb" style="left:${rand(8, 92).toFixed(0)}%;--d:${rand(7, 12).toFixed(1)}s;--dx:${rand(-40, 40).toFixed(0)}px;animation-delay:${-rand(0, 10).toFixed(1)}s"></i>`
    ).join("");

    const hearts = Array.from({ length: 10 }, (_, i) => `<i style="--i:${i}"></i>`).join("");

    // Bosque de cerezos (cherry grove) en 3 capas de profundidad, detrás del pasto
    const tree = (left, w, layer, br, op) =>
      `<i class="mc-cherry ${pick(["", "b"])} ${Math.random() < .5 ? "flip" : ""}" style="left:${left.toFixed(1)}%;--w:${w}px;--br:${br};opacity:${op};bottom:${layer}px"></i>`;
    const forest = [];
    // Fondo: muchos árboles chicos y oscuros a todo lo ancho
    for (let x = -4; x < 104; x += 8.5) forest.push(tree(x + rand(-2, 2), Math.round(rand(88, 125)), 94, .5, .7));
    // Medio: más grandes, solo hacia los lados (el centro queda libre para el texto)
    [-3, 6, 15, 26, 62, 73, 84, 94].forEach(x =>
      forest.push(tree(x + rand(-1.5, 1.5), Math.round(rand(150, 195)), 92, .66, .9)));
    // Frente: los grandes, en las orillas
    [-8, 3, 14, 80, 91].forEach(x =>
      forest.push(tree(x + rand(-1, 1), Math.round(rand(230, 285)), 88, .82, 1)));
    const cherries = forest.join("");

    const petals = Array.from({ length: 22 }, () =>
      `<i class="mc-petal" style="left:${rand(0, 98).toFixed(0)}%;--s:${pick([5, 6, 7, 8])}px;--d:${rand(9, 16).toFixed(1)}s;--dx:${rand(-80, 80).toFixed(0)}px;animation-delay:${-rand(0, 16).toFixed(1)}s"></i>`
    ).join("");

    return `
      <div class="scene scene-mc">
        ${stars}
        <i class="mc-moon"></i>
        ${clouds}
        ${cherries}
        ${orbs}
        ${loves}
        ${petals}
        <div class="mc-ground"><i class="mc-grass"></i><i class="mc-dirt"></i></div>
        <i class="mc-torch"></i>
        <div class="mc-creeper" role="button" tabindex="0" aria-label="Creeper"><i></i></div>
        <div class="mc-hud" aria-hidden="true">
          <div class="mc-hearts">${hearts}</div>
          <div class="mc-xp"><i></i></div>
        </div>
      </div>`;
  }


  /* ---------- APLICAR TEMA A CADA PANTALLA ---------- */

  function theme(id, name, html) {
    const screen = document.getElementById(id);
    if (!screen) return null;

    screen.dataset.theme = name;
    screen.insertAdjacentHTML("afterbegin", html);
    return screen;
  }

  theme("gift-screen",    "jorge", sceneJorge("gift",  JORGE_GIFT[0]));
  theme("special-screen", "mafia", sceneMafia(false));
  theme("letter-screen",  "1d",    scene1D(false));
  theme("gallery-screen", "st",    sceneStranger());
  theme("love-screen",    "mafia", sceneMafia(true));
  theme("forever-screen", "mc",    sceneMinecraft());


  /* ---------- JORGE: todo se puede tocar ---------- */

  function wireJorge(screenId, lines) {
    const screen = document.getElementById(screenId);
    const scene = screen && $(".scene-jorge", screen);
    if (!scene) return;

    const peek = $(".peek", scene);
    const bubble = $(".bubble", scene);
    const counter = $(".banana-count em", scene);

    let step = 0;
    let bananas = 0;
    let talkTimer;

    // Jorge de los binoculares habla
    const say = text => {
      bubble.textContent = text;
      peek.classList.remove("talk");
      void peek.offsetWidth;
      peek.classList.add("talk");
      clearTimeout(talkTimer);
      talkTimer = setTimeout(() => peek.classList.remove("talk"), 3400);
    };

    // Texto que sube y se desvanece
    const popText = (x, y, text) => {
      const el = document.createElement("span");
      el.className = "pop-text";
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      scene.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    };

    const pointOf = (event, el) => {
      const s = scene.getBoundingClientRect();
      if (event && event.clientX) return [event.clientX - s.left, event.clientY - s.top];
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2 - s.left, r.top - s.top];
    };

    const activate = (el, handler) => {
      el.addEventListener("click", handler);
      el.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handler(null);
        }
      });
    };

    // Binoculares
    activate(peek, () => {
      step = (step + 1) % lines.length;
      say(lines[step]);
    });

    // Los demás Jorges: saltan y dicen algo
    scene.querySelectorAll(".cg-btn").forEach(el => {
      activate(el, event => {
        el.classList.remove("hop");
        void el.offsetWidth;
        el.classList.add("hop");

        const [x, y] = pointOf(event, el);
        popText(x, y, pick(JORGE_SOUNDS));
      });
    });

    // Bananas: tócalas y cuéntalas
    const party = () => {
      for (let i = 0; i < 18; i++) {
        const b = document.createElement("span");
        b.className = "burst";
        b.textContent = "🍌";
        b.style.left = `${rand(2, 96)}%`;
        b.style.setProperty("--dx", `${rand(-50, 50)}px`);
        b.style.setProperty("--t", `${rand(1.6, 2.8)}s`);
        scene.appendChild(b);
        setTimeout(() => b.remove(), 3000);
      }
      say("¡10 bananas! ¡Eres la mejor! 🎉");
    };

    scene.querySelectorAll(".banana").forEach(banana => {
      banana.addEventListener("click", event => {
        if (banana.classList.contains("gone")) return;

        banana.classList.add("gone");
        setTimeout(() => banana.classList.remove("gone"), 3500);

        bananas++;
        const [x, y] = pointOf(event, banana);
        popText(x, y, "+1 🍌");

        if (bananas >= 10) {
          bananas = 0;
          party();
        }

        counter.textContent = bananas;
      });
    });
  }

  wireJorge("gift-screen", JORGE_GIFT);


  /* ---------- ONE DIRECTION: toca un pase y aparece el nombre ---------- */

  document.querySelectorAll(".scene-1d .pass").forEach(pass => {
    let timer;

    const show = () => {
      pass.classList.add("open");
      clearTimeout(timer);
      timer = setTimeout(() => pass.classList.remove("open"), 2200);
    };

    pass.addEventListener("click", show);
    pass.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        show();
      }
    });
  });


  /* ---------- STRANGER THINGS: PARED DE LOS BYERS ---------- */

  const oldWall = $("#gallery-screen .stranger-lights");

  if (oldWall) {
    const COLORS = ["#ff5364", "#ffd46e", "#65caff", "#8be99e", "#ff9bd9"];
    const ROWS = ["ABCDEFGHI", "JKLMNOPQR", "STUVWXYZ"];

    let colorIndex = 0;

    const rowsHTML = ROWS.map(row => {
      const cells = [...row].map((letter, i) => {
        const t = row.length > 1 ? i / (row.length - 1) : 0.5;
        const sag = (1 - Math.sin(Math.PI * t)) * 11;
        const color = COLORS[colorIndex++ % COLORS.length];

        return `<div class="cell" data-letter="${letter}" style="--c:${color};--sag:${sag.toFixed(1)}px">
                  <i class="bulb"></i><span>${letter}</span>
                </div>`;
      }).join("");

      return `<div class="wall-row">${cells}</div>`;
    }).join("");

    const wall = document.createElement("div");
    wall.className = "byers-wall";
    wall.setAttribute("role", "img");
    wall.setAttribute("aria-label", "You are my favorite person");
    wall.innerHTML = `${rowsHTML}<div class="wall-text" aria-hidden="true"></div>`;

    oldWall.before(wall);

    const hint = document.createElement("p");
    hint.className = "wall-hint";
    hint.textContent = "TOCA LAS LUCES";
    wall.after(hint);

    const text = $(".wall-text", wall);
    const cells = {};
    wall.querySelectorAll(".cell").forEach(cell => { cells[cell.dataset.letter] = cell; });
    const allCells = Object.values(cells);

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const setAll = on => allCells.forEach(c => c.classList.toggle("on", on));

    let run = 0;

    async function spell() {
      const id = ++run;

      while (id === run) {
        text.textContent = "";
        await sleep(900);

        for (const ch of WALL_MESSAGE) {
          if (id !== run) return;

          if (ch === " ") {
            text.textContent += " ";
            await sleep(450);
            continue;
          }

          const cell = cells[ch];
          cell.classList.add("on");
          text.textContent += ch;
          await sleep(620);
          cell.classList.remove("on");
          await sleep(140);
        }

        for (let k = 0; k < 4; k++) {
          if (id !== run) return;
          setAll(true);
          await sleep(160);
          setAll(false);
          await sleep(160);
        }

        setAll(true);
        await sleep(2600);
        setAll(false);
        await sleep(800);
      }
    }

    function stop() {
      run++;
      setAll(false);
    }

    // Tocar una letra la enciende; tocar la pared la manda al Upside Down
    wall.addEventListener("click", event => {
      const cell = event.target.closest(".cell");

      if (cell) {
        cell.classList.add("on");
        setTimeout(() => cell.classList.remove("on"), 900);
        return;
      }

      wall.classList.add("upside");
      setTimeout(() => wall.classList.remove("upside"), 3200);
    });

    // Empezar a deletrear solo cuando la pantalla está visible
    const gallery = document.getElementById("gallery-screen");
    let running = false;

    function sync() {
      const active = gallery.classList.contains("active");

      if (active && !running) {
        running = true;

        if (reduceMotion) {
          setAll(true);
          text.textContent = WALL_MESSAGE;
        } else {
          spell();
        }
      } else if (!active && running) {
        running = false;
        stop();
      }
    }

    new MutationObserver(sync).observe(gallery, {
      attributes: true,
      attributeFilter: ["class"]
    });

    sync();
  }

  /* ---------- MINECRAFT: creeper con corazones + logro desbloqueado ---------- */

  (() => {
    const screen = document.getElementById("forever-screen");
    const scene = screen && $(".scene-mc", screen);
    if (!scene) return;

    const creeper = $(".mc-creeper", scene);
    let busy = false;

    const popText = (x, y, text) => {
      const el = document.createElement("span");
      el.className = "pop-text";
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      scene.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    };

    const explode = () => {
      const s = scene.getBoundingClientRect();
      const r = creeper.getBoundingClientRect();
      const cx = r.left + r.width / 2 - s.left;
      const cy = r.top + r.height * 0.4 - s.top;

      for (let i = 0; i < 16; i++) {
        const h = document.createElement("i");
        h.className = "mc-burst";
        h.style.left = `${cx - 11}px`;
        h.style.top = `${cy - 10}px`;
        h.style.setProperty("--dx", `${rand(-130, 130).toFixed(0)}px`);
        h.style.setProperty("--dy", `${rand(-190, -40).toFixed(0)}px`);
        scene.appendChild(h);
        setTimeout(() => h.remove(), 1400);
      }
      popText(Math.max(80, cx - 20), cy - 30, "¡Te amooo!");
    };

    const fuse = () => {
      if (busy) return;
      busy = true;

      const s = scene.getBoundingClientRect();
      const r = creeper.getBoundingClientRect();
      popText(Math.max(60, r.left + r.width / 2 - s.left - 24), r.top - s.top - 6, "Ssssss...");

      creeper.classList.add("fuse");

      setTimeout(() => {
        creeper.classList.remove("fuse");
        explode();
        busy = false;
      }, reduceMotion ? 200 : 1100);
    };

    creeper.addEventListener("click", fuse);
    creeper.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fuse();
      }
    });

    // Logro estilo Minecraft cada vez que se abre la pantalla final
    const toast = document.createElement("div");
    toast.className = "mc-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = "<i></i><div><b>¡Logro desbloqueado!</b><small>Cumpleaños feliz</small></div>";
    screen.appendChild(toast);

    let wasActive = screen.classList.contains("active");
    let toastTimer;

    new MutationObserver(() => {
      const active = screen.classList.contains("active");

      if (active && !wasActive) {
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.add("show");
          toastTimer = setTimeout(() => toast.classList.remove("show"), 5200);
        }, 900);
      } else if (!active) {
        clearTimeout(toastTimer);
        toast.classList.remove("show");
      }

      wasActive = active;
    }).observe(screen, { attributes: true, attributeFilter: ["class"] });
  })();


})();