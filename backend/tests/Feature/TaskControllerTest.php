<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
//use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Setup a user for testing purposes.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'email' => 'testuser@example.com',
            'password' => Hash::make('password'),
        ]);
    }

    /**
     * Authenticated user can create a new task.
     */
    public function test_user_can_create_a_task()
    {
        // Authenticate the user.
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'This is a test task.',
            'due_date' => '2025-06-01',
        ]);

        // Assert the task is created and returned in response.
        $response->assertStatus(201)
                 ->assertJson([
                    'data' => [
                        'title' => 'Test Task',
                        'description' => 'This is a test task.',
                        'due_date' => '2025-06-01',
                    ],
                ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'description' => 'This is a test task.',
            'due_date' => '2025-06-01',
        ]);
    }

    /**
     * Authenticated user cannot create a task the without required fields.
     */
    public function test_user_cannot_create_task_without_required_fields()
    {
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/tasks', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'description', 'due_date']);
    }

    /**
     * Authenticated user can view own tasks.
     */
    public function test_user_can_view_own_tasks()
    {
        $task = Task::create([
            'title' => 'Test Task 1',
            'description' => 'This is a test task 1.',
            'due_date' => '2025-06-01',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/tasks');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                    'title' => 'Test Task 1',
                    'description' => 'This is a test task 1.',
                ]);
    }

    /**
     * Authenticated user can view tasks of other users.
     */
    public function test_user_can_view_tasks_of_other_users()
    {
        $otherUser = User::factory()->create();
        $task = Task::create([
            'title' => 'Test Task 2',
            'description' => 'This is a test task 2.',
            'due_date' => '2025-06-01',
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/tasks');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                    'title' => 'Test Task 2',
                    'description' => 'This is a test task 2.',
                    'due_date' => '2025-06-01',
                ]);
    }

    /**
     * Authenticated user can view a specified task.
     */
    public function test_user_can_view_a_task()
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
                 ->assertJson([
                    'data' => [
                        'title' => 'Test Task',
                        'description' => 'Test task description',
                        'due_date' => '2025-06-01',
                    ],
                ]);
    }

    /**
     * Authenticated user can update a task.
     */
    public function test_user_can_update_task()
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Task Title',
            'description' => 'Updated task description',
            'due_date' => '2025-06-15',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                    'data' => [
                        'title' => 'Updated Task Title',
                        'description' => 'Updated task description',
                        'due_date' => '2025-06-15',
                    ],
                ]);

        $task->refresh();

        $this->assertEquals('Updated Task Title', $task->title);
        $this->assertEquals('Updated task description', $task->description);
        $this->assertEquals('2025-06-15', $task->due_date);
    }

    /**
     * Authenticated user cannot update the task of another user.
     */
    public function test_user_cannot_update_task_of_other_user()
    {
        $otherUser = User::factory()->create();
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Task Title',
            'description' => 'Updated task description',
        ]);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Unauthorized to edit this task']);
    }

    /**
     * Authenticated user can mark a task as Completed.
     */
    public function test_user_can_mark_task_as_completed()
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->putJson('/api/tasks/' . $task->id . '/complete');

        $response->assertStatus(200)
                 ->assertJson([
                    'data' => [
                        'completed' => true,
                    ],
                ]);
        
        $task->refresh();

        $this->assertTrue((boolean)$task->completed);
    }

    /**
     * Authenticated user can delete a a task.
     */
    public function test_user_can_delete_task()
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Task deleted successfully']);
    }

    /**
     * Authenticated user cannot delete the task of another user.
     */
    public function test_user_cannot_delete_task_of_other_user()
    {
        $otherUser = User::factory()->create();
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test task description',
            'due_date' => '2025-06-01',
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(403)
                 ->assertJson(['message' => 'Unauthorized to delete this task']);
    }
}
