# Best Practices for State Management in Single-Page JavaScript Apps

## 1. Centralized State Object Pattern

### ❌ Bad Practice: State Scattered Everywhere
```javascript
let correct = 0;
let wrong = 0;
let currentQ = 0;
let total = 0;
let questions = [];

// State is fragmented, hard to track
```

### ✅ Good Practice: Single Source of Truth
```javascript
let quizState = {
    currentQuestion: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    questions: [...]
};

// All state in one object - easy to log, debug, persist
console.log(quizState);  // See everything at once
```

## 2. Initialize State Once, Not On Every Navigation

### ❌ Bad Practice: Re-initialize on Navigation
```javascript
function navigateTo(screen) {
    if (screen === 'quiz') {
        // This resets quiz every time user navigates back!
        quizState.currentQuestion = 0;
        quizState.correctAnswers = 0;
    }
}
```

### ✅ Good Practice: Track Initialization Status
```javascript
let quizStarted = false;

function navigateTo(screen) {
    if (screen === 'quiz') {
        // Only initialize if not started
        if (!quizStarted) {
            initMainQuiz();
        }
        // Just show the screen, don't reset state
        showQuizQuestion();
    }
}
```

## 3. Separate Concerns: Initialization, State Updates, Navigation, Rendering

### ❌ Bad Practice: Mixed Concerns
```javascript
function startQuiz() {
    // Initialize
    state = { /* ... */ };
    
    // Update
    state.correctAnswers++;
    
    // Navigate
    document.getElementById('quiz').style.display = 'block';
    
    // Render
    document.getElementById('question').innerHTML = '...';
}
```

### ✅ Good Practice: Separate Concerns
```javascript
// 1. Initialize state
function initMainQuiz() {
    quizState = { /* ... */ };
}

// 2. Update state
function submitAnswer() {
    quizState.correctAnswers++;
}

// 3. Navigate/Show screen
function navigateTo(screenId) {
    document.getElementById(screenId).classList.add('active');
}

// 4. Render UI
function showQuizQuestion() {
    const question = quizState.questions[quizState.currentQuestion];
    document.getElementById('container').innerHTML = '...';
}
```

## 4. Use Flags to Track Application State

### ❌ Bad Practice: No Status Tracking
```javascript
// Is quiz running? Unknown without checking multiple variables
if (quizState.currentQuestion > 0) {
    // Maybe quiz started? Not clear
}
```

### ✅ Good Practice: Explicit Flags
```javascript
let quizStarted = false;
let quizCompleted = false;

function initMainQuiz() {
    quizStarted = true;
    quizCompleted = false;
}

function submitQuizAnswer() {
    // ... 
    if (quizState.currentQuestion >= quizState.totalQuestions) {
        quizCompleted = true;
    }
}

// Clear intent
if (!quizStarted) {
    // Quiz hasn't begun
}
```

## 5. Manage Side Effects (DOM, Charts, Timers) Separately

### ❌ Bad Practice: Mix State with Side Effects
```javascript
function submitAnswer() {
    quizState.correctAnswers++;
    
    // Side effect mixed with state
    document.getElementById('score').textContent = quizState.correctAnswers;
    
    // Another side effect
    redrawChart();
}

// Hard to track when side effects run
```

### ✅ Good Practice: Separate State from Effects
```javascript
// 1. Pure state update (no side effects)
function submitAnswer() {
    quizState.correctAnswers++;
    // State only - idempotent, testable
}

// 2. Render UI after state updates
function updateUI() {
    document.getElementById('score').textContent = quizState.correctAnswers;
}

// 3. Handle async operations separately
function renderChart() {
    // Wait for DOM to be ready
    requestAnimationFrame(() => {
        createLoveGauge(quizState.percentage);
    });
}

// 4. Orchestrate from navigation
function navigateTo(screen) {
    showScreen(screen);
    
    if (screen === 'results') {
        updateUI();
        renderChart();
    }
}
```

## 6. Handle Asynchronous DOM Operations Properly

### ❌ Bad Practice: Synchronous Assumptions
```javascript
function navigateTo(screen) {
    document.getElementById(screen).style.display = 'block';
    createChart();  // Chart canvas might not be rendered yet!
}
```

### ✅ Good Practice: Use requestAnimationFrame or setTimeout
```javascript
function navigateTo(screen) {
    // Show screen
    document.getElementById(screen).classList.add('active');
    
    // Defer chart creation until next paint cycle
    requestAnimationFrame(() => {
        createChart();
    });
}

// Alternative: if specific delay needed
setTimeout(() => {
    createChart();
}, 50);  // 50ms ensures DOM is rendered and measured
```

## 7. Resource Cleanup and Prevention of Memory Leaks

### ❌ Bad Practice: No Cleanup
```javascript
let chartInstance;

function createChart() {
    // Create new chart every time
    chartInstance = new Chart(ctx, { ... });
}

// If called multiple times: multiple instances, memory leak!
```

### ✅ Good Practice: Cleanup Before Creating
```javascript
let chartInstance = null;

function createChart() {
    // Destroy old instance
    if (chartInstance && typeof chartInstance.destroy === 'function') {
        chartInstance.destroy();
        chartInstance = null;
    }
    
    // Create new instance
    chartInstance = new Chart(ctx, { ... });
}

// Safe to call multiple times
```

## 8. Safe DOM Element Access

### ❌ Bad Practice: Unsafe Access
```javascript
function updateUI() {
    document.getElementById('element').textContent = value;  // Crash if element doesn't exist
}
```

### ✅ Good Practice: Defensive Access
```javascript
function updateUI() {
    const element = document.getElementById('element');
    if (element) {
        element.textContent = value;  // Safe update
    }
}
```

## 9. Logging and Debugging

### ❌ Bad Practice: No Visibility
```javascript
function submitAnswer() {
    quizState.correctAnswers++;
    // Silent - hard to debug
}
```

### ✅ Good Practice: Strategic Logging
```javascript
function submitAnswer() {
    quizState.correctAnswers++;
    
    console.log('Answer submitted:', {
        isCorrect,
        correctAnswers: quizState.correctAnswers,
        currentQuestion: quizState.currentQuestion,
        totalQuestions: quizState.totalQuestions
    });
}

function initMainQuiz() {
    quizStarted = true;
    quizState.currentQuestion = 0;
    // ... reset other state
    
    // Log initialization for debugging
    console.log('Quiz initialized:', quizState);
}

// Browser console shows:
// Quiz initialized: { currentQuestion: 0, correctAnswers: 0, ... }
// Answer submitted: { isCorrect: true, correctAnswers: 1, ... }
```

## 10. Avoid Global Namespace Pollution

### ❌ Bad Practice: Window Globals
```javascript
window.quiz = { /* state */ };
window.chart = chartInstance;
window.updateUI = function() { /* ... */ };

// Pollutes global scope, conflicts with libraries
```

### ✅ Good Practice: Module-Level Variables
```javascript
// At module/file level
let quizState = { /* state */ };
let chartInstance = null;

function updateUI() {
    // ... private to this module
}

// No global pollution, can use in other modules via imports
```

## 11. Handle Circular Navigation

### ❌ Bad Practice: Forget Previous State
```javascript
function navigateTo(screen) {
    if (screen === 'quiz') {
        initMainQuiz();  // Reset every time!
    }
}

// User: Start Quiz → Go Home → Start Quiz → Old progress lost!
```

### ✅ Good Practice: Remember State
```javascript
let quizStarted = false;

function navigateTo(screen) {
    if (screen === 'quiz') {
        if (!quizStarted) {
            initMainQuiz();  // Only initialize once
        }
        showQuizQuestion();  // Resume or show first
    }
}

// User: Start Quiz → Home → Quiz → Progress preserved!
```

## 12. Safe Mathematical Operations

### ❌ Bad Practice: Unsafe Division
```javascript
let percentage = (correct / total) * 100;  // Crashes if total = 0
```

### ✅ Good Practice: Guard Against Edge Cases
```javascript
let percentage = total > 0 
    ? Math.round((correct / total) * 100) 
    : 0;  // Default to 0 if no questions
```

## Architecture Pattern Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION STRUCTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  STATE LAYER (Single Source of Truth)                │   │
│  │  • quizState object                                  │   │
│  │  • quizStarted flag                                  │   │
│  │  • chartInstance reference                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  LOGIC LAYER (Pure Functions - No Side Effects)      │   │
│  │  • initMainQuiz()  → Reset state only                │   │
│  │  • submitAnswer()  → Update counters only            │   │
│  │  • calculateScore() → Math only                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NAVIGATION LAYER                                     │   │
│  │  • navigateTo(screen) → Show/hide screens            │   │
│  │  • Check state flags before initializing             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  RENDERING LAYER (Side Effects)                       │   │
│  │  • updateUI() → DOM updates                          │   │
│  │  • createChart() → Chart.js creation                 │   │
│  │  • Uses requestAnimationFrame/setTimeout for timing  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Real-World Example Flow

```javascript
// 1. Initialize (called once)
startQuiz()
  ↓
initMainQuiz()
  • quizState = { currentQuestion: 0, correctAnswers: 0, ... }
  • quizStarted = true
  
// 2. Navigate
navigateTo('quiz')
  • Show quiz screen
  • Call showQuizQuestion()
  
// 3. Render
showQuizQuestion()
  • Display current question from quizState
  
// 4. User interacts
submitQuizAnswer()
  • Update quizState.correctAnswers
  • Increment quizState.currentQuestion
  
// 5. Check completion
if (quizState.currentQuestion >= quizState.totalQuestions)
  → showQuizResults()
    → navigateTo('results')
  
// 6. Navigate to results
navigateTo('results')
  • Show results screen
  • requestAnimationFrame(() => updateResultsScreen())
  
// 7. Render results
updateResultsScreen()
  • Calculate percentage (safe division)
  • Update DOM with results
  • setTimeout(() => createLoveGauge(percentage), 50)
  
// 8. Create chart (after DOM ready)
createLoveGauge(percentage)
  • Destroy old chart instance
  • Create new Chart.js instance
  
// Result: Correct data displayed, chart rendered, no memory leaks
```

## Checklist for State Management

- [ ] All state in single object/set of objects
- [ ] Initialization function separate from navigation
- [ ] Flags to track application status
- [ ] No side effects in state update functions
- [ ] DOM access guarded with null checks
- [ ] Resource cleanup before creation
- [ ] requestAnimationFrame/setTimeout for DOM-dependent code
- [ ] Strategic console.log for debugging
- [ ] No window.* global pollution
- [ ] Safe math operations (divide by zero guards)
- [ ] Circular navigation handled (state preserved)
- [ ] Error boundaries for edge cases

## Conclusion

Good state management in single-page apps comes down to:
1. **Single source of truth** - One place for each piece of state
2. **Separation of concerns** - State, logic, navigation, rendering are separate
3. **Predictability** - Same inputs always produce same results
4. **Debuggability** - Easy to log and inspect state
5. **Robustness** - Handle edge cases and async operations properly
6. **Maintainability** - Others can understand and modify your code
