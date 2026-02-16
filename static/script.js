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
            question: "What do you love most about me?",
            acceptableAnswers: ['smile', 'heart', 'kindness', 'laugh', 'humor']
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
    // Safe percentage calculation to avoid division by zero
    const percentage = quizState.totalQuestions > 0 
        ? Math.round((quizState.correctAnswers / quizState.totalQuestions) * 100)
        : 0;
    
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

    // Update results display
    const correctEl = document.getElementById('result-correct');
    const wrongEl = document.getElementById('result-wrong');
    const percentageEl = document.getElementById('result-percentage');
    const messageEl = document.getElementById('result-message');

    if (correctEl) correctEl.textContent = quizState.correctAnswers;
    if (wrongEl) wrongEl.textContent = quizState.wrongAnswers;
    if (percentageEl) percentageEl.textContent = percentage + '%';
    if (messageEl) messageEl.textContent = message;

    // Create the gauge chart after short delay to ensure rendering
    setTimeout(() => {
        createLoveGauge(percentage);
    }, 50);
}

function createLoveGauge(percentage) {
    const ctx = document.getElementById('loveGauge');
    if (!ctx) {
        console.warn('Love gauge canvas element not found');
        return;
    }

    // Recalculate percentage if not provided (for safety)
    if (percentage === undefined) {
        percentage = quizState.totalQuestions > 0
            ? Math.round((quizState.correctAnswers / quizState.totalQuestions) * 100)
            : 0;
    }

    // Destroy existing chart instance to prevent conflicts
    if (loveGaugeChart && typeof loveGaugeChart.destroy === 'function') {
        loveGaugeChart.destroy();
        loveGaugeChart = null;
    }

    // Create doughnut gauge chart
    loveGaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Love Score', 'Remaining'],
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(200, 200, 200, 0.3)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(200, 200, 200, 0.3)'
                ],
                borderWidth: 0,
                borderRadius: [10, 10]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            circumference: 180,
            rotation: 270,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        plugins: [{
            id: 'textCenter',
            beforeDatasetsDraw(chart) {
                const { width } = chart;
                const { height } = chart;
                const { ctx: canvasCtx } = chart;
                canvasCtx.restore();

                const fontSize = (height / 200).toFixed(2);
                canvasCtx.font = `${fontSize * 24}px Arial`;
                canvasCtx.textBaseline = 'middle';
                canvasCtx.fillStyle = '#667eea';
                canvasCtx.fontWeight = 'bold';

                const text = `${percentage}%`;
                const textX = Math.round((width - canvasCtx.measureText(text).width) / 2);
                const textY = height / 2 + 10;

                canvasCtx.fillText(text, textX, textY);
                canvasCtx.save();
            }
        }]
    });
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
