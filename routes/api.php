<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\TagController;
use App\Http\Controllers\API\UserController;

Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('posts/search', [PostController::class, 'search']);

Route::middleware('auth:sanctum')->group(function(){
    Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
    Route::post('/', [UserController::class, 'store'])->name('users.store');
    Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

// Posts Routes
Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('posts.index');
    Route::get('/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/', [PostController::class, 'store'])->name('posts.store');
    Route::put('/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    
});

// Categories Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

// Tags Routes
Route::prefix('tags')->group(function () {
    Route::get('/', [TagController::class, 'index'])->name('tags.index');
    Route::get('/{tag}', [TagController::class, 'show'])->name('tags.show');
    Route::post('/', [TagController::class, 'store'])->name('tags.store');
    Route::put('/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
});
// Comments Routes
Route::prefix('comments')->group(function () {
    Route::get('/', [CommentController::class, 'index'])->name('comments.index');
    Route::get('/{comment}', [CommentController::class, 'show'])->name('comments.show');
    Route::post('/', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});

});

