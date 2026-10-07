/* =========================================================
EDUSTRATEGIST
Main Game Engine
========================================================= */

/* =========================================================
CONFIGURATION
========================================================= */

const GAME_CONFIG = {


TOTAL_ROUNDS: 5,

ROUND_TIME: 15,

AI_THINKING_TIME: 900,

COMEBACK_THRESHOLD: 8,

STORAGE_KEY: "edustrategist_data",

LEADERBOARD_LIMIT: 10


};

/* =========================================================
GAME STATE
========================================================= */

const GAME = {


phase: "idle",

playerName: "",

difficulty: AI_DIFFICULTY.MEDIUM,

round: 0,

totalRounds: GAME_CONFIG.TOTAL_ROUNDS,

playerScore: 0,

aiScore: 0,

scenarios: [],

currentScenario: null,

playerHistory: [],

aiHistory: [],

roundResults: [],

conceptsLearned: [],

performance: {

    prediction: 0,

    adaptability: 0,

    risk: 0,

    decision: 0,

    overall: 0

},

comebackRound: false,

timer: null,

aiTimeout: null,

gameStarted: false


};

/* =========================================================
INITIALIZATION
========================================================= */

function initializeGame() {


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof initializeUI === "function"
        ) {

            initializeUI();

        }

        loadSavedPlayer();

    }
);


}

function loadSavedPlayer() {


const saved =
    getStoredData();

if (
    saved &&
    saved.playerName &&
    UI.elements.playerName
) {

    UI.elements.playerName.value =
        saved.playerName;

}


}

/* =========================================================
START GAME
========================================================= */

function startGame(playerName) {


if (
    !playerName ||
    !playerName.trim()
) {

    showToast("Please enter your name.");

    return;

}


clearTimers();

const cleanName =
    playerName.trim().slice(0, 20);


GAME.phase = "idle";

GAME.playerName = cleanName;

GAME.round = 0;

GAME.playerScore = 0;

GAME.aiScore = 0;

GAME.playerHistory = [];

GAME.aiHistory = [];

GAME.roundResults = [];

GAME.conceptsLearned = [];

GAME.currentScenario = null;

GAME.comebackRound = false;

GAME.gameStarted = true;


GAME.performance = {

    prediction: 0,

    adaptability: 0,

    risk: 0,

    decision: 0,

    overall: 0

};


GAME.scenarios =
    getGameScenarios(
        GAME.totalRounds
    );


saveStoredData({

    playerName: GAME.playerName,

    difficulty: GAME.difficulty

});


UI.selectedStrategy = null;


showScreen("game");


startNextRound();


}

/* =========================================================
NEXT ROUND
========================================================= */

function startNextRound() {

    clearTimers();

    if (GAME.round >= GAME.totalRounds) {
        finishGame();
        return;
    }

    showScreen("game");

    GAME.phase = "choosing";

    GAME.round++;

    GAME.currentScenario =
        GAME.scenarios[GAME.round - 1];

    GAME.comebackRound = false;

    checkComebackRound();

    UI.selectedStrategy = null;

    updateGameUI(
        GAME.currentScenario,
        GAME.round,
        GAME.totalRounds,
        GAME.playerScore,
        GAME.aiScore
    );

    enableStrategySelection();

    startGameTimer();
}

/* =========================================================
COMEBACK
========================================================= */

function checkComebackRound() {


if (GAME.round <= 1) {

    return false;

}

const difference =
    GAME.aiScore -
    GAME.playerScore;

return (
    difference >=
    GAME_CONFIG.COMEBACK_THRESHOLD
);


}

/* =========================================================
TIMER
========================================================= */

function startGameTimer() {


stopGameTimer();


let remaining =
    GAME_CONFIG.ROUND_TIME;


updateTimerDisplay(
    remaining
);


GAME.timer =
    setInterval(
        () => {

            /*
             * Ignore old timer callbacks.
             */

            if (
                GAME.phase !== "choosing"
            ) {

                stopGameTimer();

                return;

            }


            remaining--;


            updateTimerDisplay(
                remaining
            );


            if (
                remaining <= 5 &&
                remaining > 0
            ) {

                playGameSound("tick");

            }


            if (
                remaining <= 0
            ) {

                stopGameTimer();

                handleTimeout();

            }

        },
        1000
    );


}

function updateTimerDisplay(seconds) {


if (
    UI.elements.timer
) {

    UI.elements.timer.textContent =
        Math.max(0, seconds);

}


if (
    UI.elements.timerProgress
) {

    const percentage =
        Math.max(
            0,
            (seconds /
                GAME_CONFIG.ROUND_TIME) *
            100
        );

    UI.elements.timerProgress.style.width =
        `${percentage}%`;

}


}

function stopGameTimer() {


if (GAME.timer) {

    clearInterval(
        GAME.timer
    );

    GAME.timer = null;

}


}

function clearAITimeout() {


if (GAME.aiTimeout) {

    clearTimeout(
        GAME.aiTimeout
    );

    GAME.aiTimeout = null;

}


}

function clearTimers() {


stopGameTimer();

clearAITimeout();


}

/* =========================================================
PLAYER STRATEGY
========================================================= */

function submitPlayerStrategy(strategy) {


/*
 * This is the main anti-double-submit protection.
 */

if (
    GAME.phase !== "choosing"
) {

    return;

}


if (
    !strategy ||
    !STRATEGIES[strategy.toUpperCase()]
) {

    return;

}


if (!GAME.currentScenario) {

    return;

}


/*
 * Immediately change phase.
 *
 * Any additional clicks after this point are ignored.
 */

GAME.phase = "processing";


stopGameTimer();


disableStrategySelection();


UI.selectedStrategy =
    strategy;


GAME.playerHistory.push(
    strategy
);


playGameSound("select");


showAIThinking();


/*
 * AI is processed only once.
 */

clearAITimeout();


GAME.aiTimeout =
    setTimeout(
        () => {

            GAME.aiTimeout = null;


            if (
                GAME.phase !==
                "processing"
            ) {

                return;

            }


            processRound(
                strategy
            );

        },
        GAME_CONFIG.AI_THINKING_TIME
    );


}

/* =========================================================
TIMER TIMEOUT
========================================================= */

function handleTimeout() {


if (
    GAME.phase !== "choosing"
) {

    return;

}


GAME.phase = "processing";


disableStrategySelection();


/*
 * Timeout always defaults to DEFEND.
 */

const strategy =
    STRATEGIES.DEFEND.id;


UI.selectedStrategy =
    strategy;


GAME.playerHistory.push(
    strategy
);


showToast(
    "Time expired — DEFEND selected."
);


playGameSound("timeout");


showAIThinking();


clearAITimeout();


GAME.aiTimeout =
    setTimeout(
        () => {

            GAME.aiTimeout = null;


            if (
                GAME.phase !==
                "processing"
            ) {

                return;

            }


            processRound(
                strategy
            );

        },
        GAME_CONFIG.AI_THINKING_TIME
    );


}

/* =========================================================
PROCESS ROUND
========================================================= */

function processRound(
playerStrategy
) {


if (
    GAME.phase !== "processing"
) {

    return;

}


if (
    !GAME.currentScenario
) {

    GAME.phase = "idle";

    return;

}


/*
 * AI makes exactly one decision.
 */

const aiStrategy =
    getAIDecision(
        GAME.currentScenario,
        GAME.difficulty,
        GAME.playerHistory,
        {
            player: GAME.playerScore,
            ai: GAME.aiScore
        }
    );


GAME.aiHistory.push(
    aiStrategy
);


/*
 * Calculate payoff.
 */

const payoff =
    getPayoff(
        GAME.currentScenario,
        playerStrategy,
        aiStrategy
    );


const playerPoints =
    Math.max(
        0,
        Number(payoff.player || 0)
    );


const aiPoints =
    Math.max(
        0,
        Number(payoff.ai || 0)
    );


/*
 * Comeback bonus.
 */

let comebackBonus = 0;


if (
    GAME.comebackRound &&
    playerPoints > aiPoints
) {

    comebackBonus = 2;

}


const finalPlayerPoints =
    playerPoints +
    comebackBonus;


/*
 * Update total scores.
 */

GAME.playerScore +=
    finalPlayerPoints;


GAME.aiScore +=
    aiPoints;


/*
 * Determine round winner.
 */

let winner = "draw";


if (
    finalPlayerPoints >
    aiPoints
) {

    winner = "player";

} else if (
    aiPoints >
    finalPlayerPoints
) {

    winner = "ai";

}


/*
 * Strategic insight.
 */

const insight =
    generateRoundInsight(
        GAME.currentScenario,
        playerStrategy,
        aiStrategy,
        winner
    );


const result = {

    round: GAME.round,

    scenario:
        GAME.currentScenario.title,

    concept:
        GAME.currentScenario.gameTheory,

    playerStrategy,

    aiStrategy,

    playerPoints:
        finalPlayerPoints,

    aiPoints,

    basePlayerPoints:
        playerPoints,

    comebackBonus,

    winner,

    insight

};


GAME.roundResults.push(
    result
);


/*
 * Track concepts.
 */

const concept =
    GAME.currentScenario.gameTheory;


if (
    concept &&
    !GAME.conceptsLearned.includes(
        concept
    )
) {

    GAME.conceptsLearned.push(
        concept
    );

}


/*
 * Update performance.
 */

updatePerformance();


/*
 * Save progress.
 */

saveStoredData({

    playerName:
        GAME.playerName,

    difficulty:
        GAME.difficulty,

    lastScore:
        GAME.playerScore

});


GAME.phase = "result";


hideAIThinking();


showRoundResult({

    ...result,

    playerScore:
        GAME.playerScore,

    aiScore:
        GAME.aiScore

});


}

/* =========================================================
ROUND INSIGHT
========================================================= */

function generateRoundInsight(
scenario,
playerStrategy,
aiStrategy,
winner
) {


if (
    winner === "player"
) {

    return (
        scenario.insight ||
        "Your decision produced a stronger payoff than the AI's."
    );

}


if (
    winner === "ai"
) {

    return (
        `The AI used ${formatStrategy(aiStrategy)} effectively. ` +
        `Consider how the opponent's decision affected your payoff.`
    );

}


return (
    "Both strategies produced a similar outcome. " +
    "The next round may require a different approach."
);


}

/* =========================================================
PERFORMANCE
========================================================= */

function updatePerformance() {


const rounds =
    GAME.roundResults.length;


if (rounds === 0) {

    return;

}


/*
 * Prediction
 *
 * Measures how often the player chooses a strategy
 * that beats the AI's strategy in the current matrix.
 */

let predictionWins = 0;


GAME.roundResults.forEach(
    result => {

        if (
            result.playerPoints >
            result.aiPoints
        ) {

            predictionWins++;

        }

    }
);


GAME.performance.prediction =
    Math.round(
        (
            predictionWins /
            rounds
        ) * 100
    );


/*
 * Adaptability
 *
 * Rewards changing strategy after an unsuccessful
 * round and maintaining strong performance.
 */

if (rounds <= 1) {

    GAME.performance.adaptability = 50;

} else {

    let adaptationScore = 50;

    for (
        let i = 1;
        i < GAME.roundResults.length;
        i++
    ) {

        const previous =
            GAME.roundResults[i - 1];

        const current =
            GAME.roundResults[i];


        if (
            previous.winner === "ai" &&
            current.playerPoints >=
            current.aiPoints
        ) {

            adaptationScore += 12;

        }


        if (
            previous.winner === "player" &&
            current.playerStrategy !==
            previous.playerStrategy
        ) {

            adaptationScore += 5;

        }

    }


    GAME.performance.adaptability =
        clamp(
            adaptationScore,
            0,
            100
        );

}


/*
 * Risk Management
 */

let riskScore = 50;


GAME.roundResults.forEach(
    result => {

        if (
            result.playerStrategy ===
            STRATEGIES.DEFEND.id
        ) {

            riskScore += 5;

        }

        if (
            result.playerStrategy ===
            STRATEGIES.INVEST.id &&
            result.playerPoints >= 7
        ) {

            riskScore += 7;

        }

        if (
            result.playerStrategy ===
            STRATEGIES.ATTACK.id &&
            result.playerPoints <= 3
        ) {

            riskScore -= 6;

        }

    }
);


GAME.performance.risk =
    clamp(
        riskScore,
        0,
        100
    );


/*
 * Decision Making
 */

const totalPlayerPoints =
    GAME.roundResults.reduce(
        (sum, result) =>
            sum + result.playerPoints,
        0
    );


const maximumPossible =
    rounds * 10;


GAME.performance.decision =
    Math.round(
        (
            totalPlayerPoints /
            maximumPossible
        ) * 100
    );


GAME.performance.decision =
    clamp(
        GAME.performance.decision,
        0,
        100
    );


/*
 * Overall performance
 */

GAME.performance.overall =
    Math.round(
        (
            GAME.performance.prediction +
            GAME.performance.adaptability +
            GAME.performance.risk +
            GAME.performance.decision
        ) / 4
    );


}

/* =========================================================
FINISH GAME
========================================================= */

function finishGame() {


clearTimers();


GAME.phase = "finished";


GAME.gameStarted = false;


GAME.performance.overall =
    Math.round(
        (
            GAME.performance.prediction +
            GAME.performance.adaptability +
            GAME.performance.risk +
            GAME.performance.decision
        ) / 4
    );


saveLeaderboard();


showFinalResult({

    playerName:
        GAME.playerName,

    playerScore:
        GAME.playerScore,

    aiScore:
        GAME.aiScore,

    performance:
        GAME.performance,

    conceptsLearned:
        GAME.conceptsLearned

});


}

/* =========================================================
LEADERBOARD
========================================================= */

function saveLeaderboard() {


const data =
    getStoredData();


const leaderboard =
    Array.isArray(
        data.leaderboard
    )
        ? data.leaderboard
        : [];


leaderboard.push({

    name:
        GAME.playerName,

    score:
        GAME.playerScore,

    difficulty:
        GAME.difficulty,

    winner:
        GAME.playerScore >
        GAME.aiScore
            ? "PLAYER"
            : GAME.playerScore <
              GAME.aiScore
                ? "AI"
                : "DRAW",

    performance:
        GAME.performance.overall,

    date:
        new Date().toISOString()

});


leaderboard.sort(
    (a, b) =>
        b.score - a.score
);


data.leaderboard =
    leaderboard.slice(
        0,
        GAME_CONFIG.LEADERBOARD_LIMIT
    );


localStorage.setItem(
    GAME_CONFIG.STORAGE_KEY,
    JSON.stringify(data)
);


}

/* =========================================================
STORAGE
========================================================= */

function getStoredData() {


try {

    const raw =
        localStorage.getItem(
            GAME_CONFIG.STORAGE_KEY
        );


    if (!raw) {

        return {};

    }


    return JSON.parse(raw) || {};

} catch (error) {

    console.warn(
        "EduStrategist storage error:",
        error
    );

    return {};

}


}

function saveStoredData(values = {}) {


const current =
    getStoredData();


const updated = {

    ...current,

    ...values

};


localStorage.setItem(
    GAME_CONFIG.STORAGE_KEY,
    JSON.stringify(updated)
);


}

function clearAllStoredData() {


localStorage.removeItem(
    GAME_CONFIG.STORAGE_KEY
);


}

/* =========================================================
LEADERBOARD DATA
========================================================= */

function getLeaderboard() {


const data =
    getStoredData();


return Array.isArray(
    data.leaderboard
)
    ? data.leaderboard
    : [];


}

function clearLeaderboard() {


const data =
    getStoredData();


data.leaderboard = [];


localStorage.setItem(
    GAME_CONFIG.STORAGE_KEY,
    JSON.stringify(data)
);


renderLeaderboard();


showToast(
    "Leaderboard cleared."
);


}

/* =========================================================
RESTART
========================================================= */

function restartGame() {


const name =
    GAME.playerName ||
    UI.elements.playerName?.value ||
    "";


clearTimers();


GAME.phase = "idle";


GAME.gameStarted = false;


UI.selectedStrategy = null;


startGame(name);


}

/* =========================================================
RETURN TO MENU
========================================================= */

function returnToMainMenu() {


clearTimers();


GAME.phase = "idle";


GAME.gameStarted = false;


GAME.currentScenario = null;


UI.selectedStrategy = null;


showScreen("mainMenu");


}

/* =========================================================
DIFFICULTY
========================================================= */

function setSelectedDifficulty(
difficulty
) {


if (
    !Object.values(
        AI_DIFFICULTY
    ).includes(difficulty)
) {

    return;

}


GAME.difficulty =
    difficulty;


}

/* =========================================================
STRATEGY SELECTION CONTROL
========================================================= */

function disableStrategySelection() {


if (
    UI.elements.strategyGrid
) {

    UI.elements.strategyGrid
        .querySelectorAll(
            ".strategy-card"
        )
        .forEach(
            card => {

                card.disabled = true;

            }
        );

}


/*
 * Correct ID:
 * btn-confirm-strategy
 */

if (
    UI.elements.confirmStrategyButton
) {

    UI.elements.confirmStrategyButton.disabled =
        true;

}


}

function enableStrategySelection() {


if (
    UI.elements.strategyGrid
) {

    UI.elements.strategyGrid
        .querySelectorAll(
            ".strategy-card"
        )
        .forEach(
            card => {

                card.disabled = false;

            }
        );

}


if (
    UI.elements.confirmStrategyButton
) {

    UI.elements.confirmStrategyButton.disabled =
        !UI.selectedStrategy;

}


}

/* =========================================================
HELPERS
========================================================= */

function formatStrategy(strategy) {


if (!strategy) {

    return "UNKNOWN";

}


return strategy
    .toString()
    .replace(
        /^./,
        letter =>
            letter.toUpperCase()
    );


}

function clamp(
value,
minimum,
maximum
) {


return Math.min(
    maximum,
    Math.max(
        minimum,
        Number(value) || 0
    )
);


}

/* =========================================================
AUDIO BRIDGE
========================================================= */

function playGameSound(type) {


/*
 * ui.js owns the actual Web Audio implementation.
 * This bridge keeps game.js independent.
 */

if (
    typeof playSound === "function"
) {

    playSound(type);

}


}

/* =========================================================
GLOBAL API
========================================================= */

window.EduStrategistGame = {


startGame,

submitPlayerStrategy,

nextRound: function () {

    if (
        GAME.phase !== "result"
    ) {

        return;

    }


    if (
        GAME.round >=
        GAME.totalRounds
    ) {

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

getState: function () {

    return GAME;

}


};

/* =========================================================
START INITIALIZATION
========================================================= */

initializeGame();
