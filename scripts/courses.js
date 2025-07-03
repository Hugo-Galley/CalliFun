// Récupération du canvas et de son contexte de dessin
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = []; // Stocke les coordonnées des points


// Variable pour suivre si l'utilisateur est en train de dessiner
let drawing = false;

// Ajout des écouteurs d'événements pour la gestion du dessin
canvas.addEventListener("mousedown", startDrawing);  // Quand l'utilisateur clique sur le canvas
canvas.addEventListener("mousemove", draw);         // Quand l'utilisateur bouge la souris
canvas.addEventListener("mouseup", stopDrawing);    // Quand l'utilisateur relâche le clic
canvas.addEventListener("mouseleave", stopDrawing); // Si l'utilisateur sort du canvas

/**
 * Fonction appelée quand l'utilisateur commence à dessiner.
 * @param {MouseEvent} event - L'événement de la souris.
 */
function startDrawing(event) {
    drawing = true; // Active le mode dessin
    ctx.beginPath(); // Commence un nouveau tracé
    ctx.moveTo(event.offsetX, event.offsetY); // Place le point de départ au niveau du curseur
    points = [];
}

/**
 * Fonction appelée pendant que l'utilisateur dessine.
 * @param {MouseEvent} event - L'événement de la souris.
 */
function draw(event) {
    if (!drawing) return; // Si on ne dessine pas, on quitte la fonction

    // Trace une ligne entre l'ancien point et la nouvelle position du curseur
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.strokeStyle = "black"; // Définit la couleur du trait
    ctx.lineWidth = 3; // Définit l'épaisseur du trait
    ctx.lineCap = "round"; // Arrondi les extrémités du trait pour un effet plus naturel
    ctx.stroke(); // Applique le tracé
}

/**
 * Fonction appelée quand l'utilisateur arrête de dessiner.
 */
function stopDrawing() {
    drawing = false; // Désactive le mode dessin
    ctx.beginPath(); // Prépare un nouveau tracé pour éviter les connexions indésirables
}

/**
 * Fonction pour effacer complètement le canvas.
 */

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface tout le canevas

    // Affiche le message
    let message = document.getElementById("message");
    message.classList.remove("hidden");

    // Cache le message après 3 secondes
    setTimeout(() => {
        message.classList.add("hidden");
    }, 3000);
}

// Liste de mots en arabe
const words = ["بِسْمِ", "السلام", "مدرسة", "قلم", "كتاب", "شمس", "قمر", "زهرة", "بحر", "سماء"];

// Récupération des éléments HTML
const wordElement = document.getElementById("word");
const message = document.getElementById("message");

// Fonction pour obtenir un mot aléatoire
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

// Fonction pour afficher un nouveau mot et effacer le canevas
function nextWord() {
    wordElement.textContent = getRandomWord(); // Change le mot affiché
    clearCanvas(); // Efface le canevas
    showMessage("Nouveau mot affiché !");
}

// Fonction pour effacer le canevas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour afficher un message temporaire
function showMessage(text) {
    message.textContent = text;
    message.classList.remove("hidden");

    setTimeout(() => {
        message.classList.add("hidden");
    }, 2000);
}

// Fonction qui récupère les coordonnées de chaque point
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    let x = e.offsetX;
    let y = e.offsetY;

    points.push({ x, y }); // Stocke chaque point dessiné

    // Dessine un petit point noir à chaque mouvement de la souris
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 2, 2);
});

// J'affiche ces coordonnées dans la console
document.getElementById("validate").addEventListener("click", function() {
    console.log("Points enregistrés :", points);
});




