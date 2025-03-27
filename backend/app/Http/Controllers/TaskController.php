<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Return a resource collection from all the tasks.
            return TaskResource::collection(Task::all());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve tasks. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'image' => 'nullable|image|max:2048', // Image max size 2MB.
        ]);

        // Handle image upload.
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tasks_images', 'public'); // Store in storage/app/public/tasks_images.
        }

        try {
            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'image' => $imagePath,
                'user_id' => Auth::id(), // Associate task with the authenticated user.
            ]);

            return new TaskResource($task);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create task. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return new TaskResource($task);
    }

    /**
     * Mark the specified task as Completed.
     */
    public function markAsCompleted(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized to complete this task'], 403);
        }

        try {
            $task->update(['completed' => true]);

            return new TaskResource($task);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to mark task as completed. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized to edit this task'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'image' => 'nullable|image|max:2048', // Image max size 2MB.
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists.
            if ($task->image) {
                Storage::disk('public')->delete($task->image);
            }
            $imagePath = $request->file('image')->store('tasks_images', 'public');
            $task->image = $imagePath;
        }

        try {
            $task->update([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'image' => $task->image,
            ]);

            return new TaskResource($task);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update task. ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized to delete this task'], 403);
        }

        try {
            $task->delete();

            return response()->json(['message' => 'Task deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete task. ' . $e->getMessage()], 500);
        }
    }
}
