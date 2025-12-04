// Memory Game (Flip Card) - dynamically generated
(function(){
  const icons = ['🎵','🎨','🪵','🎸','🛠️','📷','🎧','🧩','🎹','🪕','🎶','🖼️','⚙️','🕹️'];

  const board = document.getElementById('memoryBoard');
  const difficultySelect = document.getElementById('difficulty');
  const btnStart = document.getElementById('btnStart');
  const btnReset = document.getElementById('btnReset');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const movesEl = document.getElementById('moves');
  const matchesEl = document.getElementById('matches');
  const timerEl = document.getElementById('timer');
  const bestEasyEl = document.getElementById('best-easy');
  const bestHardEl = document.getElementById('best-hard');
  const winPopup = document.getElementById('winPopup');
  const winText = document.getElementById('winText');

  let cols = 4, rows = 3; // default easy
  let totalPairs = 6;
  let firstCard = null, secondCard = null, lockBoard = false;
  let moves = 0, matches = 0;
  let timer = null, seconds = 0;
  let timerStarted = false;

  function loadBests(){
    try{
      const be = JSON.parse(localStorage.getItem('memory_best_easy') || 'null');
      const bh = JSON.parse(localStorage.getItem('memory_best_hard') || 'null');
      bestEasyEl.textContent = be ? `${be.moves} žingsn. / ${formatTime(be.time)}` : '—';
      bestHardEl.textContent = bh ? `${bh.moves} žingsn. / ${formatTime(bh.time)}` : '—';
    }catch(e){ console.warn(e); }
  }

  function formatTime(s){
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function startTimer(){
    if (timer) clearInterval(timer);
    timer = setInterval(()=>{
      seconds++; timerEl.textContent = formatTime(seconds);
    },1000);
    timerStarted = true;
  }

  function stopTimer(){ clearInterval(timer); }

  function shuffle(array){
    for(let i = array.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [array[i],array[j]] = [array[j],array[i]];
    }
  }

  function buildBoard(){
    board.innerHTML = '';
    board.removeAttribute('data-cols');
    board.setAttribute('data-cols', cols);
    const pairCount = totalPairs;
    const pool = icons.slice(0);
    shuffle(pool);
    const chosen = pool.slice(0,pairCount);
    const deck = chosen.concat(chosen).map((v,i)=>({id:i, val:v}));
    shuffle(deck);
    deck.forEach(card=>{
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.setAttribute('data-value', card.val);
      const inner = document.createElement('div'); inner.className = 'card-inner';
      const front = document.createElement('div'); front.className = 'card-face card-front'; front.textContent = '?';
      const back = document.createElement('div'); back.className = 'card-face card-back'; back.textContent = card.val;
      inner.appendChild(front); inner.appendChild(back);
      cardEl.appendChild(inner);
      cardEl.addEventListener('click', onCardClick);
      board.appendChild(cardEl);
    });
  }

  function resetGame(autoStart=false){
    firstCard = null; secondCard = null; lockBoard = false;
    moves = 0; matches = 0; movesEl.textContent = '0'; matchesEl.textContent = '0';
    stopTimer(); seconds = 0; timerEl.textContent = '00:00'; timerStarted = false;
    setWin(false);
    buildBoard();
  }

  function setWin(state){
    if(state){ winPopup.setAttribute('aria-hidden','false'); }
    else { winPopup.setAttribute('aria-hidden','true'); }
  }

  function onCardClick(e){
    const card = e.currentTarget;
    if(lockBoard) return;
    if(card.classList.contains('matched')) return;
    const inner = card.querySelector('.card-inner');
    if(inner.classList.contains('is-flipped')) return;
    inner.classList.add('is-flipped');

    // start timer on first card flip
    if(!timerStarted){ seconds = 0; timerEl.textContent = formatTime(seconds); startTimer(); }

    if(!firstCard){ firstCard = card; return; }
    secondCard = card;
    // increase move count
    moves++; movesEl.textContent = moves;
    checkForMatch();
  }

  function checkForMatch(){
    const v1 = firstCard.getAttribute('data-value');
    const v2 = secondCard.getAttribute('data-value');
    if(v1 === v2){
      // matched
      firstCard.classList.add('matched'); secondCard.classList.add('matched');
      firstCard.removeEventListener('click', onCardClick); secondCard.removeEventListener('click', onCardClick);
      matches++; matchesEl.textContent = matches;
      firstCard = null; secondCard = null;
      if(matches === totalPairs){
        // win
        stopTimer();
        const result = {moves, time: seconds};
        showWin(result);
        saveBest(result);
      }
    } else {
      lockBoard = true;
      setTimeout(()=>{
        firstCard.querySelector('.card-inner').classList.remove('is-flipped');
        secondCard.querySelector('.card-inner').classList.remove('is-flipped');
        firstCard = null; secondCard = null; lockBoard = false;
      },1000);
    }
  }

  function showWin(result){
    winText.textContent = `${result.moves} ėjimų, laikas ${formatTime(result.time)}.`;
    setWin(true);
  }

  function saveBest(result){
    try{
      const key = (cols===4 && rows===3) ? 'memory_best_easy' : 'memory_best_hard';
      const prev = JSON.parse(localStorage.getItem(key) || 'null');
      let better = false;
      if(!prev) better = true;
      else if(result.moves < prev.moves) better = true;
      else if(result.moves === prev.moves && result.time < prev.time) better = true;
      if(better){ localStorage.setItem(key, JSON.stringify(result)); loadBests(); }
    }catch(e){ console.warn(e); }
  }

  function startGame(){
    // set dimensions by difficulty (only easy/hard supported)
    const diff = difficultySelect.value;
    if(diff === 'easy'){ cols = 4; rows = 3; totalPairs = 6; }
    else { cols = 6; rows = 4; totalPairs = 12; }
    resetGame();
    // optionally begin timer only when user flips first card (handled in onCardClick)
  }

  // Attach button events
  btnStart && btnStart.addEventListener('click', ()=>{ startGame(); });
  btnReset && btnReset.addEventListener('click', ()=>{ resetGame(); });
  btnPlayAgain && btnPlayAgain.addEventListener('click', ()=>{ setWin(false); startGame(); });

  // initialize
  loadBests(); resetGame();

})();
