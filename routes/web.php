<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome'); // This should match your Blade file name
})->where('any', '.*');