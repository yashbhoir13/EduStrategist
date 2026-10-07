/* =========================================================
   EduStrategist - UI Controller
   ========================================================= */

const UI = {
    elements: {},
    selectedStrategy: null,
    toastTimeout: null,
    modalConfirmAction: null,
    audioContext: null
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeUI() {
    cacheUIElements();
    setupUIEvents();
    initializeSettingsUI();

    renderStrategies();
    renderLeaderboard();

    // Match the game's default difficulty
    const gameState = EduStrategistGame.getState();

    document.querySelectorAll(".difficulty-card").forEach(card => {
        card.classList.toggle(
            "selected",
            card.dataset.difficulty === gameState.difficulty
        );
    });

    showScreen("mainMenu");
}


/* =========================================================
   CACHE ELEMENTS
   ========================================================= */

function cacheUIElements() {
    UI.elements = {
        // Screens
        mainMenuScreen: document.getElementById("screen-menu"),
        setupScreen: document.getElementById("screen-setup"),
        gameScreen: document.getElementById("screen-game"),
        thinkingScreen: document.getElementById("screen-thinking"),
        resultScreen: document.getElementById("screen-result"),
        finalScreen: document.getElementById("screen-final"),
        howToPlayScreen: document.getElementById("screen-how-to-play"),
        leaderboardScreen: document.getElementById("screen-leaderboard"),
        settingsScreen: document.getElementById("screen-settings"),

        // Main menu
        playButton: document.getElementById("btn-play"),
        howToPlayButton: document.getElementById("btn-how-to-play"),
        leaderboardButton: document.getElementById("btn-leaderboard"),
        settingsButton: document.getElementById("btn-settings"),

        // Setup
        playerName: document.getElementById("player-name"),
        nameError: document.getElementById("name-error"),
        startGameButton: document.getElementById("btn-start-game"),
        difficultyCards: document.querySelectorAll(".difficulty-card"),

        // Game
        currentRound: document.getElementById("current-round"),
        totalRounds: document.getElementById("total-rounds"),
        playerScore: document.getElementById("player-score"),
        aiScore: document.getElementById("ai-score"),
        timer: document.getElementById("timer"),
        timerProgress: document.getElementById("timer-progress"),

        scenarioCategory: document.getElementById("scenario-category"),
        scenarioConcept: document.getElementById("scenario-concept"),
        scenarioTitle: document.getElementById("scenario-title"),
        scenarioDescription: document.getElementById("scenario-description"),

        strategyOptions: document.getElementById("strategy-options"),
        confirmStrategyButton: document.getElementById("btn-confirm-strategy"),
        strategyHistory: document.getElementById("strategy-history"),

        // Result
        resultTitle: document.getElementById("result-title"),
        resultPlayerStrategy: document.getElementById("result-player-strategy"),
        resultAIStrategy: document.getElementById("result-ai-strategy"),
        roundPlayerPoints: document.getElementById("round-player-points"),
        roundAIPoints: document.getElementById("round-ai-points"),
        strategicInsight: document.getElementById("strategic-insight"),
        resultConcept: document.getElementById("result-concept"),
        nextRoundButton: document.getElementById("btn-next-round"),

        // Final
        finalResultTitle: document.getElementById("final-result-title"),
        finalResultSubtitle: document.getElementById("final-result-subtitle"),
        finalPlayerScore: document.getElementById("final-player-score"),
        finalAIScore: document.getElementById("final-ai-score"),

        performanceTotal: document.getElementById("performance-total"),
        performancePrediction: document.getElementById("performance-prediction"),
        performanceAdaptability: document.getElementById("performance-adaptability"),
        performanceRisk: document.getElementById("performance-risk"),
        performanceDecision: document.getElementById("performance-decision"),

        barPrediction: document.getElementById("bar-prediction"),
        barAdaptability: document.getElementById("bar-adaptability"),
        barRisk: document.getElementById("bar-risk"),
        barDecision: document.getElementById("bar-decision"),

        conceptsLearned: document.getElementById("concepts-learned"),

        playAgainButton: document.getElementById("btn-play-again"),
        finalMenuButton: document.getElementById("btn-final-menu"),

        // Leaderboard
        leaderboardList: document.getElementById("leaderboard-list"),
        clearLeaderboardButton: document.getElementById("btn-clear-leaderboard"),

        // Settings
        toggleSound: document.getElementById("toggle-sound"),
        toggleMusic: document.getElementById("toggle-music"),
        resetDataButton: document.getElementById("btn-reset-data"),

        // Toast
        toast: document.getElementById("toast"),
        toastMessage: document.getElementById("toast-message"),

        // Modal
        modal: document.getElementById("modal"),
        modalTitle: document.getElementById("modal-title"),
        modalMessage: document.getElementById("modal-message"),
        modalCancel: document.getElementById("modal-cancel"),
        modalConfirm: document.getElementById("modal-confirm")
    };
}


/* =========================================================
   EVENT SETUP
   ========================================================= */

function setupUIEvents() {

    // Main menu
    UI.elements.playButton.addEventListener("click", () => {
        showScreen("setup");
    });

    UI.elements.howToPlayButton.addEventListener("click", () => {
        showScreen("howToPlay");
    });

    UI.elements.leaderboardButton.addEventListener("click", () => {
        renderLeaderboard();
        showScreen("leaderboard");
    });

    UI.elements.settingsButton.addEventListener("click", () => {
        initializeSettingsUI();
        showScreen("settings");
    });


    // Difficulty
    UI.elements.difficultyCards.forEach(card => {
        card.addEventListener("click", () => {

            UI.elements.difficultyCards.forEach(item => {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            EduStrategistGame.setSelectedDifficulty(
                card.dataset.difficulty
            );

            playSound("click");
        });
    });


    // Start game
    UI.elements.startGameButton.addEventListener("click", handleStartGame);

    UI.elements.playerName.addEventListener("input", () => {
        UI.elements.nameError.textContent = "";
        UI.elements.playerName.classList.remove("error");
    });

    UI.elements.playerName.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            handleStartGame();
        }
    });


    // Strategy selection
    UI.elements.strategyOptions.addEventListener("click", event => {

        const card = event.target.closest(".strategy-card");

        if (!card || card.disabled) {
            return;
        }

        selectStrategy(card.dataset.strategy);
    });


    // Confirm strategy
    UI.elements.confirmStrategyButton.addEventListener("click", () => {

        if (!UI.selectedStrategy) {
            showToast("Choose a strategy first.");
            return;
        }

        EduStrategistGame.submitPlayerStrategy(
            UI.selectedStrategy
        );
    });


    // Result
    UI.elements.nextRoundButton.addEventListener("click", () => {
        EduStrategistGame.nextRound();
    });


    // Final
    UI.elements.playAgainButton.addEventListener("click", () => {
        EduStrategistGame.restartGame();
    });

    UI.elements.finalMenuButton.addEventListener("click", () => {
        EduStrategistGame.returnToMainMenu();
    });


    // Leaderboard
    UI.elements.clearLeaderboardButton.addEventListener("click", () => {

        openModal(
            "Clear Leaderboard?",
            "This will permanently remove all leaderboard records.",
            () => {
                EduStrategistGame.clearLeaderboard();
                renderLeaderboard();
                showToast("Leaderboard cleared.");
            }
        );
    });


    // Settings
    UI.elements.toggleSound.addEventListener("change", () => {
        localStorage.setItem(
            "edustrategist_sound",
            UI.elements.toggleSound.checked
        );

        if (UI.elements.toggleSound.checked) {
            playSound("success");
        }
    });


    UI.elements.toggleMusic.addEventListener("change", () => {
        localStorage.setItem(
            "edustrategist_music",
            UI.elements.toggleMusic.checked
        );

        showToast(
            UI.elements.toggleMusic.checked
                ? "Music enabled."
                : "Music disabled."
        );
    });


    UI.elements.resetDataButton.addEventListener("click", () => {

        openModal(
            "Reset All Data?",
            "This will erase your saved name, leaderboard records and settings.",
            () => {

                EduStrategistGame.clearAllStoredData();

                UI.elements.playerName.value = "";

                localStorage.removeItem("edustrategist_sound");
                localStorage.removeItem("edustrategist_music");

                initializeSettingsUI();
                renderLeaderboard();

                closeModal();

                showToast("All data has been reset.");
            }
        );
    });


    // Modal
    UI.elements.modalCancel.addEventListener("click", closeModal);

    UI.elements.modalConfirm.addEventListener("click", () => {

        if (typeof UI.modalConfirmAction === "function") {
            const action = UI.modalConfirmAction;

            UI.modalConfirmAction = null;

            closeModal();

            action();
        } else {
            closeModal();
        }
    });


    // Close modal by clicking background
    UI.elements.modal.addEventListener("click", event => {

        if (event.target === UI.elements.modal) {
            closeModal();
        }
    });


    // Back buttons
    document.querySelectorAll("[data-back]").forEach(button => {

        button.addEventListener("click", () => {

            const target = button.dataset.back;

            if (target === "menu") {
                EduStrategistGame.returnToMainMenu();
            } else {
                showScreen(target);
            }
        });
    });
}


/* =========================================================
   START GAME
   ========================================================= */

function handleStartGame() {

    const name = UI.elements.playerName.value.trim();

    if (!name) {

        UI.elements.nameError.textContent =
            "Please enter your name.";

        UI.elements.playerName.classList.add("error");

        UI.elements.playerName.focus();

        playSound("error");

        return;
    }

    if (name.length < 2) {

        UI.elements.nameError.textContent =
            "Name must contain at least 2 characters.";

        UI.elements.playerName.classList.add("error");

        UI.elements.playerName.focus();

        playSound("error");

        return;
    }

    if (name.length > 20) {

        UI.elements.nameError.textContent =
            "Name must be 20 characters or less.";

        UI.elements.playerName.classList.add("error");

        UI.elements.playerName.focus();

        playSound("error");

        return;
    }

    UI.elements.nameError.textContent = "";
    UI.elements.playerName.classList.remove("error");

    playSound("start");

    EduStrategistGame.startGame(name);
}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(screenName) {

    const screenMap = {
        mainMenu: "screen-menu",
        setup: "screen-setup",
        game: "screen-game",
        thinking: "screen-thinking",
        result: "screen-result",
        final: "screen-final",
        howToPlay: "screen-how-to-play",
        leaderboard: "screen-leaderboard",
        settings: "screen-settings"
    };

    const targetId = screenMap[screenName];

    if (!targetId) {
        console.warn("Unknown screen:", screenName);
        return;
    }

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(targetId);

    if (target) {
        target.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


/* =========================================================
   GAME UI
   ========================================================= */

function updateGameUI(scenario, round, totalRounds, playerScore, aiScore) {

    // Update round and scores
    UI.elements.currentRound.textContent = round;
    UI.elements.totalRounds.textContent = totalRounds;

    UI.elements.playerScore.textContent = playerScore;
    UI.elements.aiScore.textContent = aiScore;

    // Safety check
    if (!scenario) {
        console.error("EduStrategist: No scenario received.");
        return;
    }

    console.log("Current Scenario:", scenario);

    // Scenario information
    UI.elements.scenarioCategory.textContent =
        scenario.category || "SCENARIO";

    UI.elements.scenarioConcept.textContent =
        scenario.concept || "STRATEGY";

    UI.elements.scenarioTitle.textContent =
        scenario.title || "Untitled Scenario";

    UI.elements.scenarioDescription.textContent =
        scenario.description || "Make your strategic decision.";

    // Make sure scenario information is visible
    UI.elements.scenarioCategory.style.display = "";
    UI.elements.scenarioConcept.style.display = "";
    UI.elements.scenarioTitle.style.display = "";
    UI.elements.scenarioDescription.style.display = "";

    // Render strategy choices
    renderStrategies();

    // Render previous decisions
    renderStrategyHistory();

    // Reset timer display
    updateTimerDisplay(15);
}

/* =========================================================
   STRATEGIES
   ========================================================= */

function renderStrategies() {

    const strategies = getAllStrategies();

    UI.selectedStrategy = null;

    UI.elements.strategyOptions.innerHTML = "";

    strategies.forEach(strategy => {

        const button = document.createElement("button");

        button.className = "strategy-card";

        button.type = "button";

        button.dataset.strategy = strategy.id;

        button.innerHTML = `
            <span class="strategy-icon">${strategy.icon}</span>
            <span class="strategy-content">
                <span class="strategy-name">${escapeHTML(strategy.name)}</span>
                <span class="strategy-description">
                    ${escapeHTML(strategy.description)}
                </span>
            </span>
        `;

        UI.elements.strategyOptions.appendChild(button);
    });

    UI.elements.confirmStrategyButton.disabled = true;
}


function selectStrategy(strategyId) {

    const strategy = getAllStrategies()
        .find(item => item.id === strategyId);

    if (!strategy) {
        return;
    }

    UI.selectedStrategy = strategyId;

    document.querySelectorAll(".strategy-card").forEach(card => {

        card.classList.toggle(
            "selected",
            card.dataset.strategy === strategyId
        );
    });

    UI.elements.confirmStrategyButton.disabled = false;

    playSound("select");
}


function disableStrategySelection() {

    document.querySelectorAll(".strategy-card").forEach(card => {
        card.disabled = true;
        card.classList.add("disabled");
    });

    UI.elements.confirmStrategyButton.disabled = true;
}


function enableStrategySelection() {

    document.querySelectorAll(".strategy-card").forEach(card => {
        card.disabled = false;
        card.classList.remove("disabled");
    });

    UI.elements.confirmStrategyButton.disabled =
        !UI.selectedStrategy;
}


/* =========================================================
   STRATEGY HISTORY
   ========================================================= */

function renderStrategyHistory() {

    const game = EduStrategistGame.getState();

    UI.elements.strategyHistory.innerHTML = "";

    if (!game.playerHistory.length) {

        UI.elements.strategyHistory.innerHTML = `
            <span class="history-empty">
                No decisions yet
            </span>
        `;

        return;
    }

    game.playerHistory.forEach((strategyId, index) => {

        const strategy = getAllStrategies()
            .find(item => item.id === strategyId);

        if (!strategy) {
            return;
        }

        const item = document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <span class="history-round">R${index + 1}</span>
            <span class="history-icon">${strategy.icon}</span>
            <span class="history-name">
                ${escapeHTML(strategy.name)}
            </span>
        `;

        UI.elements.strategyHistory.appendChild(item);
    });
}


/* =========================================================
   TIMER
   ========================================================= */

function updateTimerDisplay(seconds) {

    const safeSeconds = Math.max(0, Math.ceil(seconds));

    UI.elements.timer.textContent = safeSeconds;

    const percentage = (safeSeconds / 15) * 100;

    UI.elements.timerProgress.style.width =
        `${percentage}%`;

    UI.elements.timer.classList.remove(
        "warning",
        "danger"
    );

    if (safeSeconds <= 5) {
        UI.elements.timer.classList.add("danger");
    } else if (safeSeconds <= 8) {
        UI.elements.timer.classList.add("warning");
    }
}


/* =========================================================
   AI THINKING
   ========================================================= */

function showAIThinking() {

    showScreen("thinking");

    playSound("thinking");
}


function hideAIThinking() {
    // The result screen is opened immediately afterwards.
}


/* =========================================================
   ROUND RESULT
   ========================================================= */

function showRoundResult(result) {

    if (!result) {
        return;
    }

    let title = "DRAW";

    if (result.winner === "player") {
        title = "YOU WIN";
        playSound("win");
    } else if (result.winner === "ai") {
        title = "AI WINS";
        playSound("lose");
    } else {
        playSound("draw");
    }

    UI.elements.resultTitle.textContent = title;

    UI.elements.resultPlayerStrategy.textContent =
        formatStrategy(result.playerStrategy);

    UI.elements.resultAIStrategy.textContent =
        formatStrategy(result.aiStrategy);

    UI.elements.roundPlayerPoints.textContent =
        `+${result.playerPoints}`;

    UI.elements.roundAIPoints.textContent =
        `+${result.aiPoints}`;

    UI.elements.strategicInsight.textContent =
        result.insight;

    UI.elements.resultConcept.textContent =
        result.concept;

    showScreen("result");
}


/* =========================================================
   FINAL RESULT
   ========================================================= */

function showFinalResult(gameState) {

    if (!gameState) {
        gameState = EduStrategistGame.getState();
    }

    let title = "DRAW";
    let subtitle = "An evenly matched strategic battle.";

    if (gameState.playerScore > gameState.aiScore) {

        title = "VICTORY";

        subtitle =
            "You outplayed the AI through strategic decision-making.";

        playSound("victory");

    } else if (gameState.aiScore > gameState.playerScore) {

        title = "DEFEAT";

        subtitle =
            "The AI had the stronger strategy this time.";

        playSound("defeat");
    }

    UI.elements.finalResultTitle.textContent = title;

    UI.elements.finalResultSubtitle.textContent = subtitle;

    UI.elements.finalPlayerScore.textContent =
        gameState.playerScore;

    UI.elements.finalAIScore.textContent =
        gameState.aiScore;

    renderPerformance(gameState.performance);

    renderConcepts(gameState.conceptsLearned);

    showScreen("final");
}


/* =========================================================
   PERFORMANCE
   ========================================================= */

function renderPerformance(performance) {

    if (!performance) {
        return;
    }

    const prediction = clamp(performance.prediction);
    const adaptability = clamp(performance.adaptability);
    const risk = clamp(performance.risk);
    const decision = clamp(performance.decision);
    const overall = clamp(performance.overall);

    UI.elements.performanceTotal.textContent =
        `${Math.round(overall)}%`;

    UI.elements.performancePrediction.textContent =
        `${Math.round(prediction)}%`;

    UI.elements.performanceAdaptability.textContent =
        `${Math.round(adaptability)}%`;

    UI.elements.performanceRisk.textContent =
        `${Math.round(risk)}%`;

    UI.elements.performanceDecision.textContent =
        `${Math.round(decision)}%`;

    UI.elements.barPrediction.style.width =
        `${prediction}%`;

    UI.elements.barAdaptability.style.width =
        `${adaptability}%`;

    UI.elements.barRisk.style.width =
        `${risk}%`;

    UI.elements.barDecision.style.width =
        `${decision}%`;
}


/* =========================================================
   CONCEPTS
   ========================================================= */

function renderConcepts(concepts) {

    UI.elements.conceptsLearned.innerHTML = "";

    if (!concepts || !concepts.length) {

        UI.elements.conceptsLearned.innerHTML = `
            <span class="concept-tag">
                Keep playing to learn strategic concepts.
            </span>
        `;

        return;
    }

    concepts.forEach(concept => {

        const tag = document.createElement("span");

        tag.className = "concept-tag";

        tag.textContent = concept;

        UI.elements.conceptsLearned.appendChild(tag);
    });
}


/* =========================================================
   LEADERBOARD
   ========================================================= */

function renderLeaderboard() {

    const leaderboard =
        EduStrategistGame.getLeaderboard();

    UI.elements.leaderboardList.innerHTML = "";

    if (!leaderboard.length) {

        UI.elements.leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                <p>No scores yet.</p>
                <span>Complete a game to enter the leaderboard.</span>
            </div>
        `;

        return;
    }

    leaderboard.forEach((entry, index) => {

        const item = document.createElement("div");

        item.className = "leaderboard-entry";

        const difficulty =
            entry.difficulty
                ? entry.difficulty.toUpperCase()
                : "MEDIUM";

        item.innerHTML = `
            <div class="leaderboard-rank">
                #${index + 1}
            </div>

            <div class="leaderboard-player">
                <strong>${escapeHTML(entry.name)}</strong>
                <span>${difficulty}</span>
            </div>

            <div class="leaderboard-score">
                ${entry.score}
            </div>
        `;

        UI.elements.leaderboardList.appendChild(item);
    });
}


/* =========================================================
   SETTINGS
   ========================================================= */

function initializeSettingsUI() {

    const soundSetting =
        localStorage.getItem("edustrategist_sound");

    const musicSetting =
        localStorage.getItem("edustrategist_music");

    UI.elements.toggleSound.checked =
        soundSetting === null
            ? true
            : soundSetting === "true";

    UI.elements.toggleMusic.checked =
        musicSetting === null
            ? true
            : musicSetting === "true";
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!UI.elements.toast) {
        return;
    }

    UI.elements.toastMessage.textContent = message;

    UI.elements.toast.classList.add("show");

    clearTimeout(UI.toastTimeout);

    UI.toastTimeout = setTimeout(() => {

        UI.elements.toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(title, message, confirmAction) {

    UI.elements.modalTitle.textContent = title;

    UI.elements.modalMessage.textContent = message;

    UI.modalConfirmAction = confirmAction;

    UI.elements.modal.classList.add("show");
}


function closeModal() {

    UI.elements.modal.classList.remove("show");

    UI.modalConfirmAction = null;
}


/* =========================================================
   SOUND SYSTEM
   ========================================================= */

function getAudioContext() {

    if (!UI.audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        UI.audioContext = new AudioContext();
    }

    if (UI.audioContext.state === "suspended") {
        UI.audioContext.resume();
    }

    return UI.audioContext;
}


function playSound(type) {

    const soundEnabled =
        UI.elements.toggleSound
            ? UI.elements.toggleSound.checked
            : true;

    if (!soundEnabled) {
        return;
    }

    const audio = getAudioContext();

    if (!audio) {
        return;
    }

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    let frequency = 440;
    let duration = 0.08;
    let wave = "sine";

    switch (type) {

        case "click":
            frequency = 420;
            duration = 0.06;
            break;

        case "select":
            frequency = 560;
            duration = 0.08;
            break;

        case "start":
            frequency = 620;
            duration = 0.12;
            wave = "triangle";
            break;

        case "success":
            frequency = 720;
            duration = 0.14;
            wave = "triangle";
            break;

        case "win":
            frequency = 760;
            duration = 0.18;
            wave = "triangle";
            break;

        case "victory":
            frequency = 880;
            duration = 0.3;
            wave = "triangle";
            break;

        case "lose":
            frequency = 240;
            duration = 0.18;
            break;

        case "defeat":
            frequency = 180;
            duration = 0.3;
            break;

        case "draw":
            frequency = 400;
            duration = 0.14;
            break;

        case "error":
            frequency = 160;
            duration = 0.16;
            wave = "square";
            break;

        case "thinking":
            frequency = 330;
            duration = 0.08;
            break;

        case "tick":
            frequency = 800;
            duration = 0.035;
            break;

        default:
            frequency = 440;
            duration = 0.08;
    }

    oscillator.type = wave;

    oscillator.frequency.setValueAtTime(
        frequency,
        audio.currentTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.08,
        audio.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + duration
    );

    oscillator.start();

    oscillator.stop(
        audio.currentTime + duration + 0.02
    );
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatStrategy(strategyId) {

    const strategy =
        getAllStrategies().find(
            item => item.id === strategyId
        );

    return strategy
        ? strategy.name
        : strategyId;
}


function clamp(value) {

    return Math.max(
        0,
        Math.min(
            100,
            Number(value) || 0
        )
    );
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   GLOBAL UI API
   ========================================================= */

window.EduStrategistUI = {

    showScreen,
    updateGameUI,

    renderStrategies,
    selectStrategy,
    disableStrategySelection,
    enableStrategySelection,

    renderStrategyHistory,
    updateTimerDisplay,

    showAIThinking,
    hideAIThinking,

    showRoundResult,
    showFinalResult,

    renderPerformance,
    renderConcepts,

    renderLeaderboard,
    initializeSettingsUI,

    showToast,
    openModal,
    closeModal,

    playSound
};