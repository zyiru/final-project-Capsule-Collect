function getUserData(){
  fetch('/user', {method: 'GET'})
    .then(
      function(response){
        if(response.status >= 200 && response.status < 400){
          response.json().then(function(data) {
            document.getElementById('coins').innerHTML = `Coins: ${data.coins}`;
          });
        }
      }
    )
    .catch(function(error) {
      console.log(error);
    });
}

function updateData(){
  fetch('/game', {method: 'POST'})
    .then(function(responses){return;})
    .catch(function(error){console.log(error);});
}

function compMove(){
  const cm = Math.floor(Math.random()*3);
  const move = document.createElement('img');
  move.classList.add('move');
  if(cm === 0){
    move.src = "https://www.pngitem.com/pimgs/m/226-2260873_transparent-rock-paper-scissors-png-png-download.png";
  }else if(cm === 1){
    move.src = "https://cdn.clipart.email/9e4442c95786c113265ddec28a098ebf_transparent-rock-paper-scissors-clipart-rock-paper-scissors-png-_860-927.png";
  }else{
    move.src = "https://www.kindpng.com/picc/m/502-5025731_scissors-clipart-png-download-rock-paper-scissors-clipart.png";
  }
  move.classList.add('w-50');
  document.getElementById('compmove').appendChild(move);
  return cm;
}

function compare(cm, pm, end){
  if(pm === 'rock'){
    if(cm === 0)  return 'tie';
    else if(cm === 1) return 'loss';
    else{
      end('win');
    }
  }else if(pm === 'paper'){
    if(cm === 0) end('win');
    else if(cm === 1) end('tie');
    else end('loss');
  }else{
    if(cm === 0) end('loss');
    else if(cm === 1) end('win');
    else end('tie');
  }
}

function end(result){
  const game = document.getElementById('compmove');
  const res = document.createElement('div');
  res.classList.add('result');
  if(result === 'win'){
    updateData();
    res.innerHTML = 'YOU WON!!! YOU GOT 5 COINS!!!';
  }else{
    if(result === 'loss'){
      res.innerHTML = 'YOU LOST!';
    }
    if(result === 'tie'){
      res.innerHTML = 'TIED';
    }
  }
	
  game.appendChild(res);
  const btn = document.getElementById('replay');
  btn.classList.toggle('d-none');  
  const paperMoves = document.getElementById('moves');
  paperMoves.classList.toggle('d-none');
  btn.addEventListener('click', replay);
  setTimeout(getUserData, 200);
}

function replay(){
  const btn = document.getElementById('replay');
  btn.classList.toggle('d-none');
  const move = document.querySelector('.move');
  const result = document.querySelector('.result');
  console.log(result);
  const game = move.parentNode;
  const paperMoves = document.getElementById('moves');
  paperMoves.classList.toggle('d-none');
  game.removeChild(move);
  game.removeChild(result);
  const div = document.querySelector('.playlabel');
  div.classList.toggle('d-none');
}

function play(btn){
  const div = document.querySelector('.playlabel');
  div.classList.add('d-none');
  const cm = compMove();
  const pm = btn.id;
  compare(cm, pm, end);
}

