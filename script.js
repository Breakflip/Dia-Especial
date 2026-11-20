
/* =========================================
   TU DIA ESPECIAL
   SISTEMA DE INTERACTIVIDAD
========================================= */

/* CONFIGURACIÓN PRINCIPAL */

const TARGET = new Date(
  "2026-11-20T00:00:00-06:00"
).getTime();

const CORRECT_PIN = "201225";

// Cambiar temporalmente a true para probar
const TEST_MODE = false;


/* =========================================
   NAVEGACIÓN ENTRE PANTALLAS
========================================= */

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.remove("active");

    if (screen.id === id) {
      screen.classList.add("active");
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (id === "letter-screen") {
    animateLetter();
  }
}


/* =========================================
   01. CUENTA REGRESIVA
========================================= */

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const openPinButton = document.getElementById("open-pin");
const countdownCaption = document.getElementById("countdown-caption");
const lockNote = document.getElementById("lock-note");

function updateCountdown() {
  const now = Date.now();
  const remaining = TARGET - now;

  if (remaining <= 0 || TEST_MODE) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    openPinButton.hidden = false;

    countdownCaption.textContent =
      "Tu momento ha llegado. Esta sorpresa es para ti ✦";

    lockNote.hidden = true;

    clearInterval(countdownTimer);
    return;
  }

  const days = Math.floor(
    remaining / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (remaining % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (remaining % (1000 * 60)) / 1000
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();


/* =========================================
   02. ANIMACIÓN DE ESCRITURA DE LA CARTA
========================================= */

let letterAnimated = false;
let letterOriginalHTML = null;
let letterFollowRaf = 0;

function animateLetter() {
  if (letterAnimated) return;

  const letter = document.querySelector(".letter-card");
  if (!letter) return;

  letterAnimated = true;
  if (letterOriginalHTML === null) letterOriginalHTML = letter.innerHTML;
  letter.classList.add("typing-active");

  const paragraphs = letter.querySelectorAll("p");
  let characterIndex = 0;

  const characterSpeed = 0.018;

  paragraphs.forEach(paragraph => {
    const walker = document.createTreeWalker(
      paragraph,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const originalText = node.textContent;
      const fragment = document.createDocumentFragment();

      for (const character of originalText) {
        const span = document.createElement("span");

        span.className = "typing-char";
        span.textContent = character;

        span.style.animationDelay =
          `${characterIndex * characterSpeed}s`;

        fragment.appendChild(span);
        characterIndex++;
      }

      node.parentNode.replaceChild(fragment, node);
    });
  });

  const totalDuration =
    characterIndex * characterSpeed * 1000;

  followTyping(letter, characterSpeed);

  setTimeout(() => {
    letter.classList.remove("typing-active");
  }, totalDuration + 500);
}


/* =========================================
   VOLVER A EMPEZAR (cartel de Minecraft)
   Reinicia la experiencia desde el regalo,
   sin pasar por la cuenta regresiva ni el PIN
========================================= */

function resetExperience() {
  // Regalo cerrado otra vez
  const gift = document.getElementById("open-gift");
  if (gift) gift.classList.remove("opening");

  // Carta lista para escribirse de nuevo
  cancelAnimationFrame(letterFollowRaf);
  const letter = document.querySelector(".letter-card");
  if (letter && letterOriginalHTML !== null) {
    letter.classList.remove("typing-active");
    letter.innerHTML = letterOriginalHTML;
  }
  letterAnimated = false;

  // Fotos sin seleccionar
  document.querySelectorAll(".polaroid").forEach(card => {
    card.classList.remove("selected");
    card.style.transform = "";
  });
}

const restartSign = document.getElementById("restart-sign");

if (restartSign) {
  restartSign.addEventListener("click", () => {
    if (restartSign.classList.contains("go")) return;

    restartSign.classList.add("go");

    setTimeout(() => {
      resetExperience();
      showScreen("gift-screen");
      restartSign.classList.remove("go");
    }, 420);
  });
}


/* La hoja baja sola mientras se escribe.
   Si la persona toca o desliza la carta, se detiene el
   seguimiento automático para que lea a su ritmo. */

function followTyping(letter, characterSpeed) {
  const scroller = letter.querySelector(".letter-scroll");
  const chars = letter.querySelectorAll(".typing-char");

  if (!scroller || !chars.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  cancelAnimationFrame(letterFollowRaf);

  const startTime = performance.now();
  const lookAhead = 70;      // píxeles de aire debajo de la línea que se escribe
  let userTookControl = false;
  let position = scroller.scrollTop;

  const stop = () => { userTookControl = true; };
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach(name => {
    scroller.addEventListener(name, stop, { passive: true, once: true });
  });

  function step(now) {
    if (userTookControl) return;

    const index = Math.min(
      chars.length - 1,
      Math.floor((now - startTime) / (characterSpeed * 1000))
    );

    const current = chars[index];
    const lineBottom = current.offsetTop + current.offsetHeight;
    const wanted = lineBottom - scroller.clientHeight + lookAhead;

    if (wanted > position) {
      position += Math.max(0.5, (wanted - position) * 0.12);
      scroller.scrollTop = position;
    }

    if (index < chars.length - 1) {
      letterFollowRaf = requestAnimationFrame(step);
    } else {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }
  }

  letterFollowRaf = requestAnimationFrame(step);
}


/* =========================================
   03. SISTEMA DE CONTRASEÑA PIN
========================================= */

let enteredPin = "";

const dots = document.querySelectorAll("#pin-dots span");
const feedback = document.getElementById("pin-feedback");

function renderPin() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
}

function clearPin(message = "") {
  enteredPin = "";
  renderPin();
  feedback.textContent = message || "\u00A0";
}

function pressKey(key) {
  if (key === "clear") {
    enteredPin = enteredPin.slice(0, -1);
    renderPin();
    return;
  }

  if (key === "enter") {
    checkPin();
    return;
  }

  if (!/^\d$/.test(key)) return;
  if (enteredPin.length >= 6) return;

  enteredPin += key;
  renderPin();

  if (enteredPin.length === 6) {
    setTimeout(checkPin, 180);
  }
}

function checkPin() {
  if (enteredPin.length !== 6) {
    feedback.textContent = "Completa los seis números";
    return;
  }

  if (enteredPin === CORRECT_PIN) {
    feedback.textContent = "Código correcto ✦";

    setTimeout(() => {
      showScreen("gift-screen");
      clearPin();
    }, 550);

  } else {
    feedback.textContent =
      "Ese no es el código. Inténtalo otra vez.";

    const pinContainer = document.getElementById("pin-dots");
    pinContainer.classList.add("shake");

    setTimeout(() => {
      pinContainer.classList.remove("shake");
    }, 450);

    setTimeout(() => {
      clearPin();
    }, 900);
  }
}


/* =========================================
   04. TECLADO NUMÉRICO
========================================= */

document.getElementById("keypad").addEventListener("click", event => {
  const button = event.target.closest("button[data-key]");
  if (!button) return;

  pressKey(button.dataset.key);
});


/* TECLADO FÍSICO */

document.addEventListener("keydown", event => {
  const pinScreen = document.getElementById("pin-screen");

  if (!pinScreen.classList.contains("active")) return;

  if (/^\d$/.test(event.key)) {
    pressKey(event.key);
  } else if (event.key === "Backspace") {
    pressKey("clear");
  } else if (event.key === "Enter") {
    pressKey("enter");
  }
});


/* =========================================
   05. DESBLOQUEAR REGALO
========================================= */

openPinButton.addEventListener("click", () => {
  showScreen("pin-screen");
});


/* =========================================
   06. ANIMACIÓN DEL REGALO
========================================= */

const giftButton = document.getElementById("open-gift");

giftButton.addEventListener("click", () => {
  if (giftButton.classList.contains("opening")) return;

  giftButton.classList.add("opening");

  setTimeout(() => {
    showScreen("special-screen");
  }, 1250);
});


/* =========================================
   07. NAVEGACIÓN DE LAS SECCIONES
========================================= */

document.querySelectorAll(".next-screen").forEach(button => {
  button.addEventListener("click", () => {
    const nextScreen = button.dataset.next;
    showScreen(nextScreen);
  });
});


/* =========================================
   08. INTERACCIÓN DE FOTOGRAFÍAS
========================================= */

document.querySelectorAll(".polaroid").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("selected");

    if (card.classList.contains("selected")) {
      card.style.transform = "scale(1.08) rotate(0deg)";
    } else {
      card.style.transform = "";
    }
  });
});


/* =========================================
   09. PARTÍCULAS DREAMY
========================================= */

const particleContainer =
  document.getElementById("dreamy-particles");

function createParticles() {
  if (!particleContainer) return;

  const quantity = window.innerWidth < 560 ? 16 : 30;

  for (let i = 0; i < quantity; i++) {
    const particle = document.createElement("span");

    particle.className = "dream-particle";

    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    particle.style.setProperty(
      "--particle-size",
      (1.5 + Math.random() * 2) + "px"
    );

    particle.style.setProperty(
      "--particle-opacity",
      0.12 + Math.random() * 0.25
    );

    particle.style.setProperty(
      "--particle-duration",
      (5 + Math.random() * 7) + "s"
    );

    particle.style.setProperty(
      "--particle-delay",
      (-Math.random() * 8) + "s"
    );

    particle.style.setProperty(
      "--particle-x",
      (Math.random() * 50 - 25) + "px"
    );

    particleContainer.appendChild(particle);
  }
}

createParticles();


/* =========================================
   10. PÉTALOS FLOTANTES
========================================= */

const petalContainer =
  document.getElementById("falling-petals");

function createPetals() {
  if (!petalContainer) return;

  const quantity = window.innerWidth < 560 ? 7 : 13;

  for (let i = 0; i < quantity; i++) {
    const petal = document.createElement("span");

    petal.className = "dream-petal";

    petal.style.setProperty(
      "--petal-left",
      Math.random() * 100 + "%"
    );

    petal.style.setProperty(
      "--petal-size",
      (7 + Math.random() * 9) + "px"
    );

    petal.style.setProperty(
      "--petal-opacity",
      0.15 + Math.random() * 0.25
    );

    petal.style.setProperty(
      "--petal-duration",
      (14 + Math.random() * 13) + "s"
    );

    petal.style.setProperty(
      "--petal-delay",
      (-Math.random() * 25) + "s"
    );

    petalContainer.appendChild(petal);
  }
}

createPetals();


/* =========================================
   11. REPRODUCTOR DE MÚSICA
   VOLUMEN INTERACTIVO
========================================= */

const backgroundMusic = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicPlayer = document.getElementById("music-player");
const musicStatus = document.getElementById("music-status");

const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");

if (
  backgroundMusic &&
  musicToggle &&
  musicPlayer &&
  volumeSlider &&
  volumeValue
) {

  // Volumen inicial: 15 %
  backgroundMusic.volume = 0.15;

  // Actualizar apariencia de la barra
  function updateVolume() {

    const volume = Number(volumeSlider.value);

    backgroundMusic.volume = volume / 100;

    volumeValue.textContent = `${volume}%`;

    volumeSlider.style.background = `
      linear-gradient(
        to right,
        #dfa8d1 0%,
        #dfa8d1 ${volume}%,
        rgba(255,255,255,.19) ${volume}%,
        rgba(255,255,255,.19) 100%
      )
    `;
  }

  updateVolume();

  // Cambiar volumen al mover la barra
  volumeSlider.addEventListener("input", updateVolume);

  // Reproducir o pausar
  musicToggle.addEventListener("click", async () => {

    if (backgroundMusic.paused) {

      try {

        await backgroundMusic.play();

        musicPlayer.classList.add("playing");

        musicToggle.setAttribute(
          "aria-label",
          "Pausar música"
        );

        musicToggle.setAttribute(
          "aria-pressed",
          "true"
        );

        musicStatus.textContent = "REPRODUCIENDO";

      } catch (error) {

        musicStatus.textContent = "NO SE PUDO REPRODUCIR";

        console.error(
          "Error al iniciar la música:",
          error
        );
      }

    } else {

      backgroundMusic.pause();

      musicPlayer.classList.remove("playing");

      musicToggle.setAttribute(
        "aria-label",
        "Reproducir música"
      );

      musicToggle.setAttribute(
        "aria-pressed",
        "false"
      );

      musicStatus.textContent = "MÚSICA EN PAUSA";
    }
  });

  // Sincronizar el reproductor si el audio termina
  backgroundMusic.addEventListener("ended", () => {

    musicPlayer.classList.remove("playing");

    musicToggle.setAttribute(
      "aria-label",
      "Reproducir música"
    );

    musicToggle.setAttribute(
      "aria-pressed",
      "false"
    );

    musicStatus.textContent = "MÚSICA EN PAUSA";
  });
}