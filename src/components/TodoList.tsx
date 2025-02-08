import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Todo } from '../types';
import { Edit3, Trash2, CheckCircle, Save, X } from 'lucide-react';
import Header from './Header';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    if (!auth.currentUser) return;
    
    try {
      const q = query(
        collection(db, 'todos'),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !auth.currentUser) return;

    try {
      const todoRef = collection(db, 'todos');
      await addDoc(todoRef, {
        title,
        description,
        completed: false,
        partiallyCompleted: false,
        createdAt: new Date(),
        userId: auth.currentUser.uid
      });

      setTitle('');
      setDescription('');
      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveTodoEdit = async (todoId: string) => {
    if (!auth.currentUser || !editTitle.trim()) return;

    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        title: editTitle,
        description: editDescription
      });
      setEditingTodo(null);
      await fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const togglePartialComplete = async (todo: Todo) => {
    if (!auth.currentUser) return;
    
    try {
      const todoRef = doc(db, 'todos', todo.id);
      await updateDoc(todoRef, {
        partiallyCompleted: !todo.partiallyCompleted
      });
      await fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!auth.currentUser) return;
    
    try {
      await deleteDoc(doc(db, 'todos', id));
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="layout-wrapper">
      <Header 
        userName={auth.currentUser?.displayName || auth.currentUser?.email} 
        onLogout={handleLogout}
      />

      <div className="container">
        <form onSubmit={addTodo} className="todo-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Todo</button>
        </form>

        <div className="todo-grid">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-card ${todo.partiallyCompleted ? 'partially-completed' : ''}`}
            >
              {editingTodo === todo.id ? (
                <div className="form-group">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="edit-textarea"
                  />
                  <div className="todo-actions">
                    <button
                      onClick={() => saveTodoEdit(todo.id)}
                      className="btn btn-success"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn btn-danger"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className={`todo-title ${todo.partiallyCompleted ? 'completed' : ''}`}>
                    {todo.title}
                  </h3>
                  <p className="todo-description">
                    {todo.description}
                  </p>
                  <div className="todo-actions">
                    <button
                      onClick={() => togglePartialComplete(todo)}
                      className="btn btn-primary"
                    >
                      <CheckCircle size={16} />
                      Toggle
                    </button>
                    <button
                      onClick={() => startEditing(todo)}
                      className="btn btn-warning"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn btn-danger"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;