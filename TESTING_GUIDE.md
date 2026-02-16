# Testing & Verification Guide

## Pre-Test Setup

1. Clear browser cache and local storage:
   - F12 → Application tab → Clear site data
   - Or use incognito/private window

2. Open browser DevTools:
   - Press F12
   - Go to Console tab
   - Keep it open while testing

## Test Scenario 1: Complete Quiz Flow

### Steps:
```
1. Load app → Should see landing screen
2. Click "Start Quiz"
3. Answer all 10 questions:
   - Question 1: "Bheeshmaparvam" (or "beeshmaparvam")
   - Question 2: "Fried rice"
   - Question 3: "Getting married" (or "Marriage", "Wedding")
   - Question 4: "February 17" (or "February 2022", "17/2/2022")
   - Question 5: "college"
   - Question 6: "Munnar"
   - Question 7: "airpods"
   - Question 8: "Shirt"
   - Question 9: "Ki Kat" (or "KitKat", "Kit-Kat")
   - Question 10: "smile" (accept: heart, kindness, laugh, humor)
4. Submit last answer → Auto-navigate to results
```

### Expected Results:
```
✓ Results screen shows:
  - Correct: 10 (not 0)
  - Wrong: 0 (not 0)
  - Percentage: 100% (not 0%)
  - Message: "Perfect! You know me inside and out! 💯"
  
✓ Chart renders immediately with 100% fill

✓ Console shows:
  Quiz initialized: Object { 
    currentQuestion: 0, 
    totalQuestions: 10, 
    correctAnswers: 0, 
    wrongAnswers: 0 
  }
  
✓ No console errors
```

## Test Scenario 2: Partial Correct Answers

### Steps:
```
1. Start new quiz
2. Answer:
   - Q1: "Bheeshmaparvam" ✓ Correct
   - Q2: "Pizza" ✗ Wrong (correct: Fried rice)
   - Q3: "Getting married" ✓ Correct
   - Q4: "February 2020" ✗ Wrong
   - Q5: "college" ✓ Correct
   - Q6: "Goa" ✗ Wrong
   - Q7: "airpods" ✓ Correct
   - Q8: "Shoes" ✗ Wrong
   - Q9: "KitKat" ✓ Correct
   - Q10: "smile" ✓ Correct
3. Submit
```

### Expected Results:
```
✓ Results screen shows:
  - Correct: 6
  - Wrong: 4
  - Percentage: 60% (exactly)
  - Message: "Great! We have some catching up to do! 😊"

✓ Chart shows 60% filled (180 degrees out of 360, semi-circle)

✓ Percentage calculation verified:
  (6 correct / 10 total) * 100 = 60%
```

## Test Scenario 3: Navigation & State Preservation

### Steps:
```
1. Start quiz
2. Answer Q1 correctly
3. Answer Q2 incorrectly
4. (After Q2) Click home button (🏠)
5. Click "Start Quiz" again
6. Check if it:
   a) starts from Q1 (not Q3)
   b) has 0 correct/wrong (not previous scores)
```

### Expected Behavior:
```
✓ Clicking home goes to landing
✓ Clicking "Start Quiz" again RESTARTS fresh quiz
✓ Previous scores NOT shown (completely reset)
✓ Console shows "Quiz initialized" twice (two separate sessions)
```

## Test Scenario 4: Navigation After Completing Quiz

### Steps:
```
1. Complete quiz (answer all 10)
2. View results (correct: X, wrong: Y)
3. Click home (🏠)
4. Navigate back to quiz
5. Observe behavior
```

### Expected Behavior:
```
✓ Clicking home shows landing
✓ Clicking quiz icon (💑) or "Start Quiz":
  - Opens results screen (not quiz questions)
  - Shows correct scores from previous completion
  - Doesn't reset state or restart quiz
  
Reasoning: Quiz was already completed, so navigating to quiz
screen should show results instead of re-asking questions.
```

## Test Scenario 5: Multiple Results View

### Steps:
```
1. Complete quiz with 70% score
2. View results screen
3. Chart renders with 70%
4. Click home (🏠)
5. Click quiz icon (💑)
6. Observe results again
7. Click home again
8. Click quiz icon again
9. Repeat 3-4 times
```

### Expected Behavior:
```
✓ Each time, chart shows same 70%
✓ No duplicate charts
✓ No console errors about multiple instances
✓ Chart renders smoothly every time
✓ Memory doesn't leak (chart destroyed & recreated properly)
```

## Console Debugging Commands

Open DevTools Console (F12) and run:

```javascript
// Check state
console.log(quizState);
// Output: { currentQuestion: 5, correctAnswers: 3, wrongAnswers: 2, totalQuestions: 10, ... }

// Check if quiz started
console.log('Quiz started:', quizStarted);
// Output: Quiz started: true

// Check chart instance
console.log('Chart instance:', loveGaugeChart);
// Output: Chart instance: Chart { /* ... */ }

// Check percentage calculation
console.log('Percentage:', (quizState.correctAnswers / quizState.totalQuestions) * 100);
// Output: Percentage: 30

// Monitor state changes (watch for updates)
// Set breakpoint in submitQuizAnswer() to pause and inspect
```

## Expected Console Output

### After Quiz Initialization:
```
Quiz initialized: {
  currentQuestion: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 10,
  questions: [...]
}
```

### During Quiz (after each submission):
```
// No errors
// Screen updates smoothly
// Progress bar advances
```

### After Quiz Completion:
```
// No duplicate console messages
// Results screen shows with correct scores
// Chart renders with correct percentage
```

## Visual Verification Checklist

- [ ] **Landing screen**: Shows with anniversary message and "Start Quiz" button
- [ ] **Quiz screen**: 
  - Shows question 1 of 10
  - Progress bar visible
  - Input field ready to type
  - Current stats show 0 correct, 0 wrong
- [ ] **During quiz**:
  - Progress bar advances as questions answered
  - Stats update correctly (correct/wrong counts)
  - Progress text shows "Question X of 10"
- [ ] **Results screen**:
  - Shows all three stats (Correct, Wrong, Percentage)
  - All values are real numbers (not 0 or undefined)
  - Chart renders in the gaugeWrapper
  - Chart shows percentage value in center
  - Message matches percentage range
- [ ] **Chart appearance**:
  - Doughnut/semi-circle shape
  - Blue fill for score percentage
  - Gray background for remaining
  - Number displayed in center

## Error Scenarios to Check

### ❌ "result-correct is null" Error
```
Cause: HTML element missing or id mismatch
Fix: Verify index.html has:
  <span class="stat-value" id="result-correct">0</span>
```

### ❌ "loveGauge is null" Warning
```
Cause: Chart tried to render before canvas ready
Fix: Already fixed with requestAnimationFrame() and timeout
Should not see this warning
```

### ❌ Chart Multiple Instances
```
Cause: createLoveGauge() called multiple times without cleanup
Fix: Already fixed with loveGaugeChart.destroy()
Should only create one instance per results view
```

### ❌ State Shows Wrong Numbers
```
Cause: Quiz being re-initialized on navigation
Fix: Check quizStarted flag is working
console.log(quizStarted) should be true after quiz starts
```

### ❌ Division by Zero Error
```
Cause: Unknown
Fix: Already protected with ternary operator:
  quizState.totalQuestions > 0 ? ... : 0
Should never happen now
```

## Performance Check

Monitor while using for 5-10 minutes:

```javascript
// In DevTools Memory tab
// Watch for:
✓ Steady memory usage (no leaks)
✓ No growing chart instances
✓ Garbage collection working normally

// Check with:
Performance tab → Record 30 seconds of interaction
  ✓ No jank or dropped frames
  ✓ Smooth navigation between screens
  ✓ Chart renders in <1 second
```

## Final Sign-Off Checklist

Before considering the fix complete:

- [ ] Quiz completes successfully (all questions asked)
- [ ] Results show correct scores (not 0/0/0%)
- [ ] Chart renders with proper percentage
- [ ] Can restart quiz without old data leaking
- [ ] No console errors
- [ ] No duplicate charts created
- [ ] Navigation smooth between all screens
- [ ] Can view results multiple times
- [ ] Memory stable over extended use
- [ ] All DOM elements properly updated

## Rollback Plan (If Issues Found)

If something breaks, revert changes:
```bash
# Undo to original script.js
git checkout static/script.js

# Or manually restore from backup
```

## Success Criteria

✅ Quiz completion shows real scores
✅ Chart renders with correct percentage  
✅ State preserved across navigation
✅ No memory leaks or duplicate instances
✅ All DOM elements updated correctly
✅ No console errors
