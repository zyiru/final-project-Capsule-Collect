//const btn = document.getElementsByClassName('combine');
//console.log(btn);

function makeToy(btn){
  const toy = btn.parentElement.parentElement;
  const num = toy.getElementsByClassName('quantity');
  const pg = document.getElementsByClassName('fivemsg');
  while(pg[0].hasChildNodes()){
    pg[0].removeChild(pg[0].lastChild);
  }
  if(parseInt(num[0].innerHTML) < 5){
    const ele = document.createElement('div');
    ele.classList.add('alert');
    ele.classList.add('alert-danger');
    const content = document.createTextNode("Need 5 pieces to combine");
    ele.appendChild(content);
    pg[0].appendChild(ele);
//    setTimeout(()=> pg[0].removeChild(ele), 5000);
  }else{
  console.log(toy.id);
    fetch('/collection/pieces', {
      method:'POST', 
      headers: {"Content-Type": "application/json"},
      body: {name: toy.id}
    })
      .then(function(responses){return;})
      .then((data)=>console.log(data))
      .catch(function(error){console.log(error)});
    fetch('/collection/pieces', {method:'GET'})
      .then(function(response) {
        if(response.ok) return;
        throw new Error('Request failed');
      })
      .then(function(data) {
        const ele = document.createElement('div');
        ele.classList.add('alert');
        ele.classList.add('alert-info');
        ele.innerHTML = 'You have successfully created ${data} toy';
        pg[0].appendChild(ele);
      });
  }
}

