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
            gameLog: [],
            flags: [],
            phaseCount: 0,
            usedQuestions: [],
            usedOpportunities: []
        };
        this.currentScreen = 'welcome';
        this.initialized = false;
        this.gameData = {
            questions: [],
            opportunities: [],
            events: []
        };
        this.currentQuestion = null;
        this.currentOpportunity = null;
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

    // Load game data from JSON files
    async loadGameData() {
        try {
            const [questionsResponse, opportunitiesResponse, eventsResponse] = await Promise.all([
                fetch('./data/questions.json'),
                fetch('./data/opportunities.json'),
                fetch('./data/events.json')
            ]);
            
            this.gameData.questions = (await questionsResponse.json()).questions;
            this.gameData.opportunities = (await opportunitiesResponse.json()).opportunities;
            this.gameData.events = (await eventsResponse.json()).events;
            
            console.log('Game data loaded successfully!');
            return true;
        } catch (error) {
            console.error('Failed to load game data:', error);
            return false;
        }
    }

    // Get available questions for current age (excluding recently used)
    getAvailableQuestions() {
        const available = this.gameData.questions.filter(q => {
            return q.ageRange[0] <= this.player.age && 
                   q.ageRange[1] >= this.player.age &&
                   this.checkRequirements(q.requires || {}) &&
                   !this.player.usedQuestions.includes(q.id);
        });

        // If no new questions available, reset the used list and try again
        if (available.length === 0) {
            this.player.usedQuestions = [];
            return this.gameData.questions.filter(q => {
                return q.ageRange[0] <= this.player.age && 
                       q.ageRange[1] >= this.player.age &&
                       this.checkRequirements(q.requires || {});
            });
        }

        return available;
    }

    // Get available opportunities for current age (excluding recently used)
    getAvailableOpportunities() {
        const available = this.gameData.opportunities.filter(o => {
            return o.ageRange[0] <= this.player.age && 
                   o.ageRange[1] >= this.player.age &&
                   this.checkRequirements(o.requires || {}) &&
                   !this.player.usedOpportunities.includes(o.id);
        });

        // If no new opportunities available, reset the used list and try again
        if (available.length === 0) {
            this.player.usedOpportunities = [];
            return this.gameData.opportunities.filter(o => {
                return o.ageRange[0] <= this.player.age && 
                       o.ageRange[1] >= this.player.age &&
                       this.checkRequirements(o.requires || {});
            });
        }

        return available;
    }

    // Check if player meets requirements
    checkRequirements(requires) {
        // Check minimum stats
        if (requires.minStats) {
            for (let [stat, minValue] of Object.entries(requires.minStats)) {
                if (stat === 'audience' || stat === 'fame' || stat === 'money' || stat === 'health' || stat === 'motivation' || stat === 'happiness') {
                    if (this.player.resources[stat] < minValue) return false;
                } else {
                    if (this.player.stats[stat] < minValue) return false;
                }
            }
        }

        // Check required flags
        if (requires.flags) {
            for (let flag of requires.flags) {
                if (!this.player.flags.includes(flag)) return false;
            }
        }

        // Check excluded flags
        if (requires.excludeFlags) {
            for (let flag of requires.excludeFlags) {
                if (this.player.flags.includes(flag)) return false;
            }
        }

        return true;
    }

    // Apply effects to player
    applyEffects(effects) {
        const changes = {};

        // Apply stat changes
        for (let [stat, change] of Object.entries(effects)) {
            if (stat === 'resources') {
                for (let [resource, resourceChange] of Object.entries(change)) {
                    const oldValue = this.player.resources[resource];
                    this.player.resources[resource] += resourceChange;
                    changes[resource] = { old: oldValue, new: this.player.resources[resource], change: resourceChange };
                }
            } else if (stat === 'flags') {
                // Add flags
                for (let flag of change) {
                    if (!this.player.flags.includes(flag)) {
                        this.player.flags.push(flag);
                    }
                }
            } else if (this.player.stats.hasOwnProperty(stat)) {
                const oldValue = this.player.stats[stat];
                this.player.stats[stat] += change;
                // Cap stats at -5 to 25
                this.player.stats[stat] = Math.max(-5, Math.min(25, this.player.stats[stat]));
                changes[stat] = { old: oldValue, new: this.player.stats[stat], change: change };
            } else if (this.player.resources.hasOwnProperty(stat)) {
                const oldValue = this.player.resources[stat];
                this.player.resources[stat] += change;
                // Resources have minimum of 0 (except money which can go negative)
                if (stat !== 'money') {
                    this.player.resources[stat] = Math.max(0, this.player.resources[stat]);
                }
                changes[stat] = { old: oldValue, new: this.player.resources[stat], change: change };
            }
        }

        return changes;
    }

    // Check win/lose conditions
    checkGameOver() {
        const { age, resources } = this.player;
        
        // Check health first (most critical)
        if (resources.health <= 0) {
            return { type: 'health', message: `Your health has failed you. Game Over.` };
        }
        
        // Check motivation
        if (resources.motivation <= 0) {
            return { type: 'motivation', message: `You've lost all motivation to continue your musical journey. Game Over.` };
        }
        
        // Check age limit
        if (age >= 120) {
            return { type: 'natural_end', message: `You had a great life, now you rest. Game Over.` };
        }
        
        // Check money game over by age
        const ageLimit = age >= 40 ? -5000 : (age >= 30 ? -1000 : -50);
        if (resources.money < ageLimit) {
            return { type: 'bankruptcy', message: `You've gone too far into debt! Game Over.` };
        }
        
        return null;
    }

    // Check victory conditions
    checkVictory() {
        const { resources, age } = this.player;
        const victories = [];

        // Legend Status
        if (resources.fame > 90 && resources.audience > 1000000) {
            victories.push('Legend Status');
        }

        // Financial Freedom
        if (resources.money > 1000000) {
            victories.push('Financial Freedom');
        }

        // Life Satisfaction (simplified - checking if over 60 and high happiness/health)
        if (age > 60 && resources.happiness > 80 && resources.health > 60) {
            victories.push('Life Satisfaction');
        }

        return victories;
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
            gameLog: [],
            flags: [],
            phaseCount: 0,
            usedQuestions: [],
            usedOpportunities: []
        };
        this.currentScreen = 'welcome';
        this.initialized = false;
        this.currentQuestion = null;
        this.currentOpportunity = null;
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

    async startGame() {
        const playerName = document.getElementById('player-name').value.trim();
        if (playerName) {
            // Load game data first
            const dataLoaded = await this.gameState.loadGameData();
            if (!dataLoaded) {
                alert('Failed to load game data. Please refresh and try again.');
                return;
            }

            this.gameState.initializeGame(playerName);
            this.switchScreen('game');
            this.updateUI();
            
            // Start the first phase
            this.startDecisionPhase();
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

        // Reverse the array to show most recent entries at the top
        const reversedLog = [...this.gameState.player.gameLog].reverse();
        
        reversedLog.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry slide-in';
            logEntry.innerHTML = `
                <span class="log-time">Age ${entry.age}</span>
                <span class="log-text">${entry.text}</span>
            `;
            logContainer.appendChild(logEntry);
        });

        // No need to scroll since newest entries are now at the top
    }

    // Start Decision Phase
    startDecisionPhase() {
        this.gameState.player.phase = 'decision';
        
        // Get available questions
        const availableQuestions = this.gameState.getAvailableQuestions();
        
        if (availableQuestions.length === 0) {
            // No questions available, log this and skip to opportunity phase
            this.gameState.addLogEntry("No new decisions to make at this stage of life. Moving to opportunities...");
            this.startOpportunityPhase();
            return;
        }

        // Pick a random question
        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        this.gameState.currentQuestion = randomQuestion;

        // Mark question as used
        if (!this.gameState.player.usedQuestions.includes(randomQuestion.id)) {
            this.gameState.player.usedQuestions.push(randomQuestion.id);
        }

        // Update UI
        this.displayQuestion(randomQuestion);
        this.updateUI();
    }

    // Start Opportunity Phase
    startOpportunityPhase() {
        this.gameState.player.phase = 'opportunity';
        
        // Get available opportunities
        const availableOpportunities = this.gameState.getAvailableOpportunities();
        
        if (availableOpportunities.length === 0) {
            // No opportunities available, advance age and restart cycle
            this.advanceAge();
            return;
        }

        // Pick a random opportunity
        const randomOpportunity = availableOpportunities[Math.floor(Math.random() * availableOpportunities.length)];
        this.gameState.currentOpportunity = randomOpportunity;

        // Mark opportunity as used
        if (!this.gameState.player.usedOpportunities.includes(randomOpportunity.id)) {
            this.gameState.player.usedOpportunities.push(randomOpportunity.id);
        }

        // Update UI
        this.displayOpportunity(randomOpportunity);
        this.updateUI();
    }

    // Display question content
    displayQuestion(question) {
        document.getElementById('scenario-title').textContent = question.title || 'Decision Time';
        document.getElementById('scenario-text').textContent = question.text;

        // Update choice buttons
        const choicesContainer = document.querySelector('.choices-container');
        choicesContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.dataset.choice = index;
            
            // Check if choice is available (meets requirements)
            const isAvailable = this.gameState.checkRequirements(option.requires || {});
            
            if (!isAvailable) {
                button.classList.add('disabled');
                button.disabled = true;
                button.innerHTML = `<span class="choice-text">${option.text} (Requirements not met)</span>`;
            } else {
                button.innerHTML = `<span class="choice-text">${option.text}</span>`;
            }

            button.addEventListener('click', () => {
                if (!button.disabled) {
                    this.handleQuestionChoice(index);
                }
            });

            choicesContainer.appendChild(button);
        });
    }

    // Display opportunity content
    displayOpportunity(opportunity) {
        document.getElementById('scenario-title').textContent = opportunity.title;
        document.getElementById('scenario-text').textContent = opportunity.description;

        // Update choice buttons
        const choicesContainer = document.querySelector('.choices-container');
        choicesContainer.innerHTML = '';

        opportunity.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.dataset.choice = index;
            button.innerHTML = `<span class="choice-text">${choice.text}</span>`;

            button.addEventListener('click', () => {
                this.handleOpportunityChoice(index);
            });

            choicesContainer.appendChild(button);
        });
    }

    // Handle question choice
    handleQuestionChoice(choiceIndex) {
        const question = this.gameState.currentQuestion;
        const selectedOption = question.options[choiceIndex];

        // Disable all buttons to prevent multiple clicks
        this.disableAllChoiceButtons();

        // Apply effects
        const changes = this.gameState.applyEffects(selectedOption.effects);

        // Add unlocks and flags
        if (selectedOption.unlocks) {
            for (let unlock of selectedOption.unlocks) {
                if (!this.gameState.player.flags.includes(unlock)) {
                    this.gameState.player.flags.push(unlock);
                }
            }
        }

        // Log the choice
        this.gameState.addLogEntry(`${selectedOption.text} - ${this.formatEffectSummary(changes)}`);

        // Animate changes
        this.animateChanges(changes);

        // Check game over
        const gameOver = this.gameState.checkGameOver();
        if (gameOver) {
            this.showGameOver(gameOver);
            return;
        }

        // Move to opportunity phase
        setTimeout(() => {
            this.startOpportunityPhase();
        }, 2000);
    }

    // Handle opportunity choice
    handleOpportunityChoice(choiceIndex) {
        const opportunity = this.gameState.currentOpportunity;
        const selectedChoice = opportunity.choices[choiceIndex];

        // Disable all buttons to prevent multiple clicks
        this.disableAllChoiceButtons();

        // Calculate outcome based on formula
        const outcome = this.calculateOpportunityOutcome(selectedChoice);

        // Apply effects
        const changes = this.gameState.applyEffects(outcome.effects);

        // Add flags if any
        if (outcome.effects.flags) {
            for (let flag of outcome.effects.flags) {
                if (!this.gameState.player.flags.includes(flag)) {
                    this.gameState.player.flags.push(flag);
                }
            }
        }

        // Log the outcome
        this.gameState.addLogEntry(`${selectedChoice.text} - ${outcome.text} ${this.formatEffectSummary(changes)}`);

        // Animate changes
        this.animateChanges(changes);

        // Check game over
        const gameOver = this.gameState.checkGameOver();
        if (gameOver) {
            this.showGameOver(gameOver);
            return;
        }

        // Check victory
        const victories = this.gameState.checkVictory();
        if (victories.length > 0) {
            this.showVictory(victories);
            return;
        }

        // Advance age and start new cycle
        setTimeout(() => {
            this.advanceAge();
        }, 2000);
    }

    // Disable all choice buttons to prevent multiple clicks
    disableAllChoiceButtons() {
        document.querySelectorAll('.choice-button').forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.6';
        });
    }

    // Calculate opportunity outcome
    calculateOpportunityOutcome(choice) {
        const stats = this.gameState.player.stats;
        
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
        
        // Roll for outcome
        let outcomeRoll = Math.random() * totalWeight;
        
        for (let outcome of outcomes) {
            outcomeRoll -= outcome.weight;
            if (outcomeRoll <= 0) {
                return outcome;
            }
        }

        // Fallback to last outcome
        return outcomes[outcomes.length - 1];
    }

    // Advance age and start new cycle
    advanceAge() {
        // Advance age by 3-5 years
        const ageIncrease = Math.floor(Math.random() * 3) + 3; // 3-5
        this.gameState.player.age += ageIncrease;
        this.gameState.player.phaseCount++;

        this.gameState.addLogEntry(`Time passes... You are now ${this.gameState.player.age} years old.`);

        // Apply age-related effects
        this.applyAgingEffects();

        this.updateUI();

        // Check game over after aging
        const gameOver = this.gameState.checkGameOver();
        if (gameOver) {
            this.showGameOver(gameOver);
            return;
        }

        // Start new decision phase
        setTimeout(() => {
            this.startDecisionPhase();
        }, 1500);
    }

    // Apply aging effects (health decay, living costs, etc.)
    applyAgingEffects() {
        const player = this.gameState.player;
        const age = player.age;
        let healthDecay = 0;
        let livingCosts = 0;
        let passiveIncome = 0;
        let merchSales = 0;
        let effectMessages = [];

        // Health decay based on age
        if (age >= 30) {
            if (age >= 65) {
                healthDecay = Math.floor(Math.random() * 3) + 4; // 4-6
                effectMessages.push(`🏥 Senior health decline: -${healthDecay} Health`);
            } else if (age >= 50) {
                healthDecay = Math.floor(Math.random() * 3) + 3; // 3-5
                effectMessages.push(`⚕️ Middle-age health decline: -${healthDecay} Health`);
            } else if (age >= 40) {
                healthDecay = Math.floor(Math.random() * 3) + 2; // 2-4
                effectMessages.push(`🩺 Age-related health decline: -${healthDecay} Health`);
            } else {
                healthDecay = Math.floor(Math.random() * 2) + 1; // 1-2
                effectMessages.push(`💪 Minor aging effects: -${healthDecay} Health`);
            }

            player.resources.health -= healthDecay;
            player.resources.health = Math.max(0, player.resources.health);
        }

        // Living costs based on age and lifestyle (reduced for better balance)
        if (age >= 20) {
            if (age >= 65) {
                livingCosts = Math.floor(Math.random() * 400) + 800; // $800-1200
                effectMessages.push(`🏠 Senior living costs: -$${livingCosts}`);
            } else if (age >= 40) {
                livingCosts = Math.floor(Math.random() * 300) + 400; // $400-700
                effectMessages.push(`🏡 Adult living expenses: -$${livingCosts}`);
            } else if (age >= 30) {
                livingCosts = Math.floor(Math.random() * 200) + 300; // $300-500
                effectMessages.push(`🏘️ Established adult costs: -$${livingCosts}`);
            } else {
                livingCosts = Math.floor(Math.random() * 150) + 50; // $50-200
                effectMessages.push(`🏠 Young adult expenses: -$${livingCosts}`);
            }

            player.resources.money -= livingCosts;
        }

        // Fame-based income (passive earnings)
        if (player.resources.fame > 0) {
            passiveIncome = Math.floor(player.resources.fame * 10); // $10 per fame point
            player.resources.money += passiveIncome;
            effectMessages.push(`⭐ Fame royalties: +$${passiveIncome} (${player.resources.fame} fame × $10)`);
        }

        // Audience-based merchandise sales
        if (player.resources.audience > 100) {
            merchSales = Math.floor(player.resources.audience * 0.05); // $0.05 per audience member
            player.resources.money += merchSales;
            effectMessages.push(`🛒 Merchandise sales: +$${merchSales} (${player.resources.audience.toLocaleString()} fans × $0.05)`);
        }

        // Calculate net financial change
        const netMoney = passiveIncome + merchSales - livingCosts;
        const healthChange = healthDecay > 0 ? -healthDecay : 0;

        // Create summary log entry
        if (effectMessages.length > 0) {
            let summaryParts = [];
            
            if (healthChange < 0) {
                summaryParts.push(`Health: ${healthChange}`);
            }
            
            if (netMoney !== 0) {
                const sign = netMoney > 0 ? '+' : '';
                summaryParts.push(`Money: ${sign}$${netMoney}`);
            }

            const summary = summaryParts.length > 0 ? ` (Net: ${summaryParts.join(', ')})` : '';
            
            this.gameState.addLogEntry(`📅 Aging effects:${summary}`);
            
            // Add detailed breakdown
            effectMessages.forEach(message => {
                this.gameState.addLogEntry(`   ${message}`);
            });
        }
    }

    // Format effect summary for logs
    formatEffectSummary(changes) {
        const summaries = [];
        for (let [stat, change] of Object.entries(changes)) {
            if (change.change !== 0) {
                const sign = change.change > 0 ? '+' : '';
                summaries.push(`${stat}: ${sign}${change.change}`);
            }
        }
        return summaries.length > 0 ? `(${summaries.join(', ')})` : '';
    }

    // Animate changes with colors
    animateChanges(changes) {
        for (let [stat, change] of Object.entries(changes)) {
            if (change.change !== 0) {
                if (this.gameState.player.stats.hasOwnProperty(stat)) {
                    this.animateStatChange(stat, change.old, change.new);
                } else if (this.gameState.player.resources.hasOwnProperty(stat)) {
                    this.animateResourceChange(stat, change.old, change.new);
                }
            }
        }
        this.updateUI();
    }

    // Show game over screen
    showGameOver(gameOverInfo) {
        document.getElementById('scenario-title').textContent = 'Game Over';
        document.getElementById('scenario-text').textContent = gameOverInfo.message;
        
        const choicesContainer = document.querySelector('.choices-container');
        choicesContainer.innerHTML = '';
        
        const resetButton = document.createElement('button');
        resetButton.className = 'choice-button';
        resetButton.innerHTML = '<span class="choice-text">Start New Game</span>';
        resetButton.addEventListener('click', () => this.resetGame());
        choicesContainer.appendChild(resetButton);
    }

    // Show victory screen
    showVictory(victories) {
        document.getElementById('scenario-title').textContent = 'Victory!';
        document.getElementById('scenario-text').textContent = `Congratulations! You've achieved: ${victories.join(', ')}. You can continue playing or start a new game.`;
        
        const choicesContainer = document.querySelector('.choices-container');
        choicesContainer.innerHTML = '';
        
        const continueButton = document.createElement('button');
        continueButton.className = 'choice-button';
        continueButton.innerHTML = '<span class="choice-text">Continue Playing</span>';
        continueButton.addEventListener('click', () => this.advanceAge());
        choicesContainer.appendChild(continueButton);
        
        const resetButton = document.createElement('button');
        resetButton.className = 'choice-button';
        resetButton.innerHTML = '<span class="choice-text">Start New Game</span>';
        resetButton.addEventListener('click', () => this.resetGame());
        choicesContainer.appendChild(resetButton);
    }

    handleChoice(choiceNumber) {
        // This method is now deprecated but kept for compatibility
        console.log(`Legacy choice handler called: ${choiceNumber}`);
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
