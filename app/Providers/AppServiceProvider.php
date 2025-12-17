<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(2)
                ->by($request->ip() . '|' . $request->input('email'))
                ->response(function ($request, $headers) {
                    Log::channel('login')->warning('Login rate limited', [
                        'email' => $request->email,
                        'ip' => $request->ip(),
                        'retry_after' => $headers['Retry-After'] ?? null,
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => $headers['Retry-After'] ? 'Too many login attempts. Try again in ' . $headers['Retry-After'] . ' seconds.' : 'Too many login attempts. Please try again later.',
                        'code' => 'RATE_LIMIT_EXCEEDED'
                    ], 429);
                });
        });
    }
}
