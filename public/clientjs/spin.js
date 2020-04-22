const button = document.getElementById('spin');
button.addEventListener('click', function(evt){
  fetch('/home', {method:'POST'})
    .then(function(respones){
      return;  
    })
    .catch(function(error){
      console.log(error);
    });
});

setInterval(function(){
  fetch('/home',{method:'GET'})
    .then(function(response){
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    }
});
