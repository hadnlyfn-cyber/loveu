const YOUTUBE_VIDEO_ID = "pomoFf4PUXE";
const YOUTUBE_EMBED_BASE = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

const body = document.body;
const modalTriggers = document.querySelectorAll("[data-modal-target]");
const closeControls = document.querySelectorAll("[data-close-modal]");
const songPlayerFrame = document.getElementById("song-player");
const musicToggle = document.querySelector(".music-toggle");
const musicToggleText = document.querySelector(".music-toggle-text");
const revealItems = document.querySelectorAll(".reveal");
const typewriter = document.querySelector(".typewriter-text");

let activeModal = null;
let backgroundPlayer = null;
let isMusicPlaying = false;
let typewriterTimer = null;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

revealItems.forEach((item) => revealObserver.observe(item));

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }

  closeActiveModal();
  activeModal = modal;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");

  if (modalId === "song-modal") {
    songPlayerFrame.src = `${YOUTUBE_EMBED_BASE}?autoplay=1&rel=0`;
  }

  if (modalId === "words-modal") {
    playTypewriter();
  }
};

const closeActiveModal = (shouldResetSong = true) => {
  if (!activeModal) {
    return;
  }

  activeModal.classList.remove("is-open");
  activeModal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");

  if (shouldResetSong) {
    songPlayerFrame.src = "";
  }

  if (typewriterTimer) {
    window.clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }

  activeModal = null;
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(trigger.dataset.modalTarget));
});

closeControls.forEach((control) => {
  control.addEventListener("click", () => closeActiveModal());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeActiveModal();
  }
});

const playTypewriter = () => {
  if (!typewriter) {
    return;
  }

  const fullText = typewriter.dataset.fullText ?? "";
  typewriter.textContent = "";
  typewriter.classList.add("is-typing");

  let index = 0;

  const typeNextCharacter = () => {
    typewriter.textContent = fullText.slice(0, index);
    index += 1;

    if (index <= fullText.length) {
      typewriterTimer = window.setTimeout(typeNextCharacter, 34);
      return;
    }

    typewriter.classList.remove("is-typing");
  };

  typeNextCharacter();
};

const updateMusicButton = () => {
  musicToggle.classList.toggle("is-playing", isMusicPlaying);
  musicToggle.setAttribute("aria-pressed", String(isMusicPlaying));
  musicToggle.setAttribute(
    "aria-label",
    isMusicPlaying ? "Выключить фоновую музыку" : "Включить фоновую музыку",
  );
  musicToggleText.textContent = isMusicPlaying ? "Выключить музыку" : "Включить музыку";
};

window.onYouTubeIframeAPIReady = () => {
  backgroundPlayer = new YT.Player("background-player", {
    height: "0",
    width: "0",
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      rel: 0,
    },
    events: {
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          backgroundPlayer.playVideo();
        }
      },
    },
  });
};

musicToggle.addEventListener("click", () => {
  if (!backgroundPlayer || typeof backgroundPlayer.playVideo !== "function") {
    return;
  }

  if (isMusicPlaying) {
    backgroundPlayer.pauseVideo();
    isMusicPlaying = false;
  } else {
    backgroundPlayer.playVideo();
    isMusicPlaying = true;
  }

  updateMusicButton();
});

updateMusicButton();
