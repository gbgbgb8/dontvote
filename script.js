let questions = [];
let currentQuestionIndex = 0;
let candidate1Score = 0;
let candidate2Score = 0;

const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');

async function loadQuestions() {
    const response = await fetch('questions.json');
    const data = await response.json();
    questions = data.questions;
    shuffleArray(questions);
    showQuestion();
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
        document.getElementById('trump-note').textContent = "Trump: " + question.trumpNote;
        document.getElementById('biden-note').textContent = "Biden: " + question.bidenNote;
    } else {
        showResult();
    }
}

function handleAnswer(answer) {
    const question = questions[currentQuestionIndex];
    if ((answer === 'yes' && question.yesSupports === 1) || 
        (answer === 'no' && question.yesSupports === 2)) {
        candidate1Score++;
    } else {
        candidate2Score++;
    }

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
}

yesBtn.addEventListener('click', () => handleAnswer('yes'));
noBtn.addEventListener('click', () => handleAnswer('no'));

loadQuestions();