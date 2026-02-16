// Navigation
/*
    ANNIVERSARY APP - Editable Content & Privacy Notes

    - Edit quiz questions: modify `quizState.questions` below. Each item has:
            { question: "...", acceptableAnswers: ['a','b'] }
        Answers are matched case-insensitively and trimmed; you can list multiple acceptable answers.

    - Edit landing wish: see `templates/index.html` (landing section).
    - Edit final message: see `templates/index.html` (final-message section).

    Privacy & Security:
    - This app contains no database and no authentication. All content is hard-coded
        in `templates/index.html` and `static/script.js` so recipients only receive
        rendered HTML/JS served by Flask. Do not add secrets to these files.
    - To share, run locally and use a tunnel (ngrok/Cloudflare) if sharing over the internet.
*/

function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const selectedScreen = document.getElementById(screenId);
    if (selectedScreen) {
        selectedScreen.classList.add('active');
    }

    // Hide navbar on final message to prevent further interaction
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.display = (screenId === 'final-message') ? 'none' : 'flex';
    }

    // Handle screen-specific initialization
    if (screenId === 'quiz') {
        // Only initialize quiz if it hasn't been started yet
        if (!quizStarted) {
            initMainQuiz();
            showQuizQuestion();
        } else if (quizState.currentQuestion >= quizState.totalQuestions) {
            // Quiz is already finished, show results instead
            navigateTo('results');
            return;
        } else {
            // Resume quiz where left off
            showQuizQuestion();
        }
    }

    // Initialize gallery when navigating to it
    if (screenId === 'gallery') {
        initGallery();
    }

    // Update results screen when navigating to results
    if (screenId === 'results') {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            updateResultsScreen();
        });
    }
}

// Helper to start quiz from landing (initializes state then navigates)
function startQuiz() {
    // Initialize quiz state
    initMainQuiz();
    // Navigate to quiz screen (which will call showQuizQuestion)
    navigateTo('quiz');
}

// Game Functions
function playGame(gameName) {
    const modal = document.getElementById('game-modal');
    const gameContent = document.getElementById('game-content');

    modal.classList.remove('hidden');

    if (gameName === 'love-meter') {
        initLoveMeter(gameContent);
    } else if (gameName === 'question') {
        initQuestionGame(gameContent);
    } else if (gameName === 'quiz') {
        initQuizGame(gameContent);
    }
}

function closeGame() {
    document.getElementById('game-modal').classList.add('hidden');
}

// Love Meter Game
function initLoveMeter(container) {
    const messages = [
        '😔 A little love?',
        '🙂 Growing stronger',
        '😊 Very much',
        '😍 Deeply in love',
        '🥰 Forever and always',
        '💕 Infinitely!'
    ];

    container.innerHTML = `
        <div class="love-meter-container">
            <h2>💕 Love Meter 💕</h2>
            <p>How much do we love each other?</p>
            <input type="range" min="0" max="100" value="50" class="love-meter-slider" id="loveSlider">
            <div class="love-meter-result" id="loveResult">💕</div>
            <p class="love-meter-text" id="loveMessage">Growing stronger</p>
        </div>
    `;

    const slider = container.querySelector('#loveSlider');
    const result = container.querySelector('#loveResult');
    const message = container.querySelector('#loveMessage');

    slider.addEventListener('input', function() {
        const value = this.value;
        const index = Math.floor((value / 100) * (messages.length - 1));
        message.textContent = messages[index];
        result.textContent = '💕'.repeat(Math.ceil((value / 100) * 5));
    });

    // Trigger initial event
    slider.dispatchEvent(new Event('input'));
}

// Question Game
function initQuestionGame(container) {
    const questions = [
        {
            text: 'What is my favorite color?',
            answers: ['Red', 'Blue', 'Green']
        },
        {
            text: 'What is our favorite activity?',
            answers: ['Traveling', 'Cooking', 'Movie nights']
        },
        {
            text: 'Where did we first meet?',
            answers: ['School', 'Work', 'Through friends']
        },
        {
            text: 'What is my favorite food?',
            answers: ['Pizza', 'Sushi', 'Pasta']
        },
        {
            text: 'What is our song?',
            answers: ['Custom choice 1', 'Custom choice 2', 'Custom choice 3']
        }
    ];

    let currentQuestion = 0;
    let answers = [];

    function showQuestion() {
        if (currentQuestion >= questions.length) {
            showResults();
            return;
        }

        const q = questions[currentQuestion];
        container.innerHTML = `
            <div class="question-container">
                <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
                <h2>${q.text}</h2>
                <div>
                    ${q.answers.map((answer, idx) => `
                        <button class="question-btn" onclick="selectAnswer(${idx})">${answer}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.selectAnswer = function(idx) {
        answers[currentQuestion] = idx;
        currentQuestion++;
        showQuestion();
    };

    function showResults() {
        container.innerHTML = `
            <div class="quiz-score">
                <h3>Thanks for Playing! 🎮</h3>
                <p>Your answers have been recorded with love! ❤️</p>
                <button class="btn btn-primary" onclick="closeGame()">Close</button>
            </div>
        `;
    }

    showQuestion();
}

// Global state management
let quizStarted = false;  // Track if quiz has been initialized
let loveGaugeChart = null;  // Store chart instance to prevent multiple creations

// Main Quiz Game (Text Input Based)
let quizState = {
    currentQuestion: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    questions: [
        {
            question: "The first movie we watched together?",
            acceptableAnswers: ['Bheeshmaparvam', 'beeshmaparvam', 'Beeshmaparvam']  // Multiple acceptable answers
        },
        {
            question: "What is my favorite food?",
            acceptableAnswers: ['Fried rice', 'fried rice', 'Fried Rice', 'Friedrice']
        },
        {
            question: "What is my biggest dream of us?",
            acceptableAnswers: ['Getting married', 'Marriage', 'Wedding']
        },
        {
            question: "When did I said I love you first?",
            acceptableAnswers: ['February 17', 'February 2022', '17/2/2022', 'February 17, 2022', 'February17']
        },
        {
            question: "Where was our first kiss?",
            acceptableAnswers: ['college', 'College', 'COLLEGE']
        },
        {
            question: "Where did we go for our first long trip?",
            acceptableAnswers: ['Munnar']
        },
        {
            question: "What was the first gift you bought me?",
            acceptableAnswers: ['airpods']
        },
        {
            question: "What was the first gift I gave you?",
            acceptableAnswers: ['Shirt']
        },
        {
            question: "What was the first chocolate brand you bought me?",
            acceptableAnswers: ['Kit- Kat', 'Kit Kat', 'KitKat', 'Kitkat']
        },
        {
            question: "When did you say 'I love you first'?",
            acceptableAnswers: ['February 15', 'February 2022', '15/2/2022', 'February 15, 2022', 'February15']
        }
    ]
};

function initMainQuiz() {
    // Reset quiz state for fresh start
    quizStarted = true;
    quizState.currentQuestion = 0;
    quizState.correctAnswers = 0;
    quizState.wrongAnswers = 0;
    quizState.totalQuestions = quizState.questions.length;

    // Log state for debugging
    console.log('Quiz initialized:', {
        currentQuestion: quizState.currentQuestion,
        totalQuestions: quizState.totalQuestions,
        correctAnswers: quizState.correctAnswers,
        wrongAnswers: quizState.wrongAnswers
    });
}

function showQuizQuestion() {
    const container = document.getElementById('quiz-container');
    const q = quizState.questions[quizState.currentQuestion];
    const progressPercentage = ((quizState.currentQuestion) / quizState.totalQuestions) * 100;

    container.innerHTML = `
        <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="quiz-progress-text">Question ${quizState.currentQuestion + 1} of ${quizState.totalQuestions}</div>
        
        <div class="quiz-question-container">
            <h3 class="quiz-question-text">${q.question}</h3>
            <input 
                type="text" 
                id="quiz-answer-input" 
                class="quiz-input" 
                placeholder="Type your answer here..."
                onkeypress="handleQuizKeypress(event)"
                autofocus
            >
        </div>

        <div class="quiz-button-container">
            ${quizState.currentQuestion === quizState.totalQuestions - 1 
                ? `<button class="btn btn-primary" onclick="submitQuizAnswer()">Submit Answer</button>` 
                : `<button class="btn btn-primary" onclick="submitQuizAnswer()">Next Question</button>`
            }
        </div>

        <div class="quiz-stats">
            <span>✓ Correct: ${quizState.correctAnswers}</span>
            <span>✗ Wrong: ${quizState.wrongAnswers}</span>
        </div>
    `;

    // Focus on input
    setTimeout(() => {
        document.getElementById('quiz-answer-input').focus();
    }, 100);
}

function handleQuizKeypress(event) {
    if (event.key === 'Enter') {
        submitQuizAnswer();
    }
}

function submitQuizAnswer() {
    const input = document.getElementById('quiz-answer-input');
    const userAnswer = input.value.trim().toLowerCase();
    const q = quizState.questions[quizState.currentQuestion];
    
    if (!userAnswer) {
        alert('Please enter an answer!');
        return;
    }

    // Check if answer matches any acceptable answer (case-insensitive, trimmed)
    const isCorrect = q.acceptableAnswers.some(acceptable => 
        acceptable.toLowerCase() === userAnswer
    );

    if (isCorrect) {
        quizState.correctAnswers++;
    } else {
        quizState.wrongAnswers++;
    }

    // Move to next question or show results
    quizState.currentQuestion++;

    if (quizState.currentQuestion >= quizState.totalQuestions) {
        showQuizResults();
    } else {
        showQuizQuestion();
    }
}

function showQuizResults() {
    // Navigate to results screen
    // The navigateTo function will handle calling updateResultsScreen()
    navigateTo('results');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('game-modal');
    if (event.target === modal) {
        closeGame();
    }
});

// Love Meter Gauge Functions
function updateResultsScreen() {
    // Safety: ensure totalQuestions is set (in case initMainQuiz wasn't called)
    if (!quizState.totalQuestions || quizState.totalQuestions === 0) {
        quizState.totalQuestions = Array.isArray(quizState.questions) ? quizState.questions.length : 0;
    }

    // Safe percentage calculation to avoid division by zero and NaN
    let percentage = 0;
    if (quizState.totalQuestions > 0) {
        const raw = (Number(quizState.correctAnswers) || 0) / Number(quizState.totalQuestions);
        percentage = Number.isFinite(raw) ? Math.round(raw * 100) : 0;
    }

    // Diagnostic log (visible in browser console) to help debugging
    console.log('[updateResultsScreen] correct=', quizState.correctAnswers, 'total=', quizState.totalQuestions, 'computedPct=', percentage);
    
    // On-page debug visibility (remove this in production if needed)
    console.warn(`RESULTS: ${quizState.correctAnswers} correct out of ${quizState.totalQuestions}. Percentage = ${percentage}%`);
    
    let message = '';

    if (percentage === 100) {
        message = "Perfect! You know me inside and out! 💯";
    } else if (percentage >= 80) {
        message = "Excellent! You really know me well! 🌟";
    } else if (percentage >= 60) {
        message = "Great! We have some catching up to do! 😊";
    } else if (percentage >= 40) {
        message = "Not bad! Let's spend more time together! 🥰";
    } else {
        message = "No worries! This is a fun reminder to learn more about each other! 💕";
    }

    // Update stat counters and message ONLY (no percentages yet - those animate)
    const correctEl = document.getElementById('result-correct');
    const wrongEl = document.getElementById('result-wrong');
    const percentageEl = document.getElementById('result-percentage');
    const gaugePercentageEl = document.getElementById('gauge-percentage');
    const messageEl = document.getElementById('result-message');

    if (correctEl) correctEl.textContent = quizState.correctAnswers;
    if (wrongEl) wrongEl.textContent = quizState.wrongAnswers;
    if (messageEl) messageEl.textContent = message;

    // Initialize percentage elements to 0 for animation (do NOT set to final value yet)
    if (percentageEl) {
        percentageEl.textContent = '0%';
        percentageEl.classList.add('counting');
    }
    if (gaugePercentageEl) {
        gaugePercentageEl.textContent = '0%';
        gaugePercentageEl.classList.add('counting');
    }

    // Create chart at 0% (not final percentage)
    createLoveGauge(0);

    // Force reflow to ensure DOM paint happens before animation
    // This ensures the chart is rendered before we start animating it
    void document.documentElement.offsetHeight;

    // Now start animation with a fresh frame
    requestAnimationFrame(() => {
        animateGaugeAndPercentage(percentage);
    });
}

// Create (once) or update Chart.js doughnut for the love gauge.
function createLoveGauge(initialPercentage = 0) {
    const canvas = document.getElementById('loveGauge');
    if (!canvas) {
        console.error('[createLoveGauge] Canvas element #loveGauge not found!');
        return;
    }

    console.log('[createLoveGauge] Canvas found, initialPercentage=', initialPercentage);

    const ctx = canvas.getContext('2d');

    // If chart already exists, update and reinitialize
    if (loveGaugeChart) {
        console.log('[createLoveGauge] Chart exists, resetting to', initialPercentage);
        loveGaugeChart.data.datasets[0].data = [initialPercentage, 100 - initialPercentage];
        // Disable Chart.js animation while we control the animation loop
        loveGaugeChart.options.animation = loveGaugeChart.options.animation || {};
        loveGaugeChart.options.animation.duration = 0;
        loveGaugeChart.update();
        return;
    }

    // Create a single chart instance (we will update its data during animation)
    try {
        loveGaugeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Love Score', 'Remaining'],
                datasets: [{
                    data: [initialPercentage, 100 - initialPercentage],
                    backgroundColor: [
                        'rgb(173, 23, 23)',
                        'rgba(200, 200, 200, 0.25)'
                    ],
                    borderColor: ['rgba(255,255,255,0.0)', 'rgba(200,200,200,0.0)'],
                    borderWidth: 0,
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                circumference: 180,
                rotation: 270,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                animation: { duration: 0 }
            }
        });
        console.log('[createLoveGauge] Chart created successfully');
    } catch (e) {
        console.error('[createLoveGauge] Error creating chart:', e);
    }
}

// Animation helpers & state
let _gaugeAnimFrame = null;
let _confettiAnimFrame = null;

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// Animate both the gauge chart and the percentage text using requestAnimationFrame.
function animateGaugeAndPercentage(finalPercentage) {
    const percentageEl = document.getElementById('result-percentage');
    const gaugePercentageEl = document.getElementById('gauge-percentage');
    const gaugeWrapper = document.querySelector('.gauge-wrapper');

    console.log('[animateGaugeAndPercentage] Called with finalPercentage=', finalPercentage);

    // Safety check: elements and chart must exist
    if (!percentageEl || !gaugePercentageEl || !gaugeWrapper || !loveGaugeChart) {
        console.error('[animateGaugeAndPercentage] Missing elements:', {
            percentageEl: !!percentageEl,
            gaugePercentageEl: !!gaugePercentageEl,
            gaugeWrapper: !!gaugeWrapper,
            loveGaugeChart: !!loveGaugeChart
        });
        // Fallback: set values directly and trigger confetti anyway
        if (percentageEl) percentageEl.textContent = finalPercentage + '%';
        if (gaugePercentageEl) gaugePercentageEl.textContent = finalPercentage + '%';
        startConfetti(2200);
        return;
    }

    // Cancel any in-progress animation
    if (_gaugeAnimFrame) {
        cancelAnimationFrame(_gaugeAnimFrame);
    }

    // Start heartbeat and glow immediately
    const minDur = 0.35; // seconds (fast for high scores)
    const maxDur = 1.15; // seconds (slow for low scores)
    const pulseDuration = (maxDur - (finalPercentage / 100) * (maxDur - minDur)).toFixed(2) + 's';
    gaugeWrapper.style.setProperty('--pulse-duration', pulseDuration);
    gaugeWrapper.classList.add('pulsing');
    gaugeWrapper.classList.add('glow');
    console.log('[animateGaugeAndPercentage] Pulse duration set to', pulseDuration);

    // Animation timing: longer animations for longer to see the effect
    const minTime = 1000; // ms (minimum duration)
    const maxTime = 2500; // ms (maximum duration)
    const totalDuration = Math.max(minTime, Math.round(minTime + (finalPercentage / 100) * (maxTime - minTime)));
    console.log('[animateGaugeAndPercentage] Total animation duration:', totalDuration, 'ms');

    let start = null;
    let lastRendered = -1;
    let animationComplete = false;

    function step(timestamp) {
        // Initialize start time on first frame
        if (!start) {
            start = timestamp;
            console.log('[Animation Step] Starting animation at timestamp', start);
        }

        const elapsed = timestamp - start;
        const progress = Math.min(1, elapsed / totalDuration);
        const eased = easeOutCubic(progress);
        const current = Math.round(eased * finalPercentage);

        console.log('[Animation Frame] progress=', progress.toFixed(2), 'current=', current, 'lastRendered=', lastRendered);

        // Update DOM for every frame (not just when value changes) to ensure animation is visible
        if (current !== lastRendered || lastRendered === -1 && elapsed % 16 < 8) {
            // Update both percentage displays
            if (percentageEl) {
                percentageEl.textContent = current + '%';
                percentageEl.classList.add('counting');
                // Remove after brief delay to re-trigger if needed
                setTimeout(() => {
                    if (percentageEl) percentageEl.classList.remove('counting');
                }, 150);
            }

            if (gaugePercentageEl) {
                gaugePercentageEl.textContent = current + '%';
                gaugePercentageEl.classList.add('counting');
                // Remove after brief delay to re-trigger if needed
                setTimeout(() => {
                    if (gaugePercentageEl) gaugePercentageEl.classList.remove('counting');
                }, 150);
            }

            lastRendered = current;
            console.log('[Animation DOM Update] Updated to', current + '%');
        }

        // Update chart dataset without Chart.js animations
        if (loveGaugeChart) {
            loveGaugeChart.options.animation = loveGaugeChart.options.animation || {};
            loveGaugeChart.options.animation.duration = 0;
            loveGaugeChart.data.datasets[0].data = [current, Math.max(0, 100 - current)];
            loveGaugeChart.update('none');
        }

        // Continue animation until progress reaches 100%
        if (progress < 1) {
            _gaugeAnimFrame = requestAnimationFrame(step);
        } else {
            // Animation complete: finalize and cleanup
            console.log('[Animation] Progress reached 100%, calling finalize');
            finalize();
        }
    }

    function finalize() {
        if (animationComplete) return; // Prevent double-finalize
        animationComplete = true;

        console.log('[Animation Finalize] Starting finalization. Final percentage=', finalPercentage);

        // Set final values explicitly
        if (percentageEl) percentageEl.textContent = finalPercentage + '%';
        if (gaugePercentageEl) gaugePercentageEl.textContent = finalPercentage + '%';

        // Update chart to final state
        if (loveGaugeChart) {
            loveGaugeChart.data.datasets[0].data = [finalPercentage, 100 - finalPercentage];
            loveGaugeChart.update();
            console.log('[Animation Finalize] Chart updated to final state:', finalPercentage);
        }

        // Remove pulsing, keep glow briefly
        gaugeWrapper.classList.remove('pulsing');

        // Fade out glow after 1s
        setTimeout(() => {
            gaugeWrapper.classList.remove('glow');
        }, 1000);

        // Clean up animation frame reference
        if (_gaugeAnimFrame) {
            cancelAnimationFrame(_gaugeAnimFrame);
            _gaugeAnimFrame = null;
        }

        // Trigger confetti celebration (this MUST happen)
        console.log('[Animation Finalize] Triggering confetti');
        startConfetti(2200);

        console.log('[Animation Complete] Final percentage=', finalPercentage, '%');
    }

    // Safety timeout: if animation doesn't complete in reasonable time, force finalize
    const safetyTimeout = setTimeout(() => {
        if (!animationComplete) {
            console.warn('[Animation Safety] Animation timeout reached, forcing finalize');
            finalize();
        }
    }, totalDuration + 500); // 500ms grace period

    // Start animation loop
    _gaugeAnimFrame = requestAnimationFrame(step);
    console.log('[animateGaugeAndPercentage] Animation started. Target %=', finalPercentage, 'Duration=', totalDuration, 'ms');
}

// Simple canvas confetti implementation (lightweight, no external libs)
function startConfetti(duration = 2000) {
    const container = document.querySelector('.gauge-wrapper');
    if (!container) {
        console.error('[startConfetti] gauge-wrapper container not found!');
        return;
    }

    console.log('[startConfetti] Creating confetti with duration', duration);

    // Create canvas overlay
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    console.log('[startConfetti] Canvas created, size:', canvas.width, 'x', canvas.height);

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const count = Math.min(80, 10 + Math.round(canvas.width / 10));

    // Create confetti pieces
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            r: 6 + Math.random() * 6,
            color: `hsl(${Math.floor(Math.random() * 360)}, 75%, 60%)`,
            velX: (Math.random() - 0.5) * 1.8,
            velY: 2 + Math.random() * 4,
            rot: Math.random() * 360,
            drag: 0.995
        });
    }

    console.log('[startConfetti] Created', pieces.length, 'confetti pieces');

    let start = performance.now();
    let confetti_finished = false;

    function confettiStep(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.x += p.velX;
            p.y += p.velY;
            p.velY *= p.drag;
            p.rot += 6;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
            ctx.restore();
        });

        if (elapsed < duration) {
            _confettiAnimFrame = requestAnimationFrame(confettiStep);
        } else {
            // Confetti complete: cleanup
            if (!confetti_finished) {
                confetti_finished = true;
                canvas.remove();
                if (_confettiAnimFrame) cancelAnimationFrame(_confettiAnimFrame);
                _confettiAnimFrame = null;
                console.log('[startConfetti] Confetti animation ended, canvas removed');
            }
        }
    }

    // Cancel any existing confetti animation
    if (_confettiAnimFrame) cancelAnimationFrame(_confettiAnimFrame);
    _confettiAnimFrame = requestAnimationFrame(confettiStep);
    console.log('[startConfetti] Animation loop started');
}

// Initialize - show landing screen
window.addEventListener('load', function() {
    navigateTo('landing');
});

// Gallery: single-image carousel
const galleryItems = [
    { src: '/static/images/First Date.jpeg', caption: 'First Date' },
    { src: '/static/images/First Trip Together.jpeg', caption: 'First Trip Together' },
    { src: '/static/images/Keep looking at me like that.jpeg', caption: 'Keep looking at me like that' },
    { src: '/static/images/Pookiee.jpeg', caption: 'Pookie' },
    { src: '/static/images/Ummahh.jpeg', caption: 'Ummahh' },
    { src: '/static/images/Will look at you like this forever.jpeg', caption: 'Will look at you like this forever' }
];

let galleryIndex = 0;

function initGallery() {
    galleryIndex = 0;
    renderGallery();
}

function renderGallery() {
    const img = document.getElementById('gallery-image');
    const caption = document.getElementById('gallery-caption');
    if (!img || !caption) return;

    const item = galleryItems[galleryIndex];
    img.style.background = `url('${item.src}') center/cover no-repeat`;
    caption.textContent = item.caption;

    // Disable prev button on first, next button on last
    const prev = document.getElementById('gallery-prev');
    const next = document.getElementById('gallery-next');
    if (prev) prev.disabled = (galleryIndex === 0);
    if (next) next.disabled = (galleryIndex === galleryItems.length - 1);
}

function galleryNext() {
    if (galleryIndex < galleryItems.length - 1) {
        galleryIndex++;
        renderGallery();
    }
}

function galleryPrev() {
    if (galleryIndex > 0) {
        galleryIndex--;
        renderGallery();
    }
}

// Optional: keyboard navigation when gallery is active
document.addEventListener('keydown', function(e) {
    const active = document.querySelector('.screen.active');
    if (!active || active.id !== 'gallery') return;
    if (e.key === 'ArrowRight') galleryNext();
    if (e.key === 'ArrowLeft') galleryPrev();
});
