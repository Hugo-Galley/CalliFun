// Récupération du canvas et de son contexte de dessin
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = []; // Stocke les coordonnées des points
let strokes = []; // Stocke tous les traits pour l'annulation

// Variable pour suivre si l'utilisateur est en train de dessiner
let drawing = false;

// Ajout des écouteurs d'événements pour la gestion du dessin
canvas.addEventListener("mousedown", startDrawing);  // Quand l'utilisateur clique sur le canvas
canvas.addEventListener("mousemove", draw);         // Quand l'utilisateur bouge la souris
canvas.addEventListener("mouseup", stopDrawing);    // Quand l'utilisateur relâche le clic
canvas.addEventListener("mouseleave", stopDrawing); // Si l'utilisateur sort du canvas

// Configuration du canvas
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#8B4513";

/**
 * Fonction appelée quand l'utilisateur commence à dessiner.
 * @param {MouseEvent} event - L'événement de la souris.
 */
function startDrawing(event) {
    // Démarrer le timer au premier trait
    startTimer();
    
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    
    // Commencer un nouveau trait
    const currentStroke = [];
    currentStroke.push({x: event.offsetX, y: event.offsetY});
    strokes.push(currentStroke);
}

/**
 * Fonction appelée pendant que l'utilisateur dessine.
 * @param {MouseEvent} event - L'événement de la souris.
 */
function draw(event) {
    if (!drawing) return;

    // Trace une ligne entre l'ancien point et la nouvelle position du curseur
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    
    // Ajouter le point au trait actuel
    const currentStroke = strokes[strokes.length - 1];
    currentStroke.push({x: event.offsetX, y: event.offsetY});
    
    // Ajouter aussi les points à la liste globale pour la console
    points.push({x: event.offsetX, y: event.offsetY});
}

/**
 * Fonction appelée quand l'utilisateur arrête de dessiner.
 */
function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

/**
 * Fonction pour effacer complètement le canvas.
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = [];
    points = [];
    showMessage("Canvas effacé");
}

/**
 * Fonction pour annuler le dernier trait
 */
function undoLastStroke() {
    if (strokes.length > 0) {
        strokes.pop();
        redrawCanvas();
        showMessage("Dernier trait annulé");
    }
}

/**
 * Fonction pour redessiner le canvas avec tous les traits stockés
 */
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    strokes.forEach(stroke => {
        if (stroke.length > 0) {
            ctx.beginPath();
            ctx.moveTo(stroke[0].x, stroke[0].y);
            
            for (let i = 1; i < stroke.length; i++) {
                ctx.lineTo(stroke[i].x, stroke[i].y);
            }
            ctx.stroke();
        }
    });
}

// Liste de mots en arabe avec leurs traductions
const words = [
    { arabic: "بِسْمِ", french: "Au nom de" },
    { arabic: "السلام", french: "La paix" },
    { arabic: "مدرسة", french: "École" },
    { arabic: "قلم", french: "Stylo" },
    { arabic: "كتاب", french: "Livre" },
    { arabic: "شمس", french: "Soleil" },
    { arabic: "قمر", french: "Lune" },
    { arabic: "زهرة", french: "Fleur" },
    { arabic: "بحر", french: "Mer" },
    { arabic: "سماء", french: "Ciel" }
];

// Récupération des éléments HTML
const wordElement = document.getElementById("word");
const meaningElement = document.querySelector(".word-meaning");
const message = document.getElementById("message");

// Variable pour suivre le mot actuel
let currentWordIndex = 0;
let wordsCompleted = 0;

// Variables pour le timer
let startTime = null;
let timerInterval = null;
let currentTime = 0;

// Fonction pour obtenir un mot aléatoire
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Fonction pour afficher un nouveau mot et effacer le canvas
function nextWord() {
    const word = getRandomWord();
    wordElement.textContent = word.arabic;
    meaningElement.textContent = word.french;
    clearCanvas();
    showMessage("Nouveau mot affiché !");
    
    // Réinitialiser les points pour le nouveau mot
    points = [];
}

// Fonction pour valider l'écriture
function validateWriting() {
    if (strokes.length === 0) {
        showMessage("Veuillez d'abord écrire quelque chose !");
        return;
    }
    
    // Afficher les données dans la console
    console.log("=== DONNÉES DE L'ÉCRITURE ===");
    console.log("Points enregistrés :", points);
    console.log("Nombre total de points :", points.length);
    console.log("Traits enregistrés :", strokes);
    console.log("Nombre de traits :", strokes.length);
    console.log("Mot actuel :", wordElement.textContent);
    console.log("===============================");
    
    wordsCompleted++;
    updateProgress();
    
    // Générer et afficher le score
    const scoreResult = generateScore();
    console.log("Score généré :", scoreResult);
    
    // Vérifier si l'exercice est terminé
    if (wordsCompleted >= 10) {
        // Attendre un peu pour que le toaster s'affiche avant la popup
        setTimeout(() => {
            showCongratulations();
        }, 1000);
        return;
    }
    
    // Si le score est trop faible, ne pas passer au mot suivant automatiquement
    if (scoreResult.score < 0.4) {
        showMessage("Score trop faible ! Réessayez ce mot.");
        wordsCompleted--; // Décrémenter car on n'a pas validé
        updateProgress();
        return;
    }
    
    showMessage("Excellent travail ! Continuez ainsi !");
    
    // Passer au mot suivant après 2 secondes
    setTimeout(() => {
        nextWord();
    }, 2000);
}

// Variables pour le scoring
let totalScore = 0;
let averageScore = 0;

// Fonction pour générer un score aléatoire et afficher le résultat
function generateScore() {
    const score = Math.random(); // Score entre 0 et 1
    let message, color, points, icon;
    
    if (score < 0.4) {
        // Score faible - Rouge
        message = "Courage ! Vous êtes sur la bonne voie.";
        color = "error";
        points = 0;
        icon = "thumb_down";
    } else if (score >= 0.4 && score < 0.6) {
        // Score moyen - Orange
        message = "Pas mal, on peut mieux faire !";
        color = "warning";
        points = 0.5;
        icon = "thumb_up";
    } else {
        // Score élevé - Vert
        message = "Excellent travail ! Parfait !";
        color = "success";
        points = 1;
        icon = "star";
    }
    
    // Ajouter les points au score total
    totalScore += points;
    
    // Calculer la moyenne
    averageScore = totalScore / wordsCompleted;
    
    // Afficher le toaster
    showToaster(message, color, score, points, icon);
    
    // Mettre à jour l'affichage du score dans les stats
    updateScoreDisplay();
    
    return { score, points, message, color };
}

// Fonction pour afficher un toaster
function showToaster(message, type, score, points, icon) {
    // Créer le toaster
    const toaster = document.createElement('div');
    toaster.className = `toaster toaster-${type}`;
    toaster.innerHTML = `
        <div class="toaster-content">
            <div class="toaster-icon">
                <span class="material-icons-sharp">${icon}</span>
            </div>
            <div class="toaster-text">
                <h4>${message}</h4>
                <p>Score: ${(score * 100).toFixed(0)}% | Points: +${points}</p>
            </div>
            <div class="toaster-close" onclick="closeToaster(this)">
                <span class="material-icons-sharp">close</span>
            </div>
        </div>
    `;
    
    // Ajouter le toaster au body
    document.body.appendChild(toaster);
    
    // Animation d'entrée
    setTimeout(() => {
        toaster.classList.add('toaster-show');
    }, 100);
    
    // Auto-suppression après 4 secondes
    setTimeout(() => {
        closeToaster(toaster);
    }, 4000);
}

// Fonction pour fermer un toaster
function closeToaster(toaster) {
    if (toaster.classList) {
        toaster.classList.remove('toaster-show');
        setTimeout(() => {
            if (toaster.parentNode) {
                toaster.parentNode.removeChild(toaster);
            }
        }, 300);
    }
}

// Fonction pour mettre à jour l'affichage du score
function updateScoreDisplay() {
    const precisionStatElement = document.querySelector('.stat-item:nth-child(3) h4');
    if (precisionStatElement) {
        const percentage = Math.round(averageScore * 100);
        precisionStatElement.textContent = `${percentage}%`;
    }
}

// Fonction pour mettre à jour la progression
function updateProgress() {
    const progressBar = document.querySelector(".progress");
    const progressText = document.querySelector(".progress-text");
    
    const percentage = (wordsCompleted / 10) * 100;
    progressBar.style.width = percentage + "%";
    progressText.textContent = `${wordsCompleted}/10 mots`;
}

// Fonction pour afficher un message temporaire
function showMessage(text) {
    message.textContent = text;
    message.classList.remove("hidden");

    setTimeout(() => {
        message.classList.add("hidden");
    }, 2000);
}

// Gestion du menu mobile
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector("aside");
const closeBtn = document.getElementById("close-btn");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });
}

// Fonction pour créer des confettis
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Supprimer les confettis après 5 secondes
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Fonction pour afficher la popup de félicitations
function showCongratulations() {
    // Arrêter le timer
    stopTimer();
    
    // Créer les confettis
    createConfetti();
    
    // Créer la popup
    const popup = document.createElement('div');
    popup.className = 'congratulations-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <span class="material-icons-sharp">celebration</span>
                <h2>Bravo !</h2>
            </div>
            <p>Vous avez terminé l'exercice avec succès !</p>
            <p>Vous avez pratiqué <strong>10 mots</strong> en <strong>${getFormattedTime()}</strong>.</p>
            <button class="popup-btn" onclick="closePopup()">
                <span class="material-icons-sharp">arrow_forward</span>
                Continuer
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Cacher la zone de pratique
    hideExerciseArea();
}

// Fonction pour fermer la popup
function closePopup() {
    const popup = document.querySelector('.congratulations-popup');
    if (popup) {
        popup.remove();
    }
    showCompletedExercise();
}

// Fonction pour cacher la zone de pratique
function hideExerciseArea() {
    const practiceSection = document.querySelector('.practice-section');
    if (practiceSection) {
        practiceSection.style.display = 'none';
    }
}

// Fonction pour afficher l'écran de fin d'exercice
function showCompletedExercise() {
    const courseContent = document.querySelector('.course-content');
    
    // Créer l'écran de fin
    const completedScreen = document.createElement('div');
    completedScreen.className = 'completed-exercise';
    completedScreen.innerHTML = `
        <div class="completed-card">
            <div class="completed-header">
                <span class="material-icons-sharp">check_circle</span>
                <h2>Exercice terminé !</h2>
            </div>
            <div class="completed-stats">
                <div class="stat">
                    <span class="material-icons-sharp">edit</span>
                    <div>
                        <h3>10</h3>
                        <p>Mots pratiqués</p>
                    </div>
                </div>
                <div class="stat">
                    <span class="material-icons-sharp">timer</span>
                    <div>
                        <h3>${getFormattedTime()}</h3>
                        <p>Temps total</p>
                    </div>
                </div>
                <div class="stat">
                    <span class="material-icons-sharp">trending_up</span>
                    <div>
                        <h3>100%</h3>
                        <p>Complété</p>
                    </div>
                </div>
            </div>
            <div class="completed-actions">
                <button class="action-btn primary" onclick="restartExercise()">
                    <span class="material-icons-sharp">refresh</span>
                    Recommencer
                </button>
                <button class="action-btn secondary" onclick="restartExercise()">
                    <span class="material-icons-sharp">arrow_forward</span>
                    Exercice suivant
                </button>
            </div>
        </div>
    `;
    
    // Remplacer le contenu principal
    courseContent.innerHTML = '';
    courseContent.appendChild(completedScreen);
    
    // Modifier la mise en page pour centrer le contenu
    courseContent.style.gridTemplateColumns = '1fr';
    courseContent.style.justifyContent = 'center';
    courseContent.style.alignItems = 'center';
}

// Fonction pour recommencer l'exercice
function restartExercise() {
    // Réinitialiser les variables
    wordsCompleted = 0;
    totalScore = 0;
    averageScore = 0;
    startTime = null;
    currentTime = 0;
    stopTimer();
    
    // Recharger la page pour recommencer
    location.reload();
}

// Fonction pour passer à l'exercice suivant
function nextExercise() {
    showMessage("Redirection vers l'exercice suivant...");
    setTimeout(() => {
        // Ici vous pouvez rediriger vers la page suivante
        window.location.href = 'exercices.html';
    }, 1000);
}

// Fonction pour démarrer le timer
function startTimer() {
    if (startTime === null) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Fonction pour mettre à jour le timer
function updateTimer() {
    if (startTime !== null) {
        currentTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}min`;
        
        // Mettre à jour l'affichage du temps dans les stats
        const timeStatElement = document.querySelector('.stat-item:nth-child(2) h4');
        if (timeStatElement) {
            timeStatElement.textContent = timeDisplay;
        }
    }
}

// Fonction pour arrêter le timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Fonction pour obtenir le temps formaté
function getFormattedTime() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}min`;
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    nextWord();
    updateProgress();
});




