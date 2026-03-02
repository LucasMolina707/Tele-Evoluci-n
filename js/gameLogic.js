/* =========================================
   LÓGICA PRINCIPAL DEL JUEGO
========================================= */

// 1. VARIABLES DE ESTADO
let playerName = "";
let mistakesCount = 0;
let currentLevelIndex = 0;
let currentLevelData = null;

// 2. REFERENCIAS AL DOM
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const contextOverlay = document.getElementById('context-overlay');

const inputName = document.getElementById('player-name-input');
const btnStartGame = document.getElementById('btn-start-game');
const displayPlayerName = document.getElementById('display-player-name');
const finalPlayerName = document.getElementById('final-player-name');
const finalMistakes = document.getElementById('final-mistakes');

const eraTitle = document.getElementById('era-title');
const currentLevelUI = document.getElementById('current-level');
const evidenceBoard = document.getElementById('evidence-board');
const dropSlots = document.querySelectorAll('.drop-slot');
const btnVerify = document.getElementById('btn-verify');
const btnNext = document.getElementById('btn-next');
const resolutionStory = document.getElementById('resolution-story');
const storyText = document.getElementById('story-text');

// Referencias de Modal de Contexto
const contextEraTitle = document.getElementById('context-era-title');
const contextTextContent = document.getElementById('context-text-content');
const btnOpenContext = document.getElementById('btn-open-context');
const btnCloseContext = document.getElementById('btn-close-context');

// Audio
const sfxHover = document.getElementById('sound-hover');
const sfxGrab = document.getElementById('sound-grab');
const sfxDrop = document.getElementById('sound-drop');
const sfxSuccess = document.getElementById('sound-success');
const sfxError = document.getElementById('sound-error');
const sfxTransition = document.getElementById('sound-transition');
const sfxStatic = document.getElementById('sound-static');

// 3. LÓGICA DE INICIO
btnStartGame.addEventListener('click', () => {
    const nameValue = inputName.value.trim();
    if (nameValue === "") {
        alert("Por favor, ingresa tu nombre y apellido para registrar tu investigación.");
        return;
    }
    
    playerName = nameValue;
    displayPlayerName.innerText = playerName;
    
    playSound(sfxTransition);
    introScreen.style.opacity = '0';
    
    setTimeout(() => {
        introScreen.classList.remove('active');
        introScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');
        
        loadLevel(currentLevelIndex);
        
        gameScreen.style.opacity = '0';
        setTimeout(() => gameScreen.style.opacity = '1', 50);
    }, 500);
});

// 4. MOTOR DEL JUEGO (CARGA DE NIVELES)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadLevel(index) {
    evidenceBoard.innerHTML = '';
    resolutionStory.classList.add('hidden');
    btnVerify.disabled = true;
    btnVerify.classList.remove('hidden');
    btnNext.classList.add('hidden');
    
    dropSlots.forEach(slot => {
        const cards = slot.querySelectorAll('.card');
        cards.forEach(card => card.remove());
    });

    currentLevelData = gameData[index];
    currentLevelUI.innerText = currentLevelData.level;
    eraTitle.innerText = currentLevelData.era;
    
    // Cargar datos en el Modal de Contexto y abrirlo automáticamente
    contextEraTitle.innerText = currentLevelData.era;
    contextTextContent.innerText = currentLevelData.context;
    openContextModal();

    const shuffledClues = shuffleArray([...currentLevelData.clues]);
    
    shuffledClues.forEach(clue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('draggable', 'true');
        card.setAttribute('id', clue.id);
        card.setAttribute('data-correct', clue.isCorrect);
        
        card.innerHTML = `
            <img src="assets/img/${clue.img}" alt="${clue.text}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'#ddd\\'/></svg>'">
            <p>${clue.text}</p>
        `;

        card.addEventListener('mouseenter', () => playSound(sfxHover));
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        evidenceBoard.appendChild(card);
    });
}

// Lógica del Modal de Contexto (Bloquea el arrastre por CSS z-index)
function openContextModal() {
    contextOverlay.classList.remove('hidden');
}
function closeContextModal() {
    contextOverlay.classList.add('hidden');
}

btnOpenContext.addEventListener('click', openContextModal);
btnCloseContext.addEventListener('click', closeContextModal);

// 5. EVENTOS DE DRAG & DROP
let draggedCard = null;

function handleDragStart(e) {
    draggedCard = this;
    setTimeout(() => this.style.opacity = '0.5', 0);
    playSound(sfxGrab);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedCard = null;
    checkDropZones();
}

dropSlots.forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => { slot.classList.remove('drag-over'); });
    slot.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        if (draggedCard) {
            const existingCard = this.querySelector('.card');
            if (existingCard) { evidenceBoard.appendChild(existingCard); }
            this.appendChild(draggedCard);
            playSound(sfxDrop);
        }
    });
});

evidenceBoard.addEventListener('dragover', e => e.preventDefault());
evidenceBoard.addEventListener('drop', function(e) {
    e.preventDefault();
    if (draggedCard) {
        this.appendChild(draggedCard);
        playSound(sfxDrop);
    }
});

function checkDropZones() {
    let filledSlots = 0;
    dropSlots.forEach(slot => { if (slot.querySelector('.card')) filledSlots++; });
    btnVerify.disabled = filledSlots < 3;
}

// 6. VALIDACIÓN Y TRANSICIÓN
btnVerify.addEventListener('click', () => {
    let allCorrect = true;
    let cardsInSlots = [];
    let correctNames = []; // Guardar los nombres para la explicación

    dropSlots.forEach(slot => {
        const card = slot.querySelector('.card');
        if (card) {
            cardsInSlots.push(card);
            correctNames.push(card.querySelector('p').innerText);
            if (card.getAttribute('data-correct') === 'false') {
                allCorrect = false;
            }
        }
    });

    if (allCorrect) {
        playSound(sfxSuccess);
        
        // Explicación dinámica del porqué son correctas
        storyText.innerHTML = `<strong>Evidencias Confirmadas:</strong> Has enlazado correctamente a <em>${correctNames.join(", ")}</em>.<br><br><strong>Reporte de la época:</strong> ${currentLevelData.story}`;
        
        resolutionStory.classList.remove('hidden');
        btnVerify.classList.add('hidden');
        
        if (currentLevelIndex < gameData.length - 1) {
            btnNext.classList.remove('hidden');
        } else {
            btnNext.innerText = "🏆 VER REPORTE FINAL";
            btnNext.classList.remove('hidden');
        }

        cardsInSlots.forEach(card => card.setAttribute('draggable', 'false'));
        
    } else {
        playSound(sfxError);
        mistakesCount++;
        
        cardsInSlots.forEach(card => {
            if (card.getAttribute('data-correct') === 'false') {
                card.classList.add('shake');
                setTimeout(() => {
                    card.classList.remove('shake');
                    evidenceBoard.appendChild(card);
                    checkDropZones();
                }, 600);
            }
        });
    }
});

btnNext.addEventListener('click', () => {
    if (currentLevelIndex < gameData.length - 1) {
        playSound(sfxTransition);
        setTimeout(() => playSound(sfxStatic), 500);
        gameScreen.style.opacity = '0';
        
        setTimeout(() => {
            currentLevelIndex++;
            loadLevel(currentLevelIndex);
            gameScreen.style.opacity = '1';
        }, 1000);
    } else {
        playSound(sfxSuccess);
        gameScreen.style.opacity = '0';
        
        setTimeout(() => {
            gameScreen.classList.add('hidden');
            gameScreen.classList.remove('active');
            
            finalPlayerName.innerText = playerName;
            finalMistakes.innerText = mistakesCount;
            
            resultsScreen.classList.remove('hidden');
            resultsScreen.classList.add('active');
        }, 500);
    }
});

// 7. UTILIDADES
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Se requiere interacción para audio")); 
    }
}