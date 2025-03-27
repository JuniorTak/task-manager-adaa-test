"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = "http://localhost:8000/api";

export default function TaskManager() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", image: null });
  const [token, setToken] = useState(null);

  // Redirect to login page if not logged in.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchTasks(storedToken);
  }, []);

  // Logout function.
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }
  // Edit a task.
  function editTask(id) {
    //
  }

  // Fetch tasks from API.
  async function fetchTasks(token) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Echec de récupération des tâches");
      const responseData = await res.json();
      setTasks(responseData.data || []);
    } catch (err) {
      console.log(err);
      // Customize error message based on error type.
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Erreur réseau ! Impossible d'accéder au serveur.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Problème CORS ! Le backend bloque les requêtes.";
      } else if (err.message.includes("Unauthorized")) {
        errorMessage = "Identifiants invalides !";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Add a new task.
  async function addTask() {
    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      formData.append("due_date", newTask.due_date);
      if (newTask.image) formData.append("image", newTask.image); // Append image if exists.

      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Echec d'ajout de tâche");
      setNewTask({ title: "", description: "", due_date: "", image: null });
      fetchTasks(token);
      window.alert('Nouvelle tâche ajouée avec succès.');
    } catch (err) {
      // Customize error message based on error type.
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Erreur réseau ! Impossible d'accéder au serveur.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Problème CORS ! Le backend bloque les requêtes.";
      } else if (err.message.includes("Unauthorized")) {
        errorMessage = "Identifiants invalides !";
      }
      setError(errorMessage);
    }
  }

  // Toggle task completion status.
  async function markAsComplete(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Echec de terminaison de tâche");
      fetchTasks(token);
    } catch (err) {
      // Customize error message based on error type.
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Erreur réseau ! Impossible d'accéder au serveur.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Problème CORS ! Le backend bloque les requêtes.";
      } else if (err.message.includes("Unauthorized")) {
        errorMessage = "Identifiants invalides !";
      }
      setError(errorMessage);
    }
  }

  // Delete a task.
  async function deleteTask(id) {
    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer la tâche? Cette action est irreversible!");
		if (!shouldDelete) return;
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(token);
    } catch (err) {
      // Customize error message based on error type.
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Erreur réseau ! Impossible d'accéder au serveur.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Problème CORS ! Le backend bloque les requêtes.";
      } else if (err.message.includes("Unauthorized")) {
        errorMessage = "Identifiants invalides !";
      }
      setError(errorMessage);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <button onClick={handleLogout} className="bg-gray-700 text-white px-4 py-1 rounded float-right">
        Se déconnecter
      </button>
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de tâches</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Ajouter une tâche</h2>
        <label htmlFor="title" className="mt-1">Titre</label>
        <input
          type="text"
          id="title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <label htmlFor="task-image" className="mt-1">Image</label>
        <input
          type="file"
          accept="image/*"
          id="task-image"
          onChange={(e) => setNewTask({ ...newTask, image: e.target.files[0] })}
          className="border p-2 rounded w-full mb-2"
        />
        <label htmlFor="task-description" className="mt-1">Description</label>
        <input
          type="text"
          id="task-description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <label htmlFor="task-due-date" className="mt-1">Date d'échéance</label>
        <input
          type="date"
          id="task-due-date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-1 mb-1 rounded">Ajouter</button>
      </div>
      <h2 className="text-lg font-bold">Liste des tâches</h2>
      {loading ? (
        <p>Chargement de tâches...</p>
      ) : tasks === null ? (
        <p>Aucune tâche.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center space-x-2">
                {/* Task */}
                <span className="pt-1">{task.title}</span>{/*onChange={(e) => updateTask(task.id, { title: e.target.value })}*/}
                {/* Thumbnail */}
                {task.image && (
                  <Image
                    src={task.image}
                    alt={task.title}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                )}
              </div>
              <div>
              {task.completed ? 
                <span className="text-green-900 mr-2">
                  Terminée
                </span> :
                <button
                  onClick={() => markAsComplete(task.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Terminer
                </button>}
                <button
                  onClick={() => editTask(task.id)}
                  className="bg-yellow-400 text-gray-900 px-2 py-1 rounded mr-2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
