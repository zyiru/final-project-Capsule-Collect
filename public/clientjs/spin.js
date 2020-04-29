const button = document.getElementById('spin');
button.addEventListener('click', function(evt){
  const coins = document.getElementById('coins');
  const ele = document.getElementById('p-msg');
  if(parseInt(coins.innerHTML) < 10){
    ele.classList.add('alert-danger');
    const content = document.createTextNode('Not enough coins');
    ele.appendChild(content);
    $('.alert').show()
  }
});

