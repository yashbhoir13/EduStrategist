/* =========================================================
   EDUSTRATEGIST - Game Engine & Multiplayer Logic
   ========================================================= */

const GAME_CONFIG = {
    TOTAL_ROUNDS: 5,
    ROUND_TIME: 15,
    AI_THINKING_TIME: 900,
    COMEBACK_THRESHOLD: 8,
    STORAGE_KEY: "edustrategist_data",
    LEADERBOARD_LIMIT: 10
};

const GAME = {
    phase: "idle",
    playerCount: 1,
    gameMode: "classic",
    difficulty: AI_DIFFICULTY.MEDIUM,
    aiPersonality: "adaptive",
    boss: null,
    players: [],
    currentTurnIndex: 0,
    round: 0,
    totalRounds: GAME_CONFIG.TOTAL_ROUNDS,
    scenarios: [],
    currentScenario: null,
    roundResults: [],
    conceptsLearned: [],
    hintsRemaining: 2,
    streaks: { winStreak: 0, predictionStreak: 0, bestStreak: 0 },
    performance: { prediction: 0, adaptability: 0, risk: 0, decision: 0, overall: 0 },
    timer: null,
    aiTimeout: null,
    gameStarted: false
};

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeGame() {
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof initializeUI === "function") {
            initializeUI();
        }
        loadSavedData();
    });
}

function loadSavedData() {
    const saved = getStoredData();
    if (saved && saved.playerName && UI.elements.playerName) {
        UI.elements.playerName.value = saved.playerName;
    }
}

/* =========================================================
   START GAME ENGINE
   ========================================================= */

function setupMultiplayerGame(playerConfigs, mode = "classic", selectedBoss = null) {
    clearTimers();

    GAME.gameMode = mode;
    GAME.boss = selectedBoss;
    GAME.playerCount = playerConfigs.length;
    GAME.round = 0;
    GAME.totalRounds = mode === "time_attack" ? 8 : (mode === "survival" ? 10 : 5);
    GAME.roundResults = [];
    GAME.conceptsLearned = [];
    GAME.hintsRemaining = 2;
    GAME.gameStarted = true;
    GAME.phase = "choosing";

    GAME.players = playerConfigs.map((cfg, idx) => ({
        id: `p${idx + 1}`,
        name: cfg.name || `Player ${idx + 1}`,
        avatar: cfg.avatar || AVATARS[idx % AVATARS.length].icon,
        color: cfg.color || PLAYER_COLORS[idx % PLAYER_COLORS.length].hex,
        isAI: cfg.isAI || false,
        personality: cfg.personality || "adaptive",
        score: 0,
        history: [],
        currentStrategy: null,
        currentPrediction: null,
        predictionsCorrect: 0,
        predictionsTotal: 0
    }));

    // Backwards compatibility for single player
    GAME.playerName = GAME.players[0].name;
    GAME.playerScore = 0;
    GAME.aiScore = 0;

    GAME.scenarios = getGameScenarios(GAME.totalRounds);
    showScreen("game");
    startNextRound();
}

function startGame(playerName) {
    const cleanName = (playerName && playerName.trim()) ? playerName.trim().slice(0, 20) : "Player 1";
    setupMultiplayerGame([
        { name: cleanName, avatar: "🦁", color: "#00f0ff", isAI: false },
        { name: GAME.boss ? GAME.boss.name : "AI Strategist", avatar: "🤖", color: "#ff007f", isAI: true, personality: GAME.aiPersonality }
    ], GAME.gameMode, GAME.boss);
}

/* =========================================================
   ROUND FLOW & SECRET LOCKING
   ========================================================= */

function startNextRound() {
    clearTimers();

    if (GAME.round >= GAME.totalRounds && GAME.gameMode !== "endless") {
        finishGame();
        return;
    }

    GAME.round++;
    GAME.currentScenario = GAME.scenarios[(GAME.round - 1) % GAME.scenarios.length];
    GAME.currentTurnIndex = 0;
    GAME.phase = "choosing";

    // Reset current choices
    GAME.players.forEach(p => {
        p.currentStrategy = null;
        p.currentPrediction = null;
    });

    UI.selectedStrategy = null;
    showScreen("game");
    updateGameUI(GAME.currentScenario, GAME.round, GAME.totalRounds, GAME.players);
    startTurnForCurrentPlayer();
}

function startTurnForCurrentPlayer() {
    if (GAME.currentTurnIndex >= GAME.players.length) {
        processRoundReveal();
        return;
    }

    const currentPlayer = GAME.players[GAME.currentTurnIndex];

    if (currentPlayer.isAI) {
        // AI selects strategy automatically
        const opponentHistory = GAME.players.find(p => !p.isAI)?.history || [];
        currentPlayer.currentStrategy = getAIDecision(currentPlayer.personality, opponentHistory, GAME.currentScenario);
        GAME.currentTurnIndex++;
        startTurnForCurrentPlayer();
    } else {
        // Human player turn: Enable secret strategy selection UI
        updateTurnPromptUI(currentPlayer, GAME.currentTurnIndex, GAME.players.length);
        enableStrategySelection();
        if (GAME.gameMode === "time_attack") startGameTimer();
    }
}

function lockPlayerStrategy(strategy, prediction = null) {
    if (GAME.phase !== "choosing") return;

    const currentPlayer = GAME.players[GAME.currentTurnIndex];
    if (!currentPlayer || currentPlayer.isAI) return;

    stopGameTimer();
    playGameSound("select");

    currentPlayer.currentStrategy = strategy;
    currentPlayer.currentPrediction = prediction;
    currentPlayer.history.push(strategy);

    // Save legacy history compatibility
    if (GAME.currentTurnIndex === 0) GAME.playerHistory = currentPlayer.history;

    GAME.currentTurnIndex++;

    if (GAME.currentTurnIndex < GAME.players.length) {
        // Show pass screen if multiplayer
        if (GAME.players.some(p => !p.isAI && p !== currentPlayer)) {
            showPassTurnModal(GAME.players[GAME.currentTurnIndex], () => {
                startTurnForCurrentPlayer();
            });
        } else {
            startTurnForCurrentPlayer();
        }
    } else {
        processRoundReveal();
    }
}

function submitPlayerStrategy(strategy) {
    lockPlayerStrategy(strategy, null);
}

/* =========================================================
   REVEAL & PAYOFF EVALUATION
   ========================================================= */

function processRoundReveal() {
    GAME.phase = "processing";
    disableStrategySelection();

    // AI choices for any remaining AI players
    GAME.players.forEach(p => {
        if (p.isAI && !p.currentStrategy) {
            const oppHistory = GAME.players.find(other => !other.isAI)?.history || [];
            p.currentStrategy = getAIDecision(p.personality, oppHistory, GAME.currentScenario);
            p.history.push(p.currentStrategy);
        }
    });

    const choices = GAME.players.map(p => p.currentStrategy || "cooperate");
    const payoffs = calculateMultiplayerPayoffs(choices, GAME.currentScenario);

    // Update scores & verify predictions
    GAME.players.forEach((p, idx) => {
        let roundGain = payoffs[idx];

        // Prediction bonus (+2 points)
        if (!p.isAI && p.currentPrediction) {
            const oppStrategy = GAME.players.find(other => other !== p)?.currentStrategy;
            if (p.currentPrediction.toLowerCase() === (oppStrategy || "").toLowerCase()) {
                roundGain += 2;
                p.predictionsCorrect++;
                GAME.streaks.predictionStreak++;
            } else {
                GAME.streaks.predictionStreak = 0;
            }
            p.predictionsTotal++;
        }

        p.score += roundGain;
    });

    // Compatibility scores
    GAME.playerScore = GAME.players[0]?.score || 0;
    GAME.aiScore = GAME.players[1]?.score || 0;

    const roundData = {
        round: GAME.round,
        scenario: GAME.currentScenario,
        choices: [...choices],
        payoffs: [...payoffs],
        players: GAME.players.map(p => ({ ...p }))
    };
    GAME.roundResults.push(roundData);

    // AI reasoning summary
    const aiPlayer = GAME.players.find(p => p.isAI);
    const aiReasoning = generateAIReasoning(
        aiPlayer?.currentStrategy || "defend",
        choices,
        GAME.players[0]?.history || []
    );

    setTimeout(() => {
        GAME.phase = "result";
        renderRoundResultsUI(roundData, aiReasoning);
        showScreen("result");
    }, GAME_CONFIG.AI_THINKING_TIME);
}

/* =========================================================
   HINT & PREDICTION HELPERS
   ========================================================= */

function requestHint() {
    if (GAME.hintsRemaining <= 0) {
        showToast("No hints remaining!");
        return null;
    }

    GAME.hintsRemaining--;
    const aiPlayer = GAME.players.find(p => p.isAI);
    if (!aiPlayer) return "Opponents are taking varied actions.";

    const history = aiPlayer.history;
    if (history.length === 0) return "The AI tends to open with balanced strategies.";

    const counts = countStrategies(history);
    const mostUsed = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

    return `💡 HINT: The opponent has chosen ${mostUsed.toUpperCase()} most frequently in past rounds.`;
}

/* =========================================================
   TIMERS & HELPERS
   ========================================================= */

function startGameTimer() {
    stopGameTimer();
    let remaining = GAME_CONFIG.ROUND_TIME;
    updateTimerDisplay(remaining);

    GAME.timer = setInterval(() => {
        if (GAME.phase !== "choosing") {
            stopGameTimer();
            return;
        }
        remaining--;
        updateTimerDisplay(remaining);
        if (remaining <= 5 && remaining > 0) playGameSound("tick");
        if (remaining <= 0) {
            stopGameTimer();
            // Default timeout move
            lockPlayerStrategy("defend");
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    if (UI.elements.timer) UI.elements.timer.textContent = Math.max(0, seconds);
    if (UI.elements.timerProgress) {
        const pct = Math.max(0, (seconds / GAME_CONFIG.ROUND_TIME) * 100);
        UI.elements.timerProgress.style.width = `${pct}%`;
    }
}

function stopGameTimer() {
    if (GAME.timer) {
        clearInterval(GAME.timer);
        GAME.timer = null;
    }
}

function clearAITimeout() {
    if (GAME.aiTimeout) {
        clearTimeout(GAME.aiTimeout);
        GAME.aiTimeout = null;
    }
}

function clearTimers() {
    stopGameTimer();
    clearAITimeout();
}

/* =========================================================
   GAME END & STORAGE
   ========================================================= */

function finishGame() {
    GAME.phase = "final";
    clearTimers();

    // Check winner
    const sorted = [...GAME.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    if (!winner.isAI) {
        GAME.streaks.winStreak++;
        if (GAME.streaks.winStreak > GAME.streaks.bestStreak) {
            GAME.streaks.bestStreak = GAME.streaks.winStreak;
        }
        checkAchievements(winner);
    } else {
        GAME.streaks.winStreak = 0;
    }

    saveGameRecord(sorted);
    renderFinalResultsUI(sorted);
    showScreen("final");
}

function checkAchievements(player) {
    const unlocked = getStoredData()?.achievements || [];
    const newUnlocked = [...unlocked];

    if (!newUnlocked.includes("first_win")) newUnlocked.push("first_win");
    if (player.score >= 40 && !newUnlocked.includes("master_strategist")) newUnlocked.push("master_strategist");
    if (player.predictionsCorrect >= 5 && !newUnlocked.includes("mind_reader")) newUnlocked.push("mind_reader");
    if (GAME.streaks.winStreak >= 5 && !newUnlocked.includes("unstoppable")) newUnlocked.push("unstoppable");

    saveStoredData({ achievements: newUnlocked });
}

function saveGameRecord(sortedPlayers) {
    const data = getStoredData() || {};
    const history = data.gameHistory || [];

    history.unshift({
        date: new Date().toLocaleDateString(),
        mode: GAME.gameMode,
        playerCount: GAME.playerCount,
        winner: sortedPlayers[0].name,
        scores: sortedPlayers.map(p => `${p.name}: ${p.score}`).join(", "),
        rounds: GAME.round
    });

    saveStoredData({
        playerName: GAME.players[0]?.name || "Player 1",
        difficulty: GAME.difficulty,
        gameHistory: history.slice(0, 20)
    });
}

function restartGame() {
    setupMultiplayerGame(GAME.players.map(p => ({
        name: p.name, avatar: p.avatar, color: p.color, isAI: p.isAI, personality: p.personality
    })), GAME.gameMode, GAME.boss);
}

function returnToMainMenu() {
    clearTimers();
    GAME.phase = "idle";
    GAME.gameStarted = false;
    showScreen("mainMenu");
}

function setSelectedDifficulty(diff) {
    GAME.difficulty = diff;
}

/* =========================================================
   STORAGE ACCESSORS
   ========================================================= */

function getStoredData() {
    try {
        const item = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        return null;
    }
}

function saveStoredData(data) {
    try {
        const existing = getStoredData() || {};
        const updated = { ...existing, ...data };
        localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(updated));
    } catch (e) { }
}

function getLeaderboard() {
    const data = getStoredData();
    return data && data.gameHistory ? data.gameHistory : [];
}

function clearLeaderboard() {
    saveStoredData({ gameHistory: [] });
}

function clearAllStoredData() {
    try {
        localStorage.removeItem(GAME_CONFIG.STORAGE_KEY);
    } catch (e) { }
}

function disableStrategySelection() {
    if (UI.elements.strategyGrid) {
        UI.elements.strategyGrid.querySelectorAll(".strategy-card").forEach(card => card.disabled = true);
    }
    if (UI.elements.confirmStrategyButton) UI.elements.confirmStrategyButton.disabled = true;
}

function enableStrategySelection() {
    if (UI.elements.strategyGrid) {
        UI.elements.strategyGrid.querySelectorAll(".strategy-card").forEach(card => card.disabled = false);
    }
    if (UI.elements.confirmStrategyButton) UI.elements.confirmStrategyButton.disabled = !UI.selectedStrategy;
}

function playGameSound(type) {
    if (typeof playSound === "function") playSound(type);
}

/* =========================================================
   GLOBAL API WRAPPER
   ========================================================= */

window.EduStrategistGame = {
    startGame,
    setupMultiplayerGame,
    lockPlayerStrategy,
    submitPlayerStrategy,
    requestHint,
    nextRound: function () {
        if (GAME.phase !== "result") return;
        if (GAME.round >= GAME.totalRounds && GAME.gameMode !== "endless") {
            finishGame();
            return;
        }
        startNextRound();
    },
    restartGame,
    returnToMainMenu,
    setSelectedDifficulty,
    getLeaderboard,
    clearLeaderboard,
    clearAllStoredData,
    getState: function () { return GAME; }
};

initializeGame();
