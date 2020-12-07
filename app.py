from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import psycopg2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mistyblunch:pvta@localhost:5432/todosdb1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connection = connection = psycopg2.connect(database = "todosdb1")
cursor = connection.cursor()

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Todo(db.Model):
  __tablename__ = 'todos'
  id = db.Column(db.Integer, primary_key=True)
  description = db.Column(db.String(), nullable=False)
  completed = db.Column(db.Boolean, nullable=False, default=False)
  list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'), nullable=False)

  def __repr__(self):
    return f'<Todo: {self.id}, {self.description}>'

class TodoList(db.Model):
  __tablename__ = 'todolists'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(), nullable=False)
  todos = db.relationship('Todo', backref='list', lazy=True, cascade="all,delete")


# Todos
@app.route('/todos/create', methods=['GET'])
def create_todo1():
  print("create_todot1")
  description = request.args.get('description', '')
  todo = Todo(description=description)
  db.session.add(todo)
  db.session.commit()
  return redirect(url_for('index'))

@app.route('/todos/create/in_cat/<list_cat_id>', methods=['POST'])
def create_todo2(list_cat_id):
  print('create_todo2')
  try:
    cursor.execute("select count(name) from todolists where name ='Uncategorized'")
    contUncategorizedCat = cursor.fetchone()[0]

    if(contUncategorizedCat == 0):
      list_cat = TodoList(name="Uncategorized")
      db.session.add(list_cat)
      db.session.commit()
    
    # list_cat_id = TodoList.query.filter_by(name="Uncategorized").first().id
    description = request.get_json()['description']
    todo = Todo(description=description, list_id=list_cat_id)
    db.session.add(todo)
    db.session.commit()
    return jsonify({
        'id': todo.id,
        'description': todo.description,
        'completed': todo.completed
      })
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()

@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def check_complete(todo_id):
  try:
    newcompleted = request.get_json()['completed']
    todo = Todo.query.get(todo_id)
    todo.completed = newcompleted
    db.session.commit()
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()
  return redirect(url_for('index'))

@app.route('/todos/<todo_id>/delete-todo', methods=['DELETE'])
def delete_todo(todo_id):
  try:
    todo = Todo.query.get(todo_id)
    db.session.delete(todo)
    db.session.commit()
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()
  return jsonify({
    'success': True
  })

@app.route('/update/todo/<todo_id>', methods=['POST'])
def update_todo(todo_id):
  try:
    todo_id = request.get_json()['id']
    todo_desc = request.get_json()['description']
    todo = Todo.query.get(todo_id)
    print(todo_desc, "AAAAA")
    todo.description = todo_desc
    db.session.commit()
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()

# Categories
@app.route('/lists/<list_id>', methods=['GET'])
def get_list_todos(list_id):
  return render_template('index.html',
    lists = TodoList.query.all(),
    todos = Todo.query.filter_by(list_id=list_id).order_by('id').all()
  )

@app.route('/all_categories')
def return_cat_view():
  return render_template('categories.html',
    categories = TodoList.query.all(),
  )

@app.route('/categories/create', methods=['GET'])
def create_category1():
  print("create_category1")
  category_name = request.args.get('category', '')
  todo_list_cat = TodoList(name=category_name)
  db.session.add(todo_list_cat)
  db.session.commit()
  return render_template('categories.html',
    categories = TodoList.query.all(),
  )

@app.route('/categories/create', methods=['POST'])
def create_category2():
  print('create_category1')
  try:    
    category_name = request.get_json()['category']
    todo_list_cat = TodoList(name=category_name)
    db.session.add(todo_list_cat)
    db.session.commit()
    print('hizo el commit')
    return jsonify({
        'name': todo_list_cat.name,
      })
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()

@app.route('/update/todo_category/<todo_cat_id>', methods=['POST'])
def update_todo_cat(todo_cat_id):
  try:
    todo_cat_id = request.get_json()['id']
    todo_cat_name = request.get_json()['name']
    cat = TodoList.query.get(todo_cat_id)
    cat.name = todo_cat_name
    db.session.commit()
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()

@app.route('/categories/<list_category_id>/delete-list-category', methods=['DELETE'])
def delete_category(list_category_id):
  try:
    todo_list_cat = TodoList.query.get(list_category_id)
    db.session.delete(todo_list_cat)
    db.session.commit()
  except Exception as e:
    db.session.rollback()
  finally:
    db.session.close()
  return jsonify({
    'success': True
  })


@app.route('/')
def index():
  return redirect(url_for('get_list_todos', list_id=1))

if __name__ == '__main__':
  app.run(debug=True, port=5002)