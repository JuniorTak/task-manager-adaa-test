"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api";

export default function Edit() {
  const { id } = useParams(); // Get task ID from the URL.
  const router = useRouter();
  const [error, setError] = useState(null);
  const [task, setTask] = useState({ title: "", description: "", due_date: "", user_id: null });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login"); // Redirect to login page if not logged in.
      return;
    }

    setToken(storedToken);
    if (id) fetchTask(storedToken);

  }, [id]);

  useEffect(() => {
    // Get user ID from local storage.
    const storedUserId = localStorage.getItem("user_id");

    if(storedUserId && task.user_id && storedUserId != task.user_id) {
      window.alert('Vous n\'avez pas le droit de modifier cette tâche.');
      router.push("/"); // Redirect to the main page if the user ID is not the same as the task ID.
      return;
    }
  }, [task]);

  // Logout function.
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  // Fetch the task from API.
  async function fetchTask(token) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Echec de récupération de la tâche");
      const responseData = await res.json();
      setTask(responseData.data || []);

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
    }
  }

  // Update a task.
  async function updateTask(token) {
    try {
      const taskData = {
        title: task.title,
        description: task.description,
        due_date: task.due_date,
      };
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error("Echec de mise à jour de la tâche");
      else {
        window.alert('La tâche a bien été modifiée.');
        router.push("/"); // Redirect to the main page.
      };
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
        <h2 className="text-lg font-bold">Modifier la tâche</h2>
        <label htmlFor="title" className="mt-1">Titre</label>
        <input
          type="text"
          id="title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <label htmlFor="task-description" className="mt-1">Description</label>
        <input
          type="text"
          id="task-description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <label htmlFor="task-due-date" className="mt-1">Date d'échéance</label>
        <input
          type="date"
          id="task-due-date"
          value={task.due_date}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        
        <div className="space-x-2">
          <button onClick={() => updateTask(token)} className="bg-blue-500 text-white px-4 py-1 mb-1 rounded">Valider</button>
          <button onClick={() => router.back()} className="bg-yellow-400 text-gray-900 px-4 py-1 mb-1 rounded">Retour</button>
        </div>
      </div>
    </div>
  );
}
