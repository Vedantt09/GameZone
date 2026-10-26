
const games = [
  {name:"Neon Drift",cat:"Racing",emoji:"🏎️",cover:"linear-gradient(140deg,#ffb21d,#ff4c6d 55%,#5927ff)",rating:"4.9",tag:"HOT"},
  {name:"Monster Dash",cat:"Arcade",emoji:"👾",cover:"linear-gradient(140deg,#3824bb,#d92dff 60%,#ff5fa2)",rating:"4.8",tag:"HOT"},
  {name:"Brain Blitz",cat:"Puzzle",emoji:"🧠",cover:"linear-gradient(140deg,#ffdf50,#ff8c42 60%,#ff477e)",rating:"4.8",tag:"NEW"},
  {name:"Turbo Rally",cat:"Racing",emoji:"🏁",cover:"linear-gradient(140deg,#05c8d6,#1f5cff)",rating:"4.7"},
  {name:"Goal Legends",cat:"Sports",emoji:"⚽",cover:"linear-gradient(140deg,#9ee85d,#00a77d)",rating:"4.7"},
  {name:"Fruit Ninja",cat:"Arcade",emoji:"🍉",cover:"linear-gradient(140deg,#ff745e,#e82770)",rating:"4.8"},
  {name:"Pixel Jumper",cat:"Arcade",emoji:"👾",cover:"linear-gradient(140deg,#23254d,#6b50ff)",rating:"4.6"},
  {name:"Bubble Pop",cat:"Casual",emoji:"🫧",cover:"linear-gradient(140deg,#70e6ff,#4b66ff)",rating:"4.6"},
  {name:"Tic Tac Toe",cat:"Puzzle",emoji:"❎",cover:"linear-gradient(140deg,#fe5ec9,#6754ff)",rating:"4.5"},
  {name:"Pool Masters",cat:"Sports",emoji:"🎱",cover:"linear-gradient(140deg,#0c9d86,#174a67)",rating:"4.6"},
  {name:"Sky Surfer",cat:"Arcade",emoji:"🛹",cover:"linear-gradient(140deg,#42e2df,#3e67d7)",rating:"4.5"},
  {name:"Candy Kingdom",cat:"Puzzle",emoji:"🍬",cover:"linear-gradient(140deg,#ff83bd,#ffb45b)",rating:"4.7"},
  {name:"Street Racer",cat:"Racing",emoji:"🏎️",cover:"linear-gradient(140deg,#121c39,#f72585)",rating:"4.8"},
  {name:"Penalty Shootout",cat:"Sports",emoji:"🥅",cover:"linear-gradient(140deg,#55d86a,#168f60)",rating:"4.6"},
  {name:"Ninja Strike",cat:"Action",emoji:"🥷",cover:"linear-gradient(140deg,#252044,#f43f5e)",rating:"4.7"},
  {name:"Farm Frenzy",cat:"Casual",emoji:"🐣",cover:"linear-gradient(140deg,#ffe57b,#71d76c)",rating:"4.4"},
  {name:"Space Blaster",cat:"Action",emoji:"🚀",cover:"linear-gradient(140deg,#242d74,#00d6d6)",rating:"4.8"},
  {name:"Chess Clash",cat:"Puzzle",emoji:"♟️",cover:"linear-gradient(140deg,#e9d7b6,#9c7853)",rating:"4.7"},
  {name:"Skate City",cat:"Sports",emoji:"🛼",cover:"linear-gradient(140deg,#ffa7b9,#6658ff)",rating:"4.5"},
  {name:"Jelly Jump",cat:"Arcade",emoji:"🟣",cover:"linear-gradient(140deg,#56e0c4,#695bff)",rating:"4.6"},
  {name:"Mystery Manor",cat:"Puzzle",emoji:"🕵️",cover:"linear-gradient(140deg,#292d5e,#b25cff)",rating:"4.7"},
  {name:"Ocean Rescue",cat:"Casual",emoji:"🐬",cover:"linear-gradient(140deg,#70edff,#1875d1)",rating:"4.5"},
  {name:"Drift Kings",cat:"Racing",emoji:"🚘",cover:"linear-gradient(140deg,#f8a51b,#e83b53)",rating:"4.8"},
  {name:"Tower Builder",cat:"Casual",emoji:"🏗️",cover:"linear-gradient(140deg,#74f0d1,#4378d9)",rating:"4.4"},
  {name:"Robot Rumble",cat:"Action",emoji:"🤖",cover:"linear-gradient(140deg,#ffcb56,#ff6c8c)",rating:"4.7"},
  {name:"Word Wizard",cat:"Puzzle",emoji:"🔤",cover:"linear-gradient(140deg,#7ed8ff,#6a57ff)",rating:"4.5"},
  {name:"Basket Blitz",cat:"Sports",emoji:"🏀",cover:"linear-gradient(140deg,#ffb34b,#ff5c49)",rating:"4.6"},
  {name:"Ghost Escape",cat:"Action",emoji:"👻",cover:"linear-gradient(140deg,#3b2c71,#2dd4bf)",rating:"4.6"},
  {name:"Merge Mania",cat:"Puzzle",emoji:"🧩",cover:"linear-gradient(140deg,#f9a8d4,#818cf8)",rating:"4.5"},
  {name:"Happy Hopper",cat:"Casual",emoji:"🐸",cover:"linear-gradient(140deg,#b7f56c,#14b8a6)",rating:"4.4"},
  {name:"Volleyball Stars",cat:"Sports",emoji:"🏐",cover:"linear-gradient(140deg,#ffd76b,#fa7b55)",rating:"4.5"},
  {name:"Cyber Runner",cat:"Arcade",emoji:"🏃",cover:"linear-gradient(140deg,#0d243c,#00c9ff)",rating:"4.8"},
  {name:"Dragon Quest",cat:"Action",emoji:"🐉",cover:"linear-gradient(140deg,#fb7185,#7c3aed)",rating:"4.7"},
  {name:"Parking Pro",cat:"Racing",emoji:"🅿️",cover:"linear-gradient(140deg,#8bd3ff,#4f46e5)",rating:"4.5"},
  {name:"Memory Match",cat:"Puzzle",emoji:"🃏",cover:"linear-gradient(140deg,#ff9dbe,#ffcf6e)",rating:"4.6"},
  {name:"Lucky Blocks",cat:"Casual",emoji:"🟩",cover:"linear-gradient(140deg,#70e1a0,#2786d8)",rating:"4.4"}
];

const grid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const categoryBar = document.getElementById("categoryBar");
const sortSelect = document.getElementById("sortSelect");
const favoritesToggle = document.getElementById("favoritesToggle");
const clearFilters = document.getElementById("clearFilters");
const emptyState = document.getElementById("emptyState");
const loadMore = document.getElementById("loadMore");
const modal = document.getElementById("gameModal");

let category = "All";
let favoritesOnly = false;
let visibleCount = 18;
let currentGame = null;

let saved = new Set(
  JSON.parse(localStorage.getItem("gamezone-favorites") || "[]")
);

let score = 0;
let seconds = 15;
let timer = null;
let best = Number(localStorage.getItem("gamezone-best") || 0);

// Filter games by category, search and favorites.
function filteredGames() {
  const query = searchInput.value.trim().toLowerCase();

  let list = games.filter(g =>
    (category === "All" || g.cat === category) &&
    (!favoritesOnly || saved.has(g.name)) &&
    (!query || (g.name + " " + g.cat).toLowerCase().includes(query))
  );

  if (sortSelect.value === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortSelect.value === "new") {
    list.reverse();
  }

  return list;
}

// Display game cards.
function render() {
  const list = filteredGames();
  const shown = list.slice(0, visibleCount);

  grid.innerHTML = shown.map((g, i) => `
    <article class="game-card"
      tabindex="0"
      role="button"
      aria-label="Play ${g.name}"
      data-game="${g.name}"
      style="animation-delay:${Math.min(i, 15) * 25}ms">

      <div class="game-cover" style="--cover:${g.cover}">
        ${g.tag ? `<span class="new-label">${g.tag}</span>` : ""}

        <button class="favorite-btn ${saved.has(g.name) ? "saved" : ""}"
          data-fav="${g.name}"
          aria-label="${saved.has(g.name) ? "Remove" : "Add"} ${g.name} ${saved.has(g.name) ? "from" : "to"} favorites">
          ${saved.has(g.name) ? "♥" : "♡"}
        </button>

        <span class="game-emoji">${g.emoji}</span>

        <div class="play-overlay">
          <span>▶ PLAY NOW</span>
        </div>
      </div>

      <div class="game-info">
        <div class="game-name">${g.name}</div>
        <div class="game-meta">
          <span class="game-category">${g.cat}</span>
          <span class="game-rating">★ ${g.rating}</span>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("gameCount").textContent = games.length;

  document.getElementById("resultsText").textContent =
    `Showing ${shown.length} of ${list.length} games`;

  emptyState.hidden = list.length !== 0;

  loadMore.style.display =
    list.length > visibleCount ? "flex" : "none";

  clearFilters.classList.toggle(
    "show",
    category !== "All" || favoritesOnly || !!searchInput.value
  );
}

// Change category.
function setCategory(next) {
  category = next;
  visibleCount = 18;

  document.querySelectorAll(".category-chip").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  render();
}

categoryBar.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (button) {
    setCategory(button.dataset.category);
  }
});

// Search games.
searchInput.addEventListener("input", () => {
  visibleCount = 18;
  render();
});

// Sort games.
sortSelect.addEventListener("change", render);

// Show or hide favorites.
favoritesToggle.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;

  favoritesToggle.classList.toggle("selected", favoritesOnly);

  favoritesToggle.setAttribute(
    "aria-pressed",
    String(favoritesOnly)
  );

  favoritesToggle.innerHTML =
    `${favoritesOnly ? "♥" : "♡"} <span>Favorites</span>`;

  visibleCount = 18;
  render();
});

// Reset all filters.
clearFilters.addEventListener("click", () => {
  category = "All";
  favoritesOnly = false;
  searchInput.value = "";

  favoritesToggle.classList.remove("selected");
  favoritesToggle.setAttribute("aria-pressed", "false");
  favoritesToggle.innerHTML = '♡ <span>Favorites</span>';

  setCategory("All");
});

// Load more cards.
loadMore.addEventListener("click", () => {
  visibleCount += 12;
  render();
});

// Handle card clicks and favorite buttons.
grid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-fav]");

  if (favoriteButton) {
    event.stopPropagation();

    const name = favoriteButton.dataset.fav;

    if (saved.has(name)) {
      saved.delete(name);
    } else {
      saved.add(name);
    }

    localStorage.setItem(
      "gamezone-favorites",
      JSON.stringify([...saved])
    );

    render();
    return;
  }

  const card = event.target.closest("[data-game]");

  if (card) {
    launchGame(card.dataset.game);
  }
});

// Keyboard support for cards.
grid.addEventListener("keydown", event => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches("[data-game]")
  ) {
    event.preventDefault();
    launchGame(event.target.dataset.game);
  }
});

// Featured game buttons.
document.querySelectorAll("[data-launch]").forEach(button => {
  button.addEventListener("click", () => {
    launchGame(button.dataset.launch);
  });
});

// Random game buttons.
function playRandomGame() {
  const randomIndex = Math.floor(Math.random() * games.length);
  launchGame(games[randomIndex].name);
}

document.getElementById("randomBtn").addEventListener(
  "click",
  playRandomGame
);

document.getElementById("surpriseBtn").addEventListener(
  "click",
  playRandomGame
);

// Close game popup.
document.getElementById("modalClose").addEventListener(
  "click",
  closeGame
);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeGame();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeGame();
  }

  // Press / to focus the search bar.
  if (
    event.key === "/" &&
    document.activeElement !== searchInput &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

// Open a selected game.
function launchGame(name) {
  currentGame = games.find(g => g.name === name) || {
    name,
    cat: "Arcade",
    emoji: "🎮",
    cover: "linear-gradient(140deg,#6251ff,#12d8c5)"
  };

  clearInterval(timer);

  score = 0;
  seconds = 15;

  document.getElementById("modalTitle").textContent =
    currentGame.name;

  document.getElementById("modalDescription").textContent =
    `Play the ${currentGame.cat.toLowerCase()} challenge. Tap the target as many times as you can in 15 seconds!`;

  document.getElementById("scoreValue").textContent = "0";
  document.getElementById("timeValue").textContent = "15";
  document.getElementById("bestValue").textContent = best;

  document.getElementById("playField").innerHTML = `
    <div class="play-intro">
      <span>${currentGame.emoji}</span>
      <p>Ready for a quick challenge?</p>
      <button id="startGame" class="primary-btn">Start game</button>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  document.getElementById("startGame").addEventListener(
    "click",
    startGame
  );
}

// Start the 15-second mini-game.
function startGame() {
  clearInterval(timer);

  score = 0;
  seconds = 15;

  document.getElementById("scoreValue").textContent = score;
  document.getElementById("timeValue").textContent = seconds;

  const field = document.getElementById("playField");
  field.innerHTML = "";

  spawnTarget();

  timer = setInterval(() => {
    seconds--;

    document.getElementById("timeValue").textContent = seconds;

    if (seconds <= 0) {
      clearInterval(timer);

      field.innerHTML = `
        <div class="play-intro">
          <span>🏆</span>
          <p>Time's up! You scored <b>${score}</b>.</p>
          <button id="againGame" class="primary-btn">Play again</button>
        </div>
      `;

      document.getElementById("againGame").addEventListener(
        "click",
        startGame
      );
    }
  }, 1000);
}

// Create a target at a random position.
function spawnTarget() {
  const field = document.getElementById("playField");

  if (seconds <= 0) return;

  const target = document.createElement("button");

  target.className = "target-btn";
  target.type = "button";

  target.textContent = ["✦", "⚡", "🎯", "💎"][
    Math.floor(Math.random() * 4)
  ];

  const maxX = Math.max(0, field.clientWidth - 58);
  const maxY = Math.max(0, field.clientHeight - 58);

  target.style.left = (Math.random() * maxX) + "px";
  target.style.top = (Math.random() * maxY) + "px";

  target.setAttribute("aria-label", "Tap target");

  target.addEventListener("click", () => {
    score++;

    document.getElementById("scoreValue").textContent = score;

    if (score > best) {
      best = score;

      localStorage.setItem("gamezone-best", String(best));

      document.getElementById("bestValue").textContent = best;
    }

    target.remove();
    spawnTarget();
  });

  field.appendChild(target);
}

// Stop the game and close the popup.
function closeGame() {
  clearInterval(timer);
  modal.hidden = true;
  document.body.style.overflow = "";
}

// Show the initial games.
render();
