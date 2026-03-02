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
    
    // Cargar y abrir contexto
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

        // Eventos Ratón (Escritorio)
        card.addEventListener('mouseenter', () => playSound(sfxHover));
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Eventos Táctiles (Celulares / Tablets)
        card.addEventListener('touchstart', handleTouchStart, {passive: false});
        card.addEventListener('touchmove', handleTouchMove, {passive: false});
        card.addEventListener('touchend', handleTouchEnd);

        evidenceBoard.appendChild(card);
    });
}

// Modal de Contexto
function openContextModal() { contextOverlay.classList.remove('hidden'); }
function closeContextModal() { contextOverlay.classList.add('hidden'); }
btnOpenContext.addEventListener('click', openContextModal);
btnCloseContext.addEventListener('click', closeContextModal);

// =========================================
// 5. EVENTOS DE DRAG & DROP (ESCRITORIO Y MÓVIL)
// =========================================
let draggedCard = null;
let touchClone = null; // Para el efecto visual en móviles

// --- Lógica Escritorio (Ratón) ---
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
            if (existingCard && existingCard !== draggedCard) { evidenceBoard.appendChild(existingCard); }
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

// --- Lógica Móvil (Táctil) ---
function handleTouchStart(e) {
    if (this.getAttribute('draggable') === 'false') return; // Si ya ganó, no mover
    draggedCard = this;
    this.style.opacity = '0.3';
    playSound(sfxGrab);

    // Crear un clon visual que siga al dedo
    const touch = e.touches[0];
    touchClone = this.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '9999';
    touchClone.style.opacity = '0.9';
    touchClone.style.pointerEvents = 'none'; // Clave para que el sistema detecte lo que hay debajo
    touchClone.style.transform = 'translate(-50%, -50%)';
    touchClone.style.left = touch.clientX + 'px';
    touchClone.style.top = touch.clientY + 'px';
    
    document.body.appendChild(touchClone);
}

function handleTouchMove(e) {
    if (!draggedCard || !touchClone) return;
    e.preventDefault(); // Evita que la pantalla haga scroll al arrastrar
    
    // Mover el clon visual junto con el dedo
    const touch = e.touches[0];
    touchClone.style.left = touch.clientX + 'px';
    touchClone.style.top = touch.clientY + 'px';
}

function handleTouchEnd(e) {
    if (!draggedCard) return;

    // Eliminar el clon visual
    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }

    draggedCard.style.opacity = '1';

    // Obtener las coordenadas donde se levantó el dedo
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget) {
        // Verificar si se soltó sobre una ranura o sobre el tablero
        const slot = dropTarget.closest('.drop-slot');
        const board = dropTarget.closest('#evidence-board');

        if (slot) {
            const existingCard = slot.querySelector('.card');
            if (existingCard && existingCard !== draggedCard) {
                evidenceBoard.appendChild(existingCard);
            }
            slot.appendChild(draggedCard);
            playSound(sfxDrop);
        } else if (board) {
            evidenceBoard.appendChild(draggedCard);
            playSound(sfxDrop);
        }
    }

    draggedCard = null;
    checkDropZones();
}

function checkDropZones() {
    let filledSlots = 0;
    dropSlots.forEach(slot => { if (slot.querySelector('.card')) filledSlots++; });
    btnVerify.disabled = filledSlots < 3;
}

// 6. VALIDACIÓN Y TRANSICIÓN
btnVerify.addEventListener('click', () => {
    let allCorrect = true;
    let cardsInSlots = [];
    let correctNames = []; 

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
