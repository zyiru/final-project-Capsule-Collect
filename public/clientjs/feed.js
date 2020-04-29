let petLevel;
  fetch('/user', {method: 'GET'})
    .then(function(response){
      if(response.status >= 200 && response.status < 400){
        response.json().then(function(data) {
          petLevel = data.pets.level; 
        });
      }
    })
    .catch(function(error) {
      console.log(error);
    });

function feed(btn){
  const toy = btn.parentElement.parentElement;
  const num = toy.getElementsByClassName('quantity');
  const pg = document.getElementsByClassName('fivemsg');
    const ele = document.createElement('div');
    ele.classList.add('alert');
  while(pg[0].hasChildNodes()){
    pg[0].removeChild(pg[0].lastChild);
  }
  if(petLevel === 5){
    ele.classList.add('alert-danger');
    ele.innerHTML = 'Your pet is already at maximum level';
    pg[0].appendChild(ele);
  } else
  if(parseInt(num[0].innerHTML) < 1){
    ele.classList.add('alert-danger');
    const content = document.createTextNode(`You do not have any ${toy.id}`);
    ele.appendChild(content);
    pg[0].appendChild(ele);
  }else{
    //code based off
    //https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    fetch('/collection/toys', {
      method:'POST', 
      headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
      body: `name=${toy.id}`
    })
      .then(function(data) {
        console.log(data);
      })
      .catch(function(error){console.log(error)});
        ele.classList.add('alert-success');
        ele.innerHTML = `You have successfully feed your pet a ${toy.id} toy`;
        pg[0].appendChild(ele);
      num[0].innerHTML = parseInt(num[0].innerHTML)-1;
      
  }
}



