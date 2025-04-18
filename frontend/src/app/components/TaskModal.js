"use client";

import React from "react";
import Image from "next/image";

export default function TaskModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold">{task.title}</h2>
          {task.image && 
          <Image
            src={task.image}
            alt={task.title}
            width={50}
            height={50}
            style={{ objectFit: "cover", width: "auto", height: "auto" }}
            className="mt-2 rounded"
          />}
          <p className="text-gray-700 my-2">{task.description}</p>
          <p className="text-sm text-gray-700">Échéance: {task.due_date}</p>
          <div className="mt-4 flex justify-end">
              <button onClick={onClose} className="bg-gray-700 text-white px-4 py-1 rounded">Fermer</button>
          </div>
      </div>
    </div>
  );
}
