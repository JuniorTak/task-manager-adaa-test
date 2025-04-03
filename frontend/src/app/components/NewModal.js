"use client";

import { useState } from "react";

const API_URL = "http://localhost:8000/api";

export default function NewModal({ task, onClose, token}) {
  const [error, setError] = useState(null);

  // Toggle task completion status.
  async function markAsComplete(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Echec de terminaison de tâche");
      onClose();
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
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
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
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center">
      <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full">
      <button
        className="absolute -top-4 -right-4 w-9 h-9 cursor-pointer z-[1004] bg-gray-700 border-4 border-white rounded-full bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/ico_x_white_15x15.png)" }}
        onClick={onClose}
      >
      </button>
        {error && <p className="text-red-500">{error}</p>}
        <p className="pb-6">Voulez-vous marquer la tâche - <span className="text-blue-500">{task.title}</span> -  comme terminée ou la supprimer ?</p>
        <div className="space-x-2">
          <button
            onClick={() => markAsComplete(task.id)}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Terminer
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Supprimer
          </button>
          <button onClick={onClose} className="bg-gray-700 text-white px-4 py-1 rounded">Retour</button>
        </div>
      </div>
    </div>
  );
}
