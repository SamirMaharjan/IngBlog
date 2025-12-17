<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PostPublished implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
     public $post;
    public function __construct($post)
    {
        $this->post = $post->load(['author:name,id','category:name,id','tags:name,id']);
        Log::info('PostPublished event created', ['post_id' => $post->id]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        Log::info('Broadcasting PostPublished event');
        return [
            new PrivateChannel('post-published'),
        ];
    }
    public function broadcastAs()
    {
        return 'PostPublished'; // matches your frontend listen('.PostPublished')
    }
     public function broadcastWith()
    {
        return [
            'post' => $this->post->load('author'),
        ];
    }
}
