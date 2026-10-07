/* =========================================================
   EDUSTRATEGIST - Expanded Game Data & AI Logic Engine
   ========================================================= */

/* =========================================================
   STRATEGIES
   ========================================================= */

const STRATEGIES = {
    INVEST: {
        id: "invest",
        name: "INVEST",
        icon: "↗",
        description: "Take a calculated risk for higher rewards.",
        risk: "High",
        reward: "High",
        advantage: "Multiplies gains when opponent cooperates or invests.",
        weakness: "Vulnerable to heavy defensive counter-attacks."
    },
    ATTACK: {
        id: "attack",
        name: "ATTACK",
        icon: "⚔",
        description: "Exploit an opportunity aggressively.",
        risk: "Very High",
        reward: "Maximum (against Cooperate)",
        advantage: "Destroys peaceful choices and claims dominant payoff.",
        weakness: "Heavy mutual losses if met with Defend or Attack."
    },
    COOPERATE: {
        id: "cooperate",
        name: "COOPERATE",
        icon: "◎",
        description: "Build a mutually beneficial outcome.",
        risk: "Moderate",
        reward: "Balanced High",
        advantage: "Maximizes combined group outcome when all players cooperate.",
        weakness: "Easily exploited by aggressive Attack/Defect moves."
    },
    DEFEND: {
        id: "defend",
        name: "DEFEND",
        icon: "◇",
        description: "Reduce risk and protect your position.",
        risk: "Low",
        reward: "Stable",
        advantage: "Blocks incoming aggressive attacks and preserves score.",
        weakness: "Misses out on major investment breakthroughs."
    },
    RISK: {
        id: "risk",
        name: "RISK",
        icon: "🎲",
        description: "High-stakes speculative gambit.",
        risk: "Extreme",
        reward: "Jackpot",
        advantage: "Can turn around a losing game in a single turn.",
        weakness: "Devastating score penalty if opponent counter-predicts."
    },
    DEFECT: {
        id: "defect",
        name: "DEFECT",
        icon: "⚡",
        description: "Break agreement for immediate selfish gain.",
        risk: "High",
        reward: "Immediate",
        advantage: "Protects you from betrayal while exploiting trust.",
        weakness: "Destroys long-term trust and invites retaliation."
    }
};

/* =========================================================
   AI DIFFICULTIES & PERSONALITIES
   ========================================================= */

const AI_DIFFICULTY = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
};

const AI_PERSONALITIES = {
    AGGRESSOR: {
        id: "aggressor",
        name: "Aggressor",
        icon: "⚔️",
        description: "Frequently chooses aggressive Attack and Defect strategies.",
        difficulty: "Hard",
        weights: { attack: 0.5, defect: 0.25, invest: 0.15, defend: 0.05, cooperate: 0.05 }
    },
    DEFENDER: {
        id: "defender",
        name: "Defender",
        icon: "🛡️",
        description: "Prefers defensive, risk-reducing strategies.",
        difficulty: "Medium",
        weights: { defend: 0.55, cooperate: 0.25, invest: 0.1, attack: 0.05, defect: 0.05 }
    },
    DIPLOMAT: {
        id: "diplomat",
        name: "Diplomat",
        icon: "🤝",
        description: "Seeks mutual cooperation; retaliates if betrayed.",
        difficulty: "Easy",
        weights: { cooperate: 0.6, invest: 0.2, defend: 0.1, attack: 0.05, defect: 0.05 }
    },
    ADAPTIVE: {
        id: "adaptive",
        name: "Adaptive",
        icon: "🧠",
        description: "Analyzes your historical decisions and adapts counter-moves.",
        difficulty: "Hard",
        weights: null // Dynamic
    },
    CHAOS: {
        id: "chaos",
        name: "Chaos",
        icon: "🎲",
        description: "Uses wild, completely unpredictable decisions.",
        difficulty: "Medium",
        weights: { attack: 0.2, defend: 0.2, cooperate: 0.2, invest: 0.2, risk: 0.1, defect: 0.1 }
    },
    MASTER: {
        id: "master",
        name: "Master AI",
        icon: "👑",
        description: "Uses advanced Game Theory minimax behavior and opponent pattern recognition.",
        difficulty: "Master",
        weights: null // Dynamic minimax
    }
};

/* =========================================================
   AVATARS & COLOR PALETTES
   ========================================================= */

const AVATARS = [
    { id: "lion", icon: "🦁", name: "Lion" },
    { id: "eagle", icon: "🦅", name: "Eagle" },
    { id: "owl", icon: "🦉", name: "Owl" },
    { id: "fox", icon: "🦊", name: "Fox" },
    { id: "wolf", icon: "🐺", name: "Wolf" },
    { id: "dragon", icon: "🐉", name: "Dragon" },
    { id: "robot", icon: "🤖", name: "Cyber AI" },
    { id: "wizard", icon: "🧙", name: "Strategist" }
];

const PLAYER_COLORS = [
    { name: "Cyan", hex: "#00f0ff" },
    { name: "Magenta", hex: "#ff007f" },
    { name: "Gold", hex: "#ffb700" },
    { name: "Emerald", hex: "#00e676" },
    { name: "Purple", hex: "#9c27b0" },
    { name: "Orange", hex: "#ff5722" }
];

/* =========================================================
   BOSS BATTLES
   ========================================================= */

const BOSSES = [
    {
        id: "boss_1",
        name: "General Ares",
        title: "BOSS 1 — THE AGGRESSOR",
        icon: "⚔️",
        personality: "aggressor",
        strength: "Relentless offense and high pressure",
        weakness: "Predictable aggressive choices, vulnerable to Defend",
        difficulty: "Hard",
        quote: "Offense is the only true defense! Show me your strength!"
    },
    {
        id: "boss_2",
        name: "Lord Machiavelli",
        title: "BOSS 2 — THE MANIPULATOR",
        icon: "🎭",
        personality: "adaptive",
        strength: "Detects pattern habits and exploits greed",
        weakness: "Can be baited by switching strategies abruptly",
        difficulty: "Expert",
        quote: "Your habits are transparent. Every decision is calculated."
    },
    {
        id: "boss_3",
        name: "Chameleon Core",
        title: "BOSS 3 — THE ADAPTIVE",
        icon: "🧬",
        personality: "adaptive",
        strength: "Shifts tactics dynamically every single round",
        weakness: "Vulnerable to high-risk counter-gambits",
        difficulty: "Expert",
        quote: "Adaptation is survival. I mutate faster than your plans."
    },
    {
        id: "boss_4",
        name: "Grandmaster Nash",
        title: "FINAL BOSS — THE MASTER",
        icon: "👑",
        personality: "master",
        strength: "Flawless game theory minimax & expected utility calculation",
        weakness: "Pure equilibrium focus — punishable by mixed strategies",
        difficulty: "Master",
        quote: "Equilibrium is inevitable. Let us test your strategic mind."
    }
];

/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const ACHIEVEMENTS = [
    { id: "first_win", name: "First Victory", icon: "🏆", description: "Win your first game." },
    { id: "mind_reader", name: "Mind Reader", icon: "🔮", description: "Predict the opponent correctly 5 times." },
    { id: "aggressor_win", name: "Aggressor", icon: "⚔️", description: "Win 5 rounds using aggressive strategies." },
    { id: "fortress", name: "Fortress", icon: "🛡️", description: "Successfully defend 10 times." },
    { id: "diplomat", name: "Diplomat", icon: "🤝", description: "Successfully cooperate multiple times." },
    { id: "unstoppable", name: "Unstoppable", icon: "🔥", description: "Achieve a 5-win streak." },
    { id: "master_strategist", name: "Master Strategist", icon: "🧠", description: "Score over 40 points in a single game." },
    { id: "grand_strategist", name: "Grand Strategist", icon: "👑", description: "Complete games across all game modes." }
];

/* =========================================================
   LEARN GAME THEORY LESSONS
   ========================================================= */

const LEARN_LESSONS = [
    {
        id: "nash_equilibrium",
        title: "1. Nash Equilibrium",
        subtitle: "Stability in Strategic Decisions",
        concept: "NASH EQUILIBRIUM",
        explanation: "A Nash Equilibrium occurs when no player has anything to gain by changing their strategy unilaterally. When both players choose their best response to the other's action, the outcome is stable.",
        example: "Two competing coffee shops set prices. If both charge $4, neither gains by raising or lowering their price alone.",
        challenge: {
            question: "In a 2-player price battle, if changing your strategy alone decreases your payoff, you are in a:",
            options: ["Zero-Sum Trap", "Nash Equilibrium", "Risk Gambit", "Defect Cycle"],
            correctIndex: 1,
            feedback: "Correct! That is the defining property of Nash Equilibrium."
        }
    },
    {
        id: "dominant_strategy",
        title: "2. Dominant Strategy",
        subtitle: "The Best Choice Regardless",
        concept: "DOMINANT STRATEGY",
        explanation: "A strategy is strictly dominant if it yields a higher payoff than any other strategy, regardless of what your opponent chooses to do.",
        example: "In a test with bonus points for submitting early, submitting early is always better no matter what classmates do.",
        challenge: {
            question: "What makes a strategy 'Dominant'?",
            options: ["It only works when the opponent agrees", "It yields the best payoff regardless of the opponent's move", "It guarantees zero risk", "It requires 4 players"],
            correctIndex: 1,
            feedback: "Spot on! A dominant strategy is always optimal regardless of your rival."
        }
    },
    {
        id: "prisoners_dilemma",
        title: "3. Prisoner's Dilemma",
        subtitle: "Individual Rationality vs Group Good",
        concept: "PRISONER'S DILEMMA",
        explanation: "A classic game theory paradox where two rational individuals acting in their own self-interest pursue Defect, leading to a worse outcome than if they had both Cooperated.",
        example: "Two rival nations spending billions on arms races instead of investing in education.",
        challenge: {
            question: "Why do players end up with lower payoffs in Prisoner's Dilemma?",
            options: ["They lack information", "Individual incentive to Defect overrides mutual Cooperation", "The payoffs are equal", "Timer runs out"],
            correctIndex: 1,
            feedback: "Exactly right! Mutual defection is the stable equilibrium, even though mutual cooperation yields a higher total payoff."
        }
    },
    {
        id: "payoff_matrix",
        title: "4. Payoff Matrix",
        subtitle: "Mapping Outcomes & Rewards",
        concept: "PAYOFF MATRIX",
        explanation: "A visual table representing all possible strategy combinations and their associated rewards or penalties for each player.",
        example: "Row player vs Column player grid displaying [Player 1 Payoff, Player 2 Payoff].",
        challenge: {
            question: "What does the first number in a payoff pair [8, 3] represent?",
            options: ["Player 2's score", "Player 1's payoff", "The round number", "The AI difficulty"],
            correctIndex: 1,
            feedback: "Correct! Payoff pairs are ordered [Row Player, Column Player]."
        }
    },
    {
        id: "risk_vs_reward",
        title: "5. Risk vs Reward",
        subtitle: "Balancing Aggression & Safety",
        concept: "RISK & REWARD",
        explanation: "High-reward strategies (like Attack or Invest) carry catastrophic downside if countered by an opponent, whereas low-risk moves (Defend) offer security at the cost of lower ceilings.",
        example: "Investing in volatile tech stocks vs holding government bonds.",
        challenge: {
            question: "Which strategy prioritizes maximum safety over high payoff?",
            options: ["ATTACK", "DEFEND", "RISK", "INVEST"],
            correctIndex: 1,
            feedback: "Correct! DEFEND minimizes downside risk."
        }
    }
];

/* =========================================================
   SCENARIOS (REAL-WORLD CATEGORIES)
   ========================================================= */

const SCENARIOS = [
    {
        id: 1,
        category: "RESOURCE WAR",
        concept: "PAYOFF",
        title: "The Limited Resources",
        description: "You and a competing team are developing projects using a limited pool of resources. Decide how aggressively to deploy resources.",
        strategies: {
            invest: { invest: [7, 7], attack: [9, 2], cooperate: [8, 6], defend: [5, 8], risk: [10, 1], defect: [9, 3] },
            attack: { invest: [2, 9], attack: [4, 4], cooperate: [7, 3], defend: [8, 2], risk: [3, 9], defect: [4, 5] },
            cooperate: { invest: [6, 8], attack: [3, 7], cooperate: [8, 8], defend: [6, 5], risk: [5, 9], defect: [2, 8] },
            defend: { invest: [8, 5], attack: [2, 8], cooperate: [5, 6], defend: [6, 6], risk: [7, 4], defect: [6, 5] },
            risk: { invest: [1, 10], attack: [9, 3], cooperate: [9, 5], defend: [4, 7], risk: [5, 5], defect: [2, 9] },
            defect: { invest: [3, 9], attack: [5, 4], cooperate: [8, 2], defend: [5, 6], risk: [9, 2], defect: [3, 3] }
        },
        insight: "A payoff is the reward associated with decision choices. The optimal move depends on anticipating rival decisions.",
        gameTheory: "Payoff Matrix"
    },
    {
        id: 2,
        category: "STARTUP BATTLE",
        concept: "RISK & REWARD",
        title: "Launch or Wait?",
        description: "Your startup is preparing to release a groundbreaking AI feature. A rival firm is also launching. Do you rush to market or build defensibility?",
        strategies: {
            invest: { invest: [9, 6], attack: [8, 3], cooperate: [7, 7], defend: [4, 8], risk: [10, 2], defect: [8, 4] },
            attack: { invest: [3, 8], attack: [5, 5], cooperate: [8, 2], defend: [9, 3], risk: [4, 8], defect: [5, 5] },
            cooperate: { invest: [7, 7], attack: [2, 8], cooperate: [8, 8], defend: [6, 6], risk: [6, 8], defect: [3, 8] },
            defend: { invest: [8, 4], attack: [3, 9], cooperate: [6, 6], defend: [7, 7], risk: [8, 4], defect: [6, 6] },
            risk: { invest: [2, 10], attack: [8, 4], cooperate: [8, 6], defend: [4, 8], risk: [6, 6], defect: [3, 9] },
            defect: { invest: [4, 8], attack: [5, 5], cooperate: [8, 3], defend: [6, 6], risk: [9, 3], defect: [4, 4] }
        },
        insight: "Early high-risk moves offer massive rewards, but become vulnerable if rivals counter aggressively.",
        gameTheory: "Risk & Reward"
    },
    {
        id: 3,
        category: "MARKET COMPETITION",
        concept: "DOMINANT STRATEGY",
        title: "The Price War",
        description: "Two major retailers control market share. Slashing prices undercuts rivals but reduces overall profit margins.",
        strategies: {
            invest: { invest: [6, 6], attack: [8, 3], cooperate: [7, 7], defend: [5, 8], risk: [9, 2], defect: [7, 4] },
            attack: { invest: [3, 8], attack: [5, 5], cooperate: [9, 2], defend: [8, 3], risk: [4, 7], defect: [5, 5] },
            cooperate: { invest: [7, 7], attack: [2, 9], cooperate: [8, 8], defend: [6, 6], risk: [5, 8], defect: [2, 9] },
            defend: { invest: [8, 5], attack: [3, 8], cooperate: [6, 6], defend: [7, 7], risk: [8, 3], defect: [6, 6] },
            risk: { invest: [2, 9], attack: [7, 4], cooperate: [8, 5], defend: [3, 8], risk: [5, 5], defect: [2, 9] },
            defect: { invest: [4, 7], attack: [5, 5], cooperate: [9, 2], defend: [6, 6], risk: [9, 2], defect: [3, 3] }
        },
        insight: "A dominant strategy remains superior regardless of your competitor's move.",
        gameTheory: "Dominant Strategy"
    },
    {
        id: 4,
        category: "BUSINESS & TECH",
        concept: "PRISONER'S DILEMMA",
        title: "Ad Spend Escalation",
        description: "Two tech giants must choose whether to flood social media with ad campaigns or maintain baseline marketing budgets.",
        strategies: {
            invest: { invest: [8, 8], attack: [9, 2], cooperate: [7, 7], defend: [5, 7], risk: [10, 2], defect: [8, 3] },
            attack: { invest: [2, 9], attack: [4, 4], cooperate: [8, 2], defend: [7, 3], risk: [3, 8], defect: [5, 5] },
            cooperate: { invest: [7, 7], attack: [2, 8], cooperate: [9, 9], defend: [6, 6], risk: [5, 9], defect: [3, 8] },
            defend: { invest: [7, 5], attack: [3, 7], cooperate: [6, 6], defend: [7, 7], risk: [8, 3], defect: [6, 5] },
            risk: { invest: [2, 10], attack: [8, 3], cooperate: [9, 5], defend: [3, 8], risk: [5, 5], defect: [2, 9] },
            defect: { invest: [3, 8], attack: [5, 5], cooperate: [8, 3], defend: [5, 6], risk: [9, 2], defect: [4, 4] }
        },
        insight: "Unchecked marketing escalation drains profits for both sides unless mutual restraint is established.",
        gameTheory: "Prisoner's Dilemma"
    },
    {
        id: 5,
        category: "TRAFFIC & URBAN PLANNING",
        concept: "COORDINATION GAME",
        title: "Commute Highway Routing",
        description: "Thousands of drivers choose between taking the main expressway or alternative arterial roads during peak hour.",
        strategies: {
            invest: { invest: [7, 7], attack: [8, 4], cooperate: [8, 8], defend: [6, 6], risk: [9, 2], defect: [7, 5] },
            attack: { invest: [4, 8], attack: [3, 3], cooperate: [7, 3], defend: [8, 2], risk: [3, 7], defect: [4, 4] },
            cooperate: { invest: [8, 8], attack: [3, 7], cooperate: [9, 9], defend: [7, 7], risk: [6, 8], defect: [4, 7] },
            defend: { invest: [6, 6], attack: [2, 8], cooperate: [7, 7], defend: [8, 8], risk: [7, 4], defect: [6, 6] },
            risk: { invest: [2, 9], attack: [7, 3], cooperate: [8, 6], defend: [4, 7], risk: [4, 4], defect: [2, 8] },
            defect: { invest: [5, 7], attack: [4, 4], cooperate: [7, 4], defend: [6, 6], risk: [8, 2], defect: [3, 3] }
        },
        insight: "When everyone coordinates choices, traffic congestion drops and collective travel time improves.",
        gameTheory: "Coordination Game"
    },
    {
        id: 6,
        category: "FINANCE & CRYPTO",
        concept: "ZERO-SUM GAME",
        title: "Trading Liquidity Pool",
        description: "Two trading desks execute arbitrage strategies on a volatile financial asset.",
        strategies: {
            invest: { invest: [6, 6], attack: [9, 1], cooperate: [7, 7], defend: [4, 8], risk: [10, 0], defect: [8, 2] },
            attack: { invest: [1, 9], attack: [5, 5], cooperate: [8, 2], defend: [7, 3], risk: [2, 8], defect: [5, 5] },
            cooperate: { invest: [7, 7], attack: [2, 8], cooperate: [8, 8], defend: [6, 6], risk: [5, 8], defect: [3, 7] },
            defend: { invest: [8, 4], attack: [3, 7], cooperate: [6, 6], defend: [7, 7], risk: [8, 2], defect: [6, 5] },
            risk: { invest: [0, 10], attack: [8, 2], cooperate: [8, 5], defend: [2, 8], risk: [5, 5], defect: [1, 9] },
            defect: { invest: [2, 8], attack: [5, 5], cooperate: [7, 3], defend: [5, 6], risk: [9, 1], defect: [4, 4] }
        },
        insight: "In pure trading arbitrage, one desk's profit directly mirrors the rival's missed opportunity.",
        gameTheory: "Zero-Sum Game"
    }
];

/* =========================================================
   MULTIPLAYER PAYOFF ENGINE
   ========================================================= */

function calculateMultiplayerPayoffs(choices, scenario) {
    const numPlayers = choices.length;
    const payoffs = new Array(numPlayers).fill(0);

    if (numPlayers === 2) {
        const p1Choice = choices[0].toLowerCase();
        const p2Choice = choices[1].toLowerCase();

        const scenarioMatrix = scenario.strategies[p1Choice] || scenario.strategies.cooperate;
        const pair = scenarioMatrix[p2Choice] || [5, 5];

        payoffs[0] = pair[0];
        payoffs[1] = pair[1];
        return payoffs;
    }

    // 3 or 4 Players: Pairwise round-robin matrix sum + group dynamics adjustments
    for (let i = 0; i < numPlayers; i++) {
        let totalPairwiseScore = 0;
        const myChoice = choices[i].toLowerCase();

        for (let j = 0; j < numPlayers; j++) {
            if (i === j) continue;
            const oppChoice = choices[j].toLowerCase();
            const matrix = scenario.strategies[myChoice] || scenario.strategies.cooperate;
            const pair = matrix[oppChoice] || [5, 5];
            totalPairwiseScore += pair[0];
        }

        // Average pairwise score
        payoffs[i] = Math.round(totalPairwiseScore / (numPlayers - 1));
    }

    // Group Synergy Bonus (If ALL players cooperate/invest)
    const allPeaceful = choices.every(c => c.toLowerCase() === "cooperate" || c.toLowerCase() === "invest");
    if (allPeaceful) {
        for (let i = 0; i < numPlayers; i++) payoffs[i] += 2;
    }

    // Predator Bonus (If 1 player attacks/defects while rest cooperate)
    const aggressorIndices = [];
    const peacefulIndices = [];
    choices.forEach((c, idx) => {
        const lower = c.toLowerCase();
        if (lower === "attack" || lower === "defect" || lower === "risk") aggressorIndices.push(idx);
        else peacefulIndices.push(idx);
    });

    if (aggressorIndices.length === 1 && peacefulIndices.length >= 2) {
        payoffs[aggressorIndices[0]] += 3; // Sole predator bonus
        peacefulIndices.forEach(idx => payoffs[idx] = Math.max(1, payoffs[idx] - 2));
    }

    return payoffs;
}

/* =========================================================
   AI DECISION ENGINE WITH PERSONALITIES
   ========================================================= */

function getAIDecision(personalityKey = "adaptive", opponentHistory = [], scenario = null) {
    const personality = AI_PERSONALITIES[personalityKey.toUpperCase()] || AI_PERSONALITIES.ADAPTIVE;

    // Fixed weights personality
    if (personality.weights) {
        return weightedRandom(personality.weights);
    }

    // Adaptive / Master AI
    if (!opponentHistory || opponentHistory.length === 0) {
        return randomChoice(["cooperate", "invest", "defend"]);
    }

    const counts = countStrategies(opponentHistory);
    const lastMove = opponentHistory[opponentHistory.length - 1];

    if (personalityKey.toLowerCase() === "master") {
        // Minimax counter
        return counterStrategy(predictPlayerStrategy(opponentHistory) || lastMove);
    }

    // Adaptive: Tit-For-Tat with 20% random variation
    if (Math.random() < 0.2) {
        return randomChoice(["attack", "cooperate", "invest", "defend"]);
    }
    return counterStrategy(lastMove);
}

function predictPlayerStrategy(history) {
    if (!history || history.length === 0) return null;

    const counts = countStrategies(history);
    const recent = history.slice(-3);
    const recentCounts = countStrategies(recent);

    const scores = {};
    Object.keys(STRATEGIES).forEach(strat => {
        const id = STRATEGIES[strat].id;
        scores[id] = (counts[id] || 0) + ((recentCounts[id] || 0) * 1.5);
    });

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function counterStrategy(strategy) {
    switch (strategy ? strategy.toLowerCase() : "") {
        case "invest": return "defend";
        case "attack": return "defend";
        case "cooperate": return "attack";
        case "defend": return "invest";
        case "risk": return "defend";
        case "defect": return "attack";
        default: return "cooperate";
    }
}

function generateAIReasoning(aiStrategy, playerChoices, opponentHistory) {
    const strName = (aiStrategy || "DEFEND").toUpperCase();

    if (!opponentHistory || opponentHistory.length === 0) {
        return `The AI selected ${strName} as an opening baseline to test the waters and measure rival intent.`;
    }

    const lastPlayerMove = (opponentHistory[opponentHistory.length - 1] || "COOPERATE").toUpperCase();
    return `The AI observed your previous move (${lastPlayerMove}) and selected ${strName} to optimize its expected payoff matrix response.`;
}

/* =========================================================
   RANDOM HELPERS
   ========================================================= */

function randomChoice(array) {
    if (!array || array.length === 0) return STRATEGIES.DEFEND.id;
    return array[Math.floor(Math.random() * array.length)];
}

function weightedRandom(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let random = Math.random() * total;

    for (const [item, weight] of entries) {
        random -= weight;
        if (random <= 0) return item;
    }
    return entries[entries.length - 1][0];
}

function countStrategies(history) {
    const counts = { invest: 0, attack: 0, cooperate: 0, defend: 0, risk: 0, defect: 0 };
    if (!Array.isArray(history)) return counts;
    history.forEach(s => {
        if (s && counts.hasOwnProperty(s.toLowerCase())) {
            counts[s.toLowerCase()]++;
        }
    });
    return counts;
}

function getGameScenarios(totalRounds = 5) {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(totalRounds, SCENARIOS.length));
}