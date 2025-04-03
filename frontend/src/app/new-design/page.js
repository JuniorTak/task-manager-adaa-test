"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// TaskModal component.
import NewModal from "@/app/components/NewModal";

const API_URL = "http://localhost:8000/api";

export default function NewDesignManager() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
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
    fetchAllTasks(storedToken);
  }, [router]);

  // Fetch tasks from API.
  async function fetchAllTasks(token) {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/public/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Echec de récupération des tâches");
      const responseData = await res.json();
      setTasks(responseData.tasks || []);
      setLatestDate(responseData.latestDate || null);
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

  return (
    <div className="fixed inset-0 bg-gray-400 flex justify-center items-center">
      <div className="relative bg-white p-12 rounded shadow-lg max-w-xl w-full mx-auto">
        {latestDate ? (<div className="sm:flex sm:justify-between sm:items-center pb-4">
          <div className="flex justify-center items-center gap-2">
            <div className="text-5xl">{(new Date(latestDate)).getDate()}</div>
            <div>
              <div className="text-xl uppercase">{new Intl.DateTimeFormat("fr-FR", { month: "short"}).format(new Date(latestDate))}</div>
              <div className="text-lg">{(new Date(latestDate)).getFullYear()}</div>
            </div>
          </div>
          <div className="text-lg">{new Intl.DateTimeFormat("fr-FR", { weekday: "long"}).format(new Date(latestDate))}</div>
        </div>) : null}
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Chargement de tâches...</p>
        ) : tasks === null ? (
          <p>Aucune tâche.</p>
        ) : (
          <>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="sm:flex sm:justify-between sm:items-center py-2">
                {/* Task */}
                {task.completed ? (
                  <>
                    <span className="text-gray-400">{task.title} ({task.is_private ? 'privée' : 'publique'})</span>
                    <div className="border-green-700 border-2 bg-green-400 p-2 rounded-full"></div>
                  </>
                ) : (
                  <>
                    <span>{task.title} ({task.is_private ? 'privée' : 'publique'})</span>
                    {task.user_id == userId ? (
                      <button className="border-1 p-2 rounded-full" onClick={() => setSelectedTask(task)}></button>
                    ) : null }
                  </>
                )}
                </li>
              ))}
            </ul>
          </>
        )}
        <Link href="/tasks/create">
          <button className="absolute bottom-[-30px] left-[45%] bg-green-400 text-gray-300 text-4xl rounded-full border-green-700 border-1 px-4 py-2">+</button>
        </Link>
        {/* Show Modal if task is checked */}
        {selectedTask && 
        <NewModal 
          task={selectedTask} 
          onClose={() => {
            setSelectedTask(null);
            setLatestDate(null);
            fetchAllTasks(token);
          }} 
          token={token} 
        />}
      </div>
    </div>
  );
}
