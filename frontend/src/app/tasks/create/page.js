"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api";

export default function TaskManager() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", image: null, is_private: null });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function addTask() {
    if (!token) {
      setError("Token non disponible, veuillez vous reconnecter.");
      return;
    }

    setLoading(true); // Show loading state.
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      formData.append("due_date", newTask.due_date);
      if (newTask.image) formData.append("image", newTask.image);
      if (newTask.is_private !== null) formData.append("is_private", newTask.is_private);

      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json(); // Parse JSON response.

      if (!res.ok) {
        throw new Error(result.message || "Échec de l'ajout de la tâche.");
      }

      setNewTask({ title: "", description: "", due_date: "", image: null, is_private: null });
      window.alert("Nouvelle tâche ajoutée avec succès !");
      router.back(); // Redirect back.
    } catch (err) {
      // Customize error message based on error type.
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Erreur réseau ! Impossible d'accéder au serveur.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Problème CORS ! Le backend bloque les requêtes.";
      } else if (err.message.includes("Unauthorized")) {
        errorMessage = "Identifiants invalides ou session expirée.";
      } 
      setError(errorMessage);
    } finally {
      setLoading(false); // Remove loading state.
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
        {/* Form fields */}
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
        <label htmlFor="task-due-date" className="mt-1">Date d&apos;échéance</label>
        <input
          type="date"
          id="task-due-date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <fieldset className="mb-4">
          <legend className="mt-1">Type de tâches</legend>
          <label htmlFor="public-task-type" className="mr-4">
            Publique
            <input
              type="radio"
              id="public-task-type"
              name="task-type"
              onChange={(e) => setNewTask({ ...newTask, is_private: 0 })}
              className="ml-2"
            />
          </label>
          <label htmlFor="private-task-type" className="">
            Privée
          <input
            type="radio"
            id="private-task-type"
            name="task-type"
            onChange={(e) => setNewTask({ ...newTask, is_private: 1 })}
            className="ml-2"
          /></label>
        </fieldset>

        <div className="space-x-2">
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-1 mb-1 rounded" disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
          <button onClick={() => router.back()} className="bg-yellow-400 text-gray-900 px-4 py-1 mb-1 rounded">Retour</button>
        </div>
      </div>
    </div>
  );
}
