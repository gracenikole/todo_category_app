const todo_cat = document.querySelectorAll(".todo_cat")
    for (let i = 0; i < todo_cat.length; i++) {
      const item = todo_cat[i];
      item.disabled = true
      item.style.backgroundColor = "white"
      item.style.border = "none"
    }

    const cat_upd = document.querySelectorAll('.update-button');
    for (let i = 0; i < cat_upd.length; i++) {
      const item = cat_upd[i];
      item.onclick = function(e) {
        const todo_cat_id = e.target.dataset['id'];
        todo_cat[i].disabled = !todo_cat[i].disabled; 
        todo_cat[i].style.backgroundColor = "f0eded"
        todo_cat[i].style.border = "1px solid #ccc"
        todo_cat[i].focus()
        todo_cat[i].addEventListener('keydown', function(event){
        if(event.which == 13){
          todo_cat[i].disabled = !todo_cat[i].disabled;
          let todo_cat_name = todo_cat[i].value;
          console.log("Value actua: " + todo_cat_name)
          fetch('/update/todo_category/' + todo_cat_id, {
            method: 'POST',
            body: JSON.stringify({
              'id': todo_cat_id,
              'name': todo_cat_name
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
        const list_category_id = e.target.dataset['id'];
        fetch('/categories/'+list_category_id+'/delete-list-category', {
          method: 'DELETE'
        }).then(function() {
          console.log("evento: ", e);
          const item = e.target.parentElement;
          item.remove();
          window.location.reload();
        });
      }
    }

  document.getElementById('form').onsubmit = function(e) {
    e.preventDefault();
    
    fetch('/categories/create', {
      method: 'POST',
      body: JSON.stringify({
        'category': document.getElementById('category').value
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
    
      const liItem = document.createElement('LI');
      const text = document.createTextNode(' ' + jsonResponse.category);
      liItem.appendChild(text);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-button';
      deleteBtn.setAttribute('data-id', jsonResponse.id);
      // deleteBtn.innerHTML = '&cross;';
      liItem.appendChild(deleteBtn);

      document.getElementById('category').appendChild(liItem);
      document.getElementById('error').className = 'hidden';
      window.location.reload();
    })
    .catch(function(error){
      document.getElementById('error').className = '';
    });
  }