<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'image'         => $this->image ? asset(Storage::url($this->image)) : null, // Full image URL.
            'due_date'      => $this->due_date,
            'completed'     => $this->completed,
            'user_id'       => $this->user_id,
        ];
    }
}
