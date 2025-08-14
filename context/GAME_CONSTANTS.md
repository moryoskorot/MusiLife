# Game Constants - Life of a Musician

This file serves as the single source of truth for all numerical values and constants in the game.

## Character Stats

### Stat Ranges
- **Minimum Value**: -5 (severe debuffs, injuries)
- **Maximum Value**: 25 (legendary status)
- **Starting Range**: 0-10 (randomly distributed)
- **Total Starting Points**: 35-45 (distributed across 7 stats)

### Starting Stat Distribution
```javascript
const STAT_CONSTANTS = {
  MIN_VALUE: -5,
  MAX_VALUE: 25,
  STARTING_MIN: 0,
  STARTING_MAX: 10,
  TOTAL_STARTING_POINTS_MIN: 35,
  TOTAL_STARTING_POINTS_MAX: 45
};
```

## Resources

### Motivation
- **Range**: 0 to ∞ (uncapped)
- **Starting Range**: 60-80
- **Critical Level**: < 20
- **Game Over**: 0

### Happiness
- **Range**: 0 to ∞ (uncapped)
- **Starting Range**: 40-90
- **Critical Level**: < 15
- **Effects**: Low happiness reduces motivation gain, increases health loss

### Audience
- **Range**: 0 to ∞
- **Starting Value**: 0
- **Milestones**:
  - 100: Local following
  - 1,000: Regional
  - 10,000: National
  - 100,000+: International

### Fame
- **Range**: 0 to ∞ (uncapped)
- **Starting Value**: 0
- **Tiers**:
  - 0-20: Unknown
  - 21-40: Local
  - 41-60: Regional
  - 61-80: National
  - 81-100: Global
  - 100+: International Superstar
- **Income Effects**:
  - Performance Multiplier: (Fame/100) + 1
  - Merchandise Sales: Fame × $0.50 per phase
  - Higher fame unlocks premium opportunities

### Money
- **Range**: -∞ to ∞
- **Starting Range**: $0-$400
- **Critical Level**: < $0 (debt)
- **Game Over** (varies by age):
  - Age 13-20: -$50
  - Age 20-30: -$50
  - Age 30-40: -$1,000
  - Age 40+: -$5,000

### Health
- **Range**: 0 to ∞ (uncapped)
- **Starting Range**: 90-100
- **Critical Level**: < 30
- **Game Over**: 0

```javascript
const RESOURCE_CONSTANTS = {
  motivation: {
    startMin: 60,
    startMax: 80,
    critical: 20,
    gameOver: 0,
    capped: false
  },
  happiness: {
    startMin: 40,
    startMax: 90,
    critical: 15,
    capped: false
  },
  audience: {
    start: 0,
    milestones: [100, 1000, 10000, 100000],
    capped: false
  },
  fame: {
    start: 0,
    tiers: {
      unknown: [0, 20],
      local: [21, 40],
      regional: [41, 60],
      national: [61, 80],
      global: [81, 100],
      superstar: [101, Infinity]
    },
    capped: false,
    incomeMultiplier: (fame) => (fame / 100) + 1,
    merchSales: (fame) => fame * 0.5
  },
  money: {
    startMin: 0,
    startMax: 400,
    critical: 0,
    gameOverByAge: {
      teen: -50,
      youngAdult: -50,
      adult: -1000,
      veteran: -5000,
      livingLegend: -5000
    }
  },
  health: {
    startMin: 90,
    startMax: 100,
    critical: 30,
    gameOver: 0,
    capped: false
  }
};
```

## Age System

### Age Progression
- **Starting Age**: 13-16 years old
- **Age Increment**: 3-5 years per phase
- **Optional Retirement**: 65+ (can continue playing)

### Age Brackets
- **Teen**: 13-19
  - Higher motivation gain
  - Lower money needs
  - Learning bonuses
- **Young Adult**: 20-29
  - Peak performance years
  - Balanced stats
- **Adult**: 30-45
  - Experience bonuses
  - Family considerations
  - Slight health decay
- **Veteran**: 46-64
  - Legacy opportunities
  - Health concerns
  - Wisdom bonuses
- **Living Legend**: 65+
  - Maximum prestige opportunities
  - Mentorship roles
  - Legacy building
  - Significant health management

```javascript
const AGE_CONSTANTS = {
  startMin: 13,
  startMax: 16,
  incrementMin: 3,
  incrementMax: 5,
  optionalRetirement: 65,
  brackets: {
    teen: { min: 13, max: 19 },
    youngAdult: { min: 20, max: 29 },
    adult: { min: 30, max: 45 },
    veteran: { min: 46, max: 64 },
    livingLegend: { min: 65, max: Infinity }
  }
};
```

## Game Balance

### Stat Change Guidelines
- **Minor Change**: 1 point
- **Moderate Change**: 2-3 points
- **Major Change**: 4-5 points
- **Exceptional Change**: 6+ points (rare)

### Risk/Reward Ratios
- **Low Risk**: 80% success chance, 1-2 point rewards
- **Medium Risk**: 60% success chance, 2-4 point rewards
- **High Risk**: 40% success chance, 4-6 point rewards
- **Extreme Risk**: 20% success chance, 6-10 point rewards

### Success Thresholds
- **Age 13-19**: Base threshold 30-40
- **Age 20-29**: Base threshold 40-50
- **Age 30-45**: Base threshold 50-60
- **Age 46+**: Base threshold 60-70

### Resource Drain Rates (per phase)
- **Money**: 
  - Teen: $0
  - Young Adult: $100-500
  - Adult: $500-1000
  - Veteran: $1000-2000
  - Living Legend: $2000-3000
- **Health Decay** (after age 30):
  - Age 30-40: -1 to -2 per phase
  - Age 41-50: -2 to -3 per phase
  - Age 51-64: -3 to -5 per phase
  - Age 65+: -4 to -6 per phase

### Lifestyle Modifiers
- **Smoking** (optional choice):
  - Charisma: +1 immediate
  - Health Drain: +2 per phase
  - Vocals: -1 every 3 phases
  - Cost: $50 per phase

## Victory Conditions

### Legend Status
- Fame > 90
- Audience > 1,000,000

### Financial Freedom
- Money > $1,000,000
- Passive income secured

### Artistic Legacy
- 10+ critically acclaimed works
- Creativity > 20

### Life Satisfaction
- Happiness > 80
- Health > 60
- Age > 60

### Optional Retirement
- Age > 65
- Any victory condition achieved
- Can continue playing after "winning"

## Session Storage System

### Temporary Save
- **Purpose**: Refresh protection only
- **Storage**: Browser sessionStorage
- **Auto-save**: After each phase
- **Cleared**: When browser tab closes

### Game Log Export
- **Format**: Text file or JSON
- **Contents**: All choices, outcomes, and stats progression
- **Available**: At game end (win or lose)
- **Includes**: Character summary and final stats
