"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// TaskModal component.
import TaskModal from "@/app/components/TaskModal";

const API_URL = "http://localhost:8000/api";

export default function TaskManager() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // Redirect to login page if not logged in.
    if (!storedToken) {
      router.push("/login");
      return;
    }

    // Get user ID from local storage.
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);

    setToken(storedToken);
    fetchTasks(storedToken);
  }, []);

  // Logout function.
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
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
      <button onClick={handleLogout} className="bg-gray-700 text-white px-4 py-1 mb-4 sm:mb-0 rounded sm:float-right">
        Se déconnecter
      </button>
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de tâches</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Link href="/tasks/create">
        <button className="bg-blue-500 text-white px-4 py-1 mb-4 rounded">
          Nouvelle tâche
        </button>
      </Link>
      <h2 className="text-lg font-bold">Liste des tâches</h2>
      {loading ? (
        <p>Chargement de tâches...</p>
      ) : tasks === null ? (
        <p>Aucune tâche.</p>
      ) : (
        <>
          {tasks.length >= 2 ? (
            <label htmlFor="tasks-filter" className="sm:flex sm:items-center mb-2">
              <span className="mr-2">Afficher par order chronologique</span>
              <select
                id="tasks-filter"
                className="border rounded py-1 font-semibold"
                onChange={(e) => {setTasks(tasks.slice().reverse());}}
              >
                <option value="asc" defaultValue>ascendant</option>
                <option value="desc">descendant</option>
              </select>
            </label>
            ) : null}
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="sm:flex sm:justify-between sm:items-center border-b py-2">
                <div className="flex items-center space-x-2 pb-2 sm:pb-0">
                  {/* Task */}
                  <span
                    className="cursor-pointer text-blue-600 pt-1"
                    onClick={() => setSelectedTask(task)}
                  >
                    {task.title}
                  </span>
                  {/* Thumbnail */}
                  {task.image && (
                    <Image
                      src={task.image}
                      alt={task.title}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover", width: "auto", height: "auto" }}
                      className="rounded"
                    />
                  )}
                </div>
                <div className="flex items-center justify-start sm:justify-end gap-2 flex-wrap">
                {/* Task actions conditional display */}
                {task.user_id == userId ? (
                  <>
                    {task.completed ? (
                      <span className="text-green-900">
                        Terminée
                      </span>
                    ) : (
                      <>
                        <span className="text-gray-700">En cours</span>
                        <button
                          onClick={() => markAsComplete(task.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Terminer
                        </button>
                      </>
                    )}
                    <Link href={`/tasks/edit/${task.id}`}>
                      <button className="bg-yellow-400 text-gray-900 px-2 py-1 rounded">Modifier</button>
                    </Link>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </>
                ) :
                  <>
                    {task.completed ? (
                      <span className="text-green-900">Terminée</span>
                    ) : (
                      <span className="text-gray-700">En cours</span>
                    )}
                  </>
                }
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Show Modal if task is selected */}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
