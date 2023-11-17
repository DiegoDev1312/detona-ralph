const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        score: document.querySelector('#score'),
        timeLeft: document.querySelector('#time-left'),
        life: document.querySelector('#life'),
        modal: document.querySelector('.reset-game-modal'),
        modalMessageArea: document.querySelector('.modal-message-area'),
    },
    values: {
        scorePoints: 0,
        enemySquareId: 0,
        initialTime: 60,
        playerLife: 3,
    },
    actions: {
        playerTime: setInterval(attPlayerTime, 1000),
        enemyTime: setInterval(renderEnemy, 1000),
    },
};

function createModalInfo(codition) {
    const titleModal = document.createElement('h1');
    const scoreInfo = document.createElement('h2');
    const restartButton = document.createElement('button');
    titleModal.textContent = `Você ${codition === 'winner' ? 'ganhou' : 'perdeu'}!`;
    scoreInfo.textContent = `Pontuação: ${state.values.scorePoints}`;
    restartButton.textContent = 'Recomeçar';
    restartButton.addEventListener('click', restartGame);
    state.view.modalMessageArea.append(titleModal, scoreInfo, restartButton);
}

function openCoditionModal(codition) {
    navigator.vibrate(1000);
    playSound('finish-sound.mp3', 1);
    clearTimeout(state.actions.enemyTime);
    clearTimeout(state.actions.playerTime);
    state.view.modal.style.display = 'flex';
    createModalInfo(codition);
}

function attPlayerTime() {
    state.values.initialTime--;
    state.view.timeLeft.textContent = state.values.initialTime;

    if (state.values.initialTime <= 0) {
        openCoditionModal();
    }
}

function playSound(sound, volume) {
    const audio = new Audio(`./src/audios/${sound}`);

    audio.volume = volume;
    audio.play();
}

function renderEnemy() {
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });
    const randomNumber = Math.floor(Math.random() * 9);
    state.values.enemySquareId = state.view.squares[randomNumber].id;
    state.view.squares[randomNumber].classList.add('enemy');
}

function controlGameSettings() {
    if (state.values.scorePoints === 30) {
        openCoditionModal('winner');
    } else if (state.values.scorePoints >= 15) {
        state.actions.enemyTime = setInterval(renderEnemy, 700);
    } else if (state.values.scorePoints >= 25) {
        state.actions.enemyTime = setInterval(renderEnemy, 500);
    } else {
        state.actions.enemyTime = setInterval(renderEnemy, 1000);
    }
}

function handleEnemyPress() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', () => {
            if (square.id === state.values.enemySquareId) {
                clearTimeout(state.actions.enemyTime);
                square.classList.remove('enemy');
                state.values.scorePoints++;
                state.view.score.textContent = state.values.scorePoints;
                state.values.enemySquareId = null;
                playSound('hit.m4a', 0.2);
                controlGameSettings();
            } else {
                state.values.playerLife--;
                state.view.life.textContent = `x${state.values.playerLife}`;

                if (state.values.playerLife === 0) {
                    openCoditionModal('loser');
                }
            }
        });
    });
}

function restartGame() {
    location.reload(location.href);
}

function main() {
    renderEnemy();
    handleEnemyPress();
}

main();
