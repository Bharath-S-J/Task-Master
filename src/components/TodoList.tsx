import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Todo } from "../types";
import { Edit3, Trash2, CheckCircle, Save, X } from "lucide-react";
import Header from "./Header";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [reminderError, setReminderError] = useState("");

  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editReminderAt, setEditReminderAt] = useState("");
  const [editReminderError, setEditReminderError] = useState("");

  const notifiedSet = useRef<Set<string>>(new Set()); // Holds todo IDs
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const navigate = useNavigate();

useEffect(() => {
  if (!auth.currentUser) return;

  const q = query(
    collection(db, "todos"),
    where("userId", "==", auth.currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todosData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        reminderAt: data.reminderAt?.toDate?.() || null,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    }) as Todo[];

    // Sort based on status and reminderAt
    const sortedTodos = todosData.sort((a, b) => {
      const statusOrder = {
        "in_progress": 0,
        "not_started": 1,
        "completed": 2,
      };

      const statusCompare = statusOrder[a.status] - statusOrder[b.status];
      if (statusCompare !== 0) return statusCompare;

      // If same status, sort by reminderAt (nulls last)
      const aTime = a.reminderAt ? a.reminderAt.getTime() : Infinity;
      const bTime = b.reminderAt ? b.reminderAt.getTime() : Infinity;

      return aTime - bTime;
    });

    setTodos(sortedTodos);
  });

  return unsubscribe;
}, []);


  useEffect(() => {
    const runBatchUpdateOnce = async () => {
      const alreadyRun = localStorage.getItem("batchUpdateDone");
      if (alreadyRun) {
        console.log("Batch update already done, skipping");
        return;
      }

      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "todos"),
          where("userId", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        for (const document of querySnapshot.docs) {
          const data = document.data();
          const updates: Partial<{ status: string; reminderAt: any }> = {};

          if (!data.status) {
            updates.status = "not_started";
          }
          if (data.reminderAt === undefined) {
            updates.reminderAt = null; // or a Firestore timestamp if you want a default reminder
          }

          if (Object.keys(updates).length > 0) {
            const todoDocRef = doc(db, "todos", document.id);
            await updateDoc(todoDocRef, updates);
            console.log(`Updated todo with id ${document.id} with`, updates);
          }
        }

        localStorage.setItem("batchUpdateDone", "true");
        console.log("Batch update completed and flag set");
      } catch (error) {
        console.error("Batch update error:", error);
      }
    };

    runBatchUpdateOnce();
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/reminder.mp3");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      todos.forEach((todo) => {
        if (!todo.reminderAt || notifiedSet.current.has(todo.id)) return;

        const timeDiff = new Date(todo.reminderAt).getTime() - Date.now();

        if (timeDiff <= 60000 && timeDiff > 0) {
          audioRef.current?.play().catch((err) => {
            console.error("Audio play failed:", err);
          });
          alert(`Reminder: ${todo.title}`);
          notifiedSet.current.add(todo.id);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [todos]);

  const fetchTodos = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "todos"),
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          reminderAt: data.reminderAt?.toDate() || null,
        };
      }) as Todo[];

      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !auth.currentUser || reminderError) return;

    try {
      const todoRef = collection(db, "todos");
      await addDoc(todoRef, {
        title,
        description,
        status: "not_started",
        createdAt: new Date(),
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        userId: auth.currentUser.uid,
      });

      setTitle("");
      setDescription("");
      setReminderAt("");
      setReminderError("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditReminderAt(
      todo.reminderAt
        ? new Date(todo.reminderAt).toISOString().slice(0, 16)
        : ""
    );
    setEditReminderError("");
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditTitle("");
    setEditDescription("");
    setEditReminderAt("");
  };

  const saveTodoEdit = async (todoId: string) => {
    if (!auth.currentUser || !editTitle.trim() || editReminderError) return;

    try {
      const todoRef = doc(db, "todos", todoId);
      await updateDoc(todoRef, {
        title: editTitle,
        description: editDescription,
        reminderAt: editReminderAt ? new Date(editReminderAt) : null,
      });
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const cycleStatus = async (todo: Todo) => {
    if (!auth.currentUser) return;

    let newStatus: "not_started" | "in_progress" | "completed";

    switch (todo.status) {
      case "not_started":
        newStatus = "in_progress";
        break;
      case "in_progress":
        newStatus = "completed";
        break;
      case "completed":
        newStatus = "not_started";
        break;
      default:
        newStatus = "not_started";
    }

    try {
      const todoRef = doc(db, "todos", todo.id);
      await updateDoc(todoRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
          <div className="form-group">
            <label htmlFor="reminder">Reminder Time (Optional)</label>
            <input
              type="datetime-local"
              id="reminder"
              value={reminderAt}
              onChange={(e) => {
                const val = e.target.value;
                setReminderAt(val);
                if (val && new Date(val) < new Date()) {
                  setReminderError("Reminder must be in the future.");
                } else {
                  setReminderError("");
                }
              }}
            />
            {reminderError && <p className="error-text">{reminderError}</p>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={reminderError !== ""}
          >
            Add Todo
          </button>
        </form>

        <div className="todo-grid">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-card todo-status-${
                todo.status || "not_started"
              }`}
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
                  <div className="form-group">
                    <label htmlFor="editReminder">
                      Reminder Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="editReminder"
                      value={editReminderAt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditReminderAt(val);
                        if (val && new Date(val) < new Date()) {
                          setEditReminderError(
                            "Reminder must be in the future."
                          );
                        } else {
                          setEditReminderError("");
                        }
                      }}
                      className="edit-input"
                    />
                    {editReminderError && (
                      <p className="error-text">{editReminderError}</p>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => saveTodoEdit(todo.id)}
                      className="btn btn-success"
                      disabled={editReminderError !== "" || !editTitle.trim()}
                    >
                      <Save size={16} />
                      Save
                    </button>

                    <button onClick={cancelEditing} className="btn btn-danger">
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1
                    className={`todo-title todo-text-status-${
                      todo.status || "not_started"
                    }`}
                  >
                    {todo.title}
                  </h1>
                  <p
                    className={`todo-description todo-text-status-${
                      todo.status || "not_started"
                    }`}
                  >
                    {todo.description}
                  </p>
                  {todo.reminderAt && (
                    <p className="todo-reminder">
                      Reminder:{" "}
                      {format(new Date(todo.reminderAt), "dd:MM:yyyy HH:mm")}
                    </p>
                  )}
                  <div className="todo-actions">
                    <button
                      onClick={() => cycleStatus(todo)}
                      className="btn btn-primary"
                    >
                      <CheckCircle size={16} />
                      {todo.status === "completed"
                        ? "Completed"
                        : todo.status === "in_progress"
                        ? "In Progress"
                        : "Not Started"}
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
