<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
      return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->userId ?: $request->ip());
    });
    \Illuminate\Support\Facades\RateLimiter::for('auth', function (\Illuminate\Http\Request $request) {
      return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
    });
    \Illuminate\Support\Facades\RateLimiter::for('passwordReset', function (\Illuminate\Http\Request $request) {
      return \Illuminate\Cache\RateLimiting\Limit::perHour(3)->by($request->ip());
    });
  }
}