<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('tasks', TaskController::class)->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->put('/tasks/{task}/complete', [TaskController::class, 'markAsCompleted'])->name('tasks.complete');
Route::middleware('auth:sanctum')->get('/public/tasks', [TaskController::class, 'publicTasks'])->name('tasks.all');
