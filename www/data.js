/* =========================================================
EDUSTRATEGIST
Game Data + AI Logic
========================================================= */


/* =========================================================
STRATEGIES
========================================================= */

const STRATEGIES = {

    INVEST: {
        id: "invest",
        name: "INVEST",
        icon: "↗",
        description: "Take a calculated risk for higher rewards."
    },

    ATTACK: {
        id: "attack",
        name: "ATTACK",
        icon: "⚔",
        description: "Exploit an opportunity aggressively."
    },

    COOPERATE: {
        id: "cooperate",
        name: "COOPERATE",
        icon: "◎",
        description: "Build a mutually beneficial outcome."
    },

    DEFEND: {
        id: "defend",
        name: "DEFEND",
        icon: "◇",
        description: "Reduce risk and protect your position."
    }

};


/* =========================================================
DIFFICULTIES
========================================================= */

const AI_DIFFICULTY = {

    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"

};


/* =========================================================
SCENARIOS
========================================================= */

const SCENARIOS = [

    {
        id: 1,

        category: "RESOURCE WAR",

        concept: "PAYOFF",

        title: "The Limited Resources",

        description:
            "You and a competing team are developing projects using a limited pool of resources. You must decide how aggressively to use your resources before knowing what your opponent will do.",

        strategies: {

            invest: {
                invest: [7, 7],
                attack: [9, 2],
                cooperate: [8, 6],
                defend: [5, 8]
            },

            attack: {
                invest: [2, 9],
                attack: [4, 4],
                cooperate: [7, 3],
                defend: [8, 2]
            },

            cooperate: {
                invest: [6, 8],
                attack: [3, 7],
                cooperate: [8, 8],
                defend: [6, 5]
            },

            defend: {
                invest: [8, 5],
                attack: [2, 8],
                cooperate: [5, 6],
                defend: [6, 6]
            }

        },

        insight:
            "A payoff is the reward or consequence associated with a combination of decisions. The best choice depends on what you expect your opponent to do.",

        gameTheory:
            "Payoff Matrix"
    },


    {
        id: 2,

        category: "STARTUP BATTLE",

        concept: "RISK & REWARD",

        title: "Launch or Wait?",

        description:
            "Your startup is ready to launch a new product. A rival company is preparing a competing product. Launching early could give you a major advantage, but waiting reduces your risk.",

        strategies: {

            invest: {
                invest: [9, 6],
                attack: [8, 3],
                cooperate: [7, 7],
                defend: [4, 8]
            },

            attack: {
                invest: [3, 8],
                attack: [5, 5],
                cooperate: [8, 2],
                defend: [9, 3]
            },

            cooperate: {
                invest: [7, 7],
                attack: [2, 8],
                cooperate: [8, 8],
                defend: [6, 6]
            },

            defend: {
                invest: [8, 4],
                attack: [3, 9],
                cooperate: [6, 6],
                defend: [7, 7]
            }

        },

        insight:
            "High-risk strategies can generate large rewards, but they become dangerous when the opponent chooses an aggressive response.",

        gameTheory:
            "Risk & Reward"
    },


    {
        id: 3,

        category: "MARKET COMPETITION",

        concept: "DOMINANT STRATEGY",

        title: "The Price War",

        description:
            "Two companies control most of a market. You must decide whether to invest, attack your rival's position, cooperate, or defend your current market share.",

        strategies: {

            invest: {
                invest: [6, 6],
                attack: [8, 3],
                cooperate: [7, 7],
                defend: [5, 8]
            },

            attack: {
                invest: [3, 8],
                attack: [5, 5],
                cooperate: [9, 2],
                defend: [8, 3]
            },

            cooperate: {
                invest: [7, 7],
                attack: [2, 9],
                cooperate: [8, 8],
                defend: [6, 6]
            },

            defend: {
                invest: [8, 5],
                attack: [3, 8],
                cooperate: [6, 6],
                defend: [7, 7]
            }

        },

        insight:
            "A dominant strategy remains attractive regardless of what the opponent chooses. Identifying one can simplify a strategic decision.",

        gameTheory:
            "Dominant Strategy"
    },


    {
        id: 4,

        category: "TEAM STRATEGY",

        concept: "OPPONENT PREDICTION",

        title: "The Tournament",

        description:
            "You are competing against another team in a high-pressure tournament. Your opponent has already shown a preference for certain strategies. Can you predict their next move?",

        strategies: {

            invest: {
                invest: [7, 7],
                attack: [9, 3],
                cooperate: [8, 6],
                defend: [5, 8]
            },

            attack: {
                invest: [3, 9],
                attack: [4, 4],
                cooperate: [8, 2],
                defend: [9, 3]
            },

            cooperate: {
                invest: [6, 8],
                attack: [2, 8],
                cooperate: [8, 8],
                defend: [6, 6]
            },

            defend: {
                invest: [8, 5],
                attack: [3, 9],
                cooperate: [6, 6],
                defend: [7, 7]
            }

        },

        insight:
            "Previous behavior provides information. Predicting an opponent becomes easier when you identify patterns instead of treating every decision as random.",

        gameTheory:
            "Opponent Prediction"
    },


    {
        id: 5,

        category: "NEGOTIATION",

        concept: "NASH EQUILIBRIUM",

        title: "The Negotiation Table",

        description:
            "You are negotiating a partnership with another organization. Both sides want the best possible outcome, but changing your strategy alone could make your position worse.",

        strategies: {

            invest: {
                invest: [7, 7],
                attack: [8, 3],
                cooperate: [9, 6],
                defend: [5, 8]
            },

            attack: {
                invest: [3, 8],
                attack: [5, 5],
                cooperate: [9, 2],
                defend: [8, 3]
            },

            cooperate: {
                invest: [6, 9],
                attack: [2, 9],
                cooperate: [8, 8],
                defend: [6, 6]
            },

            defend: {
                invest: [8, 5],
                attack: [3, 8],
                cooperate: [6, 6],
                defend: [7, 7]
            }

        },

        insight:
            "A Nash equilibrium occurs when neither player benefits from changing their strategy alone.",

        gameTheory:
            "Nash Equilibrium"
    },


    {
        id: 6,

        category: "CYBER DEFENSE",

        concept: "RISK MANAGEMENT",

        title: "The Security Breach",

        description:
            "Your organization detects suspicious activity in its network. You can aggressively counter the threat, invest in stronger security, cooperate with another team, or defend your existing infrastructure.",

        strategies: {

            invest: {
                invest: [8, 6],
                attack: [7, 4],
                cooperate: [8, 7],
                defend: [6, 8]
            },

            attack: {
                invest: [4, 7],
                attack: [5, 5],
                cooperate: [8, 3],
                defend: [9, 2]
            },

            cooperate: {
                invest: [7, 8],
                attack: [3, 8],
                cooperate: [9, 9],
                defend: [7, 6]
            },

            defend: {
                invest: [8, 6],
                attack: [2, 9],
                cooperate: [6, 7],
                defend: [7, 7]
            }

        },

        insight:
            "Good risk management means balancing potential gains against the consequences of failure.",

        gameTheory:
            "Risk Management"
    },


    {
        id: 7,

        category: "RESOURCE ALLOCATION",

        concept: "STRATEGIC ADAPTATION",

        title: "The Energy Crisis",

        description:
            "A sudden energy shortage forces you to make difficult decisions. Your opponent is competing for the same limited resources. Adapt your strategy based on the changing situation.",

        strategies: {

            invest: {
                invest: [6, 6],
                attack: [9, 2],
                cooperate: [8, 7],
                defend: [5, 8]
            },

            attack: {
                invest: [2, 9],
                attack: [4, 4],
                cooperate: [8, 3],
                defend: [9, 2]
            },

            cooperate: {
                invest: [7, 8],
                attack: [3, 8],
                cooperate: [9, 9],
                defend: [7, 6]
            },

            defend: {
                invest: [8, 5],
                attack: [2, 9],
                cooperate: [6, 7],
                defend: [7, 7]
            }

        },

        insight:
            "A strategy that worked previously may become ineffective when circumstances change. Strong players continuously adapt.",

        gameTheory:
            "Strategic Adaptation"
    },


    {
        id: 8,

        category: "FINAL CHALLENGE",

        concept: "MIXED STRATEGIES",

        title: "The Unpredictable Rival",

        description:
            "Your opponent has become difficult to predict. Repeating the same strategy makes you vulnerable. Your final challenge is to keep your decisions unpredictable.",

        strategies: {

            invest: {
                invest: [7, 7],
                attack: [8, 3],
                cooperate: [7, 8],
                defend: [5, 8]
            },

            attack: {
                invest: [3, 8],
                attack: [5, 5],
                cooperate: [9, 2],
                defend: [8, 3]
            },

            cooperate: {
                invest: [8, 7],
                attack: [2, 9],
                cooperate: [8, 8],
                defend: [6, 7]
            },

            defend: {
                invest: [8, 5],
                attack: [3, 8],
                cooperate: [7, 6],
                defend: [7, 7]
            }

        },

        insight:
            "Mixed strategies make your behavior harder to predict. Sometimes the strongest strategy is to avoid becoming predictable.",

        gameTheory:
            "Mixed Strategies"
    }

];


/* =========================================================
BASIC DATA HELPERS
========================================================= */

function getAllStrategies() {

    return Object.values(STRATEGIES);

}


function getScenarioById(id) {

    return SCENARIOS.find(
        scenario => scenario.id === id
    );

}


function getRandomScenario(usedIds = []) {

    const available =
        SCENARIOS.filter(
            scenario =>
                !usedIds.includes(
                    scenario.id
                )
        );

    if (available.length === 0) {

        return SCENARIOS[
            Math.floor(
                Math.random() *
                SCENARIOS.length
            )
        ];

    }

    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];

}


/* =========================================================
PAYOFF
========================================================= */

function getPayoff(
    scenario,
    playerStrategy,
    aiStrategy
) {

    if (
        !scenario ||
        !scenario.strategies ||
        !scenario.strategies[playerStrategy]
    ) {

        return {
            player: 0,
            ai: 0
        };

    }

    const result =
        scenario.strategies[playerStrategy][
            aiStrategy
        ];

    if (!result) {

        return {
            player: 0,
            ai: 0
        };

    }

    return {
        player: Number(result[0]),
        ai: Number(result[1])
    };

}


/* =========================================================
AI DECISION
========================================================= */

function getAIDecision(
    scenario,
    difficulty,
    playerHistory = [],
    scoreInfo = {}
) {

    /*
     * IMPORTANT:
     * Always use strategy IDs.
     *
     * This produces:
     * invest
     * attack
     * cooperate
     * defend
     *
     * which exactly matches the payoff matrix.
     */

    const strategies =
        Object.values(STRATEGIES).map(
            strategy => strategy.id
        );


    if (!scenario) {

        return STRATEGIES.DEFEND.id;

    }


    /* =====================================================
       EASY
       ===================================================== */

    if (
        difficulty ===
        AI_DIFFICULTY.EASY
    ) {

        return weightedRandom({

            invest: 25,
            attack: 25,
            cooperate: 25,
            defend: 25

        });

    }


    /* =====================================================
       MEDIUM
       ===================================================== */

    if (
        difficulty ===
        AI_DIFFICULTY.MEDIUM
    ) {

        if (
            playerHistory.length === 0
        ) {

            return randomChoice(
                strategies
            );

        }

        const counts =
            countStrategies(
                playerHistory
            );

        const mostUsed =
            Object.entries(counts)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )[0][0];


        /*
         * Counter the player's
         * most frequently used strategy.
         */

        if (
            Math.random() < 0.65
        ) {

            return counterStrategy(
                mostUsed
            );

        }

        return randomChoice(
            strategies
        );

    }


    /* =====================================================
       HARD
       ===================================================== */

    if (
        difficulty ===
        AI_DIFFICULTY.HARD
    ) {

        return calculateHardAIDecision(
            scenario,
            playerHistory,
            scoreInfo
        );

    }


    return randomChoice(
        strategies
    );

}


/* =========================================================
HARD AI
========================================================= */

function calculateHardAIDecision(
    scenario,
    playerHistory,
    scoreInfo
) {

    /*
     * IMPORTANT:
     * Use lowercase strategy IDs.
     */

    const strategies =
        Object.values(STRATEGIES).map(
            strategy => strategy.id
        );


    const playerScore =
        Number(
            scoreInfo.player || 0
        );

    const aiScore =
        Number(
            scoreInfo.ai || 0
        );


    /* =====================================================
       PREDICT PLAYER
       ===================================================== */

    let predictedPlayer =
        predictPlayerStrategy(
            playerHistory
        );


    if (!predictedPlayer) {

        predictedPlayer =
            randomChoice(
                strategies
            );

    }


    /* =====================================================
       EVALUATE AI RESPONSES
       ===================================================== */

    const candidates = [];


    for (
        const aiStrategy
        of strategies
    ) {

        const payoff =
            getPayoff(
                scenario,
                predictedPlayer,
                aiStrategy
            );


        candidates.push({

            strategy:
                aiStrategy,

            playerPayoff:
                payoff.player,

            aiPayoff:
                payoff.ai,

            difference:
                payoff.ai -
                payoff.player

        });

    }


    /* =====================================================
       STRATEGIC SCORING
       ===================================================== */

    candidates.forEach(
        candidate => {

            let strategicScore =
                candidate.aiPayoff;


            /*
             * Reward winning outcomes.
             */

            if (
                candidate.aiPayoff >
                candidate.playerPayoff
            ) {

                strategicScore += 5;

            }


            /*
             * Penalize draws.
             */

            if (
                candidate.aiPayoff ===
                candidate.playerPayoff
            ) {

                strategicScore -= 2;

            }


            /*
             * Penalize losing outcomes.
             */

            if (
                candidate.aiPayoff <
                candidate.playerPayoff
            ) {

                strategicScore -= 4;

            }


            candidate.strategicScore =
                strategicScore;

        }
    );


    /* =====================================================
       AI LOSING
       Become more aggressive.
       ===================================================== */

    if (
        playerScore -
        aiScore >= 8
    ) {

        candidates.forEach(
            candidate => {

                if (
                    candidate.strategy ===
                    STRATEGIES.ATTACK.id
                ) {

                    candidate.strategicScore += 3;

                }

                if (
                    candidate.strategy ===
                    STRATEGIES.INVEST.id
                ) {

                    candidate.strategicScore += 2;

                }

            }
        );

    }


    /* =====================================================
       AI WINNING
       Play safer.
       ===================================================== */

    if (
        aiScore -
        playerScore >= 8
    ) {

        candidates.forEach(
            candidate => {

                if (
                    candidate.strategy ===
                    STRATEGIES.DEFEND.id
                ) {

                    candidate.strategicScore += 3;

                }

                if (
                    candidate.strategy ===
                    STRATEGIES.ATTACK.id
                ) {

                    candidate.strategicScore -= 1;

                }

            }
        );

    }


    /* =====================================================
       AVOID REPETITION
       ===================================================== */

    if (
        playerHistory.length >= 2
    ) {

        const lastPlayerStrategy =
            playerHistory[
                playerHistory.length - 1
            ];

        /*
         * If the player repeatedly
         * uses one strategy, counter it.
         */

        const counter =
            counterStrategy(
                lastPlayerStrategy
            );

        const counterCandidate =
            candidates.find(
                candidate =>
                    candidate.strategy ===
                    counter
            );

        if (counterCandidate) {

            counterCandidate.strategicScore += 2;

        }

    }


    /* =====================================================
       SORT BEST DECISIONS
       ===================================================== */

    candidates.sort(
        (a, b) =>
            b.strategicScore -
            a.strategicScore
    );


    /* =====================================================
       SMALL UNPREDICTABILITY
       ===================================================== */

    if (
        Math.random() < 0.12
    ) {

        return randomChoice(
            strategies
        );

    }


    /*
     * Pick from the strongest candidates.
     * This prevents the AI from being
     * completely deterministic.
     */

    const bestScore =
        candidates[0].strategicScore;


    const strongCandidates =
        candidates.filter(
            candidate =>
                candidate.strategicScore >=
                bestScore - 2
        );


    return strongCandidates[
        Math.floor(
            Math.random() *
            strongCandidates.length
        )
    ].strategy;

}


/* =========================================================
PLAYER PREDICTION
========================================================= */

function predictPlayerStrategy(
    history
) {

    if (
        !history ||
        history.length === 0
    ) {

        return null;

    }


    const counts =
        countStrategies(
            history
        );


    /*
     * Recent choices have more weight.
     */

    const recent =
        history.slice(-3);


    const recentCounts =
        countStrategies(
            recent
        );


    const scores = {};


    Object.keys(
        STRATEGIES
    ).forEach(
        strategy => {

            const id =
                STRATEGIES[
                    strategy
                ].id;


            scores[id] =
                (counts[id] || 0) +
                (
                    (recentCounts[id] || 0) *
                    1.5
                );

        }
    );


    return Object.entries(
        scores
    )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )[0][0];

}


/* =========================================================
STRATEGY COUNTER
========================================================= */

function counterStrategy(
    strategy
) {

    switch (strategy) {

        case "invest":
            return "defend";

        case "attack":
            return "defend";

        case "cooperate":
            return "attack";

        case "defend":
            return "invest";

        default:
            return "defend";

    }

}


/* =========================================================
RANDOM HELPERS
========================================================= */

function randomChoice(
    array
) {

    if (
        !array ||
        array.length === 0
    ) {

        return STRATEGIES.DEFEND.id;

    }

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function weightedRandom(
    weights
) {

    const entries =
        Object.entries(
            weights
        );


    const total =
        entries.reduce(
            (sum, [, weight]) =>
                sum + weight,
            0
        );


    let random =
        Math.random() *
        total;


    for (
        const [item, weight]
        of entries
    ) {

        random -= weight;


        if (
            random <= 0
        ) {

            return item;

        }

    }


    return entries[
        entries.length - 1
    ][0];

}


/* =========================================================
COUNT STRATEGIES
========================================================= */

function countStrategies(
    history
) {

    const counts = {

        invest: 0,
        attack: 0,
        cooperate: 0,
        defend: 0

    };


    if (
        !Array.isArray(history)
    ) {

        return counts;

    }


    history.forEach(
        strategy => {

            if (
                Object.prototype.hasOwnProperty.call(
                    counts,
                    strategy
                )
            ) {

                counts[strategy]++;

            }

        }
    );


    return counts;

}


/* =========================================================
RANDOM SCENARIO SELECTION
========================================================= */

function getGameScenarios(
    totalRounds = 5
) {

    /*
     * Shuffle all scenarios.
     * The game then uses the first
     * TOTAL_ROUNDS scenarios.
     */

    const shuffled =
        [...SCENARIOS]
            .sort(
                () =>
                    Math.random() - 0.5
            );


    return shuffled.slice(
        0,
        Math.min(
            totalRounds,
            SCENARIOS.length
        )
    );

}