const ROWS = 5;
const COLS = 5;

const gameMap = Array(ROWS * COLS).fill(false);

let isPlaying = false;
let playerName = null;

let hitCount = 0;
let intervalId = null;

function prepareGrid() {
  const grid = document.querySelector('#grid');

  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement('div');
    cell.classList.add('game__cell');
    grid.appendChild(cell);
  }
}

function prepareGame() {
  prepareGrid();

  const cells = document.querySelectorAll('.game__cell');

  for (const index in cells) {
    const cell = cells[index];

    cell.addEventListener('click', () => hitMole(index, cell));
  }
}

function startGame() {
  console.log('Juego iniciado');

  const name = getName();
  if (!name) {
    alert('Ingresa tu nombre');
    return;
  }

  playerName = name;

  intervalId = setInterval(spawnMole, 200);

  isPlaying = true;
}

function finishGame() {
  alert('Perdiste!');

  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  isPlaying = false;

  const previousPlayers = localStorage.getItem('scores');

  let previousPlayersArray = [];

  if (previousPlayers !== null) {
    previousPlayersArray = JSON.parse(previousPlayers);
  }

  localStorage.setItem(
    'scores',
    JSON.stringify([
      ...previousPlayersArray,
      {
        name: playerName,
        count: hitCount,
      },
    ])
  );

  alert(localStorage.getItem('scores'));
}

function resetGame() {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  hitCount = 0;
  updateHitCount(0);

  const grid = document.querySelector('#grid');

  grid.innerHTML = '';

  prepareGame();

  isPlaying = false;
}

function spawnMole() {
  if (gameLost()) {
    finishGame();
    return;
  }

  let row = Math.floor(Math.random() * ROWS);
  let col = Math.floor(Math.random() * COLS);

  while (gameMap[row * COLS + col]) {
    console.log('Repetido', row, col, gameMap[row * COLS + col]);
    row = Math.floor(Math.random() * ROWS);
    col = Math.floor(Math.random() * COLS);
  }

  gameMap[row * COLS + col] = true;

  const cells = document.querySelectorAll('.game__cell');

  const targetCell = cells[row * COLS + col];

  targetCell.classList.add('game__cell--mole');
}

function hitMole(index, cell) {
  if (isPlaying && gameMap[index]) {
    hitCount += 1;
    updateHitCount(hitCount);

    cell.classList.remove('game__cell--mole');
    cell.classList.add('game__cell--hit');

    gameMap[index] = false;

    setTimeout(() => cell.classList.remove('game__cell--hit'), 3000);
  }
}

function updateHitCount(count) {
  const element = document.querySelector('#hit-count');
  element.textContent = count;
}

function gameLost() {
  return gameMap.every((value) => value === true);
}

function getName() {
  return document.querySelector('#name-input').value;
}

document.querySelector('#play-button').addEventListener('click', startGame);
document.querySelector('#reset-button').addEventListener('click', resetGame);

prepareGame();
