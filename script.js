let currentQuestionIndex = 0;
let questions = [];

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
    const questionContainer = document.getElementById("question-text");
    const answersContainer = document.getElementById("answers-container");
    const nextButton = document.getElementById("next-button");

    nextButton.disabled = true; // השבתת כפתור "המשך" עד לבחירת תשובה
    answersContainer.innerHTML = ""; // ניקוי תשובות קודמות

    if (currentQuestionIndex >= questions.length) {
        questionContainer.innerHTML = "סיימת את החידון! כל הכבוד!";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion["שאלה"];

    // יצירת כפתורים לכל תשובה
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
    const allButtons = document.querySelectorAll(".answer-button");
    allButtons.forEach(btn => btn.disabled = true); // מניעת בחירה חוזרת

    if (button.innerText === correctAnswer) {
        button.classList.add("correct");
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
