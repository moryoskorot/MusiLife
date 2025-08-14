# Technical Implementation - Life of a Musician

## Architecture Overview

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Storage**: JSON configuration files + SessionStorage for refresh protection
- **Build Tools**: Optional - can be run directly in browser
- **Version Control**: Git recommended for content management

### Core Components

```
MusiLife/
├── index.html              # Main game interface
├── css/
│   └── styles.css         # Game styling
├── js/
│   ├── game.js           # Main game controller
│   ├── player.js         # Player state management
│   ├── phases.js         # Phase logic handlers
│   ├── ui.js             # UI rendering and updates
│   └── utils.js          # Helper functions
├── data/
│   ├── questions.json    # Decision phase questions
│   ├── opportunities.json # Opportunity scenarios
│   ├── events.json       # Random events
│   └── endings.json      # Game endings
└── assets/
    └── images/           # UI icons and backgrounds
```

## Game State Management

### Player State Object
```javascript
class PlayerState {
  constructor() {
    // Core Stats
    this.stats = {
      charisma: 0,    // -5 to 25
      vocals: 0,      // -5 to 25
      rhythm: 0,      // -5 to 25
      creativity: 0,  // -5 to 25
      luck: 0,        // -5 to 25
      skill: 0,       // -5 to 25
      intelligence: 0 // -5 to 25
    };
    
    // Resources
    this.resources = {
      motivation: 70,   // 0-∞ (starts 60-80)
      happiness: 65,    // 0-∞ (starts 40-90)
      audience: 0,      // 0-∞
      fame: 0,          // 0-∞ (uncapped)
      money: 200,       // -∞-∞ (starts 0-400)
      health: 95        // 0-∞ (starts 90-100)
    };
    
    // Metadata
    this.age = 15;
    this.phase = 'decision';
    this.phaseCount = 0;
    this.history = [];
    this.achievements = [];
    this.relationships = {};
    this.inventory = [];
    this.gameLog = [];  // For export at game end
    this.lifestyleChoices = {}; // e.g., { smoking: true }
    this.startTime = Date.now();
  }
}
```

### Game Controller
```javascript
class GameController {
  constructor() {
    this.player = new PlayerState();
    this.currentPhase = null;
    this.sessionManager = new SessionManager();
  }
  
  // Main game loop
  async runPhase() {
    if (this.checkGameOver()) {
      return this.endGame();
    }
    
    if (this.player.phase === 'decision') {
      await this.runDecisionPhase();
    } else {
      await this.runOpportunityPhase();
    }
    
    this.advanceAge();
    this.togglePhase();
    this.sessionManager.saveSession(this);
  }
  
  checkGameOver() {
    const { age, resources } = this.player;
    const ageBracket = this.getAgeBracket(age);
    
    // Check money game over by age
    const moneyLimits = {
      teen: -50,
      youngAdult: -50,
      adult: -1000,
      veteran: -5000,
      livingLegend: -5000
    };
    
    if (resources.money < moneyLimits[ageBracket]) return true;
    if (resources.motivation <= 0) return true;
    if (resources.health <= 0) return true;
    
    return false;
  }
  
  getAgeBracket(age) {
    if (age <= 19) return 'teen';
    if (age <= 29) return 'youngAdult';
    if (age <= 45) return 'adult';
    if (age <= 64) return 'veteran';
    return 'livingLegend';
  }
  
  async endGame() {
    const victory = this.checkVictoryConditions();
    this.player.gameResult = victory ? 'victory' : 'defeat';
    
    // Export game log
    this.sessionManager.exportGameLog(this.player);
    
    // Clear session
    this.sessionManager.clearSession();
    
    // Show end screen
    await this.showEndScreen();
  }
}
```

## Data Structure Design

### Questions Configuration (questions.json)
```json
{
  "questions": [
    {
      "id": "q_early_music_1",
      "ageRange": [13, 18],
      "text": "Your parents offer to pay for music lessons. What do you choose?",
      "options": [
        {
          "text": "Classical piano lessons",
          "effects": {
            "skill": 2,
            "intelligence": 1,
            "creativity": -1
          },
          "unlocks": ["classical_path"],
          "requires": {}
        },
        {
          "text": "Guitar lessons at the local music shop",
          "effects": {
            "skill": 1,
            "charisma": 1,
            "creativity": 1
          },
          "unlocks": ["rock_path"],
          "requires": {}
        },
        {
          "text": "Voice coaching",
          "effects": {
            "vocals": 3,
            "charisma": 1
          },
          "unlocks": ["vocal_path"],
          "requires": {}
        },
        {
          "text": "Save the money instead",
          "effects": {
            "intelligence": 2,
            "resources": {
              "money": 200
            }
          },
          "unlocks": ["diy_path"],
          "requires": {}
        }
      ]
    }
  ]
}
```

### Opportunities Configuration (opportunities.json)
```json
{
  "opportunities": [
    {
      "id": "campfire_jam",
      "title": "Campfire Jam Session",
      "description": "Friends are gathered around a campfire with guitars. They invite you to play something.",
      "ageRange": [13, 25],
      "requires": {
        "minStats": {},
        "flags": [],
        "excludeFlags": ["injured_hands"]
      },
      "choices": [
        {
          "text": "Play a popular song everyone knows",
          "id": "play_popular",
          "formula": {
            "description": "Performance skill and crowd appeal",
            "weights": {
              "skill": 0.3,
              "charisma": 0.4,
              "luck": 0.3
            }
          },
          "outcomes": [
            {
              "weight": 10,
              "text": "Your performance goes viral! Someone recorded it and posted online.",
              "effects": {
                "audience": 500,
                "fame": 5,
                "happiness": 10,
                "motivation": 10
              }
            },
            {
              "weight": 40,
              "text": "Everyone sings along! You make new musician friends.",
              "effects": {
                "audience": 50,
                "happiness": 5,
                "charisma": 1
              }
            },
            {
              "weight": 40,
              "text": "You forget the lyrics midway. People laugh it off kindly.",
              "effects": {
                "motivation": -5,
                "happiness": -3
              }
            },
            {
              "weight": 10,
              "text": "You stumble backwards and fall into the fire! You suffer burns.",
              "effects": {
                "health": -30,
                "motivation": -20,
                "flags": ["injured_hands"],
                "tempDisable": ["guitar", 6]
              }
            }
          ]
        },
        {
          "text": "Perform an original composition",
          "id": "play_original",
          "formula": {
            "description": "Creative expression and technical skill",
            "weights": {
              "creativity": 0.4,
              "skill": 0.3,
              "charisma": 0.2,
              "luck": 0.1
            }
          },
          "outcomes": [
            {
              "weight": 15,
              "text": "Your original song moves everyone. They want to hear more!",
              "effects": {
                "creativity": 2,
                "audience": 100,
                "fame": 3,
                "happiness": 15
              }
            },
            {
              "weight": 35,
              "text": "People appreciate your creativity. A few become new fans.",
              "effects": {
                "creativity": 1,
                "audience": 30,
                "happiness": 8
              }
            },
            {
              "weight": 50,
              "text": "The song doesn't land well. Awkward silence follows.",
              "effects": {
                "motivation": -8,
                "happiness": -5
              }
            }
          ]
        }
      ]
    },
    {
      "id": "tv_advertisement",
      "title": "TV Commercial Opportunity",
      "description": "A company wants you to perform in their TV advertisement.",
      "ageRange": [18, 50],
      "requires": {
        "minStats": { "fame": 30 },
        "flags": []
      },
      "choices": [
        {
          "text": "Accept and give it your all",
          "id": "accept_enthusiastic",
          "formula": {
            "description": "Charisma is key for TV success",
            "weights": {
              "charisma": 0.6,
              "skill": 0.2,
              "luck": 0.2
            }
          },
          "outcomes": [
            {
              "weight": 20,
              "text": "You nail it! The ad becomes iconic and runs for years.",
              "effects": {
                "money": 50000,
                "fame": 20,
                "audience": 10000,
                "flags": ["tv_star"]
              }
            },
            {
              "weight": 80,
              "text": "You do well. The ad runs for a few months.",
              "effects": {
                "money": 10000,
                "fame": 5,
                "audience": 1000
              }
            }
          ]
        },
        {
          "text": "Decline - stay authentic",
          "id": "decline",
          "formula": {
            "description": "No risk, but might gain indie credibility",
            "weights": {
              "intelligence": 1.0
            }
          },
          "outcomes": [
            {
              "weight": 100,
              "text": "Your indie fans respect your authenticity.",
              "effects": {
                "motivation": 5,
                "audience": -100,
                "flags": ["indie_cred"]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## UI/UX Design

### Layout Structure
```html
<!-- Main Game Container -->
<div class="game-container">
  <!-- Header Section -->
  <header class="game-header">
    <div class="player-info">
      <span class="player-age">Age: 15</span>
      <span class="player-phase">Decision Phase</span>
    </div>
    <div class="game-controls">
      <button class="export-log">Export Log</button>
      <button class="menu">Menu</button>
    </div>
  </header>
  
  <!-- Stats Display -->
  <div class="stats-panel">
    <div class="core-stats">
      <!-- Stat bars with icons -->
    </div>
    <div class="resources">
      <!-- Resource meters -->
    </div>
  </div>
  
  <!-- Main Game Area -->
  <main class="game-content">
    <div class="narrative-text">
      <!-- Current scenario text -->
    </div>
    <div class="choices-container">
      <!-- Dynamic choice buttons -->
    </div>
  </main>
  
  <!-- History/Log -->
  <aside class="game-history">
    <!-- Scrollable event log -->
  </aside>
</div>
```

### Visual Design Guidelines

#### Color Palette
```css
:root {
  --primary-dark: #1a1a2e;      /* Dark background */
  --primary-mid: #16213e;       /* Panel backgrounds */
  --accent-gold: #f39c12;       /* Success, fame */
  --accent-blue: #3498db;       /* Skill, intelligence */
  --accent-red: #e74c3c;        /* Health, danger */
  --accent-green: #27ae60;      /* Money, motivation */
  --text-primary: #ecf0f1;      /* Main text */
  --text-secondary: #bdc3c7;    /* Secondary text */
}
```

#### Component Styling
```css
/* Stat Bars */
.stat-bar {
  width: 100%;
  height: 24px;
  background: var(--primary-mid);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-gold));
  transition: width 0.5s ease;
}

/* Choice Buttons */
.choice-button {
  background: var(--primary-mid);
  border: 2px solid transparent;
  color: var(--text-primary);
  padding: 1rem 2rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.choice-button:hover {
  border-color: var(--accent-gold);
  transform: translateX(10px);
}

/* Narrative Text */
.narrative-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-primary);
  padding: 2rem;
  background: rgba(22, 33, 62, 0.8);
  border-radius: 10px;
  margin-bottom: 2rem;
}
```

### Responsive Design
```css
/* Mobile First Approach */
@media (max-width: 768px) {
  .game-container {
    grid-template-columns: 1fr;
  }
  
  .stats-panel {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .game-history {
    max-height: 200px;
  }
}

@media (min-width: 1024px) {
  .game-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 1rem;
  }
}
```

## Game Logic Implementation

### Phase Management
```javascript
class PhaseManager {
  constructor(gameController) {
    this.game = gameController;
    this.questionPool = [];
    this.opportunityPool = [];
  }
  
  async loadPhaseData() {
    this.questions = await fetch('./data/questions.json').then(r => r.json());
    this.opportunities = await fetch('./data/opportunities.json').then(r => r.json());
  }
  
  getRelevantQuestions() {
    return this.questions.filter(q => {
      return q.ageRange[0] <= this.game.player.age && 
             q.ageRange[1] >= this.game.player.age &&
             this.checkRequirements(q.requires);
    });
  }
  
  calculateOutcome(choice) {
    const stats = this.game.player.stats;
    
    // Calculate player's success score based on formula weights
    let playerScore = 0;
    for (let [stat, weight] of Object.entries(choice.formula.weights)) {
      playerScore += (stats[stat] || 0) * weight;
    }
    
    // Add random factor (0-100)
    const roll = Math.random() * 100;
    const finalScore = playerScore + roll;
    
    // Calculate weighted outcome selection
    const outcomes = choice.outcomes;
    const totalWeight = outcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
    
    // Roll for outcome (1-100 based on weights)
    let outcomeRoll = Math.random() * totalWeight;
    let selectedOutcome = null;
    
    // Select outcome based on weight distribution
    // Order matters - first matching outcome is selected
    for (let outcome of outcomes) {
      outcomeRoll -= outcome.weight;
      if (outcomeRoll <= 0) {
        selectedOutcome = outcome;
        break;
      }
    }
    
    // Apply fame multiplier to money rewards
    if (selectedOutcome.effects?.money > 0) {
      const fameMultiplier = (this.game.player.resources.fame / 100) + 1;
      selectedOutcome.effects.money = Math.floor(selectedOutcome.effects.money * fameMultiplier);
    }
    
    return selectedOutcome;
  }
}
```

### Session Storage & Game Log
```javascript
class SessionManager {
  constructor() {
    this.key = 'musilife_session';
  }
  
  // Save to session storage (refresh protection only)
  saveSession(gameState) {
    const sessionData = {
      version: '1.0.0',
      timestamp: Date.now(),
      player: gameState.player,
      currentPhase: gameState.currentPhase
    };
    
    sessionStorage.setItem(this.key, JSON.stringify(sessionData));
  }
  
  // Load from session storage
  loadSession() {
    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }
  
  // Clear session on game end
  clearSession() {
    sessionStorage.removeItem(this.key);
  }
  
  // Export game log at end
  exportGameLog(player) {
    const log = {
      characterName: player.name,
      finalAge: player.age,
      finalStats: player.stats,
      finalResources: player.resources,
      achievements: player.achievements,
      history: player.gameLog,
      playTime: Date.now() - player.startTime,
      result: player.gameResult // 'victory' or 'defeat'
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `musilife_${player.name}_${Date.now()}.json`;
    a.click();
  }
}
```

## Outcome Weight System

### How Weight-Based Outcomes Work

The system uses a simple weight-based probability calculation:

1. **Weight Definition**: Each outcome has a `weight` value (e.g., 10, 40, 50)
2. **Total Weight**: Sum all weights for a choice's outcomes
3. **Probability**: Each outcome's chance = (its weight / total weight) × 100%

#### Example: Campfire Jam - "Play Popular"
```
Outcome 1: weight 10  → 10/100 = 10% chance
Outcome 2: weight 40  → 40/100 = 40% chance  
Outcome 3: weight 40  → 40/100 = 40% chance
Outcome 4: weight 10  → 10/100 = 10% chance
Total: 100
```

#### Example: 50/50 Split
```json
"outcomes": [
  { "weight": 10, "text": "Success!" },
  { "weight": 10, "text": "Failure!" }
]
// Both have 50% chance (10/20 = 50%)
```

### Order Matters
Outcomes are evaluated in the order they appear in the array. The first outcome whose weight range contains the random roll is selected.

## Content Management

### Adding New Content
1. **Questions**: Add to `data/questions.json` with proper age ranges and requirements
2. **Opportunities**: Add to `data/opportunities.json` with balanced risk/reward
3. **Events**: Add to `data/events.json` for random encounters
4. **Endings**: Define in `data/endings.json` with achievement conditions

### Balancing Guidelines
- **Stat Changes**: Usually 1-3 points per action
- **Resource Changes**: Scale with age and current values
- **Weight Distribution**: Use weights to control outcome probability
- **Risk/Reward**: Higher risk should offer proportionally higher rewards

### Localization Support
```javascript
// Structure for future localization
const i18n = {
  en: {
    stats: {
      charisma: "Charisma",
      vocals: "Vocals",
      // ...
    },
    ui: {
      exportLog: "Export Log",
      menu: "Menu",
      // ...
    }
  }
};
```

## Performance Optimization

### Best Practices
1. **Lazy Loading**: Load phase data only when needed
2. **State Compression**: Use session storage efficiently
3. **Animation Throttling**: Limit UI updates to 60fps
4. **Asset Optimization**: Use WebP for images, minimize JSON

### Future Enhancements
- **WebWorkers**: For complex calculations
- **PWA Support**: Offline play capability
- **Achievement System**: Track player milestones
- **Multiple Endings**: Based on playstyle and choices
