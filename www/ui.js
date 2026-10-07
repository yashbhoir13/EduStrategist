/* =========================================================
   EduStrategist — UI Controller (Multiplayer & Visual Engine)
   ========================================================= */

const UI = {
    elements: {},
    selectedStrategy: null,
    selectedPrediction: null,
    playerCount: 1,
    passCallback: null,
    activeLearnTopicIndex: 0,
    audioContext: null
};

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeUI() {
    cacheUIElements();
    setupUIEvents();
    renderPlayersSetup(1);
    renderStrategies();
    renderLearnHub();
    renderBossesGrid();
    renderProfileDashboard();
    renderLeaderboard();
    showScreen("mainMenu");
}

/* =========================================================
   CACHE UI ELEMENTS
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
        learnScreen: document.getElementById("screen-learn"),
        modesScreen: document.getElementById("screen-modes"),
        profileScreen: document.getElementById("screen-profile"),
        howToPlayScreen: document.getElementById("screen-how-to-play"),
        leaderboardScreen: document.getElementById("screen-leaderboard"),
        settingsScreen: document.getElementById("screen-settings"),

        // Navigation Buttons
        playButton: document.getElementById("btn-play"),
        learnButton: document.getElementById("btn-learn"),
        modesButton: document.getElementById("btn-modes"),
        achievementsButton: document.getElementById("btn-achievements"),
        howToPlayButton: document.getElementById("btn-how-to-play"),
        leaderboardButton: document.getElementById("btn-leaderboard"),
        settingsButton: document.getElementById("btn-settings"),

        // Setup Screen
        countBtns: document.querySelectorAll(".count-btn"),
        playersSetupContainer: document.getElementById("players-setup-container"),
        setupModeSelect: document.getElementById("setup-mode-select"),
        startGameButton: document.getElementById("btn-start-game"),

        // Game Screen
        currentRound: document.getElementById("current-round"),
        totalRounds: document.getElementById("total-rounds"),
        liveScoreboard: document.getElementById("live-scoreboard"),
        timer: document.getElementById("timer"),
        timerProgress: document.getElementById("timer-progress"),
        turnBanner: document.getElementById("turn-banner"),
        turnAvatar: document.getElementById("turn-avatar"),
        turnPlayerName: document.getElementById("turn-player-name"),
        hintButton: document.getElementById("btn-hint"),
        hintsCount: document.getElementById("hints-count"),

        // Scenario & Strategies
        scenarioCategory: document.getElementById("scenario-category"),
        scenarioConcept: document.getElementById("scenario-concept"),
        scenarioTitle: document.getElementById("scenario-title"),
        scenarioDescription: document.getElementById("scenario-description"),
        predictionSection: document.getElementById("prediction-section"),
        predictionOptions: document.getElementById("prediction-options"),
        strategyOptions: document.getElementById("strategy-options"),
        confirmStrategyButton: document.getElementById("btn-confirm-strategy"),
        strategyHistory: document.getElementById("strategy-history"),

        // Results Screen
        resultTitle: document.getElementById("result-title"),
        multiplayerRevealGrid: document.getElementById("multiplayer-reveal-grid"),
        strategicInsight: document.getElementById("strategic-insight"),
        resultConcept: document.getElementById("result-concept"),
        liveStandingsTable: document.getElementById("live-standings-table"),
        nextRoundButton: document.getElementById("btn-next-round"),

        // Final Screen
        finalResultTitle: document.getElementById("final-result-title"),
        finalResultSubtitle: document.getElementById("final-result-subtitle"),
        finalPodium: document.getElementById("final-podium"),
        performanceTotal: document.getElementById("performance-total"),
        performancePrediction: document.getElementById("performance-prediction"),
        performanceAdaptability: document.getElementById("performance-adaptability"),
        performanceRisk: document.getElementById("performance-risk"),
        barPrediction: document.getElementById("bar-prediction"),
        barAdaptability: document.getElementById("bar-adaptability"),
        barRisk: document.getElementById("bar-risk"),
        playAgainButton: document.getElementById("btn-play-again"),
        finalMenuButton: document.getElementById("btn-final-menu"),

        // Pass Turn Modal
        modalPassTurn: document.getElementById("modal-pass-turn"),
        passAvatar: document.getElementById("pass-avatar"),
        passTitle: document.getElementById("pass-title"),
        passMessage: document.getElementById("pass-message"),
        btnUnlockPassTurn: document.getElementById("btn-unlock-pass-turn"),

        // Profile & Achievements
        statWinStreak: document.getElementById("stat-win-streak"),
        statPredStreak: document.getElementById("stat-pred-streak"),
        statBestStreak: document.getElementById("stat-best-streak"),
        achievementsGrid: document.getElementById("achievements-grid"),

        // Learn Hub & Bosses
        learnTopicsNav: document.getElementById("learn-topics-nav"),
        learnTopicCard: document.getElementById("learn-topic-card"),
        bossGrid: document.getElementById("boss-grid"),

        // Toast & General Modal
        toast: document.getElementById("toast"),
        toastMessage: document.getElementById("toast-message"),
        modal: document.getElementById("modal"),
        modalTitle: document.getElementById("modal-title"),
        modalMessage: document.getElementById("modal-message"),
        modalCancel: document.getElementById("modal-cancel"),
        modalConfirm: document.getElementById("modal-confirm")
    };
}

/* =========================================================
   EVENT LISTENERS & NAVIGATION
   ========================================================= */

function setupUIEvents() {
    // Menu Buttons
    if (UI.elements.playButton) UI.elements.playButton.addEventListener("click", () => showScreen("setup"));
    if (UI.elements.learnButton) UI.elements.learnButton.addEventListener("click", () => { renderLearnHub(); showScreen("learn"); });
    if (UI.elements.modesButton) UI.elements.modesButton.addEventListener("click", () => { renderBossesGrid(); showScreen("modes"); });
    if (UI.elements.achievementsButton) UI.elements.achievementsButton.addEventListener("click", () => { renderProfileDashboard(); showScreen("profile"); });
    if (UI.elements.howToPlayButton) UI.elements.howToPlayButton.addEventListener("click", () => showScreen("howToPlay"));
    if (UI.elements.leaderboardButton) UI.elements.leaderboardButton.addEventListener("click", () => { renderLeaderboard(); showScreen("leaderboard"); });
    if (UI.elements.settingsButton) UI.elements.settingsButton.addEventListener("click", () => showScreen("settings"));

    // Back Buttons
    document.querySelectorAll("[data-back]").forEach(btn => {
        btn.addEventListener("click", () => showScreen("mainMenu"));
    });

    // Player Count Selector
    UI.elements.countBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            UI.elements.countBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            UI.playerCount = parseInt(btn.dataset.count) || 1;
            renderPlayersSetup(UI.playerCount);
            playSound("click");
        });
    });

    // Start Multiplayer Game
    if (UI.elements.startGameButton) UI.elements.startGameButton.addEventListener("click", handleStartMultiplayerGame);

    // Strategy Option Selection
    if (UI.elements.strategyOptions) {
        UI.elements.strategyOptions.addEventListener("click", e => {
            const card = e.target.closest(".strategy-card");
            if (!card || card.disabled) return;
            selectStrategy(card.dataset.strategy);
        });
    }

    // Confirm Strategy Lock
    if (UI.elements.confirmStrategyButton) {
        UI.elements.confirmStrategyButton.addEventListener("click", () => {
            if (!UI.selectedStrategy) {
                showToast("Choose a strategy first.");
                return;
            }
            EduStrategistGame.lockPlayerStrategy(UI.selectedStrategy, UI.selectedPrediction);
        });
    }

    // Hint Button
    if (UI.elements.hintButton) {
        UI.elements.hintButton.addEventListener("click", () => {
            const hintText = EduStrategistGame.requestHint();
            if (hintText) showToast(hintText);
        });
    }

    // Unlock Pass Turn Modal
    if (UI.elements.btnUnlockPassTurn) {
        UI.elements.btnUnlockPassTurn.addEventListener("click", () => {
            if (UI.elements.modalPassTurn) UI.elements.modalPassTurn.classList.remove("active");
            if (typeof UI.passCallback === "function") {
                const cb = UI.passCallback;
                UI.passCallback = null;
                cb();
            }
        });
    }

    // Result & Final
    if (UI.elements.nextRoundButton) UI.elements.nextRoundButton.addEventListener("click", () => EduStrategistGame.nextRound());
    if (UI.elements.playAgainButton) UI.elements.playAgainButton.addEventListener("click", () => EduStrategistGame.restartGame());
    if (UI.elements.finalMenuButton) UI.elements.finalMenuButton.addEventListener("click", () => EduStrategistGame.returnToMainMenu());
}

/* =========================================================
   DYNAMIC PLAYER SETUP CARDS (1–4 PLAYERS)
   ========================================================= */

function renderPlayersSetup(count = 1) {
    if (!UI.elements.playersSetupContainer) return;
    UI.elements.playersSetupContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const playerCard = document.createElement("div");
        playerCard.className = "player-setup-card";
        playerCard.dataset.playerIdx = i;

        const isAIByDefault = i > 0 && count === 1; // Single player defaults player 2 to AI
        const defaultName = isAIByDefault ? "AI Strategist" : `Player ${i + 1}`;
        const defaultAvatar = AVATARS[i % AVATARS.length].icon;
        const defaultColor = PLAYER_COLORS[i % PLAYER_COLORS.length].hex;

        playerCard.innerHTML = `
            <div class="player-card-header" style="border-left: 4px solid ${defaultColor}">
                <span class="player-tag" style="background:${defaultColor}">${defaultName}</span>
                <span class="avatar-preview" id="avatar-prev-${i}">${defaultAvatar}</span>
            </div>
            
            <div class="form-group compact">
                <label>NAME</label>
                <input type="text" id="p-name-${i}" value="${defaultName}" maxlength="18" class="custom-input">
            </div>

            <div class="form-row">
                <div class="form-group compact">
                    <label>AVATAR</label>
                    <select id="p-avatar-${i}" class="custom-select">
                        ${AVATARS.map(a => `<option value="${a.icon}" ${a.icon === defaultAvatar ? 'selected' : ''}>${a.icon} ${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group compact">
                    <label>COLOR</label>
                    <select id="p-color-${i}" class="custom-select">
                        ${PLAYER_COLORS.map(c => `<option value="${c.hex}" ${c.hex === defaultColor ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
            </div>

            ${count > 1 ? `
            <div class="form-row">
                <div class="form-group compact">
                    <label>TYPE</label>
                    <select id="p-type-${i}" class="custom-select p-type-select">
                        <option value="human" ${!isAIByDefault ? 'selected' : ''}>👤 Human</option>
                        <option value="ai" ${isAIByDefault ? 'selected' : ''}>🤖 AI</option>
                    </select>
                </div>
                <div class="form-group compact p-ai-personality-wrap" id="p-ai-wrap-${i}" style="${isAIByDefault ? '' : 'display:none'}">
                    <label>AI PERSONALITY</label>
                    <select id="p-personality-${i}" class="custom-select">
                        ${Object.values(AI_PERSONALITIES).map(p => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            ` : ''}
        `;

        UI.elements.playersSetupContainer.appendChild(playerCard);

        // Type toggle listener
        const typeSelect = playerCard.querySelector(`#p-type-${i}`);
        const aiWrap = playerCard.querySelector(`#p-ai-wrap-${i}`);
        if (typeSelect) {
            typeSelect.addEventListener("change", (e) => {
                if (aiWrap) aiWrap.style.display = e.target.value === "ai" ? "block" : "none";
            });
        }
    }
}

function handleStartMultiplayerGame() {
    const playerConfigs = [];
    const count = UI.playerCount;

    for (let i = 0; i < count; i++) {
        const nameEl = document.getElementById(`p-name-${i}`);
        const avatarEl = document.getElementById(`p-avatar-${i}`);
        const colorEl = document.getElementById(`p-color-${i}`);
        const typeEl = document.getElementById(`p-type-${i}`);
        const persEl = document.getElementById(`p-personality-${i}`);

        const name = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : `Player ${i + 1}`;
        const avatar = avatarEl ? avatarEl.value : "🦁";
        const color = colorEl ? colorEl.value : "#00f0ff";
        const isAI = count > 1 ? (typeEl && typeEl.value === "ai") : (i === 1);
        const personality = persEl ? persEl.value : "adaptive";

        playerConfigs.push({ name, avatar, color, isAI, personality });
    }

    // Single player vs AI if count === 1
    if (count === 1) {
        playerConfigs.push({
            name: "AI Strategist",
            avatar: "🤖",
            color: "#ff007f",
            isAI: true,
            personality: "adaptive"
        });
    }

    const mode = UI.elements.setupModeSelect ? UI.elements.setupModeSelect.value : "classic";
    EduStrategistGame.setupMultiplayerGame(playerConfigs, mode, null);
}

/* =========================================================
   GAME SCREEN & SECRET SELECTION UI
   ========================================================= */

function updateGameUI(scenario, round, totalRounds, players) {
    if (UI.elements.currentRound) UI.elements.currentRound.textContent = round;
    if (UI.elements.totalRounds) UI.elements.totalRounds.textContent = totalRounds;

    // Live Scoreboard Render
    if (UI.elements.liveScoreboard) {
        UI.elements.liveScoreboard.innerHTML = players.map(p => `
            <div class="player-score-chip" style="border-top: 3px solid ${p.color}">
                <span class="chip-avatar">${p.avatar}</span>
                <div class="chip-info">
                    <strong>${p.name}</strong>
                    <small>${p.score} pts</small>
                </div>
            </div>
        `).join('');
    }

    // Scenario Details
    if (scenario) {
        if (UI.elements.scenarioCategory) UI.elements.scenarioCategory.textContent = scenario.category || "STRATEGY";
        if (UI.elements.scenarioConcept) UI.elements.scenarioConcept.textContent = scenario.concept || "PAYOFF";
        if (UI.elements.scenarioTitle) UI.elements.scenarioTitle.textContent = scenario.title || "Scenario";
        if (UI.elements.scenarioDescription) UI.elements.scenarioDescription.textContent = scenario.description || "";
    }

    // Render Prediction Options
    if (UI.elements.predictionOptions) {
        UI.elements.predictionOptions.innerHTML = Object.values(STRATEGIES).map(s => `
            <button class="pred-card" data-strategy="${s.id}">
                <span>${s.icon}</span>
                <small>${s.name}</small>
            </button>
        `).join('');

        UI.elements.predictionOptions.querySelectorAll(".pred-card").forEach(btn => {
            btn.addEventListener("click", () => {
                UI.elements.predictionOptions.querySelectorAll(".pred-card").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                UI.selectedPrediction = btn.dataset.strategy;
            });
        });
    }

    // Reset Strategy Selection
    UI.selectedStrategy = null;
    UI.selectedPrediction = null;
    renderStrategies();
}

function updateTurnPromptUI(player, turnIdx, total) {
    if (!UI.elements.turnBanner) return;
    if (UI.elements.turnAvatar) UI.elements.turnAvatar.textContent = player.avatar;
    if (UI.elements.turnPlayerName) UI.elements.turnPlayerName.textContent = player.name;
    UI.elements.turnBanner.style.borderColor = player.color;
}

function showPassTurnModal(nextPlayer, onUnlock) {
    if (!UI.elements.modalPassTurn) return;
    UI.passCallback = onUnlock;
    if (UI.elements.passAvatar) UI.elements.passAvatar.textContent = nextPlayer.avatar;
    if (UI.elements.passTitle) UI.elements.passTitle.textContent = `Pass device to ${nextPlayer.name}`;
    if (UI.elements.passMessage) UI.elements.passMessage.textContent = `Keep your strategy secret! Tap unlock when ${nextPlayer.name} is ready.`;
    UI.elements.modalPassTurn.classList.add("active");
}

function renderStrategies() {
    if (!UI.elements.strategyOptions) return;
    UI.elements.strategyOptions.innerHTML = Object.values(STRATEGIES).map(s => `
        <button class="strategy-card" data-strategy="${s.id}">
            <div class="card-icon">${s.icon}</div>
            <strong>${s.name}</strong>
            <p>${s.description}</p>
            <div class="card-tags">
                <span>Risk: ${s.risk || 'Med'}</span>
                <span>Reward: ${s.reward || 'High'}</span>
            </div>
        </button>
    `).join('');
}

function selectStrategy(strategyId) {
    UI.selectedStrategy = strategyId;
    document.querySelectorAll(".strategy-card").forEach(card => {
        card.classList.toggle("selected", card.dataset.strategy === strategyId);
    });
    if (UI.elements.confirmStrategyButton) {
        UI.elements.confirmStrategyButton.disabled = false;
    }
    playSound("click");
}

/* =========================================================
   ROUND REVEAL & STANDINGS UI
   ========================================================= */

function renderRoundResultsUI(roundData, aiReasoning) {
    if (!UI.elements.multiplayerRevealGrid) return;
    const { players, scenario, payoffs } = roundData;

    // Simultaneous Reveal Flip Cards
    UI.elements.multiplayerRevealGrid.innerHTML = players.map((p, idx) => {
        const stratObj = STRATEGIES[(p.currentStrategy || "cooperate").toUpperCase()] || STRATEGIES.COOPERATE;
        return `
            <div class="reveal-card flip-in" style="border-top: 4px solid ${p.color}">
                <div class="reveal-header">
                    <span>${p.avatar} ${p.name}</span>
                    <strong class="payoff-badge">+${payoffs[idx]} pts</strong>
                </div>
                <div class="reveal-body">
                    <span class="strat-icon">${stratObj.icon}</span>
                    <strong>${stratObj.name}</strong>
                    <small>${stratObj.description}</small>
                </div>
            </div>
        `;
    }).join('');

    if (UI.elements.strategicInsight) {
        UI.elements.strategicInsight.innerHTML = `
            <strong>${aiReasoning}</strong><br><br>
            <em>${scenario?.insight || ''}</em>
        `;
    }

    if (UI.elements.resultConcept) {
        UI.elements.resultConcept.textContent = scenario?.gameTheory || "GAME THEORY PAYOFF";
    }

    // Live Standings Table
    if (UI.elements.liveStandingsTable) {
        const sorted = [...players].sort((a, b) => b.score - a.score);
        UI.elements.liveStandingsTable.innerHTML = `
            <table class="standings-table">
                <thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead>
                <tbody>
                    ${sorted.map((p, rank) => `
                        <tr>
                            <td>#${rank + 1}</td>
                            <td>${p.avatar} ${p.name}</td>
                            <td><strong>${p.score} pts</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

/* =========================================================
   FINAL RESULTS & PODIUM UI
   ========================================================= */

function renderFinalResultsUI(sortedPlayers) {
    if (UI.elements.finalResultTitle) {
        const winner = sortedPlayers[0];
        UI.elements.finalResultTitle.textContent = `${winner.avatar} ${winner.name} WINS!`;
    }

    if (UI.elements.finalPodium) {
        UI.elements.finalPodium.innerHTML = sortedPlayers.map((p, idx) => `
            <div class="podium-card rank-${idx + 1}" style="border-color:${p.color}">
                <div class="rank-badge">#${idx + 1}</div>
                <span class="podium-avatar">${p.avatar}</span>
                <strong>${p.name}</strong>
                <small>${p.score} points</small>
            </div>
        `).join('');
    }
}

/* =========================================================
   LEARN GAME THEORY HUB UI
   ========================================================= */

function renderLearnHub() {
    if (!UI.elements.learnTopicsNav || !UI.elements.learnTopicCard) return;

    UI.elements.learnTopicsNav.innerHTML = LEARN_LESSONS.map((topic, idx) => `
        <button class="topic-nav-btn ${idx === UI.activeLearnTopicIndex ? 'active' : ''}" data-idx="${idx}">
            ${topic.title}
        </button>
    `).join('');

    const lesson = LEARN_LESSONS[UI.activeLearnTopicIndex] || LEARN_LESSONS[0];
    UI.elements.learnTopicCard.innerHTML = `
        <div class="lesson-header">
            <span class="eyebrow">${lesson.concept}</span>
            <h2>${lesson.title}</h2>
            <p class="subtitle">${lesson.subtitle}</p>
        </div>
        <div class="lesson-body">
            <h4>📖 Concept Explanation</h4>
            <p>${lesson.explanation}</p>

            <h4>💡 Real-World Example</h4>
            <p class="example-box">${lesson.example}</p>

            <div class="challenge-box">
                <h4>🎯 Mini Challenge</h4>
                <p>${lesson.challenge.question}</p>
                <div class="challenge-options">
                    ${lesson.challenge.options.map((opt, oIdx) => `
                        <button class="challenge-btn" data-oidx="${oIdx}">${opt}</button>
                    `).join('')}
                </div>
                <div id="challenge-feedback" class="feedback-msg"></div>
            </div>
        </div>
    `;

    // Nav Listeners
    UI.elements.learnTopicsNav.querySelectorAll(".topic-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            UI.activeLearnTopicIndex = parseInt(btn.dataset.idx) || 0;
            renderLearnHub();
        });
    });

    // Challenge Listeners
    UI.elements.learnTopicCard.querySelectorAll(".challenge-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = parseInt(btn.dataset.oidx);
            const feedbackEl = document.getElementById("challenge-feedback");
            if (chosen === lesson.challenge.correctIndex) {
                btn.classList.add("correct");
                if (feedbackEl) {
                    feedbackEl.textContent = "🎉 " + lesson.challenge.feedback;
                    feedbackEl.className = "feedback-msg success";
                }
                playSound("click");
            } else {
                btn.classList.add("wrong");
                if (feedbackEl) {
                    feedbackEl.textContent = "❌ Try again!";
                    feedbackEl.className = "feedback-msg error";
                }
            }
        });
    });
}

/* =========================================================
   BOSS BATTLES UI
   ========================================================= */

function renderBossesGrid() {
    if (!UI.elements.bossGrid) return;
    UI.elements.bossGrid.innerHTML = BOSSES.map(boss => `
        <div class="boss-card">
            <div class="boss-header">
                <span class="boss-icon">${boss.icon}</span>
                <div>
                    <h3>${boss.name}</h3>
                    <span class="boss-title">${boss.title}</span>
                </div>
            </div>
            <p class="boss-quote">"${boss.quote}"</p>
            <div class="boss-meta">
                <span>💪 Strength: ${boss.strength}</span>
                <span>🎯 Weakness: ${boss.weakness}</span>
            </div>
            <button class="primary-btn btn-fight-boss" data-bossid="${boss.id}">
                ⚔️ CHALLENGE BOSS
            </button>
        </div>
    `).join('');

    UI.elements.bossGrid.querySelectorAll(".btn-fight-boss").forEach(btn => {
        btn.addEventListener("click", () => {
            const boss = BOSSES.find(b => b.id === btn.dataset.bossid);
            if (boss) {
                EduStrategistGame.setupMultiplayerGame([
                    { name: "Player 1", avatar: "🦁", color: "#00f0ff", isAI: false },
                    { name: boss.name, avatar: boss.icon, color: "#ff007f", isAI: true, personality: boss.personality }
                ], "boss_battle", boss);
            }
        });
    });
}

/* =========================================================
   PROFILE & ACHIEVEMENTS DASHBOARD UI
   ========================================================= */

function renderProfileDashboard() {
    const gameState = EduStrategistGame.getState();

    if (UI.elements.statWinStreak) UI.elements.statWinStreak.textContent = gameState.streaks.winStreak || 0;
    if (UI.elements.statPredStreak) UI.elements.statPredStreak.textContent = gameState.streaks.predictionStreak || 0;
    if (UI.elements.statBestStreak) UI.elements.statBestStreak.textContent = gameState.streaks.bestStreak || 0;

    const data = EduStrategistGame.getLeaderboard();
    const unlocked = (data && data.achievements) ? data.achievements : ["first_win"];

    if (UI.elements.achievementsGrid) {
        UI.elements.achievementsGrid.innerHTML = ACHIEVEMENTS.map(badge => {
            const isUnlocked = unlocked.includes(badge.id);
            return `
                <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                    <span class="badge-icon">${badge.icon}</span>
                    <strong>${badge.name}</strong>
                    <small>${badge.description}</small>
                </div>
            `;
        }).join('');
    }
}

/* =========================================================
   LEADERBOARD & UTILITIES
   ========================================================= */

function renderLeaderboard() {
    if (!UI.elements.leaderboardList) return;
    const history = EduStrategistGame.getLeaderboard();
    if (!history || history.length === 0) {
        UI.elements.leaderboardList.innerHTML = `<p class="empty-msg">No game history recorded yet.</p>`;
        return;
    }

    UI.elements.leaderboardList.innerHTML = history.map((rec, idx) => `
        <div class="leaderboard-item">
            <div class="item-rank">#${idx + 1}</div>
            <div class="item-details">
                <strong>${rec.winner || 'Player'} Won</strong>
                <small>${rec.date} • Mode: ${rec.mode || 'Classic'}</small>
                <div class="scores-summary">${rec.scores || ''}</div>
            </div>
        </div>
    `).join('');
}

function showScreen(screenKey) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screenMap = {
        mainMenu: UI.elements.mainMenuScreen,
        setup: UI.elements.setupScreen,
        game: UI.elements.gameScreen,
        thinking: UI.elements.thinkingScreen,
        result: UI.elements.resultScreen,
        final: UI.elements.finalScreen,
        learn: UI.elements.learnScreen,
        modes: UI.elements.modesScreen,
        profile: UI.elements.profileScreen,
        howToPlay: UI.elements.howToPlayScreen,
        leaderboard: UI.elements.leaderboardScreen,
        settings: UI.elements.settingsScreen
    };

    if (screenMap[screenKey]) {
        screenMap[screenKey].classList.add("active");
    }
}

function showToast(message) {
    if (!UI.elements.toast || !UI.elements.toastMessage) return;
    UI.elements.toastMessage.textContent = message;
    UI.elements.toast.classList.add("active");
    if (UI.toastTimeout) clearTimeout(UI.toastTimeout);
    UI.toastTimeout = setTimeout(() => {
        UI.elements.toast.classList.remove("active");
    }, 3000);
}

function openModal(title, message, onConfirm) {
    if (!UI.elements.modal) return;
    if (UI.elements.modalTitle) UI.elements.modalTitle.textContent = title;
    if (UI.elements.modalMessage) UI.elements.modalMessage.textContent = message;
    UI.modalConfirmAction = onConfirm;

    if (UI.elements.modalCancel) {
        UI.elements.modalCancel.onclick = () => UI.elements.modal.classList.remove("active");
    }
    if (UI.elements.modalConfirm) {
        UI.elements.modalConfirm.onclick = () => {
            UI.elements.modal.classList.remove("active");
            if (typeof UI.modalConfirmAction === "function") UI.modalConfirmAction();
        };
    }

    UI.elements.modal.classList.add("active");
}

function playSound(type) {
    try {
        if (!UI.audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) UI.audioContext = new AudioCtx();
        }
        if (!UI.audioContext) return;

        const osc = UI.audioContext.createOscillator();
        const gain = UI.audioContext.createGain();
        osc.connect(gain);
        gain.connect(UI.audioContext.destination);

        const now = UI.audioContext.currentTime;
        if (type === "click" || type === "select") {
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "tick") {
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (e) { }
}

initializeUI();