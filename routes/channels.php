<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;


Broadcast::routes([
    'middleware' => ['auth:sanctum'] // or 'web' if using session-based auth
]);
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('post-published', function ($user) {
    Log::info('Authorizing user for post-published channel', ['user_id' => $user ? $user->id : null]);
    return $user != null; // Only authenticated users can listen
});
