# 🎮 EduStrategist

An interactive **Game-Theoretic Strategy Battle & Educational Web App**. Test your strategic thinking, analyze payoff matrices, and outmaneuver adaptive AI opponents across classic game theory scenarios (Prisoner's Dilemma, Stag Hunt, Nash Equilibrium, and more).

---

## 🌟 Key Features

- **🎮 Strategic Gameplay:** Compete in interactive decision-making scenarios grounded in game theory principles.
- **🧠 Adaptive AI Competitors:** Play against AI opponents with distinct difficulty levels and pattern-matching strategies.
- **📊 Payoff Matrix & Analysis:** Visualize real-time payoff matrices, score updates, and post-game strategic breakdowns.
- **📱 Cross-Platform Ready:** Built as a modern web app (HTML5 / JS / CSS) and bundled with **Capacitor** for Android deployment.
- **🏆 Leaderboard & History:** Track high scores, match history, and strategic concept mastery over time.

---

## 🛠️ Project Structure

```text
EduStrategist/
├── www/
│   ├── index.html      # Main user interface & game screens
│   ├── style.css       # Responsive styling & theme
│   ├── data.js         # Game scenarios, matrix data & concepts
│   ├── game.js         # Core game logic & AI decision engines
│   └── ui.js           # UI state rendering & event handling
├── android/            # Capacitor Android native platform files
├── capacitor.config.json # Capacitor mobile configuration
└── package.json        # Project metadata & dependencies
```

---

## 🚀 Quick Start (Local Web Server)

You can run EduStrategist locally using any standard HTTP web server:

### Python HTTP Server
```bash
cd EduStrategist
python -m http.server 8080 --directory www
```
Open `http://localhost:8080` in your web browser.

---

## 📱 Mobile Build (Capacitor / Android)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Sync web code to Android project:**
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

---

## 🏷️ Concepts Covered

- **Nash Equilibrium**
- **Prisoner's Dilemma**
- **Stag Hunt & Coordination**
- **Payoff Matrix Evaluation**
- **Opponent Pattern Recognition**

---

## 📝 License

Distributed under the ISC License.
