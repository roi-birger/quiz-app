let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timeLeft = 15;
let timerInterval;

// טוען את השאלות מקובץ JSON
fetch("quiz_questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    })
    .catch(error => console.error("Error loading questions:", error));

// פונקציה להצגת השאלה הנוכחית
function showQuestion() {
    clearInterval(timerInterval); // איפוס הטיימר
    timeLeft = 15; // חידוש זמן לכל שאלה
    document.getElementById("time-left").innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            disableAnswers();
        }
    }, 1000);

    const questionContainer = document.getElementById("question-text");
    const answersContainer = document.getElementById("answers-container");
    const nextButton = document.getElementById("next-button");

    nextButton.disabled = true; // השבתת כפתור "המשך" עד לבחירת תשובה
    answersContainer.innerHTML = ""; // ניקוי תשובות קודמות

    if (currentQuestionIndex >= questions.length) {
        questionContainer.innerHTML = `🎉 סיימת את החידון! הציון שלך: ${score}/${questions.length}`;
        document.getElementById("timer").style.display = "none";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion["שאלה"];

    for (let i = 1; i <= 4; i++) {
        const answerText = currentQuestion[`תשובה ${i}`];
        if (!answerText) continue;

        const button = document.createElement("button");
        button.innerText = answerText;
        button.classList.add("answer-button");
        button.addEventListener("click", () => selectAnswer(button, currentQuestion["תשובה נכונה"]));
        answersContainer.appendChild(button);
    }
}

// פונקציה לבדיקת תשובה
function selectAnswer(button, correctAnswer) {
    clearInterval(timerInterval); // עצירת הטיימר כשמשתמש בוחר תשובה

    const allButtons = document.querySelectorAll(".answer-button");
    allButtons.forEach(btn => btn.disabled = true); // מניעת בחירה חוזרת

    if (button.innerText === correctAnswer) {
        button.classList.add("correct");
        score++;
        document.getElementById("score-value").innerText = score;
    } else {
        button.classList.add("wrong");
    }

    document.getElementById("next-button").disabled = false; // הפעלת כפתור "המשך"
}

// מעבר לשאלה הבאה
document.getElementById("next-button").addEventListener("click", () => {
    currentQuestionIndex++;
    showQuestion();
});

// פונקציה לאיפוס החידון
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("score-value").innerText = score;
    document.getElementById("timer").style.display = "block";
    showQuestion();
}
