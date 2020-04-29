const button = document.getElementById('spin');
button.addEventListener('click', function(evt){
  const coins = document.getElementById('coins');
  const ele = document.getElementById('p-msg');
  if(parseInt(coins.innerHTML) < 10){
    ele.classList.add('alert-danger');
    const content = document.createTextNode('Not enough coins');
    ele.appendChild(content);
    $('.alert').show()
  }else{
/*
  fetch('/home', {method:'POST'})
    .then(function(respones){
      return;  
    })
    .catch(function(error){
      console.log(error);
    });
  /*
  fetch('/coins',{method:'GET'})
    .then(function(response){
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      
    });*/
  } 
});

/*
function message(){
  fetch('/home',{method:'GET'})
    .then(function(response){
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    }
});*/

