// Game State Management
class GameState {
    constructor() {
        this.player = {
            name: '',
            age: 15,
            stats: {
                charisma: 0,
                vocals: 0,
                rhythm: 0,
                creativity: 0,
                luck: 0,
                skill: 0,
                intelligence: 0
            },
            resources: {
                motivation: 70,
                happiness: 65,
                audience: 0,
                fame: 0,
                money: 200,
                health: 95
            },
            phase: 'decision',
            gameLog: []
        };
        this.currentScreen = 'welcome';
        this.initialized = false;
    }

    // Generate random starting stats (0-10 range)
    generateStartingStats() {
        const stats = {};
        const statNames = ['charisma', 'vocals', 'rhythm', 'creativity', 'luck', 'skill', 'intelligence'];
        
        statNames.forEach(stat => {
            stats[stat] = Math.floor(Math.random() * 11); // 0-10
        });
        
        return stats;
    }

    // Generate random starting resources
    generateStartingResources() {
        return {
            motivation: Math.floor(Math.random() * 21) + 60, // 60-80
            happiness: Math.floor(Math.random() * 51) + 40,  // 40-90
            audience: 0,
            fame: 0,
            money: Math.floor(Math.random() * 401),           // 0-400
            health: Math.floor(Math.random() * 11) + 90       // 90-100
        };
    }

    // Initialize new game
    initializeGame(playerName) {
        this.player.name = playerName;
        this.player.stats = this.generateStartingStats();
        this.player.resources = this.generateStartingResources();
        this.player.gameLog = [{
            age: 15,
            text: `${playerName} begins their musical journey...`
        }];
        this.initialized = true;
    }

    // Add log entry
    addLogEntry(text) {
        this.player.gameLog.push({
            age: this.player.age,
            text: text
        });
    }

    // Reset game state
    reset() {
        this.player = {
            name: '',
            age: 15,
            stats: {
                charisma: 0,
                vocals: 0,
                rhythm: 0,
                creativity: 0,
                luck: 0,
                skill: 0,
                intelligence: 0
            },
            resources: {
                motivation: 70,
                happiness: 65,
                audience: 0,
                fame: 0,
                money: 200,
                health: 95
            },
            phase: 'decision',
            gameLog: []
        };
        this.currentScreen = 'welcome';
        this.initialized = false;
    }
}

// UI Management
class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.tooltip = document.getElementById('tooltip');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Welcome screen
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.switchScreen('name');
        });

        // Name input screen
        const nameInput = document.getElementById('player-name');
        const confirmBtn = document.getElementById('confirm-name-btn');

        nameInput.addEventListener('input', (e) => {
            confirmBtn.disabled = e.target.value.trim().length === 0;
        });

        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !confirmBtn.disabled) {
                this.startGame();
            }
        });

        confirmBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Tooltip functionality
        this.initializeTooltips();

        // Choice buttons (placeholder for now)
        document.querySelectorAll('.choice-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.handleChoice(choice);
            });
        });
    }

    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target.dataset.tooltip, e);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            element.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });
        });
    }

    showTooltip(text, element) {
        this.tooltip.textContent = text;
        this.tooltip.classList.add('show');
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    updateTooltipPosition(e) {
        const x = e.clientX + 10;
        const y = e.clientY - 30;
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    switchScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.gameState.currentScreen = screenName;

        // Add fade-in animation
        setTimeout(() => {
            document.getElementById(`${screenName}-screen`).classList.add('fade-in');
        }, 50);
    }

    startGame() {
        const playerName = document.getElementById('player-name').value.trim();
        if (playerName) {
            this.gameState.initializeGame(playerName);
            this.switchScreen('game');
            this.updateUI();
        }
    }

    resetGame() {
        this.gameState.reset();
        this.switchScreen('welcome');
        document.getElementById('player-name').value = '';
        document.getElementById('confirm-name-btn').disabled = true;
    }

    updateUI() {
        if (!this.gameState.initialized) return;

        const player = this.gameState.player;

        // Update header
        document.getElementById('player-name-display').textContent = player.name;
        document.getElementById('player-age').textContent = `Age: ${player.age}`;
        document.getElementById('current-phase').textContent = `${player.phase.charAt(0).toUpperCase() + player.phase.slice(1)} Phase`;

        // Update stats
        this.updateStats();
        this.updateResources();
        this.updateGameLog();
    }

    updateStats() {
        const stats = this.gameState.player.stats;
        const maxStatValue = 25; // Based on our documentation (-5 to 25 range, but we'll show 0-25 for display)

        Object.entries(stats).forEach(([statName, value]) => {
            const displayValue = Math.max(0, value + 5); // Convert -5 to 25 range to 0 to 30 for display
            const percentage = (displayValue / 30) * 100;

            document.getElementById(`${statName}-value`).textContent = value;
            document.getElementById(`${statName}-bar`).style.width = `${percentage}%`;
        });
    }

    updateResources() {
        const resources = this.gameState.player.resources;

        document.getElementById('motivation-value').textContent = resources.motivation;
        document.getElementById('happiness-value').textContent = resources.happiness;
        document.getElementById('audience-value').textContent = resources.audience.toLocaleString();
        document.getElementById('fame-value').textContent = resources.fame;
        document.getElementById('money-value').textContent = `$${resources.money.toLocaleString()}`;
        document.getElementById('health-value').textContent = resources.health;
    }

    updateGameLog() {
        const logContainer = document.getElementById('game-log');
        logContainer.innerHTML = '';

        this.gameState.player.gameLog.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry slide-in';
            logEntry.innerHTML = `
                <span class="log-time">Age ${entry.age}</span>
                <span class="log-text">${entry.text}</span>
            `;
            logContainer.appendChild(logEntry);
        });

        // Scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    handleChoice(choiceNumber) {
        // Placeholder for choice handling
        console.log(`Choice ${choiceNumber} selected`);
        
        // Add a test log entry
        this.gameState.addLogEntry(`Selected option ${choiceNumber} (placeholder)`);
        this.updateGameLog();
        
        // For now, just show an alert
        alert(`You selected choice ${choiceNumber}. Game logic coming soon!`);
    }

    // Animate stat changes
    animateStatChange(statName, oldValue, newValue) {
        const element = document.getElementById(`${statName}-value`);
        element.style.color = newValue > oldValue ? '#4CAF50' : '#f44336';
        
        setTimeout(() => {
            element.style.color = '';
        }, 1000);
    }

    // Animate resource changes
    animateResourceChange(resourceName, oldValue, newValue) {
        const element = document.getElementById(`${resourceName}-value`);
        element.style.color = newValue > oldValue ? '#4CAF50' : '#f44336';
        
        setTimeout(() => {
            element.style.color = '';
        }, 1000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState();
    const uiManager = new UIManager(gameState);
    
    // Expose to global scope for debugging
    window.gameState = gameState;
    window.uiManager = uiManager;
    
    console.log('MusiLife game initialized!');
    console.log('Debug: Use window.gameState and window.uiManager to inspect game state');
});

// Debug functions
function debugRollStats() {
    if (window.gameState && window.gameState.initialized) {
        window.gameState.player.stats = window.gameState.generateStartingStats();
        window.gameState.player.resources = window.gameState.generateStartingResources();
        window.uiManager.updateUI();
        console.log('Stats rerolled:', window.gameState.player.stats);
        console.log('Resources rerolled:', window.gameState.player.resources);
    }
}

function debugAddLogEntry(text) {
    if (window.gameState && window.gameState.initialized) {
        window.gameState.addLogEntry(text || 'Debug log entry');
        window.uiManager.updateGameLog();
    }
}

// Make debug functions available globally
window.debugRollStats = debugRollStats;
window.debugAddLogEntry = debugAddLogEntry;
