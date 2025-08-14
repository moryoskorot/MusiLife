# Gameplay Mechanics - Life of a Musician

## Game Overview

"Life of a Musician" is a narrative-driven life simulation where players guide an aspiring musician from childhood to stardom (or failure). The game features alternating gameplay phases that simulate the unpredictable journey of a musical career through meaningful choices and chance encounters.

## Core Game Loop

### Phase Structure
The game alternates between two distinct phases:

1. **Decision Phase** (Multiple Choice Questions)
2. **Opportunity Phase** (Text-Based Scenarios)

Each complete cycle advances the player's age by 3-5 years.

## Phase 1: Decision Phase

### Overview
Players answer 4-5 multiple choice questions that shape their character's development and unlock future opportunities.

### Question Types

#### 🎯 **Skill Development**
- "How do you spend your free time?"
  - Practice scales (↑ Skill, ↓ Happiness)
  - Write lyrics (↑ Creativity, ↑ Intelligence)
  - Perform for friends (↑ Charisma, ↑ Happiness)
  - Play video games (↑ Happiness, ↓ Motivation)

#### 💼 **Career Choices**
- "A local band needs a bassist. You:"
  - Audition immediately (Requires Rhythm > 5)
  - Learn bass first (↑ Skill, ↑ Rhythm)
  - Recommend a friend (↑ Charisma, potential future favor)
  - Focus on your current instrument (↑ Primary skill)

#### 🎭 **Social Situations**
- "At a music industry party, you:"
  - Network aggressively (↑ Fame, ↓ Happiness)
  - Jam with other musicians (↑ Skill, ↑ Audience)
  - Enjoy the free bar (↑ Happiness, ↓ Health, ↓ Money)
  - Leave early to practice (↑ Skill, ↓ Charisma)

#### 💰 **Financial Decisions**
- "You've saved $500. You:"
  - Buy new equipment (↑ Skill potential, ↓ Money)
  - Record a demo (↑ Fame potential, ↓ Money)
  - Save it (↑ Money, ↑ Intelligence)
  - Throw a showcase party (↑ Audience, ↓ Money)

### Question Impact System
- **Immediate Effects**: Direct stat changes
- **Unlocked Options**: Future opportunities become available/unavailable
- **Relationship Changes**: NPCs remember your choices
- **Reputation Building**: Industry perception accumulates

## Phase 2: Opportunity Phase

### Overview
Text-based scenarios where players face significant career moments with risk/reward mechanics.

### Opportunity Categories

#### 🎸 **Performance Opportunities**
**Example: "Jam with an acoustic guitar around a campfire"**
- Input Options:
  - "Play a crowd favorite"
  - "Debut an original song"
  - "Show off with a difficult piece"
  - "Let others lead, support them"

**Possible Outcomes (Modified by stats + luck):**
- Critical Success: Viral moment, ↑↑ Audience, ↑ Fame
- Success: New fans, ↑ Audience, ↑ Happiness
- Mixed: Some enjoy it, minor gains
- Failure: Awkward performance, ↓ Motivation
- Critical Failure: Fall into fire, injury, ↓↓ Health, can't play for 6 months

#### 🎤 **Career Milestones**
**Example: "Join the school play"**
- Input Options:
  - "Audition for the lead"
  - "Join the orchestra"
  - "Handle sound design"
  - "Write original music for it"

**Outcome Factors:**
- Charisma affects lead role success
- Skill affects orchestra performance
- Intelligence affects technical roles
- Creativity affects composition success

#### 📀 **Industry Encounters**
**Example: "A record label scout approaches you"**
- Input Options:
  - "Sign immediately"
  - "Negotiate better terms"
  - "Ask for time to consider"
  - "Decline and stay independent"

**Long-term Consequences:**
- Contracts affect future earnings
- Label support vs. creative freedom
- Industry reputation implications

#### 🌟 **Random Events**
**Example: "Your video goes viral on social media"**
- Input Options:
  - "Capitalize with more content"
  - "Book immediate shows"
  - "Ignore it and stay focused"
  - "Hire a manager"

### Risk/Reward Mechanics

#### Success Calculation
```
Success = (Relevant Stats + Luck Roll) vs. Difficulty Threshold
```

#### Outcome Ranges
1. **Critical Success** (20% above threshold)
   - Maximum rewards
   - Bonus opportunities
   - Permanent advantages

2. **Success** (Meet threshold)
   - Expected rewards
   - Progression as planned

3. **Partial Success** (Within 20% of threshold)
   - Reduced rewards
   - Mixed consequences

4. **Failure** (Below threshold)
   - Negative consequences
   - Lost opportunities

5. **Critical Failure** (20% below threshold)
   - Severe penalties
   - Potential game-changing setbacks

## Progression System

### Age Milestones
- **13-16**: Tutorial phase, low stakes, learning basics
- **17-21**: Early career, college decisions, first bands
- **22-30**: Professional development, major career choices
- **31-45**: Established career, legacy building
- **46-64**: Veteran phase, mentorship, managing health
- **65+**: Living Legend phase, optional retirement, legacy focus

### Branching Narratives
Choices create distinct career paths:
- **Indie Route**: Creative freedom, financial struggles
- **Commercial Route**: Financial success, artistic compromises
- **Academic Route**: Teaching, steady income, respect
- **Behind-the-Scenes**: Production, songwriting, industry roles

## Win/Lose Conditions

### Victory Conditions
Achieve one or more:
- 🏆 **Legend Status**: Fame > 90, Audience > 1M
- 💎 **Financial Freedom**: Money > $1M, passive income secured
- 🎨 **Artistic Legacy**: Created 10+ critically acclaimed works
- 😊 **Life Satisfaction**: End with Happiness > 80, Health > 60, Age > 60

**Note**: Game continues after victory - retirement at 65+ is optional!

### Failure Conditions
Game ends immediately if:
- 💀 **Death**: Health reaches 0
- 💸 **Bankruptcy**: Money debt exceeds age-based limits:
  - Age 13-30: -$50
  - Age 31-40: -$1,000
  - Age 41+: -$5,000
- 😔 **Giving Up**: Motivation reaches 0

### Scoring System
Final score calculated from:
- Peak fame achieved (×1000)
- Total audience reached (×1)
- Money earned lifetime (×0.1)
- Albums/Songs released (×500)
- Years survived (×100)
- Final happiness (×10)

## Difficulty Scaling

### Dynamic Difficulty
- Success raises future opportunity difficulty
- Failure provides easier recovery options
- Age increases health/money pressure

### Player Agency
- Can choose safe vs. risky options
- Resource management affects available choices
- Building stats early pays off later

## Replayability Features

### Multiple Endings
- 15+ unique career endings
- Character epilogues based on choices
- "Where are they now?" summaries

### Achievement System
- "One Hit Wonder": Peak then fade
- "Slow Burn": Gradual success over time
- "Phoenix": Recover from rock bottom
- "Jack of All Trades": Master multiple instruments
- "Industry Mogul": Build music empire

### New Game Plus
- Start with slight stat bonuses
- Unlock new starting scenarios
- Access to rare opportunities
