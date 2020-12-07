const todo_desc = document.querySelectorAll(".todo_desc")
for (let i = 0; i < todo_desc.length; i++) {
  const item = todo_desc[i];
  item.disabled = true
  item.style.backgroundColor = "white"
  item.style.border = "none"
}

const items_upd = document.querySelectorAll('.update-button');
for (let i = 0; i < items_upd.length; i++) {
  const item = items_upd[i];
  item.onclick = function(e) {
    const todo_id = e.target.dataset['id'];
    todo_desc[i].disabled = !todo_desc[i].disabled;
    todo_desc[i].style.backgroundColor = "f0eded"
    todo_desc[i].style.border = "1px solid #ccc"
    todo_desc[i].focus()
    todo_desc[i].addEventListener('keydown', function(event){
    if(event.which == 13){
      todo_desc[i].disabled = !todo_desc[i].disabled;
      let todo_val = todo_desc[i].value;
      console.log("Value actua: " + todo_val)
      fetch('/update/todo/' + todo_id, {
        method: 'POST',
        body: JSON.stringify({
          'id': todo_id,
          'description': todo_val
        }),
        headers: {
          'content-type': 'application/json'
        }
      }).then(function() {
        window.location.reload();
      });
    }
  })
  }
}


const items = document.querySelectorAll('.delete-button');
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  item.onclick = function(e) {
    //console.log('evento click: ', e);
    const todo_id = e.target.dataset['id'];
    fetch('/todos/'+todo_id+'/delete-todo', {
      method: 'DELETE'
    }).then(function() {
      console.log("evento: ", e);
      const item = e.target.parentElement;
      item.remove();
      window.location.reload();
    });
  }
}


const checkboxes = document.querySelectorAll('.check-completed');
for (let i = 0; i < checkboxes.length; i++) {
  const checkbox = checkboxes[i];
  checkbox.onchange = function(e) {
    console.log(e);
    const newCompleted = e.target.checked;
    const todo_id = e.target.dataset['id'];
    fetch('/todos/'+ todo_id +'/set-completed', {
      method: 'POST',
      body: JSON.stringify({
        'completed': newCompleted
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(function(error) {
      document.getElementById('error').className = '';
    });

  }
}


document.getElementById('form').onsubmit = function(e) {
  e.preventDefault();
  let href = window.location.href
  let arr = href.split('/')
  let list_cat_id = arr[arr.length - 1]
  console.log(list_cat_id)
  fetch('/todos/create/in_cat/' + list_cat_id , {
    method: 'POST',
    body: JSON.stringify({
      'description': document.getElementById('description').value
      
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function(response){
    return response.json();
  })
  .then(function(jsonResponse) {
    console.log(jsonResponse);
    /* json object: {"description" : "tarea500"} */
  
    const liItem = document.createElement('LI');
    const checkbox = document.createElement('input');
    checkbox.className = 'check-completed';
    checkbox.type = 'checkbox'
    checkbox.setAttribute('data-id', jsonResponse.id);
    liItem.appendChild(checkbox);

    const text = document.createTextNode(' ' + jsonResponse.description);
    liItem.appendChild(text);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.setAttribute('data-id', jsonResponse.id);
    // deleteBtn.innerHTML = '&cross;';
    liItem.appendChild(deleteBtn);

    document.getElementById('todos').appendChild(liItem);
    document.getElementById('error').className = 'hidden';
    window.location.reload();
  })
  .catch(function(error){
    document.getElementById('error').className = '';
  });
} 