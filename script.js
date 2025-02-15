let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

// **מערך השאלות**
let questions = [
    {
        "שאלה": "במטרה לבסס קשר סיבתי בין משתנים במחקר יש להראות:",
        "תשובות": [
            {"תשובה": "קשר (מתאם)", "נכונה": false},
            {"תשובה": "קדימות בזמן של המשתנה הבלתי תלוי (הסיבה) למשתנה התלוי (התוצאה)", "נכונה": false},
            {"תשובה": "הפרכת כל הסבר חלופי לתוצאה שהתקבלה", "נכונה": false},
            {"תשובה": "כל התשובות נכונות", "נכונה": true}
        ]
    },
    {
        "שאלה": "מה ניתן לומר על ניסוי שדה לעומת ניסוי מעבדה?",
        "תשובות": [
            {"תשובה": "בניסוי שדה ניתן לשלוט יותר בקלות במשתנים המתערבים, אך קשה יותר לדמות את המציאות לעומת ניסוי מעבדה", "נכונה": false},
            {"תשובה": "בניסוי שדה ניתן לדמות בקלות רבה יותר את המציאות, אך קשה יותר לשלוט במשתנים המתערבים לעומת ניסוי מעבדה", "נכונה": true},
            {"תשובה": "בניסוי שדה אפשר להסיק רק על קשר מתאמי ובניסוי מעבדה אפשר להסיק על קשר סיבתי", "נכונה": false},
            {"תשובה": "בניסוי שדה אפשר להסיק על קשר סיבתי ובניסוי מעבדה אפשר להסיק רק על קשר מתאמי", "נכונה": false}
        ]
    }
];

// **הפעלת השאלה הראשונה**
showQuestion();

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

    currentQuestion["תשובות"].forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer["תשובה"];
        button.classList.add("answer-button");
        button.addEventListener("click", () => selectAnswer(button, answer["נכונה"]));
        answersContainer.appendChild(button);
    });
}

// פונקציה לבדיקת תשובה
function selectAnswer(button, isCorrect) {
    clearInterval(timerInterval); // עצירת הטיימר כשמשתמש בוחר תשובה

    const allButtons = document.querySelectorAll(".answer-button");
    allButtons.forEach(btn => btn.disabled = true); // מניעת בחירה חוזרת

    if (isCorrect) {
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
