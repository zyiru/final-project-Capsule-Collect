//const btn = document.getElementsByClassName('combine');
//console.log(btn);

function makeToy(btn){
  const toy = btn.parentElement.parentElement;
  const num = toy.getElementsByClassName('quantity');
  const pg = document.getElementsByClassName('fivemsg');
	const childs = pg[0].childNodes;
	childs.forEach((node)=>pg[0].removeChild(node));
  if(parseInt(num[0].innerHTML) < 5){
    const ele = document.createElement('div');
    ele.classList.add('alert');
    ele.classList.add('alert-danger');
    const content = document.createTextNode("Need 5 pieces to combine");
    ele.appendChild(content);
    pg[0].appendChild(ele);
  }else{
    //code based off
	//https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    fetch('/collection/pieces', {
      method:'POST', 
      headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
      body: `name=${toy.id}`
    })
      .then(function(data) {
        console.log(data);
      })
      .catch(function(error){console.log(error)});
        const ele = document.createElement('div');
        ele.classList.add('alert');
        ele.classList.add('alert-success');
        ele.innerHTML = `You have successfully created ${toy.id} toy`;
        pg[0].appendChild(ele);
        num[0].innerHTML = parseInt(num[0].innerHTML)-5;
  }
}

