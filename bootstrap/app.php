<?php
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\SecurityHeadersMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__.'/../routes/web.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
      AddLinkHeadersForPreloadedAssets::class,
      HandleInertiaRequests::class,
      SecurityHeadersMiddleware::class,
    ]);
    $middleware->alias([
      'role' => RoleMiddleware::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
  })->create();