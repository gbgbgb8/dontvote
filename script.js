let questions = [];
let currentQuestionIndex = 0;
let candidate1Score = 0;
let candidate2Score = 0;
let userAnswers = [];

const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const trumpNote = document.getElementById('trump-note');
const bidenNote = document.getElementById('biden-note');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const scoreBreakdown = document.getElementById('score-breakdown');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        questions = data.questions;
        shuffleArray(questions);
        showQuestion();
    } catch (error) {
        console.error("Could not load questions:", error);
        questionText.textContent = "Error loading questions. Please try again later.";
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionContainer.classList.remove('fade-out');
        questionContainer.classList.add('fade-in');
        questionText.textContent = question.text;
        trumpNote.textContent = "Candidate C1: " + question.trumpNote;
        bidenNote.textContent = "Candidate C2: " + question.bidenNote;
        updateProgressBar();
    } else {
        showResult();
    }
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function handleAnswer(answer) {
    const question = questions[currentQuestionIndex];
    if ((answer === 'yes' && question.yesSupports === 1) || 
        (answer === 'no' && question.yesSupports === 2)) {
        candidate1Score++;
    } else {
        candidate2Score++;
    }

    userAnswers.push({question: question.text, answer: answer});

    currentQuestionIndex++;
    questionContainer.classList.remove('fade-in');
    questionContainer.classList.add('fade-out');
    setTimeout(showQuestion, 500);
}

function showResult() {
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    if (candidate1Score > candidate2Score) {
        resultText.textContent = "You align more closely with Trump";
    } else if (candidate2Score > candidate1Score) {
        resultText.textContent = "You align more closely with Biden";
    } else {
        resultText.textContent = "You align equally with both candidates";
    }

    scoreBreakdown.innerHTML = `
        <p>Trump Score: ${candidate1Score}</p>
        <p>Biden Score: ${candidate2Score}</p>
        <h3>Your Answers:</h3>
        <ul>
            ${userAnswers.map(a => `<li>${a.question}: ${a.answer}</li>`).join('')}
        </ul>
    `;
}

function restartSurvey() {
    currentQuestionIndex = 0;
    candidate1Score = 0;
    candidate2Score = 0;
    userAnswers = [];
    resultContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    shuffleArray(questions);
    showQuestion();
}

yesBtn.addEventListener('click', () => handleAnswer('yes'));
noBtn.addEventListener('click', () => handleAnswer('no'));
restartBtn.addEventListener('click', restartSurvey);

loadQuestions();