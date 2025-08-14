# Issues and Implementation Priorities - Life of a Musician

## 🚨 Critical Issues & Obstacles

### 1. Data Structure Inconsistencies ✅ RESOLVED
**Problem**: Conflicting information across documentation files
- **Stats Range Mismatch**: PLAYER.md says 1-10, TECHNICAL.md shows 1-20
- **Starting Money**: PLAYER.md shows $100-$1000 range, TECHNICAL.md shows fixed $500
- **Starting Resources**: Various inconsistencies in initial values

**Impact**: High - Could cause confusion during implementation and gameplay balancing

**RESOLUTION**:
- **Stats**: Range from -5 to 25, starting at 0-10 (random)
- **Starting Money**: $0-$400 (random) for teen realism
- **Starting Resources**:
  - Motivation: 60-80 (random)
  - Happiness: 40-90 (random)
  - Health: 90-100 (random)
  - Audience: 0 (fixed)
  - Fame: 0 (fixed)
  - All resources uncapped on upper limit (except where noted)

---

### 2. Missing Game Balance Framework
**Problem**: No clear mathematical formulas for progression
- Age-based stat decay not defined
- Resource drain over time not specified
- Difficulty scaling formulas missing
- "tempDisable" mechanic not fully explained

**Impact**: High - Core gameplay could be unbalanced or broken

**Discussion Points**:
- How should health decay with age? Linear or exponential?
- Should living costs increase with fame/age?
- How do temporary disabilities work mechanically?

---

### 3. Incomplete Opportunity System ✅ RESOLVED
**Problem**: JSON examples show incomplete data
- Only "play_popular" has full outcome definitions
- Other choices (play_original, play_technical, decline) missing outcomes
- No clear template for creating balanced opportunities

**Impact**: Critical - Can't implement opportunities without complete data

**RESOLUTION**:
- **Flexible choices**: 2-4 choices per opportunity
- **Flexible outcomes**: 2-5 outcome tiers per choice
- **Custom formulas**: Each opportunity has weighted stat requirements
- **Dice roll system**: 1-100 roll with weighted outcome ranges
- **Examples provided**: TV ad (charisma-based), barfight (health-based), investment (intelligence+luck)
- **Trait system**: Persistent flags affect future opportunities

---

### 4. Save System Vulnerabilities ✅ RESOLVED
**Problem**: Current design has limitations
- LocalStorage size limits (~5-10MB)
- No save corruption handling
- No migration system for updates
- No validation of loaded data

**Impact**: Medium - Could lose player progress

**RESOLUTION**:
- Changed to session-only storage (no persistent saves)
- Each game played in single sitting
- SessionStorage for refresh protection only
- Export game log at end for record keeping
- No save slots needed

---

### 5. UI Scalability Issues
**Problem**: Interface might be overwhelming
- 13 total stats/resources to display
- No accessibility considerations
- Missing loading/transition states
- Mobile layout unclear

**Impact**: Medium - Poor user experience

**Discussion Points**:
- Should some stats be hidden/collapsed by default?
- Color scheme for colorblind users?
- Minimum supported screen size?

---

## 🔧 Technical Debt Prevention

### Missing Architecture Components

#### 1. Event System
**Need**: Decoupled communication between game components
**Discussion**: Should we use native CustomEvents or a pub/sub library?

#### 2. State Machine
**Need**: Managing game phases and valid transitions
**Discussion**: Simple switch/case or formal state machine pattern?

#### 3. Animation Queue
**Need**: Preventing UI conflicts during rapid changes
**Discussion**: CSS transitions or JavaScript animation library?

#### 4. Content Loader
**Need**: Centralized system for managing JSON data with caching
**Discussion**: Load all at start or lazy load as needed?

---

## 📋 Implementation Priority

### Phase 1: Critical Foundation (Must Complete First)
1. **Standardize Numerical Values**
   - [x] Decide on stat ranges (-5 to 25, starting 0-10)
   - [x] Finalize starting values for all resources
   - [x] Document all ranges in a single source of truth

2. **Complete Opportunity Definitions**
   - [x] Create outcome data for all choice options
   - [x] Establish balance guidelines
   - [x] Create opportunity template

3. **Basic Error Handling**
   - [ ] Try/catch blocks for critical operations
   - [ ] Graceful handling of missing data
   - [ ] User-friendly error messages

---

### Phase 2: Important Features (Core Gameplay)
1. **Game Balance Formulas**
   - [ ] Age progression effects
   - [ ] Difficulty scaling
   - [ ] Resource drain rates
   - [ ] Success calculation refinement

2. **Content Validation Tools**
   - [ ] JSON schema definitions
   - [ ] Validation scripts
   - [ ] Balance testing framework

3. **Session Storage System**
   - [x] Session storage for refresh protection
   - [x] Export game log functionality
   - [x] Clear session on game end

---

### Phase 3: Enhancement (Polish & Scale)
1. **Accessibility Features**
   - [ ] Colorblind modes
   - [ ] Screen reader support
   - [ ] Keyboard navigation

2. **Performance Optimizations**
   - [ ] Virtual scrolling
   - [ ] Lazy loading
   - [ ] State compression

3. **Content Management Interface**
   - [ ] Visual editor for questions/opportunities
   - [ ] Balance testing tools
   - [ ] Preview system

---

## 📝 Discussion Framework

For each issue, we should address:
1. **Current State**: What exists now
2. **Desired State**: What we want
3. **Options**: Different approaches
4. **Decision**: What we'll implement
5. **Rationale**: Why we chose this approach

Ready to start with Issue #1: Data Structure Inconsistencies?
